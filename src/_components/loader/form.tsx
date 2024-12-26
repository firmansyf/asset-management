import 'react-loading-skeleton/dist/skeleton.css'

import {toAbsoluteUrl} from '@helpers'
import {FC} from 'react'

export const FileLoader: FC<any> = () => {
  return (
    <div className='row'>
      <div className='col-12 text-center'>
        <img
          src={toAbsoluteUrl('/media/svg/others/loader-pages.gif')}
          width='80'
          alt='Metronic logo'
          className='mb-20 mt-20'
        />
      </div>
    </div>
  )
}
