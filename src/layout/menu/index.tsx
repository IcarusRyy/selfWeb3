import { Menu } from 'antd'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface MyMenuProps {
  routes: any[]
}

const MyMenu = (props: MyMenuProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { routes } = props
  const items = routes
    .filter(item => item.isMenu)
    .map(item => ({
      key: item.key,
      label: item.key,
    }))
  const handleOnClick = (data: any) => {
    navigate(data.key)
  }
  return (
    <>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={
          location.pathname.length > 1 ? [location.pathname.split('/')[1]] : ['deposit']
        }
        items={items}
        onClick={handleOnClick}
      />
    </>
  )
}
export default MyMenu
