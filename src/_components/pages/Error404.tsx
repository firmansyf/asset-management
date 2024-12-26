import {toAbsoluteUrl} from '@helpers'
import {FC} from 'react'

import Button from './_buttons'

const Error404: FC = () => {
  return (
    <div
      className='d-flex align-items-center justify-content-center w-100'
      style={{height: '60vh'}}
    >
      <div className='w-100 text-center'>
        <img
          alt='img'
          src={toAbsoluteUrl('/media/svg/illustrations/18.png')}
          className='h-150px mb-10'
        />
        <div className='fw-bold fs-5 text-gray-800 mb-10'>
          The page you are looking for could not be found
        </div>
        <Button />
      </div>
    </div>
  )
}

export {Error404}
