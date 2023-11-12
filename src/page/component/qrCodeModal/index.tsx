import React, { ReactNode } from 'react'
import { Modal, QRCode } from 'antd'
import styles from './index.less'
import useSize from '@/share/ahooks/useSize'
interface QRCodeModalPropsType {
  open: boolean
  onClose: () => void
  qrCode: string
}

const QRCodeModal = (props: QRCodeModalPropsType) => {
  const { open, onClose, qrCode } = props
  const size = useSize(document.body)

  const isMobile = size?.width ? size.width <= 768 : window.innerWidth <= 768

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      className={styles.qrCodeModal}
      width={isMobile ? '90%' : '20%'}
    >
      <div className={styles.qrCodeBox}>
        <QRCode value={qrCode} />
        <div className={styles.textBox}>
          Scan the QR code with your mobile device's app to add a TOTP account
        </div>
      </div>
    </Modal>
  )
}

export default QRCodeModal
