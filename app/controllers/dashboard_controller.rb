class DashboardController < ApplicationController
  def index
    workspace = current_user.workspace
    leads = workspace.leads.where(archived: false)

    # General / Manager metrics
    total_leads = leads.count
    leads_by_stage = Lead::STAGES.each_with_object({}) { |s, h| h[s] = leads.where(stage: s).count }
    pending_follow_ups = FollowUp.joins(:lead).where(leads: { workspace_id: workspace.id, archived: false }, status: "Pending").count

    won = leads_by_stage["Won"] || 0
    lost = leads_by_stage["Lost"] || 0
    total_closed = won + lost
    conversion_rate = total_closed > 0 ? ((won.to_f / total_closed) * 100).round(1) : 0.0

    # User-specific metrics
    my_leads_scope = leads.where(owner_id: current_user.id)
    my_leads = my_leads_scope.count
    my_pending_follow_ups = FollowUp.joins(:lead).where(leads: { owner_id: current_user.id, archived: false }, status: "Pending").count
    my_won_deals = my_leads_scope.where(stage: "Won").count
    my_lost_deals = my_leads_scope.where(stage: "Lost").count

    render inertia: "Dashboard", props: {
      stats: {
        totalLeads: total_leads,
        leadsByStage: leads_by_stage,
        pendingFollowUps: pending_follow_ups,
        conversionRate: conversion_rate,
        myLeads: my_leads,
        myPendingFollowUps: my_pending_follow_ups,
        myWonDeals: my_won_deals,
        myLostDeals: my_lost_deals
      }
    }
  end
end
