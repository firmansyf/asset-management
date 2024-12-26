import {toAbsoluteUrl} from '@helpers'
import {FC} from 'react'

const Nodata: FC<any> = ({height = '50vh', text = 'No Data', scale = 1}) => {
  return (
    <div
      className='d-flex align-items-center justify-content-center w-100'
      style={{height, transform: `scale(${scale})`}}
    >
      <div className='w-100 text-center'>
        <img
          alt='img'
          src={toAbsoluteUrl('/media/svg/illustrations/box-1.png')}
          className='h-100px mb-5'
        />
        <div className='fs-7 text-gray-500'>{text}</div>
      </div>
    </div>
  )
}

export {Nodata}
