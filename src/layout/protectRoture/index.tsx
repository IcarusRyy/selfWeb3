import React from 'react'
import { Route, Navigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import userInfo from '@/page/store/user'

interface ProtectedRouteProps {
  path: string
  element: JSX.Element
  key: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ path, element, key }) => {
  if (!userInfo.isLoggedIn) {
    return <Navigate to="/" replace />
  }

  return <Route path={path} element={element} key={key} />
}

export default observer(ProtectedRoute)
