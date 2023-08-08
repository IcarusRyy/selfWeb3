import React from 'react'
import styles from './index.less'
interface ToBoxPropsType {
  title: string
  receiveBalance: number | string
  currentBalance: number | string
}

const ToBox = (props: ToBoxPropsType) => {
  const { title, receiveBalance, currentBalance } = props
  return (
    <>
      <div className={styles.toBox}>
        <div className={styles.toTitleBox}>
          <span>{title}</span>
        </div>
        <div className={styles.toAmountBox}>
          <p>
            You will receive: <span>{receiveBalance} BNB</span>
          </p>
          <p className="ft10">Current balance: {currentBalance} BNB</p>
        </div>
      </div>
    </>
  )
}

export default ToBox
