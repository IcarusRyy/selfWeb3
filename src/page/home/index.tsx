import React, { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import LazyWrapper from '@/share/components/LazyWrapper'
import styles from './index.less'
import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'
import { Web3Button, useWeb3Modal } from '@web3modal/react'
import { Button, Card } from 'antd'
import { useAccount } from 'wagmi'
import { Init, GetWeb3, GetUser } from '@/assets/logic/index'
import { ethereumClient } from '@/assets/constants'
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
  const [hasInfo, setHasInfo] = useState<any>({})
  const navigate = useNavigate()
  const { isOpen, open, close, setDefaultChain } = useWeb3Modal()
  const { address, connector, isConnected, isDisconnected } = useAccount()
  const handleChangeBtn = useCallback((e: any, nowBtn: 'left' | 'right') => {
    e.preventDefault()
    e.stopPropagation()
    setNowBtn(nowBtn)
    navigate('/deposit')
  }, [])
  useEffect(() => {
    if (isConnected && !!connector) {
      checkWalletForUser()
    }
  }, [isConnected, connector])
  const errorCb = (err: any, flow: any, msg: string, param: any) =>
    console.log({ flow: flow, error: err === 'error', msg: msg, param: param })

  // user初始化成功回调
  const initUserSuccessCb = async (selfAddress: string, web2Address: string) => {
      // check registered
      const { registered, bound } = await GetUser().Registered(address, selfAddress);
      if (registered === true) {
          if (bound === true) {
              // 已注册, 钱包地址一致, 开始加载用户私有信息
              GetUser().Load(address, selfAddress, function() {
                // 已注册, 钱包地址一致, 用拿到的地址信息初始化profile(第一个卡片的内容), 用户加载流程完成
                console.log('selfAddress: ', selfAddress, 'web2Address: ', web2Address, 'contractAddress: ', GetWeb3().ContractAddress)
              })
          } else {
              console.log('// 已注册, 但钱包地址不一致, 弹出modal框提示是否重新绑定钱包, 启动钱包重新绑定流程')
          }
      } else {
          console.log('// 尚未注册')
      }
  }
  // user初始化失败回调
  const initUserErrorCb = (error: any) => {
    console.log(
      '// 已注册, 钱包地址一致, 但需要用户自行输入web2服务密钥解密私有数据, 弹出modal框提示用户输入web2服务密钥, 确认后重新走selfweb3.GetUser().Init流程',
    )
  }
  const checkWalletForUser = useCallback(async () => {
    // const res = Init(GetWeb3().ContractSelfWeb3)
    // console.log(address, 'address')
    // const currentProvider = ethereumClient.getAccount()
    // console.log(currentProvider, 'current')
    // console.log(connector, 'connector')
    const currentProvider = await connector?.options.getProvider()
    console.log(currentProvider, 'currentProvider')
    const bInit = await Init(GetWeb3().ContractSelfWeb3, currentProvider, errorCb)
    if (!!bInit) GetUser().Init(address, '', initUserSuccessCb, initUserErrorCb)

  }, [address, connector])
  const handleClickCard = useCallback(
    (pathname: string) => {
      console.log(isConnected, 'isDis')
      if (!isConnected) {
        return open()
      }
    },
    [isConnected],
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
            {!!hasInfo && <Button>信息</Button>}
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
    </div>
  )
}

export default HomePage
