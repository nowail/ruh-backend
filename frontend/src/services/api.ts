import { 
  Client, 
  Appointment, 
  ClientsResponse, 
  AppointmentsResponse, 
  CreateAppointmentData, 
  UpdateAppointmentData
} from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(url, config)
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new ApiError(response.status, errorData.error || response.statusText)
  }

  const result = await response.json()
  
  // Handle wrapped response format from backend
  if (result.success && result.data) {
    return result.data
  }
  
  return result
}

export const clientApi = {
  async getClients(params?: { page?: number; per_page?: number; search?: string }): Promise<ClientsResponse> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.per_page) searchParams.append('per_page', params.per_page.toString())
    if (params?.search) searchParams.append('search', params.search)
    
    const query = searchParams.toString()
    const endpoint = `/clients${query ? `?${query}` : ''}`
    
    return apiRequest<ClientsResponse>(endpoint)
  },

  async getClient(id: number): Promise<Client> {
    return apiRequest<Client>(`/clients/${id}`)
  },

  async searchClients(query: string): Promise<{ clients: Client[]; query: string }> {
    return apiRequest<{ clients: Client[]; query: string }>(`/clients/search?q=${encodeURIComponent(query)}`)
  },
}

export const appointmentApi = {
  async getAppointments(params?: {
    page?: number
    per_page?: number
    status?: string
    start_date?: string
    end_date?: string
    client_id?: number
    appointment_type?: string
  }): Promise<AppointmentsResponse> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.per_page) searchParams.append('per_page', params.per_page.toString())
    if (params?.status) searchParams.append('status', params.status)
    if (params?.start_date) searchParams.append('start_date', params.start_date)
    if (params?.end_date) searchParams.append('end_date', params.end_date)
    if (params?.client_id) searchParams.append('client_id', params.client_id.toString())
    if (params?.appointment_type) searchParams.append('appointment_type', params.appointment_type)
    
    const query = searchParams.toString()
    const endpoint = `/appointments${query ? `?${query}` : ''}`
    
    return apiRequest<AppointmentsResponse>(endpoint)
  },

  async getAppointment(id: number): Promise<Appointment> {
    return apiRequest<Appointment>(`/appointments/${id}`)
  },

  async createAppointment(data: CreateAppointmentData): Promise<Appointment> {
    return apiRequest<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify({ appointment: data }),
    })
  },

  async updateAppointment(id: number, data: UpdateAppointmentData): Promise<Appointment> {
    return apiRequest<Appointment>(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ appointment: data }),
    })
  },

  async deleteAppointment(id: number): Promise<void> {
    return apiRequest<void>(`/appointments/${id}`, {
      method: 'DELETE',
    })
  },

  async cancelAppointment(id: number): Promise<Appointment> {
    return apiRequest<Appointment>(`/appointments/${id}/cancel`, {
      method: 'PATCH',
    })
  },
} 