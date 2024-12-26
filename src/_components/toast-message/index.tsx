import 'react-toastify/dist/ReactToastify.css'
import './style.scss'

import {toast, ToastOptions} from 'react-toastify'

interface ToastProps extends Omit<ToastOptions, 'type'> {
  message?: any
  type?: 'success' | 'error' | 'warn' | 'info' | 'clear'
}

const config: ToastOptions = {
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

const ToastMessage = async ({type, message, ...options}: ToastProps) => {
  try {
    // const audio: any = new Audio('/audio/toast_sound_1.mp3')
    // await audio.play()
  } catch {
    // eslint-disable-next-line no-console
    console.info('Initialize audio successfully')
  } finally {
    switch (type) {
      case 'success':
        toast.success(message, {...config, ...options})
        break
      case 'error':
        toast.error(message, {...config, ...options, autoClose: false})
        break
      case 'warn':
        toast.warn(message, {...config, ...options})
        break
      case 'info':
        toast.info(message, {...config, ...options})
        break
      case 'clear':
        toast.dismiss()
        break
      default:
        toast(message, {...config, ...options})
    }
  }
}

export {ToastMessage}
