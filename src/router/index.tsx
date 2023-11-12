import { Navigate, Route } from 'react-router-dom'
import DepositPage from '@/page/deposit'
import WithdrawPage from '@/page/withdraw'
import HistoryPage from '@/page/history'
import HomePage from '@/page/home'

type MyRoute = {
  path: string
  element: JSX.Element
  key: string
  isMenu?: boolean
}

export const routes: MyRoute[] = [
  {
    path: '/',
    key: 'root',
    element: <HomePage />,
  },
  {
    path: '/deposit',
    key: 'deposit',
    isMenu: true,
    element: <DepositPage />,
  },
  {
    path: '/withdraw',
    key: 'withdraw',
    isMenu: true,
    element: <WithdrawPage />,
  },
  {
    path: '/history',
    key: 'history',
    isMenu: true,
    element: <HistoryPage />,
  },
  {
    path: '*',
    key: '*',
    element: <Navigate to="/" />,
  },
]
