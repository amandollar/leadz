import React, { useEffect, useState } from 'react'
import { router, usePage, Link } from '@inertiajs/react'

export default function Layout({ children }) {
  const { auth, flash } = usePage().props
  const user = auth?.user
  
  // Track current path for highlighting navigation links
  const [currentPath, setCurrentPath] = useState('/')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setCurrentPath(window.location.pathname)
  }, [])

  const handleLogout = (e) => {
    e.preventDefault()
    router.delete('/logout')
  }

  const navLinks = [
    {
      name: 'Dashboard',
      href: '/',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      )
    },
    {
      name: 'Pipeline Board',
      href: '/pipeline',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    {
      name: 'Leads Directory',
      href: '/leads',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      name: 'Analytics Reports',
      href: '/reports',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ]

  if (["Admin", "Manager"].includes(user?.role)) {
    navLinks.push({
      name: 'Team Settings',
      href: '/settings/team',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    })
  }

  return (
    <div className="min-h-screen md:h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col md:flex-row overflow-hidden">
      
      {/* Sidebar navigation - Hidden on mobile, visible on desktop */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200/80 flex-col shrink-0">
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-slate-100 bg-white shrink-0">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-xs transition-transform duration-300 hover:scale-105 shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <div className="overflow-hidden">
            <span className="font-bold text-sm text-slate-900 tracking-tight block leading-tight truncate">
              {user?.workspace_name || 'Agency CRM'}
            </span>
            <span className="text-[9px] text-indigo-600 font-bold tracking-wider uppercase block mt-0.5">
              Workspace
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = currentPath === link.href || (link.href !== '/' && currentPath.startsWith(link.href))
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:translate-x-0.5 ${
                  isActive
                    ? 'bg-indigo-50/70 text-indigo-600 shadow-2xs before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r-md before:bg-indigo-600'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            )
          })}
        </nav>

        {/* User profile / Logout card */}
        <div className="p-4 border-t border-slate-100 bg-white shrink-0">
          <div className="flex items-center gap-3 mb-3.5 p-1 rounded-lg">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate leading-none">{user?.name}</p>
              <p className="text-[10px] font-medium text-slate-400 capitalize truncate mt-1">{user?.role}</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 hover:text-slate-900 active:scale-[0.98] transition-all duration-150 cursor-pointer shadow-2xs"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden w-full bg-white border-b border-slate-250/60 px-4 py-3 flex items-center justify-between shrink-0 shadow-2xs">
        <Link href="/" className="flex items-center gap-2 overflow-hidden">
          <div className="h-7 w-7 rounded-md bg-indigo-600 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <div className="overflow-hidden">
            <span className="font-bold text-xs text-slate-900 block leading-tight truncate">{user?.workspace_name || 'Agency CRM'}</span>
            <span className="text-[8px] text-indigo-600 font-bold tracking-wider uppercase block">Workspace</span>
          </div>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 focus:outline-none"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </header>

      {/* Mobile Navigation Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 shadow-sm transition-all shrink-0">
          <nav className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const isActive = currentPath === link.href || (link.href !== '/' && currentPath.startsWith(link.href))
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-xs transition-colors ${
                    isActive ? 'bg-indigo-50 text-indigo-650' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              )
            })}
            <div className="border-t border-slate-100 pt-3 mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-extrabold text-[10px] flex items-center justify-center shadow-xs">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-800 leading-tight">{user?.name}</p>
                  <p className="text-[9px] font-medium text-slate-400 capitalize">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Flash Notifications Box */}
        {flash && (flash.notice || flash.alert || flash.success) && (
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 animate-fade-in">
            {flash.notice && !flash.notice.includes('Temporary Password') && (
              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold flex items-center gap-3 shadow-2xs">
                <svg className="w-4.5 h-4.5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{flash.notice}</span>
              </div>
            )}
            {flash.alert && (
              <div className="p-3.5 rounded-lg bg-red-50 border border-red-200/80 text-red-800 text-xs font-semibold flex items-center gap-3 shadow-2xs">
                <svg className="w-4.5 h-4.5 text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{flash.alert}</span>
              </div>
            )}
            {flash.success && (
              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold flex items-center gap-3 shadow-2xs">
                <svg className="w-4.5 h-4.5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{flash.success}</span>
              </div>
            )}
          </div>
        )}

        {/* View Content Viewport */}
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  )
}
