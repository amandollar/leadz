class TeamController < ApplicationController
  before_action :ensure_manager_or_admin!

  def index
    # Retrieve all users in the current workspace
    team_members = current_user.workspace.users.order(created_at: :desc).map do |u|
      {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        created_at: u.created_at.strftime("%B %d, %Y")
      }
    end

    render inertia: "Team", props: {
      teamMembers: team_members
    }
  end

  def create
    name = params[:name].to_s.strip
    email = params[:email].to_s.strip.downcase
    role = params[:role].to_s.strip

    if name.blank? || email.blank? || role.blank?
      redirect_to team_settings_path, alert: "All fields (Name, Email, Role) are required."
      return
    end

    if User.exists?(email: email)
      redirect_to team_settings_path, alert: "Email is already in use by another account."
      return
    end

    # Generate temporary password
    temp_pwd = SecureRandom.alphanumeric(10)

    # Build user in the current user's workspace
    user = current_user.workspace.users.build(
      name: name,
      email: email,
      role: role,
      password: temp_pwd,
      temporary_password: temp_pwd,
      must_change_password: true
    )

    if user.save
      # Share the temporary password in a flash notice so the admin can copy it
      redirect_to team_settings_path, notice: "Member added! Temporary Password: #{temp_pwd}"
    else
      redirect_to team_settings_path, alert: user.errors.full_messages.to_sentence
    end
  end

  private

  def ensure_manager_or_admin!
    unless [ "Admin", "Manager" ].include?(current_user.role)
      redirect_to root_path, alert: "You are not authorized to access Team Settings."
    end
  end
end
