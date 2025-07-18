import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { appointmentApi, clientApi } from '../services/api'
import { UpdateAppointmentData } from '../types'
import { ArrowLeft, User } from 'lucide-react'

const schema = yup.object({
  client_external_id: yup.string().optional(),
  start_time: yup.string().optional(),
  end_time: yup.string().optional(),
  appointment_type: yup.string().optional(),
  notes: yup.string().optional(),
}).test('end-after-start', 'End time must be after start time', function(value) {
  if (!value.start_time || !value.end_time) return true
  return new Date(value.end_time) > new Date(value.start_time)
}).test('minimum-duration', 'Appointment must be at least 15 minutes long', function(value) {
  if (!value.start_time || !value.end_time) return true
  const start = new Date(value.start_time)
  const end = new Date(value.end_time)
  const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60)
  return durationMinutes >= 15
})

export function EditAppointment() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: appointment, isLoading: appointmentLoading } = useQuery({
    queryKey: ['appointment', id],
    queryFn: () => appointmentApi.getAppointment(Number(id)),
    enabled: !!id,
  })

  const { data: clientsData } = useQuery({
    queryKey: ['clients', { page: 1, per_page: 100 }],
    queryFn: () => clientApi.getClients({ page: 1, per_page: 100 }),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    trigger,
  } = useForm<UpdateAppointmentData>({
    resolver: yupResolver(schema),
  })

  // Reset form when appointment data is loaded
  useEffect(() => {
    if (appointment) {
      reset({
        client_external_id: appointment.client?.external_id || '',
        appointment_type: appointment.appointment_type || '',
        start_time: appointment.start_time ? new Date(appointment.start_time).toISOString().slice(0, 16) : '',
        end_time: appointment.end_time ? new Date(appointment.end_time).toISOString().slice(0, 16) : '',
        notes: appointment.notes || '',
      })
    }
  }, [appointment, reset])

  const updateMutation = useMutation({
    mutationFn: (data: UpdateAppointmentData) => appointmentApi.updateAppointment(Number(id), data),
    onSuccess: () => {
      toast.success('Appointment updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['appointment', id] })
      navigate('/appointments')
    },
    onError: (error: any) => {
      const errorMessage = error?.message || 'Failed to update appointment'
      toast.error(errorMessage)
    },
  })

  const onSubmit = async (data: UpdateAppointmentData) => {
    // Validate form before submission
    const isValid = await trigger()
    if (!isValid) {
      toast.error('Please fix the validation errors before submitting')
      return
    }

    // Additional validation checks
    if (!data.start_time || !data.end_time) {
      toast.error('Start time and end time are required')
      return
    }

    const startTime = new Date(data.start_time)
    const endTime = new Date(data.end_time)

    // Check if end time is before start time
    if (endTime <= startTime) {
      toast.error('End time must be after start time')
      return
    }

    // Check minimum duration
    const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60)
    if (durationMinutes < 15) {
      toast.error('Appointment must be at least 15 minutes long')
      return
    }

    updateMutation.mutate(data)
  }

  const watchClientId = watch('client_external_id')
  const selectedClientData = clientsData?.clients?.find(
    client => client.external_id === watchClientId
  )

  if (appointmentLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/appointments')}
            className="btn-secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Appointment</h1>
            <p className="text-gray-600">Loading appointment details...</p>
          </div>
        </div>
        <div className="card max-w-2xl">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/appointments')}
            className="btn-secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Appointment</h1>
            <p className="text-gray-600">Appointment not found</p>
          </div>
        </div>
        <div className="card max-w-2xl">
          <p className="text-gray-500">The appointment you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/appointments')}
          className="btn-secondary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Appointment</h1>
          <p className="text-gray-600">Update appointment information</p>
        </div>
      </div>

      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Client Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client
            </label>
            <select
              {...register('client_external_id')}
              className="input"
            >
              <option value="">Select a client</option>
              {clientsData?.clients?.map((client) => (
                <option key={client.id} value={client.external_id}>
                  {client.name} - {client.email}
                </option>
              ))}
            </select>
            {errors.client_external_id && (
              <p className="text-red-600 text-sm mt-1">{errors.client_external_id.message}</p>
            )}
            
            {selectedClientData && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{selectedClientData.name}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{selectedClientData.email}</p>
                <p className="text-sm text-gray-600">{selectedClientData.phone}</p>
                {selectedClientData.notes && (
                  <p className="text-sm text-gray-500 mt-1">{selectedClientData.notes}</p>
                )}
              </div>
            )}
          </div>

          {/* Appointment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appointment Type
            </label>
            <select
              {...register('appointment_type')}
              className="input"
            >
              <option value="">Select appointment type</option>
              <option value="Wellness Check">Wellness Check</option>
              <option value="Massage Therapy">Massage Therapy</option>
              <option value="Physical Therapy">Physical Therapy</option>
              <option value="Consultation">Consultation</option>
            </select>
            {errors.appointment_type && (
              <p className="text-red-600 text-sm mt-1">{errors.appointment_type.message}</p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <input
                type="datetime-local"
                {...register('start_time')}
                className="input"
                min={new Date().toISOString().slice(0, 16)}
              />
              {errors.start_time && (
                <p className="text-red-600 text-sm mt-1">{errors.start_time.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <input
                type="datetime-local"
                {...register('end_time')}
                className="input"
                min={new Date().toISOString().slice(0, 16)}
              />
              {errors.end_time && (
                <p className="text-red-600 text-sm mt-1">{errors.end_time.message}</p>
              )}
            </div>
          </div>

          {/* Validation Messages */}
          {errors.end_time && errors.end_time.type === 'end-after-start' && (
            <p className="text-red-600 text-sm">End time must be after start time</p>
          )}
          {errors.end_time && errors.end_time.type === 'minimum-duration' && (
            <p className="text-red-600 text-sm">Appointment must be at least 15 minutes long</p>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="input"
              placeholder="Add any additional notes about this appointment..."
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/appointments')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="btn-primary"
            >
              {updateMutation.isPending ? 'Updating...' : 'Update Appointment'}
            </button>
          </div>

          {updateMutation.error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">
                Error updating appointment: {(updateMutation.error as Error).message}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
} 