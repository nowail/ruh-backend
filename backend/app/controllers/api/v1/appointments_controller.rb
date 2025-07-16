class Api::V1::AppointmentsController < ApplicationController
  before_action :set_appointment, only: [:show, :update, :destroy, :cancel]
  
  def index
    appointments = Appointment.includes(:client)
    
    # Apply filters
    appointments = apply_filters(appointments)
    
    # Apply pagination
    page = params[:page]&.to_i || 1
    per_page = [params[:per_page]&.to_i || 20, 100].min
    
    appointments = appointments.offset((page - 1) * per_page).limit(per_page)
    
    render_success({
      appointments: appointments.as_json,
      pagination: {
        page: page,
        per_page: per_page,
        total: Appointment.count,
        total_pages: (Appointment.count.to_f / per_page).ceil
      }
    })
  end
  
  def show
    render_success(@appointment.as_json)
  end
  
  def create
    # First, create appointment in external API
    external_result = ExternalApiService.create_appointment_in_external(appointment_params)
    
    unless external_result[:success]
      return render_error("Failed to create appointment in external system: #{external_result[:error]}")
    end
    
    # Find the client
    client = Client.find_by(external_id: appointment_params[:client_external_id])
    unless client
      return render_error("Client not found", :not_found)
    end
    
    # Create appointment locally
    @appointment = Appointment.new(
      external_id: external_result[:external_id],
      client: client,
      start_time: appointment_params[:start_time],
      end_time: appointment_params[:end_time],
      appointment_type: appointment_params[:appointment_type],
      notes: appointment_params[:notes],
      status: 'scheduled'
    )
    
    if @appointment.save
      render_success(@appointment.as_json, "Appointment created successfully")
    else
      render_error(@appointment.errors.full_messages.join(", "))
    end
  end
  
  def update
    if @appointment.update(appointment_update_params)
      # Sync with external API
      ExternalApiService.sync_appointment(@appointment)
      
      render_success(@appointment.as_json, "Appointment updated successfully")
    else
      render_error(@appointment.errors.full_messages.join(", "))
    end
  end
  
  def destroy
    @appointment.destroy
    render_success(nil, "Appointment deleted successfully")
  end
  
  def cancel
    @appointment.cancel!
    render_success(@appointment.as_json, "Appointment cancelled successfully")
  end
  
  private
  
  def set_appointment
    @appointment = Appointment.find(params[:id])
  end
  
  def appointment_params
    params.require(:appointment).permit(
      :client_external_id,
      :start_time,
      :end_time,
      :appointment_type,
      :notes
    ).tap do |permitted_params|
      # Convert string dates to DateTime objects
      permitted_params[:start_time] = Time.parse(permitted_params[:start_time]) if permitted_params[:start_time]
      permitted_params[:end_time] = Time.parse(permitted_params[:end_time]) if permitted_params[:end_time]
    end
  end
  
  def appointment_update_params
    params.require(:appointment).permit(
      :start_time,
      :end_time,
      :appointment_type,
      :notes,
      :status
    ).tap do |permitted_params|
      # Convert string dates to DateTime objects
      permitted_params[:start_time] = Time.parse(permitted_params[:start_time]) if permitted_params[:start_time]
      permitted_params[:end_time] = Time.parse(permitted_params[:end_time]) if permitted_params[:end_time]
    end
  end
  
  def apply_filters(appointments)
    # Filter by status
    if params[:status].present?
      appointments = appointments.by_status(params[:status])
    end
    
    # Filter by date range
    if params[:start_date].present?
      start_date = Date.parse(params[:start_date])
      appointments = appointments.where('start_time >= ?', start_date.beginning_of_day)
    end
    
    if params[:end_date].present?
      end_date = Date.parse(params[:end_date])
      appointments = appointments.where('end_time <= ?', end_date.end_of_day)
    end
    
    # Filter by client
    if params[:client_id].present?
      appointments = appointments.where(client_id: params[:client_id])
    end
    
    # Filter by appointment type
    if params[:appointment_type].present?
      appointments = appointments.where(appointment_type: params[:appointment_type])
    end
    
    # Default sorting
    appointments.order(:start_time)
  end
end 