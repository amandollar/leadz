class LeadsController < ApplicationController
  before_action :set_lead, only: [ :show, :update, :update_stage, :assign, :archive ]
  before_action :ensure_assign_permission!, only: [ :assign ]

  def index
    @leads = current_user.workspace.leads.where(archived: false)

    # Search
    if params[:query].present?
      q = "%#{params[:query]}%"
      @leads = @leads.where("business_name ILIKE :q OR contact_name ILIKE :q OR email ILIKE :q", q: q)
    end

    # Filters
    @leads = @leads.where(stage: params[:stage]) if params[:stage].present?
    @leads = @leads.where(owner_id: params[:owner_id]) if params[:owner_id].present?

    # Optimization
    @leads = @leads.includes(:owner).order(created_at: :desc)

    # Get Workspace Users for Assignment Filter & dropdowns
    @users = current_user.workspace.users.select(:id, :name, :email, :role).order(:name)

    render inertia: "Leads/Index", props: {
      leads: @leads.map { |l| serialize_lead(l) },
      users: @users,
      filters: params.permit(:query, :stage, :owner_id)
    }
  end

  def pipeline
    @leads = current_user.workspace.leads.where(archived: false).includes(:owner)
    @users = current_user.workspace.users.select(:id, :name, :email, :role).order(:name)
    render inertia: "Pipeline/Index", props: {
      leads: @leads.map { |l| serialize_lead(l) },
      users: @users
    }
  end

  def show
    activities = @lead.activities.includes(:user).order(created_at: :desc)
    follow_ups = @lead.follow_ups.order(due_date: :asc)
    audit_logs = @lead.audit_logs.includes(:user).order(created_at: :desc)
    users = current_user.workspace.users.select(:id, :name, :email, :role).order(:name)

    render inertia: "Leads/Show", props: {
      lead: serialize_lead(@lead),
      activities: activities.map { |a| serialize_activity(a) },
      followUps: follow_ups.map { |f| serialize_follow_up(f) },
      auditLogs: audit_logs.map { |log| serialize_audit_log(log) },
      users: users
    }
  end

  def create
    @lead = current_user.workspace.leads.new(lead_params)

    # Set owner to creator if not specified and creator is a Rep/Manager
    @lead.owner = current_user if @lead.owner_id.nil? && [ "Sales Rep", "Manager" ].include?(current_user.role)

    if @lead.save
      AuditLog.create!(
        user: current_user,
        action: "Lead Created",
        trackable: @lead,
        metadata: { business_name: @lead.business_name, stage: @lead.stage }.to_json
      )
      redirect_to lead_path(@lead), notice: "Lead was successfully created."
    else
      redirect_to leads_path, alert: "Failed to create lead: #{@lead.errors.full_messages.join(', ')}"
    end
  end

  def update
    old_attrs = @lead.attributes.slice("business_name", "contact_name", "email", "phone", "website", "industry", "city", "notes")

    if @lead.update(lead_params)
      # Log changes
      changes = @lead.previous_changes.slice(*old_attrs.keys)
      if changes.any?
        AuditLog.create!(
          user: current_user,
          action: "Lead Updated",
          trackable: @lead,
          metadata: changes.to_json
        )
      end
      redirect_to lead_path(@lead), notice: "Lead details updated successfully."
    else
      redirect_to lead_path(@lead), alert: "Failed to update lead: #{@lead.errors.full_messages.join(', ')}"
    end
  end

  def update_stage
    old_stage = @lead.stage
    new_stage = params[:stage]

    if Lead::STAGES.include?(new_stage) && @lead.update(stage: new_stage)
      AuditLog.create!(
        user: current_user,
        action: "Stage Changed",
        trackable: @lead,
        metadata: { from: old_stage, to: new_stage }.to_json
      )
      redirect_back fallback_location: leads_path, notice: "Lead stage updated to #{new_stage}."
    else
      redirect_back fallback_location: leads_path, alert: "Invalid stage transition."
    end
  end

  def assign
    old_owner_name = @lead.owner&.name || "Unassigned"
    new_owner = params[:owner_id].present? ? current_user.workspace.users.find(params[:owner_id]) : nil

    if @lead.update(owner: new_owner)
      new_owner_name = new_owner&.name || "Unassigned"
      AuditLog.create!(
        user: current_user,
        action: "Lead Assigned",
        trackable: @lead,
        metadata: { from: old_owner_name, to: new_owner_name }.to_json
      )
      redirect_back fallback_location: lead_path(@lead), notice: "Lead successfully assigned to #{new_owner_name}."
    else
      redirect_back fallback_location: lead_path(@lead), alert: "Failed to assign lead."
    end
  end

  def archive
    if @lead.update(archived: true)
      AuditLog.create!(
        user: current_user,
        action: "Lead Archived",
        trackable: @lead
      )
      redirect_to leads_path, notice: "Lead was successfully archived."
    else
      redirect_to lead_path(@lead), alert: "Failed to archive lead."
    end
  end

  private

  def set_lead
    @lead = current_user.workspace.leads.find(params[:id])
  end

  def lead_params
    params.require(:lead).permit(:business_name, :contact_name, :email, :phone, :website, :industry, :city, :notes, :owner_id, :stage)
  end

  def ensure_assign_permission!
    unless [ "Admin", "Manager" ].include?(current_user.role)
      redirect_back fallback_location: lead_path(@lead), alert: "Only Admins and Managers can assign leads."
    end
  end

  # Serializers
  def serialize_lead(lead)
    {
      id: lead.id,
      business_name: lead.business_name,
      contact_name: lead.contact_name,
      email: lead.email,
      phone: lead.phone,
      website: lead.website,
      industry: lead.industry,
      city: lead.city,
      notes: lead.notes,
      stage: lead.stage,
      archived: lead.archived,
      owner: lead.owner ? { id: lead.owner.id, name: lead.owner.name, role: lead.owner.role } : nil,
      created_at: lead.created_at.strftime("%b %d, %Y")
    }
  end

  def serialize_activity(activity)
    {
      id: activity.id,
      activity_type: activity.activity_type,
      notes: activity.notes,
      user_name: activity.user.name,
      created_at: activity.created_at.strftime("%b %d, %Y at %I:%M %p")
    }
  end

  def serialize_follow_up(follow_up)
    {
      id: follow_up.id,
      due_date: follow_up.due_date.strftime("%Y-%m-%d"),
      due_date_formatted: follow_up.due_date.strftime("%b %d, %Y"),
      notes: follow_up.notes,
      status: follow_up.status
    }
  end

  def serialize_audit_log(log)
    {
      id: log.id,
      action: log.action,
      user_name: log.user&.name || "System",
      metadata: log.metadata.present? ? JSON.parse(log.metadata) : nil,
      created_at: log.created_at.strftime("%b %d, %Y at %I:%M %p")
    }
  rescue JSON::ParserError
    {
      id: log.id,
      action: log.action,
      user_name: log.user&.name || "System",
      metadata: log.metadata,
      created_at: log.created_at.strftime("%b %d, %Y at %I:%M %p")
    }
  end
end
