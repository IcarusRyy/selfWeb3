import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './layout/App'
import './index.less'
// const root = document.getElementById('root');
const root = document.querySelector('#root')

if (root) {
  createRoot(root).render(<App />)
}
