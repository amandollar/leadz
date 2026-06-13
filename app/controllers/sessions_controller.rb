class SessionsController < ApplicationController
  skip_before_action :authenticate_user!, only: [ :new, :create ]

  def new
    if logged_in?
      redirect_to root_path
    else
      render inertia: "Login"
    end
  end

  def create
    user = User.find_by(email: params[:email].to_s.strip.downcase)
    if user && user.authenticate(params[:password])
      if user.must_change_password
        session[:reset_user_id] = user.id
        redirect_to force_reset_path, notice: "Please set a new password before proceeding."
      else
        session[:user_id] = user.id
        redirect_to root_path, notice: "Welcome back, #{user.name}!"
      end
    else
      redirect_to login_path, alert: "Invalid email or password."
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to login_path, notice: "You have been logged out."
  end
end
