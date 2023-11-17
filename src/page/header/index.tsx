import React from 'react'
import styles from './index.less'
import { Button } from 'antd'
import { RollbackOutlined, UserOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import { useWeb3Modal } from '@web3modal/react'
import { Web3Button } from '@web3modal/react'
import { useNavigate } from 'react-router-dom'
interface HeaderPropsType {
  isMobile: boolean
}

const Header = (props: HeaderPropsType) => {
  const { isMobile } = props
  const { isOpen, open, close, setDefaultChain } = useWeb3Modal()
  const navigate = useNavigate()
  const handleConnectWallet = async () => {
    try {
      // const provider = await web3Modal.connect()
      // const web3Instance = new Web3(provider)
      open()
    } catch (error) {
      console.log('Failed to connect wallet:', error)
    }
  }
  return (
    <div className={classNames(styles.headersBox, isMobile && styles.userIconBox)}>
      <Button
        size="large"
        icon={<RollbackOutlined />}
        onClick={() => navigate('/')}
        className={styles.headerBtn}
      />
      {isMobile ? (
        <UserOutlined className={styles.userIcon} />
      ) : (
        <>
          {/* <Button className={styles.headerBtn} onClick={handleConnectWallet}>
            Connect Wallet
          </Button> */}
          <div className={styles.web3BtnBox}>
            <Web3Button icon="hide" label="CONNECT" />
          </div>
        </>
      )}
    </div>
  )
}

export default Header
