import React from 'react'
import styles from './index.less'
import { Dropdown, Input, MenuProps } from 'antd'
import { getChainIcon } from '@/share/utils'
import MyIcon from '../myIcon'
interface FromBoxPropsType {
  title: string
  handleFromAmount: (amount: number | string) => void
  chainList?: any[]
  chain?: any
  data: any
  balance: number | string
  handleChangeChain?: (id: number) => void
}

const FromBox = (props: FromBoxPropsType) => {
  const { chainList, chain, handleChangeChain, data, title, balance, handleFromAmount } = props
  // const items: MenuProps['items'] = chainList.map(item => ({
  //   label: <span>{item.name}</span>,
  //   key: item.id,
  //   icon: <img src={`${getChainIcon(item.id)}`} />,
  //   onClick: item => handleChangeChain(Number(item.key)),
  // }))
  return (
    <div className={styles.fromBox}>
      <div className={styles.fromTitleBox}>
        <span className={styles.fromLeftTitle}>{title}</span>
        {/* <span className={styles.fromRightTitle}>Faucet</span> */}
      </div>
      <div className={styles.fromAmountBox}>
        <div>Amount</div>
        <div className="mt10">
          <Input
            className={styles.fromInput}
            onChange={e => handleFromAmount(e.target.value?.trim())}
            // addonAfter={
            //   <div id="inputBoxId">
            //     <Dropdown
            //       menu={{ items }}
            //       trigger={['click']}
            //       getPopupContainer={() => document.getElementById('inputBoxId') || document.body}
            //       placement="bottom"
            //     >
            //       <div className={styles.downMenuOption}>
            //         {/* {!!chain.id && <img src={`${getChainIcon(chain.id)}`} />} */}
            //         {/* <span className={'ml5'}>{chain.name}</span> */}
            //       </div>
            //     </Dropdown>
            //   </div>
            // }
          />
        </div>
        <div className="mt10">Balance: {data?.formatted} ETH</div>
      </div>
    </div>
  )
}

export default FromBox
