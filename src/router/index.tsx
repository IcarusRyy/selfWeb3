import { Navigate, RouteObject } from 'react-router-dom'
import DepositPage from '@/page/deposit'
import WithdrawPage from '@/page/withdraw'
import HistoryPage from '@/page/history'
import HomePage from '@/page/home'
type MyRoute = RouteObject & { isMenu?: boolean; key?: string }
export const routes: MyRoute[] = [
  // 对精确匹配"/"，跳转deposit页面
  {
    path: '/',
    element: <HomePage />,
  },
  // 精确匹配"/deposit"，跳转deposit页面
  {
    path: '/deposit',
    key: 'deposit',
    isMenu: true,
    element: <DepositPage />,
  },
  // 精确匹配"/withdraw"，跳转withdraw页面
  {
    path: '/withdraw',
    key: 'withdraw',
    isMenu: true,
    element: <WithdrawPage />,
  },
  // 精确匹配"/history"，跳转history页面
  {
    path: '/history',
    key: 'history',
    isMenu: true,
    element: <HistoryPage />,
  },
  // 未匹配，，跳转deposit页面
  {
    path: '*',
    element: <Navigate to="/" />,
  },
]
