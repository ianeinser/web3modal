import type { ConfigCtrlState } from '@web3modal/core'
import { ConfigCtrl, ModalCtrl, OptionsCtrl } from '@web3modal/core'

/**
 * Types
 */
type Web3ModalConfig = Omit<ConfigCtrlState, 'enableStandaloneMode'>

/**
 * Client
 */
export class Web3Modal {
  public constructor(config: Web3ModalConfig) {
    ConfigCtrl.setConfig({ enableStandaloneMode: true, ...config })
    this.initUi()
  }

  private async initUi() {
    if (typeof window !== 'undefined') {
      await import('@web3modal/ui')
      const modal = document.createElement('w3m-modal')
      document.body.insertAdjacentElement('beforeend', modal)
      OptionsCtrl.setIsUiLoaded(true)
    }
  }

  public openModal = ModalCtrl.open

  public closeModal = ModalCtrl.close

  public subscribeModal = ModalCtrl.subscribe

  public setTheme = ConfigCtrl.setThemeConfig

  public setMobileWallets = ConfigCtrl.setMobileWallets

  public setDesktopWallets = ConfigCtrl.setDesktopWallets

  public setWalletImages = ConfigCtrl.setWalletImages

  public setChainImages = ConfigCtrl.setChainImages

  public setTokenImages = ConfigCtrl.setTokenImages
}
