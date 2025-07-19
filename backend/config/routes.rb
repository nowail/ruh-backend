Rails.application.routes.draw do
  # API routes
  namespace :api do
    namespace :v1 do
      resources :clients, only: [:index, :show] do
        collection do
          get :search
        end
      end
      
      resources :appointments, only: [:index, :show, :create, :update, :destroy] do
        member do
          patch :cancel
        end
      end
      
      # Sync endpoints for external API integration
      namespace :sync do
        post :clients
        post :appointments
      end
    end
  end

  # Health check endpoint
  get '/health', to: 'health#check'
  get '/test', to: 'health#test_api'
  
  # Root endpoint
  root 'health#check'
  
  # Development/test endpoints
  post '/seed', to: 'health#seed_data' if Rails.env.development? || Rails.env.production?
end 