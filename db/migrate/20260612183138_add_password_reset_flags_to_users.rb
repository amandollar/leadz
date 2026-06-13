class AddPasswordResetFlagsToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :must_change_password, :boolean, default: false
    add_column :users, :temporary_password, :string
  end
end
