export interface Client {
  id: number
  external_id: string
  name: string
  email: string
  phone: string
  notes?: string
  active: boolean
  appointment_count: number
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: number
  external_id: string
  client_id: number
  client: {
    id: number
    external_id: string
    name: string
    email: string
  }
  start_time: string
  end_time: string
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed'
  appointment_type: string
  notes?: string
  duration_minutes: number
  is_upcoming: boolean
  is_past: boolean
  is_today: boolean
  created_at: string
  updated_at: string
}

export interface PaginationMeta {
  page: number
  per_page: number
  total: number
  total_pages: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface ClientsResponse {
  clients: Client[]
  pagination: PaginationMeta
}

export interface AppointmentsResponse {
  appointments: Appointment[]
  pagination: PaginationMeta
}

export interface CreateAppointmentData {
  client_external_id: string
  start_time: string
  end_time: string
  appointment_type: string
  notes?: string
}

export interface UpdateAppointmentData {
  client_external_id?: string
  start_time?: string
  end_time?: string
  appointment_type?: string
  notes?: string
  status?: string
} 