class RegistrationsController < ApplicationController
  skip_before_action :authenticate_user!, only: [ :new, :create ]

  def new
    if logged_in?
      redirect_to root_path
    else
      render inertia: "Signup"
    end
  end

  def create
    workspace_name = params[:workspace_name].to_s.strip
    name = params[:name].to_s.strip
    email = params[:email].to_s.strip.downcase
    password = params[:password]

    if workspace_name.blank? || name.blank? || email.blank? || password.blank?
      redirect_to signup_path, alert: "All fields are required."
      return
    end

    if User.exists?(email: email)
      redirect_to signup_path, alert: "Email is already taken."
      return
    end

    User.transaction do
      workspace = Workspace.create!(name: workspace_name)
      user = User.create!(
        name: name,
        email: email,
        password: password,
        role: "Admin",
        workspace: workspace
      )
      session[:user_id] = user.id
      redirect_to root_path, notice: "Workspace and Admin account registered successfully!"
    end
  rescue ActiveRecord::RecordInvalid => e
    redirect_to signup_path, alert: e.message
  end
end
