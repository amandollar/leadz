import React, { useState } from 'react'
import { router, usePage, useForm, Link } from '@inertiajs/react'
import Layout from '../../components/Layout'

export default function Index({ leads, users, filters }) {
  const { auth } = usePage().props
  const user = auth?.user
  
  const [showAddModal, setShowAddModal] = useState(false)

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState(filters.query || '')
  const [stageFilter, setStageFilter] = useState(filters.stage || '')
  const [ownerFilter, setOwnerFilter] = useState(filters.owner_id || '')

  // Create lead form state
  const { data, setData, post, processing, reset, errors } = useForm({
    business_name: '',
    contact_name: '',
    email: '',
    phone: '',
    website: '',
    industry: '',
    city: '',
    notes: '',
    owner_id: '',
  })

  // Apply filters on search/filter changes
  const applyFilters = (queryStr = searchQuery, stageStr = stageFilter, ownerStr = ownerFilter) => {
    router.get('/leads', {
      query: queryStr,
      stage: stageStr,
      owner_id: ownerStr
    }, { preserveState: true, replace: true })
  }

  const handleSearchChange = (e) => {
    const val = e.target.value
    setSearchQuery(val)
    applyFilters(val, stageFilter, ownerFilter)
  }

  const handleStageFilterChange = (e) => {
    const val = e.target.value
    setStageFilter(val)
    applyFilters(searchQuery, val, ownerFilter)
  }

  const handleOwnerFilterChange = (e) => {
    const val = e.target.value
    setOwnerFilter(val)
    applyFilters(searchQuery, stageFilter, val)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setStageFilter('')
    setOwnerFilter('')
    router.get('/leads', {}, { replace: true })
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    post('/leads', {
      onSuccess: () => {
        reset()
        setShowAddModal(false)
      }
    })
  }

  // Get color for stage badge (Light Theme SaaS Styling)
  const getStageBadgeColor = (stage) => {
    switch (stage) {
      case 'New': return 'bg-slate-50 text-slate-600 border-slate-200'
      case 'Contacted': return 'bg-blue-50 text-blue-700 border-blue-200/60'
      case 'Interested': return 'bg-indigo-50 text-indigo-700 border-indigo-200/60'
      case 'Meeting Scheduled': return 'bg-violet-50 text-violet-700 border-violet-200/60'
      case 'Proposal Sent': return 'bg-pink-50 text-pink-700 border-pink-200/60'
      case 'Negotiation': return 'bg-amber-50 text-amber-700 border-amber-200/60'
      case 'Won': return 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
      case 'Lost': return 'bg-red-50 text-red-700 border-red-200/60'
      default: return 'bg-slate-50 text-slate-600 border-slate-200'
    }
  }

  const stagesList = ["New", "Contacted", "Interested", "Meeting Scheduled", "Proposal Sent", "Negotiation", "Won", "Lost"]

  return (
    <Layout>
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-5 mb-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leads Directory</h1>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 shadow-2xs">
            {leads.length} Active
          </span>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 active:scale-[0.985] text-white text-xs font-semibold py-2 px-4 rounded-lg transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Lead
        </button>
      </div>

      {/* Main Content */}
      <div className="space-y-6 animate-slide-up">
        
        {/* Search and Filters Bar */}
        <div className="flex flex-col md:flex-row items-center gap-4 bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          {/* Search Box */}
          <div className="relative w-full md:flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search business name, email or contacts..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-white border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 transition-all outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex w-full md:w-auto items-center gap-3 shrink-0">
            <select
              value={stageFilter}
              onChange={handleStageFilterChange}
              className="bg-white border border-slate-300 text-slate-700 rounded-lg px-3 py-2 text-xs transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
            >
              <option value="">All Stages</option>
              {stagesList.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              value={ownerFilter}
              onChange={handleOwnerFilterChange}
              className="bg-white border border-slate-300 text-slate-700 rounded-lg px-3 py-2 text-xs transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
            >
              <option value="">All Owners</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
              ))}
            </select>

            {(searchQuery || stageFilter || ownerFilter) && (
              <button
                onClick={clearFilters}
                className="text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition-colors text-xs font-semibold py-1.5 px-3 rounded-lg border border-transparent hover:border-slate-200 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Leads List Table */}
        <div className="border border-slate-200/80 bg-white rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                  <th className="py-3.5 px-6">Business Name</th>
                  <th className="py-3.5 px-6">Contact Person</th>
                  <th className="py-3.5 px-6">Industry / City</th>
                  <th className="py-3.5 px-6 text-center">Pipeline Stage</th>
                  <th className="py-3.5 px-6">Assigned Owner</th>
                  <th className="py-3.5 px-6 text-right">Date Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 text-xs font-medium text-slate-650">
                {leads.length > 0 ? (
                  leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                      <td className="py-4 px-6 font-bold">
                        <Link href={`/leads/${lead.id}`} className="text-slate-900 hover:text-indigo-600 transition-colors duration-150">
                          {lead.business_name}
                        </Link>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-slate-800 font-semibold">{lead.contact_name || <span className="text-slate-400 font-normal">-</span>}</div>
                        <div className="text-[10px] text-slate-400 font-normal mt-0.5">{lead.email}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-slate-700">{lead.industry || <span className="text-slate-400 font-normal">-</span>}</div>
                        <div className="text-[10px] text-slate-400 font-normal mt-0.5">{lead.city}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center">
                          <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold tracking-wide uppercase ${getStageBadgeColor(lead.stage)}`}>
                            {lead.stage}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {lead.owner ? (
                          <div className="flex items-center gap-2">
                            <span className="h-5.5 w-5.5 rounded-full bg-indigo-50 border border-indigo-150 flex items-center justify-center font-bold text-[9px] text-indigo-600 shrink-0">
                              {lead.owner.name[0].toUpperCase()}
                            </span>
                            <span className="text-slate-800 font-semibold">{lead.owner.name}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-normal italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right text-slate-400 font-normal">
                        {lead.created_at}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400 font-normal">
                      No leads match your search criteria. Try modifying your search query or filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-[2px] animate-fade-in">
          <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-xl shadow-xl overflow-hidden relative animate-slide-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Create New Lead</h3>
              <button
                onClick={() => {
                  reset()
                  setShowAddModal(false)
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Business Name *</label>
                  <input
                    type="text"
                    required
                    value={data.business_name}
                    onChange={e => setData('business_name', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none"
                    placeholder="e.g. Acme Corp"
                  />
                  {errors.business_name && <p className="text-[10px] text-red-600 mt-1">{errors.business_name}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Contact Name</label>
                  <input
                    type="text"
                    value={data.contact_name}
                    onChange={e => setData('contact_name', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none"
                    placeholder="e.g. John Doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={e => setData('email', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none"
                    placeholder="john@company.com"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={data.phone}
                    onChange={e => setData('phone', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none"
                    placeholder="e.g. +1 555-0100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Website</label>
                  <input
                    type="text"
                    value={data.website}
                    onChange={e => setData('website', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none"
                    placeholder="e.g. acme.com"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Industry</label>
                  <input
                    type="text"
                    value={data.industry}
                    onChange={e => setData('industry', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none"
                    placeholder="e.g. Tech"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">City</label>
                  <input
                    type="text"
                    value={data.city}
                    onChange={e => setData('city', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none"
                    placeholder="e.g. Seattle"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Assign Owner</label>
                <select
                  value={data.owner_id}
                  onChange={e => setData('owner_id', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-xs text-slate-750 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none"
                >
                  <option value="">Unassigned (Open Lead Pool)</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Background Notes</label>
                <textarea
                  rows={3}
                  value={data.notes}
                  onChange={e => setData('notes', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none resize-none"
                  placeholder="Summarize context or source..."
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    reset()
                    setShowAddModal(false)
                  }}
                  className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-650 text-xs font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 text-white text-xs font-semibold py-2 px-4 rounded-lg transition-all cursor-pointer shadow-xs"
                >
                  {processing ? 'Creating...' : 'Create Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </Layout>
  )
}
