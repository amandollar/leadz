Rails.application.routes.draw do
  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  get "up" => "rails/health#show", as: :rails_health_check

  # Sessions / Authentication
  get "login" => "sessions#new", as: :login
  post "login" => "sessions#create"
  delete "logout" => "sessions#destroy", as: :logout

  # Agency Registrations (SaaS Signup)
  get "signup" => "registrations#new", as: :signup
  post "signup" => "registrations#create"

  # Force Password Reset Gate
  get "force_reset" => "reset_passwords#new", as: :force_reset
  post "force_reset" => "reset_passwords#create"

  # Team Settings / Management
  get "settings/team" => "team#index", as: :team_settings
  post "settings/team" => "team#create", as: :create_team_member

  # Root / Dashboard
  root "dashboard#index"

  # Kanban Pipeline Board
  get "pipeline" => "leads#pipeline", as: :pipeline

  # Leads REST resource with custom transitions
  resources :leads, only: [ :index, :show, :create, :update ] do
    member do
      patch :update_stage
      patch :assign
      patch :archive
    end
  end

  # Interactions
  resources :activities, only: [ :create ]
  resources :follow_ups, only: [ :create, :update ]

  # Performance metrics
  get "reports" => "reports#index", as: :reports
end
