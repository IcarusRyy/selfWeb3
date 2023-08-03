import React, { Suspense, lazy, useCallback, useState } from 'react'
import LazyWrapper from '@/share/components/LazyWrapper'
import styles from './index.less'
import classNames from 'classnames'

// // prefetch
// const PreFetchDemo = lazy(
//   () =>
//     import(
//       /* webpackChunkName: "PreFetchDemo" */
//       /*webpackPrefetch: true*/
//       '@/components/test/PrefetchDemo'
//     ),
// )

// // preload
// const PreloadDemo = lazy(
//   () =>
//     import(
//       /* webpackChunkName: "PreloadDemo" */
//       /*webpackPreload: true*/
//       '@/components/test/PreloadDemo'
//     ),
// )
const HomePage = () => {
  const [nowBtn, setNowBtn] = useState<string>('left')
  const handleChangeBtn = useCallback((e: any, nowBtn: 'left' | 'right') => {
    e.preventDefault()
    e.stopPropagation()
    setNowBtn(nowBtn)
  }, [])
  return (
    <div className={styles.homeBox}>
      <div className={styles.box}>
        <div className={styles.btnBox}>
          <div
            className={classNames(styles.leftBtn, nowBtn === 'left' && styles.nowBgc)}
            onClick={e => handleChangeBtn(e, 'left')}
          >
            MINT
          </div>
          <div
            className={classNames(styles.rightBtn, nowBtn === 'right' && styles.nowBgc)}
            onClick={e => handleChangeBtn(e, 'right')}
          >
            BURN
          </div>
        </div>
        <div>123</div>
        <div>123</div>
      </div>
    </div>
  )
}

export default HomePage
