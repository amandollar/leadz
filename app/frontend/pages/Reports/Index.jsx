import React from 'react'
import { usePage } from '@inertiajs/react'
import Layout from '../../components/Layout'

export default function Index({ stageCounts, wonCount, lostCount, conversionRate, userStats }) {
  const { auth } = usePage().props
  const user = auth?.user

  // Get total leads in marketing pipeline (New + Contacted + Interested)
  const marketingTotal = (stageCounts['New'] || 0) + (stageCounts['Contacted'] || 0) + (stageCounts['Interested'] || 0)
  // Get total leads in sales pipeline (Meeting Scheduled + Proposal Sent + Negotiation)
  const salesTotal = (stageCounts['Meeting Scheduled'] || 0) + (stageCounts['Proposal Sent'] || 0) + (stageCounts['Negotiation'] || 0)

  return (
    <Layout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5 mb-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics Reports</h1>
          <p className="text-sm text-slate-500 mt-1">Workspace conversion performance and sales activity metrics.</p>
        </div>
      </div>

      {/* Main Container */}
      <div className="space-y-8 animate-slide-up">
        
        {/* Core Conversion Metrics Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Lead Conversion Rate</p>
              <h4 className="text-3xl font-extrabold text-emerald-600 tracking-tight">{conversionRate}%</h4>
              <p className="text-[10px] text-slate-400 font-normal mt-1.5">Won deals out of total closed (Won/Lost)</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-3xs">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Won Contracts</p>
              <h4 className="text-3xl font-extrabold text-slate-900 tracking-tight">{wonCount}</h4>
              <p className="text-[10px] text-slate-400 font-normal mt-1.5">Onboarded accounts in current cycle</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-650 shrink-0 shadow-3xs">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Lost Accounts</p>
              <h4 className="text-3xl font-extrabold text-slate-500 tracking-tight">{lostCount}</h4>
              <p className="text-[10px] text-slate-400 font-normal mt-1.5">Closed deals marked as drop-out</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-slate-55 border border-slate-200/80 flex items-center justify-center text-slate-500 shrink-0 shadow-3xs">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

        </div>

        {/* Funnel chart cards layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Visual Sales Pipeline Funnel */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider border-b border-slate-200 pb-4">
              Sales Pipeline Funnel
            </h3>

            <div className="space-y-4">
              {/* Marketing Stage */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-500">Marketing Stages ({marketingTotal} leads)</span>
                  <span className="text-slate-400 font-medium">New &bull; Contacted &bull; Interested</span>
                </div>
                <div className="w-full bg-slate-100 h-8 rounded-lg overflow-hidden border border-slate-200 flex font-sans">
                  <div className="h-full bg-slate-200/80 hover:bg-slate-250 text-[10px] font-bold text-slate-700 flex items-center justify-center border-r border-slate-350 shrink-0 transition-colors" style={{ width: '33.3%' }}>
                    New ({stageCounts['New'] || 0})
                  </div>
                  <div className="h-full bg-blue-100 hover:bg-blue-150 text-[10px] font-bold text-blue-800 flex items-center justify-center border-r border-slate-350 shrink-0 transition-colors" style={{ width: '33.3%' }}>
                    Cont. ({stageCounts['Contacted'] || 0})
                  </div>
                  <div className="h-full bg-indigo-100 hover:bg-indigo-150 text-[10px] font-bold text-indigo-800 flex items-center justify-center shrink-0 transition-colors" style={{ width: '33.4%' }}>
                    Int. ({stageCounts['Interested'] || 0})
                  </div>
                </div>
              </div>

              {/* Sales Stage */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-500">Negotiation & Sales Stages ({salesTotal} leads)</span>
                  <span className="text-slate-400 font-medium">Meetings &bull; Proposal &bull; Negotiate</span>
                </div>
                <div className="w-full bg-slate-100 h-8 rounded-lg overflow-hidden border border-slate-200 flex font-sans">
                  <div className="h-full bg-violet-100 hover:bg-violet-150 text-[10px] font-bold text-violet-800 flex items-center justify-center border-r border-slate-350 shrink-0 transition-colors" style={{ width: '33.3%' }}>
                    Meet ({stageCounts['Meeting Scheduled'] || 0})
                  </div>
                  <div className="h-full bg-pink-100 hover:bg-pink-150 text-[10px] font-bold text-pink-855 flex items-center justify-center border-r border-slate-350 shrink-0 transition-colors" style={{ width: '33.3%' }}>
                    Prop. ({stageCounts['Proposal Sent'] || 0})
                  </div>
                  <div className="h-full bg-amber-100 hover:bg-amber-150 text-[10px] font-bold text-amber-800 flex items-center justify-center shrink-0 transition-colors" style={{ width: '33.4%' }}>
                    Nego ({stageCounts['Negotiation'] || 0})
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Won vs Lost conversion summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider border-b border-slate-200 pb-4">
              Conversion Performance
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1.5">
                  <span>Won Accounts vs Lost Deals</span>
                  <span className="text-slate-400">{wonCount} Won / {lostCount} Lost</span>
                </div>
                <div className="w-full bg-slate-100 h-5 rounded-lg overflow-hidden border border-slate-200 flex shadow-3xs">
                  {wonCount + lostCount > 0 ? (
                    <>
                      <div className="h-full bg-emerald-500" style={{ width: `${(wonCount / (wonCount + lostCount)) * 100}%` }} title="Won Accounts" />
                      <div className="h-full bg-red-400" style={{ width: `${(lostCount / (wonCount + lostCount)) * 100}%` }} title="Lost Deals" />
                    </>
                  ) : (
                    <div className="w-full h-full bg-slate-50 flex items-center justify-center text-[9px] text-slate-400 font-bold uppercase tracking-wider">No closed deals</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-medium bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider mb-0.5">Total Closed Outcomes</span>
                  <span className="text-slate-800 font-bold text-sm">{wonCount + lostCount} Accounts</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider mb-0.5">Workspace Success rate</span>
                  <span className="text-emerald-600 font-bold text-sm">{conversionRate}% Won</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Team Performance leaderboard table */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
          <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider border-b border-slate-200 pb-4">
            Team Activity & Performance
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  <th className="py-3 px-4">Sales Representative</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4 text-center">Leads Assigned</th>
                  <th className="py-3 px-4 text-center">Deals Won</th>
                  <th className="py-3 px-4 text-center">Touchpoints Logged</th>
                  <th className="py-3 px-4 text-center">Follow Ups Completed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-650">
                {userStats.map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                    <td className="py-3.5 px-4 font-bold text-slate-800 flex items-center gap-2">
                      <span className="h-6.5 w-6.5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] text-slate-600 font-bold">
                        {rep.name[0].toUpperCase()}
                      </span>
                      {rep.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-normal">{rep.role}</td>
                    <td className="py-3.5 px-4 text-center text-slate-900 font-bold">{rep.leads_assigned}</td>
                    <td className="py-3.5 px-4 text-center text-emerald-600 font-bold">{rep.deals_won}</td>
                    <td className="py-3.5 px-4 text-center text-slate-600">{rep.activities_count}</td>
                    <td className="py-3.5 px-4 text-center text-indigo-650 font-semibold">{rep.follow_ups_completed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Layout>
  )
}
