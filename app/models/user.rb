class User < ApplicationRecord
  has_secure_password

  belongs_to :workspace
  has_many :owned_leads, class_name: "Lead", foreign_key: "owner_id", dependent: :nullify
  has_many :activities, dependent: :destroy
  has_many :audit_logs, dependent: :nullify

  ROLES = [ "Admin", "Manager", "Sales Rep", "Intern" ].freeze

  validates :name, presence: true
  validates :email, presence: true, uniqueness: { case_sensitive: false }, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :role, inclusion: { in: ROLES }
end
