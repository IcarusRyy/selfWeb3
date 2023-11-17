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
import { EnterDapp, Register, Reset } from '@/assets/logic/user'
import HomeBackground from '@/assets/imgs/home-bg.jpg'
import preferences from '@/assets/imgs/selfweb3.jpg'
import selfVault from '@/assets/imgs/selfvault.jpg'
import selNft from '@/assets/imgs/selfnft.jpg'
import userInfo from '../store/user'
const ResetModal = loadable(() => import('@/page/component/resetModal'))
const QRCodeModal = loadable(() => import('../component/qrCodeModal'))
const TotpVerifyModal = loadable(() => import('@/page/component/totpVerify'))
const SystemInfoModal = loadable(() => import('@/page/component/systemInfoModal'))
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
  const [web2Address, setWeb2Address] = useState<string>()
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false)
  const [registerLoading, setRegisterLoading] = useState<boolean>(false)
  const [showResetModal, setShowResetModal] = useState<boolean>(false)
  const [resetLoading, setResetLoading] = useState<boolean>(false)
  const [QRCode, setQRCode] = useState<string>()
  const [QRCodeOpenModal, setQRCodeOpenModal] = useState<boolean>(false)
  const [totpVerifyOpenModal, setTotpVerifyOpenModal] = useState<boolean>(false)
  const [totpVerifyLoading, setTotpVerifyLoading] = useState<boolean>(false)
  const [systemInfoOpenModal, setSystemInfoOpenModal] = useState<boolean>(false)
  const navigate = useNavigate()
  const { isOpen, open, close, setDefaultChain } = useWeb3Modal()
  const catchSelfAddress = localStorage.getItem('selfAddress')
  const { address, connector, isConnected, isDisconnected } = useAccount()
  // const handleChangeBtn = useCallback((e: any, nowBtn: 'left' | 'right') => {
  //   e.preventDefault()
  //   e.stopPropagation()
  //   setNowBtn(nowBtn)
  //   navigate('/deposit')
  // }, [])
  useEffect(() => {
    if (isConnected && !!connector) {
      if (!userInfo.isLoggedIn) {
        checkWalletForUser()
      } else {
        if (!!catchSelfAddress) {
          setIsRegistered(true)
          setSelfAddress(catchSelfAddress)
        } else {
          checkWalletForUser()
        }
      }
    } else {
      setIsRegistered(undefined)
    }
  }, [isConnected, connector])

  // user初始化成功回调
  const initUserSuccessCb = async (selfAddress: string, web2Address: string) => {
    // check registered
    const { registered, bound } = await GetUser().Registered(address, selfAddress)
    localStorage.setItem('selfAddress', selfAddress)
    userInfo.changeSelfAddres(selfAddress)
    setSelfAddress(selfAddress)
    setWeb2Address(web2Address)
    if (registered === true) {
      if (bound === true) {
        // 已注册, 钱包地址一致, 开始加载用户私有信息
        GetUser().Load(address, selfAddress, function () {
          // 已注册, 钱包地址一致, 用拿到的地址信息初始化profile(第一个卡片的内容), 用户加载流程完成
          setIsRegistered(registered)

          userInfo.changeLoginStatus(true)
        })
      } else {
        console.log(
          '// 已注册, 但钱包地址不一致, 弹出modal框提示是否重新绑定钱包, 启动钱包重新绑定流程',
        )
      }
    } else {
      setIsRegistered(false)
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
  const errorCb = useCallback((err: any, flow: any, msg: string, param: any) => {
    if (err && param.includes('User denied')) {
      setIsRegistered(false)
      window.location.reload()
    }
  }, [])

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
      if (!userInfo.isLoggedIn) return

      if (!selfAddress && selfAddress !== '') {
        return setShowRegisterModal(true)
      }

      if (pathname === '/deposit') {
        return setTotpVerifyOpenModal(true)
      }
      navigate(pathname)
    },
    [isConnected, selfAddress, userInfo.isLoggedIn],
  )

  // 生成TOTP注册二维码
  const getSelfID = (selfAddress: string) => {
    return (
      selfAddress.substring(0, 4) +
      '...' +
      selfAddress.substring(selfAddress.length - 4, selfAddress.length)
    )
  }
  const getQRCodeLink = (selfAddress: string, QRCode: string) => {
    return (
      'otpauth://totp/selfweb3-' +
      GetWeb3().networkId +
      ':' +
      getSelfID(selfAddress) +
      '?secret=' +
      QRCode.replace(/=/g, '')
    )
  }

  // 注册相关
  const handleRegisterOpenModal = useCallback((isOpen: boolean) => {
    setShowRegisterModal(isOpen)
  }, [])

  const registerSuccessCb = useCallback((SelfAddress: string, QRCode: string) => {
    setRegisterLoading(false)
    setIsRegistered(true)
    userInfo.changeLoginStatus(true)
    setShowRegisterModal(false)
    userInfo.changeSelfAddres(SelfAddress)
    setSelfAddress(SelfAddress)
    setQRCode(getQRCodeLink(SelfAddress, QRCode))
    handleOpenQRcodeModal(true)
  }, [])
  const registerFailCb = useCallback(() => {
    setRegisterLoading(false)
  }, [])
  const handleRegisterSelfWeb3 = useCallback(
    (params: { email: string }) => {
      setRegisterLoading(true)
      Register(address, selfAddress, params.email, registerSuccessCb, registerFailCb)
    },
    [address, selfAddress],
  )

  // 重置相关
  const handleCloseResetModal = useCallback(() => {
    setShowResetModal(false)
  }, [])
  // 重置成功回调
  const resetSuccessCb = useCallback((SelfAddress: string, QRCode: string) => {
    message.success('Reset successful')
    setResetLoading(true)
    handleOpenQRcodeModal(true)
    setQRCode(getQRCodeLink(SelfAddress, QRCode))
    setShowResetModal(false)
  }, [])
  // 重置失败回调
  const resetFailCb = useCallback(() => {
    setResetLoading(false)
    message.error('Reset failed')
  }, [])
  const handleSubmitResetModalForm = useCallback(
    (params: { email: string; code: string; resetKind: string }) => {
      setResetLoading(true)
      Reset(address, selfAddress, params.code, params.resetKind, resetSuccessCb, resetFailCb)
    },
    [address, selfAddress],
  )
  // 二维码相关
  const handleOpenQRcodeModal = useCallback((open: boolean) => {
    setQRCodeOpenModal(open)
  }, [])

  // 进入deposit相关
  const inDepositSuccessCb = useCallback(() => {
    setTotpVerifyOpenModal(false)
    setTotpVerifyLoading(false)
    navigate('/deposit')
  }, [])
  const inDepositFailCb = useCallback(() => {
    message.error('verification failed')
    setTotpVerifyLoading(false)
  }, [])
  const handleInDeposit = useCallback(
    (code: string) => {
      setTotpVerifyLoading(true)
      EnterDapp(address, selfAddress, code, inDepositSuccessCb, inDepositFailCb)
    },
    [address],
  )
  return (
    <div className={styles.homeBox}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.title}>Welcome to SelfWeb3</span>
          <p className={styles.description}>
            An on-chain privatization solution that binds Web3 to the user one-to-one
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
            onClick={() => setSystemInfoOpenModal(true)}
            cover={<img alt="Preference" src={preferences} />}
          >
            <Meta
              title={selfAddress ? getSelfID(selfAddress) : 'SelfWeb3'}
              description="System settings, deployed addresses, and personalization preferences"
            />
          </Card>
          <Card
            className={styles.card}
            hoverable
            onClick={() => handleClickCard('/deposit')}
            cover={<img alt="SelfVault" src={selfVault} />}
          >
            <Meta
              title="SelfVault"
              description="Your private vault, completely under your control, extremely safe"
            />
          </Card>
          <Card className={styles.card} hoverable cover={<img alt="SelfNFT" src={selNft} />}>
            <Meta
              title="SelfNFT"
              description="Your private NFT, completely under your control, comming soon"
            />
          </Card>
        </div>
      </div>
      {showRegisterModal && (
        <RegisterModal
          title="Register"
          loading={registerLoading}
          open={showRegisterModal}
          onOk={handleRegisterSelfWeb3}
          onClose={() => handleRegisterOpenModal(false)}
        />
      )}
      {showResetModal && !!address && (
        <ResetModal
          title="Register"
          walletAddress={address}
          loading={resetLoading}
          open={showResetModal}
          onOk={params => handleSubmitResetModalForm(params)}
          onClose={handleCloseResetModal}
        />
      )}
      {QRCodeOpenModal && !!QRCode && (
        <QRCodeModal
          open={QRCodeOpenModal}
          onClose={() => handleOpenQRcodeModal(false)}
          qrCode={QRCode}
        />
      )}
      {totpVerifyOpenModal && (
        <TotpVerifyModal
          loading={totpVerifyLoading}
          open={totpVerifyOpenModal}
          onCancel={() => setTotpVerifyOpenModal(false)}
          onOk={(code: string) => handleInDeposit(code)}
        />
      )}
      {systemInfoOpenModal && (
        <SystemInfoModal
          web2Address={web2Address}
          selfAddress={selfAddress}
          title="SelfWeb3"
          open={systemInfoOpenModal}
          onCancel={() => setSystemInfoOpenModal(false)}
          onOK={() => setSystemInfoOpenModal(false)}
        />
      )}
    </div>
  )
}

export default HomePage
