import React from 'react'
import styles from './index.less'
import { Input, Select } from 'antd'
interface FromBoxPropsType {
  chainList: any[]
  chain: any
  data: any
  handleChangeChain: (id: number) => void
}
const { Option } = Select

const FromBox = (props: FromBoxPropsType) => {
  const { chainList, chain, handleChangeChain, data } = props

  const selectAfter = (
    <Select value={chain?.id} onSelect={handleChangeChain}>
      {chainList.map(item => (
        <Option key={item.id} value={item.id}>
          {/* {!!chainIcon && <img src={chainIcon} alt="" />} */}
          {item.name}
        </Option>
      ))}
    </Select>
  )

  return (
    <div className={styles.fromBox}>
      <div className={styles.fromTitleBox}>
        <span className={styles.fromLeftTitle}>From BNB Smart Chain Testnet</span>
        <span className={styles.fromRightTitle}>Faucet</span>
      </div>
      <div className={styles.fromAmountBox}>
        <div>Amount</div>
        <div className="mt10">
          <Input className={styles.fromInput} addonAfter={selectAfter} />
        </div>
        <div className="mt10">Balance: {data?.formatted} BNB</div>
      </div>
    </div>
  )
}

export default FromBox
