import React, { lazy, Suspense, useState } from 'react'
import '@/App.css'
import { RouterProvider } from 'react-router-dom'
import { globalRouters } from './router'

function App() {
  return (
    <>
      <RouterProvider router={globalRouters} />
    </>
  )
}

export default App
