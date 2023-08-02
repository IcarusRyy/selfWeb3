import React, { lazy, Suspense, useState } from "react"
import "@/App.css"
import lessStyles from "./app.less"
import LazyWrapper from "./share/components/LazyWrapper"

const LazyDemo = lazy(() => import("@/components/test/LazyDemo")) // 使用import语法配合react的Lazy动态引入资源

// prefetch
const PreFetchDemo = lazy(
  () =>
    import(
      /* webpackChunkName: "PreFetchDemo" */
      /*webpackPrefetch: true*/
      "@/components/test/PrefetchDemo"
    )
)
// preload
const PreloadDemo = lazy(
  () =>
    import(
      /* webpackChunkName: "PreloadDemo" */
      /*webpackPreload: true*/
      "@/components/test/PreloadDemo"
    )
)

function App() {
  const [show, setShow] = useState(false)
  // 点击事件中动态引入css, 设置show为true
  const handleOnClick = () => {
    import("@/App.css")
    setShow(true)
  }
  return (
    <div>
      <h2>webpack5-react-ts</h2>
      <div className={lessStyles["lessBox"]}>
        <div className={lessStyles["box"]}>lessBox</div>
        <div className={lessStyles["smallImg"]}>小图片背景</div>
      </div>
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
    </div>
  )
}

export default App
