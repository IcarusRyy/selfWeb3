import React, { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import LazyWrapper from '@/share/components/LazyWrapper'
import styles from './index.less'
import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'
import { Web3Button, useWeb3Modal } from '@web3modal/react'
import { Card } from 'antd'
import { useAccount } from 'wagmi'

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
const { Meta } = Card
const HomePage = () => {
  const [nowBtn, setNowBtn] = useState<string>('left')
  const navigate = useNavigate()
  const { isOpen, open, close, setDefaultChain } = useWeb3Modal()
  const { isDisconnected } = useAccount()
  const handleChangeBtn = useCallback((e: any, nowBtn: 'left' | 'right') => {
    e.preventDefault()
    e.stopPropagation()
    setNowBtn(nowBtn)
    navigate('/deposit')
  }, [])
  // useEffect(() => {
  //   console.log(Web3Button)
  // })

  const handleClickCard = useCallback(
    (pathname: string) => {
      if (isDisconnected) {
        return open()
      }
    },
    [isDisconnected],
  )
  return (
    <div className={styles.homeBox}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.title}>Welcome to selfWeb3.</span>
          <p className={styles.description}>
            Get started by configuring your desired network in, then modify the file!
          </p>
          <div className={styles.connect}>
            <Web3Button icon="hide" label="CONNECT" />
          </div>
        </div>
        <div className={styles.cardBox}>
          <Card
            className={styles.card}
            hoverable
            onClick={() => handleClickCard('/deposit')}
            cover={
              <img
                alt="example"
                src="https://cra-javascript-starter.thirdweb-example.com/images/portal-preview.png"
              />
            }
          >
            <Meta title="Europe Street beat" description="www.instagram.com" />
          </Card>
          <Card
            className={styles.card}
            hoverable
            cover={
              <img
                alt="example"
                src="https://cra-javascript-starter.thirdweb-example.com/images/portal-preview.png"
              />
            }
          >
            123
          </Card>
          <Card
            className={styles.card}
            hoverable
            cover={
              <img
                alt="example"
                src="https://cra-javascript-starter.thirdweb-example.com/images/portal-preview.png"
              />
            }
          >
            <Meta title="Europe Street beat" description="www.instagram.com" />
          </Card>
        </div>
      </div>
      {/* <div onClick={e => handleChangeBtn(e, 'left')}>MINT</div> */}
      {/* <div className={styles.box}>
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
      </div> */}
    </div>
  )
}

export default HomePage
