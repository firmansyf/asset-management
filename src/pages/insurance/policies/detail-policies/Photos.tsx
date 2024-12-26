import {toAbsoluteUrl} from '@helpers'
import {FC, memo} from 'react'

let PhotosAsset: FC = () => {
  return (
    <div>
      <img alt='Logo' src={toAbsoluteUrl('/media/logos/logo-assetdata.png')} className='h-30px' />
      <img alt='Logo' src={toAbsoluteUrl('/media/logos/logo-assetdata.png')} className='h-30px' />
      <img alt='Logo' src={toAbsoluteUrl('/media/logos/logo-assetdata.png')} className='h-30px' />
    </div>
  )
}

PhotosAsset = memo(PhotosAsset)
export {PhotosAsset}
