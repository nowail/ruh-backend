class SyncClientsJob < ApplicationJob
  queue_as :default
  
  def perform
    Rails.logger.info "Starting client sync job"
    
    result = ExternalApiService.sync_all_clients
    
    if result[:success]
      Rails.logger.info "Client sync completed successfully. Synced #{result[:count]} clients."
    else
      Rails.logger.error "Client sync failed: #{result[:error]}"
      # In a real application, you might want to retry or alert administrators
    end
  rescue => e
    Rails.logger.error "Client sync job failed with exception: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
  end
end 