import '@metronic/assets/sass/custom/cloud-page-loader.scss'

import Button from '@components/pages/_buttons'
import {toAbsoluteUrl} from '@helpers'

export function FallbackView() {
  return (
    <div className='splash-screen'>
      <img src={toAbsoluteUrl('/media/logos/logo-compact.svg')} alt='Start logo' />
      <span>Loading ...</span>
    </div>
  )
}

export function Forbidden() {
  return (
    <div
      className='d-flex align-items-center justify-content-center w-100'
      style={{height: '60vh'}}
    >
      <div className='w-100 text-center'>
        <img
          alt='img'
          src={toAbsoluteUrl('/media/svg/illustrations/17.png')}
          className='h-150px mb-10'
        />
        <div className='fw-bold fs-5 text-gray-800 mb-10'>
          You do not have Authorization to access this page
        </div>
        <Button />
      </div>
    </div>
  )
}
