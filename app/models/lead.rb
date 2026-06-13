class Lead < ApplicationRecord
  belongs_to :workspace
  belongs_to :owner, class_name: "User", optional: true

  has_many :activities, -> { order(created_at: :desc) }, dependent: :destroy
  has_many :follow_ups, -> { order(due_date: :asc) }, dependent: :destroy
  has_many :audit_logs, -> { order(created_at: :desc) }, as: :trackable, dependent: :destroy

  STAGES = [ "New", "Contacted", "Interested", "Meeting Scheduled", "Proposal Sent", "Negotiation", "Won", "Lost" ].freeze

  validates :business_name, presence: true
  validates :stage, inclusion: { in: STAGES }
  validates :archived, inclusion: { in: [ true, false ] }
end
