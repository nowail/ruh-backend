class Api::V1::ClientsController < ApplicationController
  before_action :set_client, only: [:show]
  
  def index
    clients = Client.active.recent
    
    # Apply search filter if provided
    if params[:search].present?
      clients = clients.search(params[:search])
    end
    
    # Apply pagination
    page = params[:page]&.to_i || 1
    per_page = [params[:per_page]&.to_i || 20, 100].min
    
    clients = clients.offset((page - 1) * per_page).limit(per_page)
    
    render_success({
      clients: clients.as_json,
      pagination: {
        page: page,
        per_page: per_page,
        total: Client.active.count,
        total_pages: (Client.active.count.to_f / per_page).ceil
      }
    })
  end
  
  def show
    render_success(@client.as_json(include: { appointments: { only: [:id, :start_time, :end_time, :status, :appointment_type] } }))
  end
  
  def search
    query = params[:q]
    
    if query.blank?
      return render_error("Search query is required", :bad_request)
    end
    
    clients = Client.search(query).limit(10)
    
    render_success({
      clients: clients.as_json,
      query: query
    })
  end
  
  private
  
  def set_client
    @client = Client.find(params[:id])
  end
end 