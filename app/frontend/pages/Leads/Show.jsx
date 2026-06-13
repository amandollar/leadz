import React, { useState } from 'react'
import { router, usePage, useForm, Link } from '@inertiajs/react'
import Layout from '../../components/Layout'

export default function Show({ lead, activities, followUps, auditLogs, users }) {
  const { auth } = usePage().props
  const user = auth?.user
  
  const isManager = ["Admin", "Manager"].includes(user?.role)

  // Lead Details editing state
  const [isEditing, setIsEditing] = useState(false)
  const editForm = useForm({
    business_name: lead.business_name,
    contact_name: lead.contact_name || '',
    email: lead.email || '',
    phone: lead.phone || '',
    website: lead.website || '',
    industry: lead.industry || '',
    city: lead.city || '',
    notes: lead.notes || '',
  })

  // Add Activity form
  const activityForm = useForm({
    lead_id: lead.id,
    activity_type: 'Call',
    notes: '',
  })

  // Add Follow Up form
  const followUpForm = useForm({
    lead_id: lead.id,
    due_date: '',
    notes: '',
  })

  const handleEditSubmit = (e) => {
    e.preventDefault()
    editForm.patch(`/leads/${lead.id}`, {
      onSuccess: () => setIsEditing(false)
    })
  }

  const handleStageChange = (e) => {
    router.patch(`/leads/${lead.id}/update_stage`, { stage: e.target.value })
  }

  const handleOwnerChange = (e) => {
    router.patch(`/leads/${lead.id}/assign`, { owner_id: e.target.value })
  }

  const handleArchive = () => {
    if (confirm("Are you sure you want to archive this lead? It will be removed from directory tables.")) {
      router.patch(`/leads/${lead.id}/archive`)
    }
  }

  const handleActivitySubmit = (e) => {
    e.preventDefault()
    activityForm.post('/activities', {
      onSuccess: () => activityForm.reset('notes')
    })
  }

  const handleFollowUpSubmit = (e) => {
    e.preventDefault()
    followUpForm.post('/follow_ups', {
      onSuccess: () => followUpForm.reset('due_date', 'notes')
    })
  }

  const handleFollowUpStatus = (id, status) => {
    router.patch(`/follow_ups/${id}`, { status: status })
  }

  const stagesList = ["New", "Contacted", "Interested", "Meeting Scheduled", "Proposal Sent", "Negotiation", "Won", "Lost"]
  const activityTypes = ["Call", "WhatsApp", "Email", "Meeting", "Note"]

  return (
    <Layout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5 mb-8 animate-fade-in">
        <div className="flex items-center gap-4">
          <Link href="/leads" className="text-slate-500 hover:text-slate-900 transition-colors text-sm flex items-center gap-1 font-bold">
            &larr; Directory
          </Link>
          <span className="h-4 w-px bg-slate-250" />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{lead.business_name}</h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleArchive}
            className="bg-white border border-slate-200 hover:bg-red-50 hover:border-red-200/80 hover:text-red-700 text-slate-600 text-xs font-semibold py-2.5 px-4 rounded-lg transition-all active:scale-[0.985] cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Archive Lead
          </button>
        </div>
      </div>

      {/* Main Split Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up">
        
        {/* LEFT COLUMN: Lead Details profile */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Details Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Lead Profile</h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-indigo-650 hover:text-indigo-800 text-xs font-bold transition-all cursor-pointer"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {isEditing ? (
              /* Edit Mode form */
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Business Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.data.business_name}
                    onChange={e => editForm.setData('business_name', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Contact Name</label>
                  <input
                    type="text"
                    value={editForm.data.contact_name}
                    onChange={e => editForm.setData('contact_name', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email</label>
                  <input
                    type="email"
                    value={editForm.data.email}
                    onChange={e => editForm.setData('email', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Phone</label>
                  <input
                    type="text"
                    value={editForm.data.phone}
                    onChange={e => editForm.setData('phone', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Website</label>
                  <input
                    type="text"
                    value={editForm.data.website}
                    onChange={e => editForm.setData('website', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Industry</label>
                    <input
                      type="text"
                      value={editForm.data.industry}
                      onChange={e => editForm.setData('industry', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">City</label>
                    <input
                      type="text"
                      value={editForm.data.city}
                      onChange={e => editForm.setData('city', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Notes</label>
                  <textarea
                    rows={3}
                    value={editForm.data.notes}
                    onChange={e => editForm.setData('notes', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={editForm.processing}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-lg active:scale-[0.985] transition-all cursor-pointer shadow-2xs"
                >
                  Save Changes
                </button>
              </form>
            ) : (
              /* View Mode data with premium inline SVGs */
              <div className="space-y-4 text-xs font-medium">
                <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-3">
                  <div>
                    <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      <svg className="w-3 h-3 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Contact Person
                    </span>
                    <span className="text-slate-800 font-bold">{lead.contact_name || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      <svg className="w-3 h-3 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      City
                    </span>
                    <span className="text-slate-800 font-semibold">{lead.city || 'N/A'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-3">
                  <div>
                    <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      <svg className="w-3 h-3 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email
                    </span>
                    <span className="text-slate-800 font-semibold truncate block" title={lead.email}>{lead.email || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      <svg className="w-3 h-3 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Phone
                    </span>
                    <span className="text-slate-800 font-semibold">{lead.phone || 'N/A'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-3">
                  <div>
                    <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      <svg className="w-3 h-3 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      Website
                    </span>
                    <span className="text-slate-800 font-semibold block truncate" title={lead.website}>{lead.website || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      <svg className="w-3 h-3 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4.674 12.83a3 3 0 003.366-3.366m-10.048 0a3 3 0 003.366 3.366M20 8v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h12a2 2 0 012 2z" />
                      </svg>
                      Industry
                    </span>
                    <span className="text-slate-800 font-semibold">{lead.industry || 'N/A'}</span>
                  </div>
                </div>

                {lead.notes && (
                  <div className="border-b border-slate-100 pb-3">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Background Notes</span>
                    <p className="text-slate-600 leading-relaxed font-normal bg-slate-50/50 p-3.5 rounded-lg border border-slate-200">{lead.notes}</p>
                  </div>
                )}
              </div>
            )}

            {/* Quick Status controls (Stage and Owner) */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Pipeline Stage</label>
                <select
                  value={lead.stage}
                  onChange={handleStageChange}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none"
                >
                  {stagesList.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Assigned Owner</label>
                {isManager ? (
                  <select
                    value={lead.owner?.id || ''}
                    onChange={handleOwnerChange}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-705 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none"
                  >
                    <option value="">Unassigned (Open Pool)</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                    ))}
                  </select>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-550 font-semibold">
                    {lead.owner ? lead.owner.name : 'Unassigned'}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Action modules & log timeline */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Activities Timeline & logging */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider border-b border-slate-200 pb-4">
              Activities & Timeline
            </h3>

            {/* Log Activity Form */}
            <form onSubmit={handleActivitySubmit} className="bg-slate-50/50 border border-slate-200 p-4 rounded-xl space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Log Touchpoint:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activityTypes.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => activityForm.setData('activity_type', type)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold border active:scale-95 transition-all duration-150 cursor-pointer ${
                        activityForm.data.activity_type === type
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <textarea
                  required
                  rows={2}
                  value={activityForm.data.notes}
                  onChange={e => activityForm.setData('notes', e.target.value)}
                  placeholder="Record summary of notes, conversation details, or email follow ups..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none resize-none"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={activityForm.processing}
                  className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-[10px] font-bold py-1.5 px-3.5 rounded-lg transition-all cursor-pointer shadow-2xs"
                >
                  Log Touchpoint
                </button>
              </div>
            </form>

            {/* Activity Stream */}
            <div className="space-y-4">
              {activities.length > 0 ? (
                activities.map(a => {
                  // Style badge color based on action type
                  const getBulletColor = (t) => {
                    switch (t) {
                      case 'Call': return 'bg-blue-500 ring-white'
                      case 'WhatsApp': return 'bg-emerald-500 ring-white'
                      case 'Email': return 'bg-purple-500 ring-white'
                      case 'Meeting': return 'bg-pink-500 ring-white'
                      default: return 'bg-slate-400 ring-white'
                    }
                  }
                  return (
                    <div key={a.id} className="relative pl-6 border-l-2 border-slate-100 last:border-0 pb-2">
                      {/* Bullet indicator */}
                      <div className={`absolute top-1 left-0 -translate-x-[6px] h-2.5 w-2.5 rounded-full ring-4 ${getBulletColor(a.activity_type)}`} />
                      
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">{a.activity_type}</span>
                          <span className="text-[10px] text-slate-400">by {a.user_name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal">{a.created_at}</span>
                      </div>
                      <p className="text-xs text-slate-600 font-normal leading-relaxed">{a.notes}</p>
                    </div>
                  )
                })
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">No contact activities logged on this lead yet.</p>
              )}
            </div>
          </div>

          {/* Follow Ups Panel */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider border-b border-slate-200 pb-4">
              Scheduled Tasks & Follow Ups
            </h3>

            {/* Schedule Follow Up Form */}
            <form onSubmit={handleFollowUpSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50/50 border border-slate-200 p-4 rounded-xl">
              <div className="md:col-span-1">
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={followUpForm.data.due_date}
                  onChange={e => followUpForm.setData('due_date', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none"
                />
              </div>
              <div className="md:col-span-2 flex items-end gap-2">
                <div className="flex-1">
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Task Description</label>
                  <input
                    type="text"
                    required
                    value={followUpForm.data.notes}
                    onChange={e => followUpForm.setData('notes', e.target.value)}
                    placeholder="e.g. Call to finalize contract"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={followUpForm.processing}
                  className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-[10px] font-bold py-2 px-3.5 rounded-lg transition-all cursor-pointer shrink-0 h-[34px] shadow-2xs"
                >
                  Schedule
                </button>
              </div>
            </form>

            {/* Follow Ups Checklist */}
            <div className="divide-y divide-slate-100">
              {followUps.length > 0 ? (
                followUps.map(f => (
                  <div key={f.id} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      {/* Checkbox button */}
                      {f.status === 'Pending' ? (
                        <button
                          onClick={() => handleFollowUpStatus(f.id, 'Completed')}
                          className="h-4.5 w-4.5 rounded border border-slate-300 bg-white hover:border-emerald-500 hover:bg-emerald-50 flex items-center justify-center transition-all duration-150 cursor-pointer group mt-0.5"
                          title="Mark Completed"
                        >
                          <svg className="w-3 h-3 text-emerald-600 opacity-0 group-hover:opacity-100 transition-all duration-150" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      ) : (
                        <div className={`h-4.5 w-4.5 rounded flex items-center justify-center mt-0.5 ${
                          f.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-250' : 'bg-red-50 text-red-600 border border-red-200'
                        }`}>
                          {f.status === 'Completed' ? (
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </div>
                      )}

                      <div>
                        <p className={`text-xs font-semibold ${f.status === 'Completed' ? 'line-through text-slate-400 font-normal' : 'text-slate-800'}`}>
                          {f.notes}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">
                          Due by: {f.due_date_formatted} <span className="text-slate-300 mx-1">&bull;</span> <span className={`${f.status === 'Missed' ? 'text-red-600 font-semibold' : ''}`}>{f.status}</span>
                        </span>
                      </div>
                    </div>

                    {/* Change to Missed toggle for Active pending items */}
                    {f.status === 'Pending' && (
                      <button
                        onClick={() => handleFollowUpStatus(f.id, 'Missed')}
                        className="text-[10px] font-semibold text-red-650 hover:text-red-700 hover:bg-red-50 border border-red-200 transition-colors px-2.5 py-1 rounded cursor-pointer"
                      >
                        Mark Missed
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">No follow up reminders scheduled.</p>
              )}
            </div>
          </div>

          {/* Polymorphic Audit Trails Logs */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider border-b border-slate-200 pb-4">
              Audit Logs & History
            </h3>
            
            <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2">
              {auditLogs.length > 0 ? (
                auditLogs.map(log => {
                  return (
                    <div key={log.id} className="text-xs bg-slate-50 border border-slate-200/60 p-3.5 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-800">{log.action}</span>
                        <span className="text-[9px] text-slate-400">{log.created_at}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        Performed by: <span className="text-slate-700 font-bold">{log.user_name}</span>
                      </div>
                      
                      {/* Decode metadata changes */}
                      {log.metadata && (
                        <div className="mt-2 text-[9px] bg-white border border-slate-200 p-2.5 rounded-md font-mono text-slate-500 overflow-x-auto shadow-3xs">
                          {Object.entries(log.metadata).map(([field, val]) => {
                            if (Array.isArray(val)) {
                              return <div key={field}>{field}: {val[0] || 'nil'} &rarr; {val[1] || 'nil'}</div>
                            }
                            return <div key={field}>{field}: {JSON.stringify(val)}</div>
                          })}
                        </div>
                      )}
                    </div>
                  )
                })
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">No history records found.</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </Layout>
  )
}
