import { createFromIconfontCN } from '@ant-design/icons'
const iconfont = require('@/assets/iconfont/iconfont')
const MyIcon = createFromIconfontCN({
  // scriptUrl: '//at.alicdn.com/t/font_2439816_mw6j5npx6ys.js', // 在 iconfont.cn 上生成
  scriptUrl: iconfont, // 本地
})

export default MyIcon
