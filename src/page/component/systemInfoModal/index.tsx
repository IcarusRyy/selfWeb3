import { ContractAddress } from '@/assets/logic/web3'
import { Modal, Card, Avatar } from 'antd'
import React, { useEffect } from 'react'
import preferences from '@/assets/imgs/preferences.jpg'
import { UserOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'

interface SystemInfoModalPropsType {
  open: boolean
  selfAddress?: string
  web2Address?: string
  // contractAddress:string
  title: string
  onOK: () => void
  onCancel: () => void
}

const SystemInfoModal = (props: SystemInfoModalPropsType) => {
  const { open, title = 'SelfWeb3', selfAddress, web2Address, onOK, onCancel } = props
  // useEffect(()=>{

  // }, [])
  return (
    <Modal open={open} title={title} onCancel={onCancel} footer={null}>
      <Card
        // style={{ width: 300 }}
        cover={<img alt="Preference" src={preferences} />}
        actions={[
          <UserOutlined key="profile" />,
          <SettingOutlined key="setting" />,
          <EllipsisOutlined key="ellipsis" />,
        ]}
      >
        <div>
          <div>
            <span>Self: </span>
            <span>{selfAddress ? selfAddress:'Your own unique web3 address'}</span>
          </div>
          <div>
            <span>Web2: </span>
            <span>{web2Address ? web2Address:'Official web2 service address'}</span>
          </div>
          <div>
            <span>Contract: </span>
            <span>{ContractAddress ? ContractAddress:'Deployed contract address'}</span>
          </div>
        </div>
      </Card>
    </Modal>
  )
}

export default SystemInfoModal
