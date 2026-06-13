class FollowUp < ApplicationRecord
  belongs_to :lead

  STATUSES = [ "Pending", "Completed", "Missed" ].freeze

  validates :due_date, presence: true
  validates :status, inclusion: { in: STATUSES }
end
