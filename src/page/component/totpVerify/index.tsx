import { Input, InputNumber, Modal, message } from 'antd'
import React, { useCallback, useRef, useState } from 'react'
import styles from './index.less'
interface TotpVerifyModalPropsType {
  open: boolean
  loading: boolean
  onOk: (code: string) => void
  onCancel: () => void
  length?: number
}

const TotpVerifyModal = (props: TotpVerifyModalPropsType) => {
  const { open, onOk, onCancel, length = 6, loading } = props
  const [otp, setOtp] = useState(Array(length).fill(''))
  const inputRefs: any = useRef([])

  const handleChange = (e: any, index: number) => {
    const value = e.target.value
    if (value.length >= 1) {
      setOtp(prevOtp => {
        const newOtp = [...prevOtp]
        newOtp[index] = value[value.length - 1]
        return newOtp
      })

      if (index < length - 1) {
        inputRefs.current[index + 1].focus()
      }
    } else if (value.length === 0) {
      setOtp(prevOtp => {
        const newOtp = [...prevOtp]
        newOtp[index] = ''
        return newOtp
      })

      if (index > 0) {
        inputRefs.current[index - 1].focus()
      }
    }
  }

  const handleKeyDown = (e: any, index: number) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e: any) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').slice(0, length)
    const newOtp = Array(length).fill('')

    pastedData.split('').forEach((char: any, index: number) => {
      newOtp[index] = char
    })

    setOtp(newOtp)
    inputRefs.current[length - 1].focus()
  }
  const handleOk = useCallback(() => {
    const code = otp.join('')
    if (code.length < 6) return message.error('Verification code error')
    onOk(code)
  }, [otp])
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      className={styles.totpVerifyModal}
      confirmLoading={loading}
    >
      <div className={styles.totpVerifyContentBox}>
        <h1>TOTP Authenticator</h1>
        {/* <InputNumber controls={false} /> */}
        <div style={{ display: 'flex' }}>
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              // maxLength={1}
              value={digit}
              onChange={e => handleChange(e, index)}
              onKeyDown={e => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className={styles.inputItem}
              ref={ref => (inputRefs.current[index] = ref)}
            />
          ))}
        </div>
      </div>
    </Modal>
  )
}

export default TotpVerifyModal
