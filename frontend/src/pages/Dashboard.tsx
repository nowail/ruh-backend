import { useQuery } from '@tanstack/react-query'
import { clientApi, appointmentApi } from '../services/api'
import { Users, Calendar, Clock, CheckCircle } from 'lucide-react'


export function Dashboard() {
  const { data: clientsData } = useQuery({
    queryKey: ['clients', { page: 1, per_page: 5 }],
    queryFn: () => clientApi.getClients({ page: 1, per_page: 5 }),
  })

  const { data: appointmentsData } = useQuery({
    queryKey: ['appointments', { page: 1, per_page: 5 }],
    queryFn: () => appointmentApi.getAppointments({ page: 1, per_page: 5 }),
  })

  const { data: upcomingAppointments } = useQuery({
    queryKey: ['appointments', 'upcoming'],
    queryFn: () => appointmentApi.getAppointments({ 
      page: 1, 
      per_page: 10,
      start_date: new Date().toISOString().split('T')[0]
    }),
  })

  const stats = [
    {
      name: 'Total Clients',
      value: clientsData?.pagination?.total || 0,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Appointments',
      value: appointmentsData?.pagination?.total || 0,
      icon: Calendar,
      color: 'bg-green-500',
    },
    {
      name: 'Upcoming Today',
      value: upcomingAppointments?.appointments?.filter(apt => apt.is_today).length || 0,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      name: 'Completed Today',
      value: appointmentsData?.appointments?.filter(apt => apt.status === 'completed' && apt.is_today).length || 0,
      icon: CheckCircle,
      color: 'bg-purple-500',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to the Wellness Platform admin dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Clients</h2>
          {clientsData?.clients?.length ? (
            <div className="space-y-3">
              {clientsData.clients.map((client) => (
                <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{client.name}</p>
                    <p className="text-sm text-gray-600">{client.email}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {client.appointment_count} appointments
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No clients found</p>
          )}
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
          {upcomingAppointments?.appointments?.length ? (
            <div className="space-y-3">
              {upcomingAppointments.appointments.slice(0, 5).map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{appointment.client.name}</p>
                    <p className="text-sm text-gray-600">{appointment.appointment_type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(appointment.start_time).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(appointment.start_time).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No upcoming appointments</p>
          )}
        </div>
      </div>
    </div>
  )
} 