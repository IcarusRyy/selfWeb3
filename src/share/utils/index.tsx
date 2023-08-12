import { ChainPresets } from '@/assets/constants/ChainPresets'
import {
  ClientCtrl,
  ConfigCtrl,
  CoreUtil,
  ExplorerCtrl,
  ModalCtrl,
  OptionsCtrl,
  RouterCtrl,
  ToastCtrl,
  WcConnectionCtrl,
} from '@web3modal/core'
export const getChainIcon = (chainId: number | string) => {
  const imageId = ChainPresets[chainId]
  const { projectId, chainImages } = ConfigCtrl.state

  return (
    chainImages?.[chainId] ?? (projectId && imageId ? ExplorerCtrl.getAssetImageUrl(imageId) : '')
  )
}
