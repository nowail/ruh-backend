Sidekiq.configure_server do |config|
  config.redis = { url: ENV.fetch('REDIS_URL', 'redis://localhost:6379/0') }
  
  # Configure logging
  config.logger.level = Logger::INFO
  
  # Configure concurrency
  config.concurrency = ENV.fetch('SIDEKIQ_CONCURRENCY', 5).to_i
end

Sidekiq.configure_client do |config|
  config.redis = { url: ENV.fetch('REDIS_URL', 'redis://localhost:6379/0') }
end

# Schedule recurring jobs
if defined?(Sidekiq::Cron)
  Sidekiq::Cron::Job.create(
    name: 'Sync Clients - every 30 minutes',
    cron: '*/30 * * * *',
    class: 'SyncClientsJob'
  )
  
  Sidekiq::Cron::Job.create(
    name: 'Sync Appointments - every 15 minutes',
    cron: '*/15 * * * *',
    class: 'SyncAppointmentsJob'
  )
end 