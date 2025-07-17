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
  
  # Root endpoint - serve React app
  root 'static_pages#index'
  
  # Catch all routes for React Router
  get '*path', to: 'static_pages#catch_all', constraints: ->(request) do
    !request.xhr? && request.format.html?
  end
end 