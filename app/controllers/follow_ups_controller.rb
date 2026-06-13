class FollowUpsController < ApplicationController
  def create
    lead = current_user.workspace.leads.find(params[:lead_id])
    follow_up = lead.follow_ups.new(
      due_date: params[:due_date],
      notes: params[:notes],
      status: "Pending"
    )

    if follow_up.save
      AuditLog.create!(
        user: current_user,
        action: "Follow Up Created",
        trackable: lead,
        metadata: { due_date: follow_up.due_date.strftime("%Y-%m-%d") }.to_json
      )
      redirect_to lead_path(lead), notice: "Follow-up scheduled successfully."
    else
      redirect_to lead_path(lead), alert: "Failed to schedule follow-up: #{follow_up.errors.full_messages.join(', ')}"
    end
  end

  def update
    follow_up = FollowUp.joins(:lead).where(leads: { workspace_id: current_user.workspace_id }).find(params[:id])
    old_status = follow_up.status

    if follow_up.update(status: params[:status])
      AuditLog.create!(
        user: current_user,
        action: "Follow Up Updated",
        trackable: follow_up.lead,
        metadata: { from: old_status, to: follow_up.status }.to_json
      )
      redirect_back fallback_location: lead_path(follow_up.lead), notice: "Follow-up marked as #{follow_up.status}."
    else
      redirect_back fallback_location: lead_path(follow_up.lead), alert: "Failed to update follow-up."
    end
  end
end
