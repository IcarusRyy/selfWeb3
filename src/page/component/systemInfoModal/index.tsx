import { ContractAddress } from '@/assets/logic/web3'
import { Modal } from 'antd'
import React, { useEffect } from 'react'

interface SystemInfoModalPropsType {
  open: boolean
  selfAddress: string
  web2Address: string
  // contractAddress:string
  title: string
  onOK: () => void
  onCancel: () => void
}

const SystemInfoModal = (props: SystemInfoModalPropsType) => {
  const { open, title = 'preference', selfAddress, web2Address, onOK, onCancel } = props
  // useEffect(()=>{

  // }, [])
  return (
    <Modal open={open} title={title} onCancel={onCancel} footer={null}>
      <div>
        <div>
          <span>selfAddress: </span>
          <span>{selfAddress}</span>
        </div>
        <div>
          <span>web2Address: </span>
          <span>{web2Address}</span>
        </div>
        <div>
          <span>contractAddress: </span>
          <span>{ContractAddress}</span>
        </div>
      </div>
    </Modal>
  )
}

export default SystemInfoModal
