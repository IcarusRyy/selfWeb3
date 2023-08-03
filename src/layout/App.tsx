import React, { lazy, Suspense, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { globalRouters } from '../router'
import { Layout } from 'antd'
import Headers from '@/page/header'
import styles from './app.less'
const { Header, Content, Footer } = Layout
function App() {
  console.log(globalRouters, 'globalRouters')
  return (
    <>
      <Layout className={`layout  ${styles.layoutBox}`}>
        <Header className={styles.headerBox}>
          <Headers />
        </Header>
        <Content className={` ${styles.contentBox}`}>
          <RouterProvider router={globalRouters} />
        </Content>
      </Layout>
    </>
  )
}

export default App
