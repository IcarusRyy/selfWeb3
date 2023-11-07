import React, { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import LazyWrapper from '@/share/components/LazyWrapper'
import styles from './index.less'
import { useNavigate } from 'react-router-dom'
import { Web3Button, useWeb3Modal } from '@web3modal/react'
import { Button, Card, message } from 'antd'
import { useAccount } from 'wagmi'
import { Init, GetWeb3, GetUser } from '@/assets/logic/index'
import { ethereumClient } from '@/assets/constants'
import loadable from '@loadable/component'
import { Register, Reset } from '@/assets/logic/user'

const ResetModal = loadable(() => import('@/page/component/resetModal'))
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

// const RegisterModal = lazy(() => import(
//   /*webpackPrefetch: true*/
//   '@/page/component/registerModal'
// ))
const RegisterModal = loadable(() => import('@/page/component/registerModal'))
const { Meta } = Card
const HomePage = () => {
  // const [nowBtn, setNowBtn] = useState<string>('left')
  // const [hasInfo, setHasInfo] = useState<any>({})
  const [isRegistered, setIsRegistered] = useState<boolean | undefined>(undefined)
  const [selfAddress, setSelfAddress] = useState<string>()
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false)
  const [showResetModal, setShowResetModal] = useState<boolean>(false)
  const [QRCode, setQRCode] = useState<string>()
  const navigate = useNavigate()
  const { isOpen, open, close, setDefaultChain } = useWeb3Modal()
  const { address, connector, isConnected, isDisconnected } = useAccount()
  // const handleChangeBtn = useCallback((e: any, nowBtn: 'left' | 'right') => {
  //   e.preventDefault()
  //   e.stopPropagation()
  //   setNowBtn(nowBtn)
  //   navigate('/deposit')
  // }, [])
  useEffect(() => {
    if (isConnected && !!connector) {
      checkWalletForUser()
    } else {
      setIsRegistered(undefined)
    }
  }, [isConnected, connector])
  const errorCb = (err: any, flow: any, msg: string, param: any) =>
    console.log({ flow: flow, error: err === 'error', msg: msg, param: param })

  // user初始化成功回调
  const initUserSuccessCb = async (selfAddress: string, web2Address: string) => {
    // check registered
    const { registered, bound } = await GetUser().Registered(address, selfAddress)
    setIsRegistered(registered)
    setSelfAddress(selfAddress)
    if (registered === true) {
      if (bound === true) {
        // 已注册, 钱包地址一致, 开始加载用户私有信息
        GetUser().Load(address, selfAddress, function () {
          // 已注册, 钱包地址一致, 用拿到的地址信息初始化profile(第一个卡片的内容), 用户加载流程完成
          console.log(
            'selfAddress: ',
            selfAddress,
            'web2Address: ',
            web2Address,
            'contractAddress: ',
            GetWeb3().ContractAddress,
          )
        })
      } else {
        console.log(
          '// 已注册, 但钱包地址不一致, 弹出modal框提示是否重新绑定钱包, 启动钱包重新绑定流程',
        )
      }
    } else {
      console.log(registered, bound, '// 尚未注册')
    }
  }
  // user初始化失败回调
  const initUserErrorCb = (error: any) => {
    console.log(
      '// 已注册, 钱包地址一致, 但需要用户自行输入web2服务密钥解密私有数据, 弹出modal框提示用户输入web2服务密钥, 确认后重新走selfweb3.GetUser().Init流程',
    )
  }
  /**
   * 检查用户钱包地址是否存在selfWeb3账户  用户信息初始化
   * walletAddress: 钱包地址
   * inputWeb2Key：
   * initUserSuccessCb：成功回调
   * initUserErrorCb：失败回调
   */
  const checkWalletForUser = useCallback(async () => {
    const currentProvider = await connector?.options.getProvider()
    const bInit = await Init(GetWeb3().ContractSelfWeb3, currentProvider, errorCb)
    if (!!bInit) {
      GetUser().Init(address, '', initUserSuccessCb, initUserErrorCb)
    }
  }, [address, connector, isConnected])
  const handleClickCard = useCallback(
    (pathname: string) => {
      if (!isConnected) {
        return open()
      }
    },
    [isConnected],
  )

  // 注册相关
  const handleRegisterOpenModal = useCallback((isOpen: boolean) => {
    setShowRegisterModal(isOpen)
  }, [])

  const registerSuccessCb = useCallback((SelfAddress: string, QRCode: string) => {
    setIsRegistered(true)
    setSelfAddress(SelfAddress)
  }, [])
  const handleRegisterSelfWeb3 = useCallback(
    (params: { email: string }) => {
      Register(address, selfAddress, params.email, registerSuccessCb)
    },
    [address, selfAddress],
  )

  // 重置相关
  const handleCloseResetModal = useCallback(() => {
    setShowResetModal(false)
  }, [])
  // 重置成功回调
  const resetSuccessCb = useCallback((QRcode: string) => {
    message.success('Reset successful')
    setQRCode(QRcode)
    setShowResetModal(false)
  }, [])
  // 重置失败回调
  const resetFailCb = useCallback(() => {
    message.error('Reset failed')
  }, [])
  const handleSubmitResetModalForm = useCallback(
    (params: { email: string; code: string; resetKind: string }) => {
      Reset(address, selfAddress, params.code, params.resetKind, resetSuccessCb, resetFailCb)
    },
    [address, selfAddress],
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
            {isRegistered === false && (
              <Button
                size="large"
                className="ml5 baseBtn"
                onClick={() => handleRegisterOpenModal(true)}
              >
                Register
              </Button>
            )}
            {isRegistered && !!selfAddress && (
              <Button size="large" className="ml5 baseBtn" onClick={() => setShowResetModal(true)}>
                Reset
              </Button>
            )}
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
      {showRegisterModal && (
        <RegisterModal
          title="Register"
          open={showRegisterModal}
          onOk={handleRegisterSelfWeb3}
          onClose={() => handleRegisterOpenModal(false)}
        />
      )}
      {showResetModal && (
        <ResetModal
          title="Register"
          open={showResetModal}
          onOk={params => handleSubmitResetModalForm(params)}
          onClose={handleCloseResetModal}
        />
      )}
    </div>
  )
}

export default HomePage
