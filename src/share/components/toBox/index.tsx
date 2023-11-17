import React from 'react'
import styles from './index.less'
interface ToBoxPropsType {
  title: string
  rate: number | string
  receiveBalance?: number | string
  currentBalance: number | string
}

const ToBox = (props: ToBoxPropsType) => {
  const { title, receiveBalance, currentBalance, rate } = props
  return (
    <>
      <div className={styles.toBox}>
        <div className={styles.toTitleBox}>
          <span>{title}</span>
        </div>
        <div className={styles.toAmountBox}>
          <p>
            Deposit fee rate: <span>{rate}</span>
          </p>
          <p className="ft10">Current balance: {currentBalance} ETH</p>
        </div>
      </div>
    </>
  )
}

export default ToBox
