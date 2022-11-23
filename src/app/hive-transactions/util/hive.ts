export type KeychainFunctionName =
  | 'requestHandshake'
  | 'requestTransfer'
  | 'requestVerifyKey'
  | 'requestPost'
  | 'requestVote'
  | 'requestCustomJson'
  | 'requestSignBuffer'
  | 'requestAddAccountAuthority'
  | 'requestRemoveAccountAuthority'
  | 'requestBroadcast'
  | 'requestSignedCall'
  | 'requestSendToken'
  | 'requestDelegation'
  | 'requestWitnessVote'
  | 'requestPowerUp'
  | 'requestPowerDown'

export interface KeychainFunction {
  0: KeychainFunctionName
  1: {[key: string]: any}
}

export interface KeychainReturnObject {
  success: boolean
  msg: string
  cancel?: boolean
  notInstalled?: boolean
  notActive?: boolean
  error?: any
}

// TODO: Add better typing
/* interface IRequestTransfer extends KeychainFunction {
  0: 'requestHandshake'
  1: {
    from: string
    to: string
    amount: number
    symbol: AssetSymbol
    memo?: string
  }
} */

/**
 *
 * @param window Window object of your browser
 * @param fn Keychain function name
 * @param args Function arguments
 *
 * Example 1: keychain(window, 'requestTransfer', sender, receiver, amount, memo, asset)
 *
 * Example 2: keychain(window, 'requestTransfer', 'test', 'therealwolf', 5, 'test memo', 'HIVE')
 *
 * More info: https://github.com/stoodkev/hive-keychain
 *
 * Return Object:
 * success => whether it was successfully transferred
 *
 * msg => error message
 *
 * cancel => keychain popup was cancelled by the user
 *
 * notInstalled => keychain is not yet installed
 *
 * notActive => keychain was used before but is not active right now and
 * has to either be clicked on or set to allow current page
 */
export const keychain = async (
  window: any,
  fn: KeychainFunctionName,
  ...args: any
): Promise<KeychainReturnObject> => {
  try {
    const {installed, used} = await isKeychainInstalled(window)
    console.log(installed)
    if (!installed) {
      return {
        success: false,
        msg: '',
        notInstalled: !installed,
        notActive: used,
        cancel: false,
      }
    }

    return new Promise((resolve) => {
      window.hive_keychain[fn](...args, (r:any) => { 
        console.log(JSON.stringify(r));
        if (r.error && r.error === 'user_cancel') {
          return resolve({success: false, msg: r.error, cancel: true, ...r})
        }
        if (r.success) {
          return resolve({success: true, msg: r.result, ...r})
        }
        return resolve({success: false, msg: r.message, ...r})
      })
    })
  } catch (error: any) {
    return {success: false, msg: error.message}
  }
}

export const isKeychainInstalled = async (window: any) => {
  const used = hasKeychainBeenUsed()
  if (!window.hive_keychain) return {installed: false, used}

  try {
    await (() => {
      return new Promise((resolve) => {
        window.hive_keychain.requestHandshake((r:any) => {
          if (r.error) {
            throw new Error('missing')
          } else {
            resolve(true)
          }
        })
      })
    })
  } catch (error) {
    return {installed: false, used}
  }
  if (!hasKeychainBeenUsed()) localStorage.setItem('hasKeychain', 'true')
  return {installed: true, used: true}
}

export const hasKeychainBeenUsed = () => {
  return Boolean(localStorage.getItem('hasKeychain'))
}

/**
 * Wrapper for requestSignBuffer that allows for setting of title without breaking callback
 */
export const keychainRequestSign = (
  window: any,
  title: string,
  message: string,
  key: 'Posting' | 'Active' | 'Memo',
  account?: string,
  rpc?: string,
): Promise<KeychainReturnObject> => {
  return new Promise((resolve) => {
    keychain(
      window,
      'requestSignBuffer',
      account,
      message,
      key,
      (r: any) => {
        if (r.error === 'user_cancel') {
          return resolve({success: false, msg: r.error, cancel: true, ...r})
        }
        if (r.success) {
          return resolve({success: true, msg: r.result, ...r})
        }
        return resolve({success: false, msg: r.message, ...r})
      },
      rpc,
      title,
    )
  })
}
