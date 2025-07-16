class HealthController < ApplicationController
  def check
    health_status = {
      status: 'healthy',
      timestamp: Time.current.iso8601,
      version: '1.0.0',
      services: {
        database: database_healthy?,
        external_api: external_api_healthy?,
        redis: redis_healthy?
      }
    }
    
    overall_status = health_status[:services].values.all? ? :ok : :service_unavailable
    
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