import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { appointmentApi } from '../services/api'
import { Calendar, Clock, User, Filter, Plus } from 'lucide-react'
import React from 'react'
export function Appointments() {
  const [filters, setFilters] = useState({
    status: '',
    start_date: '',
    end_date: '',
    appointment_type: '',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['appointments', { page: currentPage, ...filters }],
    queryFn: () => appointmentApi.getAppointments({ 
      page: currentPage, 
      per_page: 20,
      ...filters 
    }),
  })

  const cancelMutation = useMutation({
    mutationFn: appointmentApi.cancelAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const handleCancel = (id: number) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      cancelMutation.mutate(id)
    }
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

  if (error) {
    return (
      <div className="card">
        <p className="text-red-600">Error loading appointments: {error?.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600">Manage your wellness clinic appointments</p>
        </div>
        <Link to="/appointments/new" className="btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          New Appointment
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-gray-500 mr-2" />
          <h3 className="font-medium text-gray-900">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="input"
          >
            <option value="">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={filters.appointment_type}
            onChange={(e) => handleFilterChange('appointment_type', e.target.value)}
            className="input"
          >
            <option value="">All Types</option>
            <option value="Wellness Check">Wellness Check</option>
            <option value="Massage Therapy">Massage Therapy</option>
            <option value="Physical Therapy">Physical Therapy</option>
            <option value="Consultation">Consultation</option>
          </select>

          <input
            type="date"
            value={filters.start_date}
            onChange={(e) => handleFilterChange('start_date', e.target.value)}
            className="input"
            placeholder="Start Date"
          />

          <input
            type="date"
            value={filters.end_date}
            onChange={(e) => handleFilterChange('end_date', e.target.value)}
            className="input"
            placeholder="End Date"
          />
        </div>
      </div>

      {/* Appointments List */}
      <div className="card">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading appointments...</p>
          </div>
        ) : data?.appointments?.length ? (
          <div className="space-y-4">
            {data?.appointments?.map((appointment) => (
              <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-wellness-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-wellness-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">{appointment.appointment_type}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {appointment.client.name}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {new Date(appointment.start_time).toLocaleDateString()} at{' '}
                          {new Date(appointment.start_time).toLocaleTimeString([], { 
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
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/appointments/${appointment.id}`}
                      className="btn-secondary text-sm"
                    >
                      View Details
                    </Link>
                    {appointment.status === 'scheduled' && (
                      <button
                        onClick={() => handleCancel(appointment.id)}
                        className="btn-danger text-sm"
                        disabled={cancelMutation.isLoading}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No appointments found</p>
          </div>
        )}

        {/* Pagination */}
        {data?.pagination && data.pagination.total_pages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-6">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {data.pagination.total_pages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === data.pagination.total_pages}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 