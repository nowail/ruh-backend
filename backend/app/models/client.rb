class Client < ApplicationRecord
  has_many :appointments, dependent: :destroy
  
  validates :external_id, presence: true, uniqueness: true
  validates :name, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :phone, presence: true
  
  # Scopes
  scope :active, -> { where(active: true) }
  scope :recent, -> { order(created_at: :desc) }
  
  # Search functionality
  def self.search(query)
    where("name ILIKE ? OR email ILIKE ? OR phone ILIKE ?", 
          "%#{query}%", "%#{query}%", "%#{query}%")
  end
  
  # External API integration
  def sync_with_external_api
    ExternalApiService.sync_client(self)
  end
  
  def self.sync_all_from_external
    ExternalApiService.sync_all_clients
  end
  
  # JSON serialization
  def as_json(options = {})
    super(options.merge(
      methods: [:appointment_count],
      except: [:created_at, :updated_at]
    ))
  end
  
  def appointment_count
    appointments.count
  end
  
  # Data validation
  def valid_for_external_sync?
    external_id.present? && name.present? && email.present?
  end
  
  private
  
  def normalize_phone
    self.phone = phone.gsub(/\D/, '') if phone.present?
  end
end 