import React from 'react'
import { useRoutes } from 'react-router-dom'
import { routes } from '../router'
import { Layout } from 'antd'
import Headers from '@/page/header'
import styles from './app.less'
import MyMenu from './menu'
import { useSize } from 'ahooks'
const { Header, Content } = Layout
function App() {
  const element = useRoutes(routes)
  const size = useSize(document.body)
  const isMobile = size?.width ? size.width <= 768 : window.innerWidth <= 768
  return (
    <>
      <Layout className={`layout  ${styles.layoutBox}`}>
        <Header className={styles.headerBox}>
          <MyMenu routes={routes} isMobile={isMobile} />
          <Headers isMobile={isMobile} />
        </Header>
        <Content className={` ${styles.contentBox}`}>{element}</Content>
      </Layout>
    </>
  )
}

export default App
