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
import { Balance, Deposit } from '@/assets/logic/vault'
import TotpVerifyModal from '../component/totpVerify'
import _ from 'lodash'
const DepositPage = () => {
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  const { chains, error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork()
  const [balance, setBalance] = useState<number | string>(0)
  const [amount, setAmount] = useState<number | string>(0)
  const [totpVerifyOpenModal, setTotpVerifyOpenModal] = useState<boolean>(false)
  const [totpVerifyLoading, setTotpVerifyLoading] = useState<boolean>(false)
  const { data, refetch } = useBalance({
    address,
    watch: true,
    enabled: false,
  })
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
  // useEffect(() => {
  //   if (!userInfo.isLoggedIn) {
  //     navigate('/')
  //   }
  // if (chain?.id) {
  //   handleIcon(chain.id)
  //   refetch()
  // }
  // }, [userInfo.isLoggedIn])
  useEffect(() => {
    if (userInfo.selfAddress) {
      handleGetSelfWeb3Balance()
    }
  }, [userInfo.selfAddress])
  const navigate = useNavigate()
  const handleToWithDrawPage = () => {
    if (!isConnected) {
      return open()
    }
    navigate('/withdraw')
  }

  const handleChangeChain = (id: number) => {
    switchNetwork?.(id)
  }
  // 获取selfWeb3 余额
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
  // from 相关
  const handleFromAmount = useCallback(
    _.debounce((amount: number | string) => {
      setAmount(amount)
    }, 500),
    [],
  )
  // deposit相关
  const depositSuccessCb = useCallback(() => {
    refetch()
    handleGetSelfWeb3Balance()
    setTotpVerifyLoading(false)
    setTotpVerifyOpenModal(false)
  }, [])
  const depositFailCb = useCallback(() => {
    setTotpVerifyLoading(false)
  }, [])
  const handleDeposit = useCallback(
    (code: string) => {
      setTotpVerifyLoading(true)
      Deposit(address, userInfo.selfAddress, amount, code, depositSuccessCb, depositFailCb)
    },
    [address, userInfo.selfAddress, amount, depositSuccessCb, depositFailCb],
  )
  const handleBeforeDeposit = useCallback(() => {
    setTotpVerifyOpenModal(true)
  }, [])
  return (
    <div className={'flexcc h100'}>
      <div className={styles.depositBox}>
        <div className={styles.titleBox}>
          <h1>Deposit</h1>
          <p>
            Deposit ETH into the private web3 vault from your wallet through your own dynamic
            authorization
          </p>
        </div>
        <FromBox
          title="From Wallet"
          data={data}
          balance={balance}
          handleFromAmount={handleFromAmount}
          // chain={chain}
          // chainList={chains}
          // handleChangeChain={handleChangeChain}
        />
        <div className={classNames(styles.swapBox)}>
          <SwapOutlined className={styles.swapIcon} onClick={handleToWithDrawPage} />
        </div>
        <ToBox title="To SelfVault" rate={0} currentBalance={balance} />
        <Button className="mt20 baseBtn" onClick={handleBeforeDeposit}>
          Deposit
        </Button>
        {/* <BottomBox /> */}
      </div>
      {totpVerifyOpenModal && (
        <TotpVerifyModal
          loading={totpVerifyLoading}
          open={totpVerifyOpenModal}
          onCancel={() => setTotpVerifyOpenModal(false)}
          onOk={(code: string) => handleDeposit(code)}
        />
      )}
    </div>
  )
}
export default DepositPage
