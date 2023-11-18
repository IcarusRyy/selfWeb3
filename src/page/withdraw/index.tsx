import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import styles from './index.less'
import { Button, message } from 'antd'
import classNames from 'classnames'
import { SwapOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import ToBox from '@/share/components/toBox'
import BottomBox from '@/share/components/bottomBox'
import { useAccount, useBalance, useNetwork, useSwitchNetwork } from 'wagmi'
import { getChainIcon } from '@/share/utils'
import FromBox from '@/share/components/fromBox'
import userInfo from '../store/user'
import _ from 'lodash'
import { Balance, Withdraw } from '@/assets/logic/vault'
import loadable from '@loadable/component'

const TotpVerifyModal = loadable(() => import('@/page/component/totpVerify'))
const WithdrawPage = () => {
  const { address, isConnected } = useAccount()
  const [balance, setBalance] = useState<number | string>(0)
  const [amount, setAmount] = useState<number | string>(0)
  const [totpVerifyOpenModal, setTotpVerifyOpenModal] = useState<boolean>(false)
  const [totpVerifyLoading, setTotpVerifyLoading] = useState<boolean>(false)

  const { chain } = useNetwork()
  const { chains, error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork()
  const { data, refetch } = useBalance({
    address,
    watch: true,
  })
  const navigate = useNavigate()

  // const [chainIcon, setChainIcon] = useState<string>('')
  // 获取区块链列表icon
  const handleIcon = (id: number) => {
    const res = getChainIcon(id)
    // setChainIcon(res || '')
  }
  useLayoutEffect(() => {
    if (!userInfo.isLoggedIn) {
      navigate('/')
    }
  }, [userInfo.isLoggedIn])
  useEffect(() => {
    if (userInfo.selfAddress) {
      handleGetSelfWeb3Balance()
    }
  }, [userInfo.selfAddress])
  // 获取selfWeb3余额
  const getSelfWeb3BalanceSuccessCb = useCallback((balance: string | number) => {
    setBalance(balance)
  }, [])
  const getSelfWeb3BalanceFaildCb = useCallback((balance: string | number) => {
    setBalance(0)
    return message.error('Failed to get balance')
  }, [])
  const handleGetSelfWeb3Balance = useCallback(() => {
    if (!!userInfo.selfAddress) {
      Balance(address, userInfo.selfAddress, getSelfWeb3BalanceSuccessCb, getSelfWeb3BalanceFaildCb)
    }
  }, [userInfo.selfAddress, address])
  // useEffect(() => {
  //   if (chain?.id) {
  //     handleIcon(chain.id)
  //     refetch()
  //   }
  // }, [chain?.id])
  const handleToWithDrawPage = () => {
    if (!isConnected) {
      return open()
    }
    navigate('/deposit')
  }

  const handleChangeChain = (id: number) => {
    switchNetwork?.(id)
  }

  // from 相关
  const handleFromAmount = useCallback(
    _.debounce((amount: number | string) => {
      setAmount(amount)
    }, 500),
    [],
  )

  // withdraw 相关
  const handleBeforeWithdraw = useCallback(() => {
    setTotpVerifyOpenModal(true)
  }, [])
  const withdrawSuccessCb = useCallback(() => {
    refetch()
    handleGetSelfWeb3Balance()
    setTotpVerifyLoading(false)
    setTotpVerifyOpenModal(false)
  }, [])
  const withdrawFailCb = useCallback(() => {
    setTotpVerifyLoading(false)
  }, [])
  const handleWithdraw = useCallback(
    (code: string) => {
      setTotpVerifyLoading(true)
      Withdraw(address, userInfo.selfAddress, amount, code, withdrawSuccessCb, withdrawFailCb)
    },
    [address, userInfo.selfAddress, amount, withdrawSuccessCb, withdrawFailCb],
  )
  return (
    <div className={'flexcc h100'}>
      <div className={styles.withDrawBox}>
        <div className={styles.titleBox}>
          <h1>Withdraw</h1>
          <p>
            Withdraw ETH from the private web3 vault via your own dynamic
            authorization
          </p>
        </div>
        <FromBox
          title="From SelfVault"
          balance={balance}
          handleFromAmount={handleFromAmount}
          // chain={chain}
          // chainList={chains}
          // handleChangeChain={handleChangeChain}
        />
        {/* <div className={classNames(styles.swapBox)}>
          <SwapOutlined className={styles.swapIcon} onClick={handleToWithDrawPage} />
        </div> */}
        <ToBox title="To Wallet" rate={0} currentBalance={data?.formatted || 0} />
        <Button className="mt20 baseBtn" onClick={handleBeforeWithdraw}>
          Withdraw
        </Button>
      </div>
      {totpVerifyOpenModal && (
        <TotpVerifyModal
          loading={totpVerifyLoading}
          open={totpVerifyOpenModal}
          onCancel={() => {
            setTotpVerifyOpenModal(false)
            setTotpVerifyLoading(false)
          }}
          onOk={(code: string) => handleWithdraw(code)}
        />
      )}
    </div>
  )
}
export default WithdrawPage
