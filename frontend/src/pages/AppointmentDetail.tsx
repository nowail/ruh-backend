import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { appointmentApi } from '../services/api'
import { Calendar, Clock, User, ArrowLeft, Edit, Trash2 } from 'lucide-react'

export function AppointmentDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: appointment, isLoading, error } = useQuery({
    queryKey: ['appointment', id],
    queryFn: () => appointmentApi.getAppointment(Number(id)),
    enabled: !!id,
  })

  const cancelMutation = useMutation({
    mutationFn: appointmentApi.cancelAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointment', id] })
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: appointmentApi.deleteAppointment,
    onSuccess: () => {
      navigate('/appointments')
    },
  })

  if (isLoading) {
    return (
      <div className="card">
        <p className="text-gray-500">Loading appointment...</p>
      </div>
    )
  }

  if (error || !appointment) {
    return (
      <div className="card">
        <p className="text-red-600">Error loading appointment: {error?.message}</p>
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

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      cancelMutation.mutate(appointment.id)
    }
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) {
      deleteMutation.mutate(appointment.id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/appointments')}
            className="btn-secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Appointments
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Appointment Details</h1>
            <p className="text-gray-600">View and manage appointment information</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(`/appointments/${appointment.id}/edit`)}
            className="btn-secondary"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </button>
          {appointment.status === 'scheduled' && (
            <button
              onClick={handleCancel}
              disabled={cancelMutation.isPending}
              className="btn-danger"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="btn-danger"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Information */}
        <div className="card">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-wellness-100 rounded-full flex items-center justify-center">
              <Calendar className="w-8 h-8 text-wellness-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{appointment.appointment_type}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Client</p>
                <p className="text-sm text-gray-600">{appointment.client.name}</p>
                <p className="text-sm text-gray-600">{appointment.client.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Date</p>
                <p className="text-sm text-gray-600">
                  {new Date(appointment.start_time).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Time</p>
                <p className="text-sm text-gray-600">
                  {new Date(appointment.start_time).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })} - {new Date(appointment.end_time).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Duration:</span> {appointment.duration_minutes} minutes
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">External ID:</span> {appointment.external_id}
              </p>
            </div>

            {appointment.notes && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-900 mb-2">Notes</p>
                <p className="text-sm text-gray-600">{appointment.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Timeline</p>
              <div className="mt-2 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${appointment.is_past ? 'bg-gray-400' : 'bg-green-400'}`}></div>
                  <span className="text-sm text-gray-600">
                    {appointment.is_past ? 'Past' : appointment.is_today ? 'Today' : 'Upcoming'}
                  </span>
                </div>
                {appointment.is_upcoming && (
                  <p className="text-sm text-gray-500">
                    {Math.ceil((new Date(appointment.start_time).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days away
                  </p>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900">Status History</p>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-600">
                  Created: {new Date(appointment.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Last Updated: {new Date(appointment.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Appointment ID:</span> {appointment.id}
              </p>
            </div>
          </div>
        </div>
      </div>

      {(cancelMutation.error || deleteMutation.error) && (
        <div className="card">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">
              Error: {cancelMutation.error?.message || deleteMutation.error?.message}
            </p>
          </div>
        </div>
      )}
    </div>
  )
} 