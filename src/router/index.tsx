import { createBrowserRouter, Navigate } from 'react-router-dom'
import HomePage from '@/page/home'
// 全局路由
export const globalRouters = createBrowserRouter([
  // 对精确匹配"/"，跳转Home页面
  {
    path: '/',
    element: <HomePage />,
  },
  // 精确匹配"/home"，跳转Home页面
  {
    path: '/home',
    element: <HomePage />,
  },
  // 未匹配，，跳转Home页面
  {
    path: '*',
    element: <Navigate to="/" />,
  },
])
