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
            <span>{selfAddress}</span>
          </div>
          <div>
            <span>Web2: </span>
            <span>{web2Address}</span>
          </div>
          <div>
            <span>Contract: </span>
            <span>{ContractAddress}</span>
          </div>
        </div>
      </Card>
    </Modal>
  )
}

export default SystemInfoModal
