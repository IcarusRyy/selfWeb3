import React, { FC, useCallback } from 'react'
import { Form, Input, Modal } from 'antd'
import useSize from '@/share/ahooks/useSize'
import styles from './index.less'
import { useForm } from 'antd/es/form/Form'
interface RegisterModalPropsType {
  open: boolean
  title: string
  loading: boolean
  onClose: () => void
  onOk: (params: { email: string }) => void
}
type FieldType = {
  email: string
}
const RegisterModal: FC<RegisterModalPropsType> = (props: RegisterModalPropsType) => {
  const { open, title, onClose, onOk, loading } = props
  const [form] = useForm()
  const size = useSize(document.body)
  const isMobile = size?.width ? size.width <= 768 : window.innerWidth <= 768
  const handleOk = useCallback(() => {
    const value = form.getFieldsValue()
    onOk(value)
  }, [form])
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={loading}
      centered={isMobile}
      className={styles.registerModal}
    >
      <Form form={form}>
        <Form.Item<FieldType>
          label="email"
          name="email"
          rules={[{ required: true, type: 'email', message: 'Please input your email!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default RegisterModal
