class ApplicationController < ActionController::API
  include ActionController::HttpAuthentication::Token::ControllerMethods
  
  before_action :set_default_response_format
  before_action :authenticate_request
  
  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ActiveRecord::RecordInvalid, with: :unprocessable_entity
  rescue_from ActionController::ParameterMissing, with: :bad_request
  
  private
  
  def set_default_response_format
    request.format = :json
  end
  
  def authenticate_request
    # Skip authentication for now to allow frontend requests
    # In a real application, implement proper authentication
    true
  end
  
  def not_found(exception)
    render json: { 
      error: 'Not Found', 
      message: exception.message 
    }, status: :not_found
  end
  
  def unprocessable_entity(exception)
    render json: { 
      error: 'Validation Failed', 
      message: exception.message,
      details: exception.record.errors.full_messages 
    }, status: :unprocessable_entity
  end
  
  def bad_request(exception)
    render json: { 
      error: 'Bad Request', 
      message: exception.message 
    }, status: :bad_request
  end
  
  def render_success(data = nil, message = nil)
    response = { success: true }
    response[:data] = data if data
    response[:message] = message if message
    
    render json: response
  end
  
  def render_error(message, status = :unprocessable_entity)
    render json: { 
      success: false, 
      error: message 
    }, status: status
  end
end 