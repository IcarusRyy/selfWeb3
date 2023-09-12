import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './layout/App'
import './global.module.less'
import { BrowserRouter } from 'react-router-dom'
import { WagmiConfig } from 'wagmi'
import { wagmiConfig } from './assets/constants'
const root = document.querySelector('#root')

if (root) {
  createRoot(root).render(
    <BrowserRouter>
      <WagmiConfig config={wagmiConfig}>
        <App />
      </WagmiConfig>
    </BrowserRouter>,
  )
}
