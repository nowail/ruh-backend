class SyncAppointmentsJob < ApplicationJob
  queue_as :default
  
  def perform
    Rails.logger.info "Starting appointment sync job"
    
    result = ExternalApiService.sync_all_appointments
    
    if result[:success]
      Rails.logger.info "Appointment sync completed successfully. Synced #{result[:count]} appointments."
    else
      Rails.logger.error "Appointment sync failed: #{result[:error]}"
      # In a real application, you might want to retry or alert administrators
    end
  rescue => e
    Rails.logger.error "Appointment sync job failed with exception: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
  end
end 