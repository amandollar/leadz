class CreateFollowUps < ActiveRecord::Migration[8.1]
  def change
    create_table :follow_ups do |t|
      t.references :lead, null: false, foreign_key: true
      t.datetime :due_date, null: false
      t.text :notes
      t.string :status, null: false, default: 'Pending'

      t.timestamps
    end
  end
end
