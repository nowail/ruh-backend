# Seed data for Wellness Platform

puts "Creating seed data..."

# Create sample clients
clients_data = [
  {
    external_id: 'client_001',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '555-0101',
    notes: 'Prefers morning appointments'
  },
  {
    external_id: 'client_002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '555-0102',
    notes: 'Allergic to latex'
  },
  {
    external_id: 'client_003',
    name: 'Michael Brown',
    email: 'michael.brown@email.com',
    phone: '555-0103',
    notes: 'Requires wheelchair access'
  },
  {
    external_id: 'client_004',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    phone: '555-0104',
    notes: 'First-time client'
  },
  {
    external_id: 'client_005',
    name: 'David Wilson',
    email: 'david.wilson@email.com',
    phone: '555-0105',
    notes: 'Veteran client - 5 years'
  }
]

clients_data.each do |client_data|
  Client.find_or_create_by(external_id: client_data[:external_id]) do |client|
    client.assign_attributes(client_data)
  end
end

puts "Created #{Client.count} clients"

# Create sample appointments
appointments_data = [
  {
    external_id: 'apt_001',
    client_external_id: 'client_001',
    start_time: 1.day.from_now.at_beginning_of_hour + 9.hours,
    end_time: 1.day.from_now.at_beginning_of_hour + 10.hours,
    appointment_type: 'Wellness Check',
    status: 'confirmed',
    notes: 'Annual wellness checkup'
  },
  {
    external_id: 'apt_002',
    client_external_id: 'client_002',
    start_time: 1.day.from_now.at_beginning_of_hour + 14.hours,
    end_time: 1.day.from_now.at_beginning_of_hour + 15.hours,
    appointment_type: 'Massage Therapy',
    status: 'scheduled',
    notes: 'Deep tissue massage'
  },
  {
    external_id: 'apt_003',
    client_external_id: 'client_003',
    start_time: 2.days.from_now.at_beginning_of_hour + 10.hours,
    end_time: 2.days.from_now.at_beginning_of_hour + 11.hours,
    appointment_type: 'Physical Therapy',
    status: 'scheduled',
    notes: 'Post-surgery rehabilitation'
  },
  {
    external_id: 'apt_004',
    client_external_id: 'client_004',
    start_time: 3.days.from_now.at_beginning_of_hour + 11.hours,
    end_time: 3.days.from_now.at_beginning_of_hour + 12.hours,
    appointment_type: 'Consultation',
    status: 'scheduled',
    notes: 'Initial consultation'
  },
  {
    external_id: 'apt_005',
    client_external_id: 'client_005',
    start_time: 1.week.from_now.at_beginning_of_hour + 15.hours,
    end_time: 1.week.from_now.at_beginning_of_hour + 16.hours,
    appointment_type: 'Wellness Check',
    status: 'scheduled',
    notes: 'Follow-up appointment'
  }
]

appointments_data.each do |appointment_data|
  client = Client.find_by(external_id: appointment_data[:client_external_id])
  next unless client
  
  Appointment.find_or_create_by(external_id: appointment_data[:external_id]) do |appointment|
    appointment.assign_attributes(
      client: client,
      start_time: appointment_data[:start_time],
      end_time: appointment_data[:end_time],
      appointment_type: appointment_data[:appointment_type],
      status: appointment_data[:status],
      notes: appointment_data[:notes]
    )
  end
end

puts "Created #{Appointment.count} appointments"

# Schedule initial sync jobs
SyncClientsJob.perform_later
SyncAppointmentsJob.perform_later

puts "Scheduled initial sync jobs"
puts "Seed data creation completed!" 