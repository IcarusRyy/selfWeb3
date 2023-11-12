import React, { useCallback, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate, useRoutes } from 'react-router-dom'
import { routes } from '../router'
import { Layout, Spin } from 'antd'
import Headers from '@/page/header'
import styles from './app.less'
import MyMenu from './menu'
import useSize from '@/share/ahooks/useSize'
import { Web3Modal, useWeb3Modal } from '@web3modal/react'
import { WALLETCONNECTPROJECTID, ethereumClient } from '@/assets/constants'
import { useAccount } from 'wagmi'
import { GetUser } from '@/assets/logic'
const { Header, Content } = Layout
function App() {
  const element = useRoutes(routes)
  const location = useLocation()
  const navigate = useNavigate()
  const { address, isConnected, isDisconnected } = useAccount()
  const { isOpen, open, close, setDefaultChain } = useWeb3Modal()
  const size = useSize(document.body)
  const isMobile = size?.width ? size.width <= 768 : window.innerWidth <= 768
  useEffect(() => {
    if (!isConnected) {
      navigate('/')
      // open()
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
          '--w3m-logo-image-url': '',
        }}
      />
    </>
  )
}

export default App

// import React, { useCallback, useEffect } from 'react'
// import { Navigate, Route, Routes, useLocation, useNavigate, useRoutes } from 'react-router-dom'
// import { routes } from '../router'
// import { Layout, Spin } from 'antd'
// import Headers from '@/page/header'
// import styles from './app.less'
// import MyMenu from './menu'
// import useSize from '@/share/ahooks/useSize'
// import { Web3Modal, useWeb3Modal } from '@web3modal/react'
// import { WALLETCONNECTPROJECTID, ethereumClient } from '@/assets/constants'
// import { useAccount } from 'wagmi'
// import { GetUser } from '@/assets/logic'
// import ProtectedRoute from './protectRoture'
// import userInfo from '@/page/store/user'
// import { observer } from 'mobx-react-lite'
// const { Header, Content } = Layout
// function App() {
//   // const element = (
//   //   <Routes>
//   //     {routes.map(route => (
//   //       <ProtectedRoute key={route.key} path={route.path} element={route.element} />
//   //     ))}
//   //   </Routes>
//   // )
//   const location = useLocation()
//   const navigate = useNavigate()
//   const { address, isConnected, isDisconnected } = useAccount()
//   const { isOpen, open, close, setDefaultChain } = useWeb3Modal()
//   const size = useSize(document.body)
//   const isMobile = size?.width ? size.width <= 768 : window.innerWidth <= 768
//   useEffect(() => {
//     if (!isConnected) {
//       navigate('/')
//       // open()
//     }
//   }, [isConnected])
//   return (
//     <>
//       {!isConnected || location.pathname === '/' ? (
//         <>
//           <Routes>
//             {routes.map(route => (
//               <Route key={route.key} path={route.path} element={route.element} />
//             ))}
//           </Routes>
//         </>
//       ) : (
//         <>
//           <Spin
//             className={styles.spinning}
//             style={{ display: !isConnected ? undefined : 'none' }}
//             spinning={!isConnected}
//             tip="正在加载……"
//           />
//           <Layout className={`layout  ${styles.layoutBox}`}>
//             <Header className={styles.headerBox}>
//               <MyMenu routes={routes} isMobile={isMobile} />
//               <Headers isMobile={isMobile} />
//             </Header>
//             <Content className={` ${styles.contentBox}`}>
//               {
//                 <Routes>
//                   {routes.map(route => (
//                     <ProtectedRoute key={route.key} path={route.path} element={route.element} />
//                   ))}
//                 </Routes>
//               }
//             </Content>
//           </Layout>
//         </>
//       )}
//       <Web3Modal
//         projectId={WALLETCONNECTPROJECTID}
//         ethereumClient={ethereumClient}
//         themeVariables={{
//           '--w3m-font-family': 'Roboto, sans-serif',
//           // '--w3m-accent-color': '#F5841F',
//           '--w3m-accent-color': 'rgb(235, 92, 32)',
//           '--w3m-background-color': '#09a29d',
//           '--w3m-logo-image-url': '',
//         }}
//       />
//     </>
//   )
// }

// export default App
