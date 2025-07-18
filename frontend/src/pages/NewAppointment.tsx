  import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { appointmentApi, clientApi } from '../services/api'
import { CreateAppointmentData } from '../types'
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react'


const schema = yup.object({
  client_external_id: yup.string().required('Client is required'),
  start_time: yup.string().required('Start time is required'),
  end_time: yup.string().required('End time is required'),
  appointment_type: yup.string().required('Appointment type is required'),
  notes: yup.string(),
}).test('end-after-start', 'End time must be after start time', function(value) {
  if (!value.start_time || !value.end_time) return true
  return new Date(value.end_time) > new Date(value.start_time)
}).test('future-dates', 'Appointments must be scheduled in the future', function(value) {
  if (!value.start_time) return true
  return new Date(value.start_time) > new Date()
}).test('minimum-duration', 'Appointment must be at least 15 minutes long', function(value) {
  if (!value.start_time || !value.end_time) return true
  const start = new Date(value.start_time)
  const end = new Date(value.end_time)
  const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60)
  return durationMinutes >= 15
})

export function NewAppointment() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedClient, setSelectedClient] = useState<any>(null)

  const { register, handleSubmit, formState: { errors }, watch, trigger } = useForm<CreateAppointmentData>({
    resolver: yupResolver(schema),
  })

  const { data: clientsData } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientApi.getClients({ per_page: 100 }),
  })

  const createMutation = useMutation({
    mutationFn: appointmentApi.createAppointment,
    onSuccess: () => {
      toast.success('Appointment created successfully!')
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      navigate('/appointments')
    },
    onError: (error: any) => {
      const errorMessage = error?.message || 'Failed to create appointment'
      toast.error(errorMessage)
    },
  })

  const onSubmit = async (data: CreateAppointmentData) => {
    // Validate form before submission
    const isValid = await trigger()
    if (!isValid) {
      toast.error('Please fix the validation errors before submitting')
      return
    }

    // Additional validation checks
    const startTime = new Date(data.start_time)
    const endTime = new Date(data.end_time)
    const now = new Date()

    // Check if appointment is in the past
    if (startTime <= now) {
      toast.error('Cannot schedule appointments in the past')
      return
    }

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

    createMutation.mutate(data)
  }

  const watchClientId = watch('client_external_id')
  const selectedClientData = clientsData?.clients?.find(
    client => client.external_id === watchClientId
  )

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
          <h1 className="text-2xl font-bold text-gray-900">New Appointment</h1>
          <p className="text-gray-600">Schedule a new appointment for a client</p>
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
          {errors.start_time && errors.start_time.type === 'future-dates' && (
            <p className="text-red-600 text-sm">Appointments must be scheduled in the future</p>
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
              disabled={createMutation.isPending}
              className="btn-primary"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Appointment'}
            </button>
          </div>

          {createMutation.error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">
                Error creating appointment: {(createMutation.error as Error)?.message || 'Unknown error occurred'}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
} 