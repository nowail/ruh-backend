import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { clientApi, appointmentApi } from '../services/api'
import { User, Mail, Phone, Calendar, ArrowLeft, MapPin } from 'lucide-react'

export function ClientDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: client, isLoading, error } = useQuery({
    queryKey: ['client', id],
    queryFn: () => clientApi.getClient(Number(id)),
    enabled: !!id,
  })

  const { data: appointmentsData } = useQuery({
    queryKey: ['appointments', 'client', id],
    queryFn: () => appointmentApi.getAppointments({ 
      client_id: Number(id),
      per_page: 50 
    }),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="card">
        <p className="text-gray-500">Loading client...</p>
      </div>
    )
  }

  if (error || !client) {
    return (
      <div className="card">
        <p className="text-red-600">Error loading client: {error?.message}</p>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/clients')}
          className="btn-secondary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Clients
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Details</h1>
          <p className="text-gray-600">View client information and appointments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Information */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{client.name}</h2>
                <p className="text-sm text-gray-500">Client ID: {client.external_id}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">{client.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Phone</p>
                  <p className="text-sm text-gray-600">{client.phone}</p>
                </div>
              </div>

              {client.notes && (
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Notes</p>
                    <p className="text-sm text-gray-600">{client.notes}</p>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Status:</span>{' '}
                  <span className={client.active ? 'text-green-600' : 'text-red-600'}>
                    {client.active ? 'Active' : 'Inactive'}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Total Appointments:</span> {client.appointment_count}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Appointments</h3>
              <button
                onClick={() => navigate('/appointments/new')}
                className="btn-primary"
              >
                Schedule Appointment
              </button>
            </div>

            {appointmentsData?.appointments.length ? (
              <div className="space-y-4">
                {appointmentsData.appointments.map((appointment) => (
                  <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-wellness-100 rounded-full flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-wellness-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">{appointment.appointment_type}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                              {appointment.status}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(appointment.start_time).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(appointment.start_time).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })} - {new Date(appointment.end_time).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </div>
                          {appointment.notes && (
                            <p className="text-sm text-gray-500 mt-1">{appointment.notes}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/appointments/${appointment.id}`)}
                        className="btn-secondary text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No appointments found for this client</p>
                <button
                  onClick={() => navigate('/appointments/new')}
                  className="btn-primary mt-4"
                >
                  Schedule First Appointment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 