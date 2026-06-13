import React from 'react'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import './application.css'

const init = () => {
  createInertiaApp({
    resolve: name => {
      const pages = import.meta.glob('../pages/**/*.jsx', { eager: true })
      console.log('Inertia Pages Glob:', pages)
      console.log('Inertia resolving name:', name)
      const page = pages[`../pages/${name}.jsx`]
      console.log('Inertia resolved page module:', page)
      if (!page) {
        throw new Error(`Page not found: ../pages/${name}.jsx`)
      }
      return page.default || page
    },
    setup({ el, App, props }) {
      createRoot(el).render(<App {...props} />)
    },
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}

