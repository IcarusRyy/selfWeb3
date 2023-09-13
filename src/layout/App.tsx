import React, { useCallback, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate, useRoutes } from 'react-router-dom'
import { routes } from '../router'
import { Layout, Spin } from 'antd'
import Headers from '@/page/header'
import styles from './app.less'
import MyMenu from './menu'
import useSize from '@/share/ahooks/useSize'
import { Web3Modal } from '@web3modal/react'
import { WALLETCONNECTPROJECTID, ethereumClient } from '@/assets/constants'
import { useAccount } from 'wagmi'
const { Header, Content } = Layout
function App() {
  const element = useRoutes(routes)
  const location = useLocation()
  const navigate = useNavigate()
  const { isConnected, isDisconnected } = useAccount()
  const size = useSize(document.body)
  const isMobile = size?.width ? size.width <= 768 : window.innerWidth <= 768
  useEffect(() => {
    if (!isConnected) {
      navigate('/')
    }
  }, [isConnected])
  return (
    <>
      {!isConnected || location.pathname === '/' ? (
        <>{element}</>
      ) : (
        <>
          <Spin
            className={styles.spinning}
            style={{ display: !isConnected ? undefined : 'none' }}
            spinning={!isConnected}
            tip="正在加载……"
          />
          <Layout className={`layout  ${styles.layoutBox}`}>
            <Header className={styles.headerBox}>
              <MyMenu routes={routes} isMobile={isMobile} />
              <Headers isMobile={isMobile} />
            </Header>
            <Content className={` ${styles.contentBox}`}>{element}</Content>
          </Layout>
        </>
      )}
      <Web3Modal
        projectId={WALLETCONNECTPROJECTID}
        ethereumClient={ethereumClient}
        themeVariables={{
          '--w3m-font-family': 'Roboto, sans-serif',
          // '--w3m-accent-color': '#F5841F',
          '--w3m-accent-color': 'rgb(235, 92, 32)',
          '--w3m-background-color': '#09a29d',
          // '--w3m-logo-image-url': 'https://selfweb3.refitor.com/favicon.ico',
        }}
      />
    </>
  )
}

export default App
