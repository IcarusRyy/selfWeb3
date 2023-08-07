import React from 'react'
import { useRoutes } from 'react-router-dom'
import { routes } from '../router'
import { Layout } from 'antd'
import Headers from '@/page/header'
import styles from './app.less'
import MyMenu from './menu'
const { Header, Content } = Layout
function App() {
  const element = useRoutes(routes)
  return (
    <>
      <Layout className={`layout  ${styles.layoutBox}`}>
        <Header className={styles.headerBox}>
          <MyMenu routes={routes} />
          <Headers />
        </Header>
        <Content className={` ${styles.contentBox}`}>{element}</Content>
      </Layout>
    </>
  )
}

export default App
