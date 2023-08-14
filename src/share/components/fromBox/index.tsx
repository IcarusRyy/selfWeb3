import React from 'react'
import styles from './index.less'
import { Dropdown, Input, MenuProps } from 'antd'
import { getChainIcon } from '@/share/utils'
import MyIcon from '../myIcon'
interface FromBoxPropsType {
  title: string
  chainList: any[]
  chain: any
  data: any
  handleChangeChain: (id: number) => void
}

const FromBox = (props: FromBoxPropsType) => {
  const { chainList, chain, handleChangeChain, data, title } = props
  const items: MenuProps['items'] = chainList.map(item => ({
    label: <span>{item.name}</span>,
    key: item.id,
    icon: <img src={`${getChainIcon(item.id)}`} />,
    onClick: item => handleChangeChain(Number(item.key)),
  }))
  return (
    <div className={styles.fromBox}>
      <div className={styles.fromTitleBox}>
        <span className={styles.fromLeftTitle}>{title}</span>
        <span className={styles.fromRightTitle}>Faucet</span>
      </div>
      <div className={styles.fromAmountBox}>
        <div>Amount</div>
        <div className="mt10">
          <Input
            className={styles.fromInput}
            addonAfter={
              <div id="inputBoxId">
                <Dropdown
                  menu={{ items }}
                  trigger={['click']}
                  getPopupContainer={() => document.getElementById('inputBoxId') || document.body}
                  placement="bottom"
                >
                  <div className={styles.downMenuOption}>
                    <img src={`${getChainIcon(chain.id)}`} />
                    <span className={'ml5'}>{chain.name}</span>
                  </div>
                </Dropdown>
              </div>
            }
          />
        </div>
        <div className="mt10">Balance: {data?.formatted} BNB</div>
      </div>
    </div>
  )
}

export default FromBox
