class CreateAuditLogs < ActiveRecord::Migration[8.1]
  def change
    create_table :audit_logs do |t|
      t.references :user, null: true, foreign_key: true
      t.string :action, null: false
      t.string :trackable_type, null: false
      t.bigint :trackable_id, null: false
      t.text :metadata

      t.timestamps
    end
    add_index :audit_logs, [ :trackable_type, :trackable_id ]
  end
end
