import React from 'react'
import styles from './index.less'
import { Button } from 'antd'
import classNames from 'classnames'
const BottomBox = () => {
  return (
    <div className={classNames('flexcc', styles.bottomBox)}>
      <div className={styles.lineBox}>
        <div className={styles.line}></div>
        <div className={styles.lineContent}>Third Party Bridge</div>
      </div>
      <Button className="baseBtn mt10">待补充</Button>
      <div className={classNames('mt10', styles.bottomContent)}>
        These are independent service providers that BNB Chain is linking to for your convenience -
        BNB Chain has no responsibility for their operation.
      </div>
    </div>
  )
}

export default BottomBox
