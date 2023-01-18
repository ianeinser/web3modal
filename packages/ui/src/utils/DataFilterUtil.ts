import type { Listing, MobileWallet } from '@web3modal/core'
import { ClientCtrl, ConfigCtrl, CoreUtil, OptionsCtrl } from '@web3modal/core'
import type { TemplateResult } from 'lit'
import { InjectedId } from '../presets/EthereumPresets'
import { UiUtil } from './UiUtil'

export interface DesktopWallet {
  id: string
  name: string
  links: {
    native: string
    universal: string
  }
}

export interface ExtensionWallet {
  name: string
  icon: string
  url: string
  isMobile?: boolean | undefined
  isDesktop?: boolean | undefined
  id: string
}

export const DataFilterUtil = {
  allowedExplorerListings(listings: Listing[]) {
    const { explorerAllowList, explorerDenyList } = ConfigCtrl.state
    let filtered = [...listings]
    if (explorerAllowList?.length) {
      filtered = filtered.filter(l => explorerAllowList.includes(l.id))
    }
    if (explorerDenyList?.length) {
      filtered = filtered.filter(l => !explorerDenyList.includes(l.id))
    }

    return filtered
  },

  walletsWithInjected<T extends Listing | MobileWallet>(wallets?: T[]) {
    let filtered = [...(wallets ?? [])]

    if (window.ethereum) {
      const injectedName = UiUtil.getWalletName('')
      filtered = filtered.filter(({ name }) => !UiUtil.caseSafeIncludes(name, injectedName))
    }

    return filtered
  },

  connectorWallets() {
    const { isStandalone } = OptionsCtrl.state
    if (isStandalone) {
      return []
    }
    let connectors = ClientCtrl.client().getConnectors()
    if (!window.ethereum && CoreUtil.isMobile()) {
      connectors = connectors.filter(({ id }) => id !== 'injected' && id !== InjectedId.metaMask)
    }

    return connectors
  },

  walletTemplatesWithRecent(
    walletsTemplate: TemplateResult<1>[],
    recentTemplate?: TemplateResult<1>
  ) {
    let wallets = [...walletsTemplate]
    if (recentTemplate) {
      const recentWallet = UiUtil.getRecentWallet()
      wallets = wallets.filter(wallet => !wallet.values.includes(recentWallet?.name))
      wallets.splice(1, 0, recentTemplate)
    }

    return wallets
  },

  deduplicateExplorerListingsFromConnectors(listings: Listing[]) {
    const { isStandalone } = OptionsCtrl.state
    if (isStandalone) {
      return listings
    }
    const connectors = ClientCtrl.client().getConnectors()
    const connectorNames = connectors.map(({ name }) => name.toUpperCase())

    return listings.filter(({ name }) => !connectorNames.includes(name.toUpperCase()))
  },

  deduplicateWallets<T extends DesktopWallet | ExtensionWallet | Listing | MobileWallet>(
    duplicates: T[]
  ) {
    const uniqueIds: string[] = []

    const uniqueWallets = duplicates.filter(w => {
      const isDuplicate = uniqueIds.includes(w.id)

      if (!isDuplicate) {
        uniqueIds.push(w.id)

        return true
      }

      return false
    })

    return uniqueWallets
  },

  deduplicateWalletTemplates(duplicates: TemplateResult<1>[]) {
    const uniqueNames: string[] = []

    const uniqueWalletTemplates = duplicates.filter(wt => {
      const wtname: string = JSON.stringify(wt.values[1])
      const isDuplicate = uniqueNames.includes(wtname)

      if (!isDuplicate) {
        uniqueNames.push(wtname)

        return true
      }

      // eslint-disable-next-line no-console
      console.log(`Wallet template name ${wtname}`)

      return false
    })

    return uniqueWalletTemplates
  }
}
