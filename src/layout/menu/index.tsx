import { Menu } from 'antd'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './index.less'
interface MyMenuProps {
  routes: any[]
}

const MyMenu = (props: MyMenuProps) => {
  const [selectKey, setSelectKey] = useState<string[]>()
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
  const handleSelectKeys = (pathname: string) => {
    const nameArr = pathname.split('/').filter(item => item)
    setSelectKey(nameArr.length ? nameArr : ['deposit'])
  }
  useEffect(() => {
    handleSelectKeys(location.pathname)
  }, [location])
  return (
    <>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={selectKey}
        items={items}
        onClick={handleOnClick}
        className={styles.menuBox}
      />
    </>
  )
}
export default MyMenu
