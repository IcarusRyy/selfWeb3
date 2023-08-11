import { Menu } from 'antd'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './index.less'
import { useWeb3Modal } from '@web3modal/react'
import { useAccount } from 'wagmi'
interface MyMenuProps {
  routes: any[]
  isMobile: boolean
}

const MyMenu = (props: MyMenuProps) => {
  const { routes, isMobile } = props
  const [selectKey, setSelectKey] = useState<string[]>()
  const navigate = useNavigate()
  const location = useLocation()
  const { isOpen, open } = useWeb3Modal()
  const { address, isConnected } = useAccount()
  const items = routes
    .filter(item => item.isMenu)
    .map(item => ({
      key: item.key,
      label: item.key,
    }))
  const handleOnClick = async (data: any) => {
    if (!isConnected) {
      return open()
    }
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
