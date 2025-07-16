class CreateAppointments < ActiveRecord::Migration[7.0]
  def change
    create_table :appointments do |t|
      t.string :external_id, null: false, index: { unique: true }
      t.references :client, null: false, foreign_key: true
      t.datetime :start_time, null: false
      t.datetime :end_time, null: false
      t.string :status, null: false, default: 'scheduled'
      t.string :appointment_type, null: false
      t.text :notes
      t.datetime :last_synced_at
      t.jsonb :external_data, default: {}

      t.timestamps
    end
    
    add_index :appointments, :start_time
    add_index :appointments, :status
    add_index :appointments, :appointment_type
    add_index :appointments, :external_data, using: :gin
    
    # Add constraint for appointment time ranges
    add_check_constraint :appointments, "end_time > start_time", name: "check_end_time_after_start_time"
  end
end 