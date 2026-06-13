class CreateLeads < ActiveRecord::Migration[8.1]
  def change
    create_table :leads do |t|
      t.string :business_name, null: false
      t.string :contact_name
      t.string :email
      t.string :phone
      t.string :website
      t.string :industry
      t.string :city
      t.text :notes
      t.string :stage, null: false, default: 'New'
      t.boolean :archived, null: false, default: false
      t.references :workspace, null: false, foreign_key: true
      t.integer :owner_id

      t.timestamps
    end
    add_index :leads, :owner_id
    add_foreign_key :leads, :users, column: :owner_id
  end
end
