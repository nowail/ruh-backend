class CreateClients < ActiveRecord::Migration[7.0]
  def change
    create_table :clients do |t|
      t.string :external_id, null: false, index: { unique: true }
      t.string :name, null: false
      t.string :email, null: false
      t.string :phone, null: false
      t.text :notes
      t.boolean :active, default: true
      t.datetime :last_synced_at
      t.jsonb :external_data, default: {}

      t.timestamps
    end
    
    add_index :clients, :email
    add_index :clients, :name
    add_index :clients, :active
    add_index :clients, :external_data, using: :gin
  end
end 