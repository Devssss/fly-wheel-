import { sdk } from '@farcaster/miniapp-sdk'

export async function initFarcaster() {
  sdk.actions.ready()
}

export { sdk }
