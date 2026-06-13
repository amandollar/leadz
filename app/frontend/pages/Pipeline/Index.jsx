import React, { useState } from 'react'
import { router, usePage, Link } from '@inertiajs/react'
import Layout from '../../components/Layout'

export default function Index({ leads, users }) {
  const { auth } = usePage().props
  const user = auth?.user

  const stagesList = ["New", "Contacted", "Interested", "Meeting Scheduled", "Proposal Sent", "Negotiation", "Won", "Lost"]

  // Track the card ID being dragged
  const [draggingId, setDraggingId] = useState(null)

  const handleDragStart = (e, leadId) => {
    e.dataTransfer.setData('text/plain', leadId)
    setDraggingId(leadId)
  }

  const handleDragEnd = () => {
    setDraggingId(null)
  }

  const handleDrop = (e, targetStage) => {
    e.preventDefault()
    const leadId = e.dataTransfer.getData('text/plain')
    
    if (leadId) {
      updateLeadStage(leadId, targetStage)
    }
    setDraggingId(null)
  }

  const updateLeadStage = (leadId, stage) => {
    router.patch(`/leads/${leadId}/update_stage`, { stage: stage }, {
      preserveScroll: true,
      preserveState: true
    })
  }

  // Group leads by stage
  const getLeadsByStage = (stage) => {
    return leads.filter(l => l.stage === stage)
  }

  // Get accent styles for columns
  const getStageHeaderStyles = (stage) => {
    switch (stage) {
      case 'New': return 'border-t-4 border-t-slate-350'
      case 'Contacted': return 'border-t-4 border-t-blue-500'
      case 'Interested': return 'border-t-4 border-t-indigo-500'
      case 'Meeting Scheduled': return 'border-t-4 border-t-violet-500'
      case 'Proposal Sent': return 'border-t-4 border-t-pink-500'
      case 'Negotiation': return 'border-t-4 border-t-amber-500'
      case 'Won': return 'border-t-4 border-t-emerald-500'
      case 'Lost': return 'border-t-4 border-t-red-500'
      default: return 'border-t-4 border-t-slate-350'
    }
  }

  return (
    <Layout>
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-5 mb-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pipeline Board</h1>
          <p className="text-xs text-slate-500 mt-1">Drag cards to update stage, or click arrows to move.</p>
        </div>
        <div className="text-xs text-slate-505 font-semibold bg-slate-100 border border-slate-200 px-3 py-2 rounded-lg shrink-0 shadow-2xs">
          Active Leads: <span className="text-slate-900 font-bold">{leads.length}</span>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="overflow-x-auto pb-6 select-none animate-slide-up">
        
        <div className="flex gap-4 items-start min-w-[1600px] pb-6">
          {stagesList.map((stage) => {
            const stageLeads = getLeadsByStage(stage)
            return (
              <div
                key={stage}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, stage)}
                className={`w-72 flex flex-col rounded-xl border border-slate-200 bg-white ${getStageHeaderStyles(stage)} shrink-0 shadow-[0_4px_20px_rgb(0,0,0,0.01)]`}
              >
                
                {/* Column Title */}
                <div className="p-4 flex items-center justify-between border-b border-slate-200 shrink-0 bg-slate-50/50 rounded-t-lg">
                  <span className="text-xs font-bold text-slate-700 tracking-wider uppercase">{stage}</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-bold text-slate-500">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Column Cards Area */}
                <div className="flex-1 p-3 space-y-3 min-h-[450px]">
                  {stageLeads.length > 0 ? (
                    stageLeads.map((lead) => {
                      const isDragged = draggingId === String(lead.id)
                      return (
                        <div
                          key={lead.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, lead.id)}
                          onDragEnd={handleDragEnd}
                          className={`bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-350 rounded-lg p-4 shadow-3xs cursor-grab active:cursor-grabbing hover:-translate-y-0.5 transition-all duration-200 ${
                            isDragged ? 'opacity-30 border-dashed border-slate-400 bg-slate-100' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <Link
                              href={`/leads/${lead.id}`}
                              className="text-xs font-bold text-slate-800 hover:text-indigo-650 block transition-colors line-clamp-1"
                            >
                              {lead.business_name}
                            </Link>
                          </div>

                          <div className="text-[10px] text-slate-400 font-medium mb-3 block line-clamp-1">
                            Contact: {lead.contact_name || 'N/A'}
                          </div>

                          <div className="flex items-center justify-between border-t border-slate-200/60 pt-3 mt-1 text-[10px]">
                            {/* Lead owner initials */}
                            {lead.owner ? (
                              <div className="flex items-center gap-1.5 text-slate-500">
                                <span className="h-5 w-5 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-[8px] text-indigo-600 shrink-0">
                                  {lead.owner.name[0].toUpperCase()}
                                </span>
                                <span className="truncate max-w-[85px] font-semibold text-slate-700">{lead.owner.name.split(' ')[0]}</span>
                              </div>
                            ) : (
                              <span className="text-slate-400 font-normal italic">Unassigned</span>
                            )}

                            {/* Quick Action triggers */}
                            <div className="flex gap-1 items-center">
                              {/* Left arrow to demote stage */}
                              {stagesList.indexOf(stage) > 0 && (
                                <button
                                  onClick={() => updateLeadStage(lead.id, stagesList[stagesList.indexOf(stage) - 1])}
                                  className="h-5.5 w-5.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 hover:text-slate-800 text-slate-450 flex items-center justify-center rounded transition-colors cursor-pointer shadow-3xs"
                                  title="Move to previous stage"
                                >
                                  &larr;
                                </button>
                              )}
                              {/* Right arrow to promote stage */}
                              {stagesList.indexOf(stage) < stagesList.length - 1 && (
                                <button
                                  onClick={() => updateLeadStage(lead.id, stagesList[stagesList.indexOf(stage) + 1])}
                                  className="h-5.5 w-5.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 hover:text-slate-800 text-slate-450 flex items-center justify-center rounded transition-colors cursor-pointer shadow-3xs"
                                  title="Move to next stage"
                                >
                                  &rarr;
                                </button>
                              )}
                            </div>

                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="h-24 border border-dashed border-slate-200 rounded-lg flex items-center justify-center text-[10px] text-slate-400 bg-slate-50/30">
                      Empty stage column
                    </div>
                  )}
                </div>

              </div>
            )
          })}
        </div>

      </div>
    </Layout>
  )
}
