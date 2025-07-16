# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "appointments", force: :cascade do |t|
    t.string "external_id", null: false
    t.bigint "client_id", null: false
    t.datetime "start_time", null: false
    t.datetime "end_time", null: false
    t.string "status", default: "scheduled", null: false
    t.string "appointment_type", null: false
    t.text "notes"
    t.datetime "last_synced_at"
    t.jsonb "external_data", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["appointment_type"], name: "index_appointments_on_appointment_type"
    t.index ["client_id"], name: "index_appointments_on_client_id"
    t.index ["external_data"], name: "index_appointments_on_external_data", using: :gin
    t.index ["external_id"], name: "index_appointments_on_external_id", unique: true
    t.index ["start_time"], name: "index_appointments_on_start_time"
    t.index ["status"], name: "index_appointments_on_status"
    t.check_constraint "end_time > start_time", name: "check_end_time_after_start_time"
  end

  create_table "clients", force: :cascade do |t|
    t.string "external_id", null: false
    t.string "name", null: false
    t.string "email", null: false
    t.string "phone", null: false
    t.text "notes"
    t.boolean "active", default: true
    t.datetime "last_synced_at"
    t.jsonb "external_data", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["active"], name: "index_clients_on_active"
    t.index ["email"], name: "index_clients_on_email"
    t.index ["external_data"], name: "index_clients_on_external_data", using: :gin
    t.index ["external_id"], name: "index_clients_on_external_id", unique: true
    t.index ["name"], name: "index_clients_on_name"
  end

  add_foreign_key "appointments", "clients"
end
