import React from 'react'
import styles from './index.less'
import { Button } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import classNames from 'classnames'
interface HeaderPropsType {
  isMobile: boolean
}
const Header = (props: HeaderPropsType) => {
  const { isMobile } = props
  return (
    <div className={classNames(styles.headersBox, isMobile && styles.userIconBox)}>
      {isMobile ? (
        <UserOutlined className={styles.userIcon} />
      ) : (
        <Button className={styles.headerBtn}>Connect Wallet</Button>
      )}
    </div>
  )
}

export default Header
