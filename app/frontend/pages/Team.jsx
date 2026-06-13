import React, { useState } from 'react'
import { useForm, usePage } from '@inertiajs/react'
import Layout from '../components/Layout'

export default function Team({ teamMembers }) {
  const { flash } = usePage().props
  const [copied, setCopied] = useState(false)

  // Form state to add new member
  const { data, setData, post, processing, reset, errors } = useForm({
    name: '',
    email: '',
    role: 'Sales Representative'
  })

  // Check if a temporary password is in the flash message
  const tempPasswordMatch = flash?.notice?.match(/Temporary Password:\s*(\w+)/)
  const tempPassword = tempPasswordMatch ? tempPasswordMatch[1] : null

  const handleCopyPassword = () => {
    if (tempPassword) {
      navigator.clipboard.writeText(tempPassword)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    post('/settings/team', {
      onSuccess: () => reset()
    })
  }

  // Get color for role badges
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Admin': return 'bg-indigo-50 text-indigo-700 border-indigo-200'
      case 'Manager': return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'Sales Representative': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'Intern': return 'bg-slate-50 text-slate-600 border-slate-200'
      default: return 'bg-slate-50 text-slate-600 border-slate-200'
    }
  }

  // Get gradient classes for team avatars
  const getAvatarGradient = (role) => {
    switch (role) {
      case 'Admin': return 'from-amber-500 to-orange-500'
      case 'Manager': return 'from-indigo-500 to-purple-500'
      case 'Sales Representative': return 'from-blue-500 to-cyan-500'
      case 'Intern': return 'from-slate-400 to-slate-500'
      default: return 'from-slate-400 to-slate-500'
    }
  }

  return (
    <Layout>
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-5 mb-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Team Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage team members, roles, and invite new users.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up">
        
        {/* Left column: Directory */}
        <div className="lg:col-span-2 space-y-6">

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Members</span>
              <div className="text-xl font-extrabold text-slate-900 mt-1">{teamMembers.length}</div>
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Admins & Managers</span>
              <div className="text-xl font-extrabold text-slate-900 mt-1">
                {teamMembers.filter(m => ['Admin', 'Manager'].includes(m.role)).length}
              </div>
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sales & Interns</span>
              <div className="text-xl font-extrabold text-slate-900 mt-1">
                {teamMembers.filter(m => ['Sales Representative', 'Intern'].includes(m.role)).length}
              </div>
            </div>
          </div>
          
          {/* Temporary Password Callout Banner */}
          {tempPassword && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 shadow-xs animate-fade-in space-y-3">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="text-sm font-bold text-emerald-900">Member Created Successfully!</h4>
                  <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">
                    Copy the temporary password below and send it to the user. They will be forced to set a new password on their first login.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 max-w-sm">
                <input
                  type="text"
                  readOnly
                  value={tempPassword}
                  className="bg-white border border-emerald-200 text-slate-800 text-sm font-mono rounded-lg px-3 py-1.5 flex-1 focus:outline-none"
                />
                <button
                  onClick={handleCopyPassword}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}

          {/* Directory Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Active Team Members</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider bg-slate-50/20">
                    <th className="py-3 px-6">Name & Email</th>
                    <th className="py-3 px-6">Role</th>
                    <th className="py-3 px-6 text-right">Added On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-650">
                  {teamMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full bg-gradient-to-tr ${getAvatarGradient(member.role)} text-white font-extrabold text-xs flex items-center justify-center shadow-xs shrink-0`}>
                            {member.name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div className="text-slate-900 font-bold">{member.name}</div>
                            <div className="text-[10px] text-slate-400 font-normal mt-0.5">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold tracking-wide uppercase ${getRoleBadgeColor(member.role)}`}>
                          {member.role}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right text-slate-400 font-normal">
                        {member.created_at}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column: Form */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Add Team Member</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={data.name}
                  onChange={e => setData('name', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none"
                  placeholder="John Smith"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-650 font-medium">{errors.name}</p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={data.email}
                  onChange={e => setData('email', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none"
                  placeholder="john@company.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-650 font-medium">{errors.email}</p>
                )}
              </div>

              {/* Role Dropdown */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Access Role</label>
                <select
                  value={data.role}
                  onChange={e => setData('role', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none"
                >
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Sales Representative">Sales Representative</option>
                  <option value="Intern">Intern</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-xs text-red-650 font-medium">{errors.role}</p>
                )}
              </div>

              {/* Action Buttons */}
              <button
                type="submit"
                disabled={processing}
                className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 text-white text-xs font-semibold py-2.5 rounded-lg transition-all cursor-pointer shadow-2xs mt-2"
              >
                {processing ? 'Adding Member...' : 'Create Team Member'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </Layout>
  )
}
