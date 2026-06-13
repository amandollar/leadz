class ActivitiesController < ApplicationController
  def create
    lead = current_user.workspace.leads.find(params[:lead_id])
    activity = lead.activities.new(
      user: current_user,
      activity_type: params[:activity_type],
      notes: params[:notes]
    )

    if activity.save
      AuditLog.create!(
        user: current_user,
        action: "Activity Logged",
        trackable: lead,
        metadata: { type: activity.activity_type }.to_json
      )
      redirect_to lead_path(lead), notice: "Activity logged successfully."
    else
      redirect_to lead_path(lead), alert: "Failed to log activity: #{activity.errors.full_messages.join(', ')}"
    end
  end
end
