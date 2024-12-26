import {toAbsoluteUrl} from '@helpers'
import {FC} from 'react'

import Button from './_buttons'

const Permission: FC = () => {
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

export {Permission}
