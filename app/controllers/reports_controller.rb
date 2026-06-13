class ReportsController < ApplicationController
  def index
    workspace = current_user.workspace
    leads = workspace.leads.where(archived: false)

    # 1. Pipeline stage counts
    stage_counts = Lead::STAGES.each_with_object({}) do |stage, hash|
      hash[stage] = leads.where(stage: stage).count
    end

    # 2. Conversion metrics
    won_count = leads.where(stage: "Won").count
    lost_count = leads.where(stage: "Lost").count
    total_closed = won_count + lost_count
    conversion_rate = total_closed > 0 ? ((won_count.to_f / total_closed) * 100).round(1) : 0.0

    # 3. User performance stats
    user_stats = workspace.users.order(:name).map do |user|
      user_leads = workspace.leads.where(owner_id: user.id)
      {
        id: user.id,
        name: user.name,
        role: user.role,
        leads_assigned: user_leads.count,
        deals_won: user_leads.where(stage: "Won").count,
        activities_count: user.activities.count,
        follow_ups_completed: FollowUp.joins(:lead).where(leads: { owner_id: user.id }, status: "Completed").count
      }
    end

    render inertia: "Reports/Index", props: {
      stageCounts: stage_counts,
      wonCount: won_count,
      lostCount: lost_count,
      conversionRate: conversion_rate,
      userStats: user_stats
    }
  end
end
