class HealthController < ApplicationController
  skip_before_action :authenticate_request, only: [:check, :test_api]
  
  def check
    health_status = {
      status: 'healthy',
      timestamp: Time.current.iso8601,
      version: '1.0.0',
      services: {
        database: database_healthy?,
        redis: redis_healthy?
      }
    }
    
    # Add external API status as optional (doesn't affect overall health)
    external_api_status = external_api_healthy?
    health_status[:services][:external_api] = external_api_status
    
    # Only database and redis are required for overall health
    required_services_healthy = health_status[:services][:database] && health_status[:services][:redis]
    overall_status = required_services_healthy ? :ok : :service_unavailable
    
    render json: health_status, status: overall_status
  end
  
  def test_api
    render json: { 
      message: "API is working!",
      timestamp: Time.current.iso8601,
      test_data: {
        sample_clients: 5,
        sample_appointments: 5
      }
    }
  end
  
  def seed_data
    # Load and run seeds
    load Rails.root.join('db', 'seeds.rb')
    render json: { 
      message: "Database seeded successfully!",
      clients_count: Client.count,
      appointments_count: Appointment.count
    }
  end
  
  private
  
  def database_healthy?
    ActiveRecord::Base.connection.execute('SELECT 1')
    true
  rescue => e
    Rails.logger.error "Database health check failed: #{e.message}"
    false
  end
  
  def external_api_healthy?
    response = ExternalApiService.get('/health')
    response.success?
  rescue => e
    Rails.logger.error "External API health check failed: #{e.message}"
    false
  end
  
  def redis_healthy?
    Redis.new(url: ENV.fetch('REDIS_URL', 'redis://localhost:6379')).ping == 'PONG'
  rescue => e
    Rails.logger.error "Redis health check failed: #{e.message}"
    false
  end
end 