class AuditLog < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :trackable, polymorphic: true

  validates :action, presence: true
end
