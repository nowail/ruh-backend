require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module WellnessPlatform
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.0

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")

    # API-only mode
    config.api_only = true

    # CORS configuration
    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins '*'  # In production, replace with specific origins
        resource '*',
          headers: :any,
          methods: [:get, :post, :put, :patch, :delete, :options, :head],
          credentials: false
      end
    end

    # External API configuration
    config.external_api_url = ENV.fetch('EXTERNAL_API_URL', 'https://mock.api')
    config.external_api_timeout = 30
    config.external_api_retries = 3

    # Background job configuration
    config.active_job.queue_adapter = :sidekiq

    # Time zone
    config.time_zone = 'UTC'

    # Locale
    config.i18n.default_locale = :en
    config.i18n.available_locales = [:en]

    # Logging
    config.log_level = :info
    config.log_tags = [:request_id, :remote_ip]

    # Cache store
    config.cache_store = :redis_cache_store, { url: ENV.fetch('REDIS_URL', 'redis://localhost:6379/0') }
  end
end 