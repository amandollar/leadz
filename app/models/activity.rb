class Activity < ApplicationRecord
  belongs_to :lead
  belongs_to :user

  TYPES = [ "Call", "WhatsApp", "Email", "Meeting", "Note" ].freeze

  validates :activity_type, inclusion: { in: TYPES }
  validates :notes, presence: true
end
