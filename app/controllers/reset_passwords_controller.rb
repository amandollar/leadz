class ResetPasswordsController < ApplicationController
  skip_before_action :authenticate_user!
  before_action :ensure_reset_session!

  def new
    render inertia: "ForceReset"
  end

  def create
    password = params[:password]
    password_confirmation = params[:password_confirmation]

    if password.blank? || password_confirmation.blank?
      redirect_to force_reset_path, alert: "Password and confirmation are required."
      return
    end

    if password != password_confirmation
      redirect_to force_reset_path, alert: "Passwords do not match."
      return
    end

    user = User.find(session[:reset_user_id])
    if user.update(
      password: password,
      must_change_password: false,
      temporary_password: nil
    )
      session[:user_id] = user.id
      session[:reset_user_id] = nil
      redirect_to root_path, notice: "Your password has been changed successfully. Welcome to the app!"
    else
      redirect_to force_reset_path, alert: user.errors.full_messages.to_sentence
    end
  end

  private

  def ensure_reset_session!
    redirect_to login_path unless session[:reset_user_id].present?
  end
end
