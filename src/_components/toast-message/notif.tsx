import 'react-toastify/dist/ReactToastify.css'
import './style.notif.scss'

import {toast} from 'react-toastify'

const ToastNotif = async ({type, message}: any, options = {}) => {
  let config: any = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    pauseOnFocusLoss: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    icon: true,
  }
  config = {...config, ...options}
  try {
    // const audio: any = new Audio('/audio/toast_sound_1.mp3')
    // await audio.play()
  } catch {
    // eslint-disable-next-line no-console
    console.info('Initialize audio successfully')
  } finally {
    switch (type) {
      case 'success':
        toast.success(message, config)
        break
      case 'error':
        toast.error(message, config)
        break
      case 'warn':
        toast.warn(message, config)
        break
      case 'info':
        toast.info(message, config)
        break
      default:
        toast(message, config)
    }
  }
}

export {ToastNotif}
