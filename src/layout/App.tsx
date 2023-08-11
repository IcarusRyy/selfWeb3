import React from 'react'
import { Route, Routes, useRoutes } from 'react-router-dom'
import { routes } from '../router'
import { Layout } from 'antd'
import Headers from '@/page/header'
import styles from './app.less'
import MyMenu from './menu'
import useSize from '@/share/ahooks/useSize'
import { Web3Modal } from '@web3modal/react'
import { WALLETCONNECTPROJECTID, ethereumClient, wagmiConfig } from '@/assets/constants'
import { WagmiConfig } from 'wagmi'
const { Header, Content } = Layout
function App() {
  const element = useRoutes(routes)
  const size = useSize(document.body)
  const isMobile = size?.width ? size.width <= 768 : window.innerWidth <= 768
  return (
    <WagmiConfig config={wagmiConfig}>
      <Layout className={`layout  ${styles.layoutBox}`}>
        <Header className={styles.headerBox}>
          <MyMenu routes={routes} isMobile={isMobile} />
          <Headers isMobile={isMobile} />
        </Header>
        <Content className={` ${styles.contentBox}`}>
          {element}
          {/* <Routes>
            {routes.map((route, index) => (
              <Route key={route.key} path={route.path} element={element} />
            ))}
          </Routes> */}
        </Content>
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
      </Layout>
    </WagmiConfig>
  )
}

export default App
