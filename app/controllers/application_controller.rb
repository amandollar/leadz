class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  before_action :authenticate_user!

  helper_method :current_user, :logged_in?

  inertia_share do
    {
      auth: {
        user: current_user ? {
          id: current_user.id,
          name: current_user.name,
          email: current_user.email,
          role: current_user.role,
          workspace_name: current_user.workspace&.name
        } : nil
      },
      flash: {
        success: flash[:success],
        alert: flash[:alert],
        notice: flash[:notice]
      }
    }
  end

  private

  def current_user
    @current_user ||= User.find_by(id: session[:user_id]) if session[:user_id]
  end

  def logged_in?
    current_user.present?
  end

  def authenticate_user!
    if session[:reset_user_id]
      redirect_to force_reset_path and return
    end

    unless logged_in?
      flash[:alert] = "You must be logged in to access this page."
      redirect_to login_path
    end
  end
end
