import { Menu } from 'antd'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './index.less'
interface MyMenuProps {
  routes: any[]
  isMobile: boolean
}

const MyMenu = (props: MyMenuProps) => {
  const { routes, isMobile } = props
  const [selectKey, setSelectKey] = useState<string[]>()
  const navigate = useNavigate()
  const location = useLocation()

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
  // if (isMobile) {
  //   return <>123</>
  // }
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
