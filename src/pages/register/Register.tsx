import {toAbsoluteUrl} from '@helpers'
import {useEffect} from 'react'

import {Registration} from '../auth/components/Registration'

export function RegisterPage() {
  useEffect(() => {
    document?.body?.classList?.add('bg-white')
    return () => {
      document?.body?.classList?.remove('bg-white')
    }
  }, [])

  return (
    <div
      className='d-flex flex-column flex-column-fluid bgi-position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed'
      style={{
        backgroundImage: 'url(/media/patterns/bg-blue-ui.png)',
        backgroundColor: '#00048f',
        backgroundRepeat: 'repeat',
      }}
    >
      <div className='d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20'>
        <a href='#' className='mb-5'>
          <img
            alt='Logo'
            src={toAbsoluteUrl('/media/logos/logo-assetdata.png')}
            className='h-60px'
            style={{
              filter: 'brightness(0) invert(1)',
            }}
          />
        </a>
        <Registration />
      </div>
    </div>
  )
}
