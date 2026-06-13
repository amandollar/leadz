class Workspace < ApplicationRecord
  has_many :users, dependent: :destroy
  has_many :leads, dependent: :destroy

  validates :name, presence: true
end
