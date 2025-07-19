class HealthController < ApplicationController
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