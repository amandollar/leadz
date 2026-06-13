class CreateActivities < ActiveRecord::Migration[8.1]
  def change
    create_table :activities do |t|
      t.references :lead, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :activity_type, null: false
      t.text :notes, null: false

      t.timestamps
    end
  end
end
