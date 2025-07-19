Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins '*'  # Allow all origins for now to fix the issue
    
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: false,
      expose: ['Content-Type', 'Content-Length']
  end
end 