import React, { useEffect, useState } from 'react'
import styles from './index.less'
import { Button } from 'antd'
import classNames from 'classnames'
import { SwapOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import ToBox from '@/share/components/toBox'
import BottomBox from '@/share/components/bottomBox'
import { useAccount, useBalance, useNetwork, useSwitchNetwork } from 'wagmi'
import { getChainIcon } from '@/share/utils'
import FromBox from '@/share/components/fromBox'
import userInfo from '../store/user'

const DepositPage = () => {
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  const { chains, error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork()
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
  useEffect(() => {
    if (!userInfo.isLoggedIn) {
      navigate('/')
    }
    if (chain?.id) {
      handleIcon(chain.id)
      refetch()
    }
  }, [chain?.id])
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

  return (
    <div className={'flexcc h100'}>
      <div className={styles.depositBox}>
        <div className={styles.titleBox}>
          <h1>Deposit</h1>
          <p>Deposit ETH into the private web3 vault from your wallet through your own dynamic authorization</p>
        </div>
        <FromBox
          title="From Wallet"
          data={data}
          chain={chain}
          chainList={chains}
          handleChangeChain={handleChangeChain}
        />
        <div className={classNames(styles.swapBox)}>
          <SwapOutlined className={styles.swapIcon} onClick={handleToWithDrawPage} />
        </div>
        <ToBox title="To SelfVault" receiveBalance={0} currentBalance={0} />
        <Button className="mt20 baseBtn">Deposit</Button>
        {/* <BottomBox /> */}
      </div>
    </div>
  )
}
export default DepositPage
