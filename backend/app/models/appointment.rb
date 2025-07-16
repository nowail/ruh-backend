class Appointment < ApplicationRecord
  belongs_to :client
  
  validates :external_id, presence: true, uniqueness: true
  validates :client_id, presence: true
  validates :start_time, presence: true
  validates :end_time, presence: true
  validates :status, presence: true, inclusion: { in: %w[scheduled confirmed cancelled completed] }
  validates :appointment_type, presence: true
  
  # Scopes
  scope :upcoming, -> { where('start_time > ?', Time.current).order(:start_time) }
  scope :past, -> { where('end_time < ?', Time.current).order(start_time: :desc) }
  scope :today, -> { where(start_time: Time.current.beginning_of_day..Time.current.end_of_day) }
  scope :by_status, ->(status) { where(status: status) }
  
  # Validations
  validate :end_time_after_start_time
  validate :no_overlapping_appointments, on: :create
  
  # External API integration
  def sync_with_external_api
    ExternalApiService.sync_appointment(self)
  end
  
  def self.sync_all_from_external
    ExternalApiService.sync_all_appointments
  end
  
  # Business logic
  def cancel!
    update!(status: 'cancelled')
    sync_with_external_api
  end
  
  def confirm!
    update!(status: 'confirmed')
    sync_with_external_api
  end
  
  def complete!
    update!(status: 'completed')
    sync_with_external_api
  end
  
  def duration_minutes
    return 0 unless start_time && end_time
    ((end_time - start_time) / 60).to_i
  end
  
  def is_upcoming?
    start_time > Time.current
  end
  
  def is_past?
    end_time < Time.current
  end
  
  def is_today?
    start_time.to_date == Date.current
  end
  
  # JSON serialization
  def as_json(options = {})
    super(options.merge(
      methods: [:duration_minutes, :is_upcoming?, :is_past?, :is_today?],
      include: { client: { only: [:id, :name, :email] } },
      except: [:created_at, :updated_at]
    ))
  end
  
  private
  
  def end_time_after_start_time
    return unless start_time && end_time
    
    if end_time <= start_time
      errors.add(:end_time, "must be after start time")
    end
  end
  
  def no_overlapping_appointments
    return unless client_id && start_time && end_time
    
    overlapping = client.appointments
                       .where.not(id: id)
                       .where('(start_time, end_time) OVERLAPS (?, ?)', start_time, end_time)
                       .exists?
    
    if overlapping
      errors.add(:base, "Appointment overlaps with existing appointment for this client")
    end
  end
end 