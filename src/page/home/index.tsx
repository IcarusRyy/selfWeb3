import React, { Suspense, lazy, useState } from 'react'
import LazyWrapper from '@/share/components/LazyWrapper'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import lessStyles from './index.less'

// prefetch
const PreFetchDemo = lazy(
  () =>
    import(
      /* webpackChunkName: "PreFetchDemo" */
      /*webpackPrefetch: true*/
      '@/components/test/PrefetchDemo'
    ),
)

// preload
const PreloadDemo = lazy(
  () =>
    import(
      /* webpackChunkName: "PreloadDemo" */
      /*webpackPreload: true*/
      '@/components/test/PreloadDemo'
    ),
)
const HomePage = () => {
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  // 点击事件中动态引入css, 设置show为true
  const handleOnClick = () => {
    import('@/App.css')
    setShow(true)
  }
  return (
    <>
      <h2>HomePage</h2>
      {/* <Button onClick={() => navigate('/pageA')}>跳转A页面</Button> */}
      <div className={lessStyles['lessBox']}>
        <div className={lessStyles['box']}>lessBox</div>
        <div className={lessStyles['smallImg']}>小图片背景</div>
      </div>
      <Button>测试123</Button>
      <h2 onClick={handleOnClick}>展示</h2>
      {/* show为true时加载LazyDemo组件 */}
      {show && (
        <Suspense fallback={null}>
          {/* <LazyDemo /> */}
          <LazyWrapper path="test/LazyDemo" />
        </Suspense>
      )}
      {show && (
        <>
          <Suspense fallback={null}>
            <PreloadDemo />
          </Suspense>
          <Suspense fallback={null}>
            <PreFetchDemo />
          </Suspense>
        </>
      )}
    </>
  )
}

export default HomePage
