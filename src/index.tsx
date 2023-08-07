import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './layout/App'
import './global.module.less'
import { BrowserRouter } from 'react-router-dom'
const root = document.querySelector('#root')

if (root) {
  createRoot(root).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  )
}
