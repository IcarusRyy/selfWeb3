import React from 'react'
import styles from './index.less'
import { Button, Input } from 'antd'
import classNames from 'classnames'
import { SwapOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import ToBox from '@/share/components/toBox'
import BottomBox from '@/share/components/bottomBox'

const DepositPage = () => {
  const navigate = useNavigate()
  const handleToWithDrawPage = () => {
    navigate('/withdraw')
  }
  return (
    <div className={'flexcc h100'}>
      <div className={styles.depositBox}>
        <div className={styles.titleBox}>
          <h1>Deposit</h1>
          <p>Transfer BNB from BNB Smart Chain Testnet to your opBNB Testnet account.</p>
        </div>
        <div className={styles.fromBox}>
          <div className={styles.fromTitleBox}>
            <span className={styles.fromLeftTitle}>From BNB Smart Chain Testnet</span>
            <span className={styles.fromRightTitle}>Faucet</span>
          </div>
          <div className={styles.fromAmountBox}>
            <div>Amount</div>
            <div className="mt10">
              <Input className={styles.fromInput} />
            </div>
            <div className="mt10">Balance: 0 BNB</div>
          </div>
        </div>
        <div className={classNames('mt30', styles.swapBox)}>
          <SwapOutlined className={styles.swapIcon} onClick={handleToWithDrawPage} />
        </div>
        <ToBox title="To opBNB Testnet" receiveBalance={0} currentBalance={0} />
        <Button className="mt20 baseBtn">Connect Wallet</Button>
        <BottomBox />
      </div>
    </div>
  )
}
export default DepositPage
