import React from 'react'
import { usePage, Link } from '@inertiajs/react'
import Layout from '../components/Layout'

export default function Dashboard({ stats }) {
  const { auth } = usePage().props
  const user = auth?.user
  
  const isManager = ["Admin", "Manager"].includes(user?.role)

  return (
    <Layout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5 mb-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Summary of sales activity and pipeline performance for your workspace.
          </p>
        </div>
        <div className="text-xs text-slate-550 font-semibold bg-white border border-slate-200 px-3 py-1.5 rounded-lg shrink-0 self-start md:self-center shadow-2xs">
          Active Workspace: <span className="text-slate-900 font-bold">{user?.workspace_name}</span> <span className="text-slate-200 mx-2">|</span> <span className="capitalize text-indigo-650 font-bold">{user?.role}</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="space-y-8 animate-slide-up">
        
        {/* Welcome Section */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.01)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Welcome back, {user?.name}!</h2>
            <p className="text-slate-500 text-sm mt-1 max-w-2xl leading-relaxed">
              Use the vertical sidebar navigation to inspect the interactive pipeline board, coordinate CRM lead stages, or evaluate conversion funnels.
            </p>
          </div>
        </div>

        {/* Conditional Dashboard Render */}
        {isManager ? (
          /* MANAGER / ADMIN VIEW */
          <div className="space-y-8">
            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              <div className="bg-white border border-slate-200 border-t-4 border-t-indigo-600 rounded-xl p-6 flex flex-col justify-between h-36 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 shadow-2xs">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Total Active Leads</p>
                  <h4 className="text-3xl font-extrabold text-indigo-650 tracking-tight">{stats.totalLeads}</h4>
                </div>
                <Link href="/leads" className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 transition-colors">
                  View directory &rarr;
                </Link>
              </div>

              <div className="bg-white border border-slate-200 border-t-4 border-t-emerald-500 rounded-xl p-6 flex flex-col justify-between h-36 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 shadow-2xs">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Conversion Rate</p>
                  <h4 className="text-3xl font-extrabold text-emerald-600 tracking-tight">{stats.conversionRate}%</h4>
                </div>
                <p className="text-xs text-slate-400 font-medium">Won deals / closed outcomes</p>
              </div>

              <div className="bg-white border border-slate-200 border-t-4 border-t-violet-500 rounded-xl p-6 flex flex-col justify-between h-36 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 shadow-2xs">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Pending Follow-ups</p>
                  <h4 className="text-3xl font-extrabold text-violet-600 tracking-tight">{stats.pendingFollowUps}</h4>
                </div>
                <p className="text-xs text-slate-400 font-medium">Reminders to finalize</p>
              </div>

              <div className="bg-white border border-slate-200 border-t-4 border-t-slate-500 rounded-xl p-6 flex flex-col justify-between h-36 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 shadow-2xs">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Active Won Deals</p>
                  <h4 className="text-3xl font-extrabold text-slate-900 tracking-tight">{stats.leadsByStage["Won"] || 0}</h4>
                </div>
                <p className="text-xs text-slate-400 font-medium">Successfully onboarded</p>
              </div>
            </div>

            {/* Pipeline Stage Counts Chart Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
              <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-5">Pipeline Stage Breakdown</h4>
              <div className="grid grid-cols-2 md:grid-cols-8 gap-4">
                {Object.entries(stats.leadsByStage).map(([stage, count]) => (
                  <div key={stage} className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 text-center flex flex-col justify-between min-h-[96px] hover:border-slate-350 transition-colors">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block truncate">{stage}</span>
                    <span className="text-2xl font-black text-slate-800 mt-2 block tracking-tight">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* SALES REP / INTERN VIEW */
          <div className="space-y-8">
            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              <div className="bg-white border border-slate-200 border-t-4 border-t-indigo-600 rounded-xl p-6 flex flex-col justify-between h-36 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 shadow-2xs">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">My Assigned Leads</p>
                  <h4 className="text-3xl font-extrabold text-indigo-655 tracking-tight">{stats.myLeads}</h4>
                </div>
                <Link href="/leads" className="text-xs text-indigo-650 hover:text-indigo-700 font-bold flex items-center gap-1 transition-colors">
                  Manage leads &rarr;
                </Link>
              </div>

              <div className="bg-white border border-slate-200 border-t-4 border-t-emerald-500 rounded-xl p-6 flex flex-col justify-between h-36 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 shadow-2xs">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">My Won Deals</p>
                  <h4 className="text-3xl font-extrabold text-emerald-600 tracking-tight">{stats.myWonDeals}</h4>
                </div>
                <p className="text-xs text-slate-400 font-medium">Deals successfully closed</p>
              </div>

              <div className="bg-white border border-slate-200 border-t-4 border-t-red-500 rounded-xl p-6 flex flex-col justify-between h-36 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 shadow-2xs">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">My Lost Deals</p>
                  <h4 className="text-3xl font-extrabold text-red-650 tracking-tight">{stats.myLostDeals}</h4>
                </div>
                <p className="text-xs text-slate-400 font-medium">Closed marked as lost</p>
              </div>

              <div className="bg-white border border-slate-200 border-t-4 border-t-violet-500 rounded-xl p-6 flex flex-col justify-between h-36 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 shadow-2xs">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">My Due Follow-ups</p>
                  <h4 className="text-3xl font-extrabold text-violet-650 tracking-tight">{stats.myPendingFollowUps}</h4>
                </div>
                <p className="text-xs text-slate-400 font-medium">Tasks awaiting calls</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Links Section */}
        <div className="border border-dashed border-slate-350 bg-white rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h4 className="text-slate-900 font-bold mb-1">Need to modify client stages?</h4>
            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              Access the interactive Kanban board to drag and drop leads through stages, or search leads by business details.
            </p>
          </div>
          <div className="flex gap-4 shrink-0">
            <Link
              href="/pipeline"
              className="bg-indigo-600 hover:bg-indigo-700 active:scale-[0.985] text-white text-xs font-semibold py-2.5 px-5 rounded-lg transition-all cursor-pointer shadow-2xs"
            >
              Open Kanban Pipeline
            </Link>
            <Link
              href="/leads"
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold py-2.5 px-5 rounded-lg transition-all cursor-pointer shadow-2xs"
            >
              Leads Directory
            </Link>
          </div>
        </div>

      </div>
    </Layout>
  )
}
