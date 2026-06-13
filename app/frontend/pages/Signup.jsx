import React from 'react'
import { useForm, usePage, Link } from '@inertiajs/react'

export default function Signup() {
  const { flash } = usePage().props
  const { data, setData, post, processing, errors } = useForm({
    workspace_name: '',
    name: '',
    email: '',
    password: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    post('/signup')
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center bg-slate-50 text-slate-800 px-4 font-sans animate-fade-in overflow-hidden">
      {/* Decorative blurred background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[30%] -left-[20%] w-[70%] h-[70%] rounded-full bg-indigo-200/35 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-[30%] -right-[20%] w-[70%] h-[70%] rounded-full bg-purple-200/35 blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      <div className="w-full max-w-md z-10">
        
        {/* Logo / Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm mb-3.5 transition-transform duration-300 hover:scale-105">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Create an Account
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">
            Register your agency workspace on Agency CRM
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-8 shadow-[0_12px_45px_-12px_rgba(0,0,0,0.06)] animate-slide-up">
          
          {/* Flash Messages */}
          {flash?.alert && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200/80 text-red-800 text-sm font-medium flex items-center gap-3">
              <svg className="w-5 h-5 text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{flash.alert}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Workspace Name Input */}
            <div>
              <label htmlFor="workspace_name" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Workspace / Agency Name
              </label>
              <input
                type="text"
                id="workspace_name"
                value={data.workspace_name}
                onChange={(e) => setData('workspace_name', e.target.value)}
                className="w-full bg-white border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 rounded-lg px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none"
                placeholder="e.g. Acme Digital"
                required
              />
            </div>

            {/* Owner Name Input */}
            <div>
              <label htmlFor="name" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="w-full bg-white border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 rounded-lg px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none"
                placeholder="Jane Doe"
                required
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className="w-full bg-white border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 rounded-lg px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none"
                placeholder="name@agency.com"
                required
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-650 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                className="w-full bg-white border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 rounded-lg px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={processing}
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.985] disabled:opacity-50 text-white text-sm font-semibold py-2.5 px-4 rounded-lg shadow-sm hover:shadow transition-all outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer mt-2"
            >
              {processing ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
          
          <div className="border-t border-slate-100 pt-4 mt-6 text-center">
            <p className="text-xs text-slate-500">
              Already registered? <Link href="/login" className="text-indigo-650 hover:underline font-bold">Sign In</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
