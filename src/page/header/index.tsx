import React from 'react'
import styles from './index.less'
import { Button } from 'antd'
const Header = () => {
  return (
    <div className={styles.headersBox}>
      <Button>Connect Wallet</Button>
    </div>
  )
}

export default Header
