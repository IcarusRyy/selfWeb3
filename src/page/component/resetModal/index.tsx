import React, { FC, useCallback, useState } from 'react'
import { Button, Form, Input, Modal, Select, message } from 'antd'
import useSize from '@/share/ahooks/useSize'
import styles from './index.less'
import { useForm } from 'antd/es/form/Form'
import { BeginEmailVerify } from '@/assets/logic/verify'

interface RegisterModalPropsType {
  open: boolean
  title: string
  walletAddress: string
  onClose: () => void
  onOk: (params: { email: string; code: string; resetKind: string }) => void
}

type FieldType = {
  email: string
  code: string
  resetKind: string
}

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
}

const RestModal: FC<RegisterModalPropsType> = (props: RegisterModalPropsType) => {
  const { open, title, onClose, onOk, walletAddress } = props
  const [form] = useForm()
  const [countdown, setCountdown] = useState(0)
  const size = useSize(document.body)
  const isMobile = size?.width ? size.width <= 768 : window.innerWidth <= 768

  const startCountdown = useCallback((time: number = 60) => {
    let countdownValue = 60 // 设置倒计时初始值为60秒
    const countdownTimer = setInterval(() => {
      countdownValue -= 1
      setCountdown(countdownValue)

      if (countdownValue === 0) {
        clearInterval(countdownTimer)
      }
    }, 1000)
  }, [])

  // 发送验证码
  const handleSendCodeSuccessCb = useCallback(() => {
    message.success('Sent successfully, please check it carefully!')
    setCountdown(60) // 设置倒计时为60秒
    startCountdown() // 开始倒计时
  }, [startCountdown])
  const handleSendCodeFailCb = useCallback(() => {
    message.success('Sending failed, please try again!')
    setCountdown(3) // 设置倒计时为60秒
    startCountdown(3) // 开始倒计时
  }, [])
  const handleSubmit = useCallback(async () => {
    try {
      await form.validateFields(['email'])
      // 在这里执行获取验证码的逻辑，可以发送请求给服务器获取验证码
      const email = form.getFieldValue('email')
      console.log(email, 'email')
      BeginEmailVerify(walletAddress, email, handleSendCodeSuccessCb, handleSendCodeFailCb)
    } catch (error) {
      console.log('表单校验失败:', error)
    }
  }, [form, startCountdown])

  const handleOk = useCallback(() => {
    const value = form.getFieldsValue()
    onOk(value)
  }, [form, onOk])

  return (
    <Modal
      title={title}
      open={open} // 将 open 属性更名为 visible
      onCancel={onClose}
      onOk={handleOk}
      centered={isMobile}
      className={styles.registerModal}
    >
      <Form form={form} initialValues={{ resetKind: 'TOTP' }} {...formItemLayout}>
        <Form.Item<FieldType>
          label="resetKind"
          name="resetKind"
          rules={[{ required: true, message: 'Please select your resetKind!' }]}
        >
          <Select
            className={styles.selectBox}
            options={[
              { label: 'TOTP', value: 'TOTP' },
              { label: 'SelfPass', value: 'SelfPass', disabled: true },

              { label: 'WebAuthn', value: 'WebAuthn', disabled: true },
            ]}
          />
        </Form.Item>
        <Form.Item<FieldType>
          label="email"
          name="email"
          rules={[{ required: true, type: 'email', message: 'Please input your email!' }]}
        >
          <Input
            className={`${styles.emailInput}`}
            addonAfter={
              <Button type="primary" disabled={countdown > 0} onClick={handleSubmit}>
                {countdown > 0 ? `${countdown}s` : 'Get Code'}
              </Button>
            }
          />
        </Form.Item>
        <Form.Item<FieldType>
          label="code"
          name="code"
          rules={[{ required: true, message: 'Please input your Verification Code!' }]}
        >
          <Input className={styles.inputBox} placeholder="Please input your Verification Code!" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default RestModal
