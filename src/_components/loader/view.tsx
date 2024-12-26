import 'react-loading-skeleton/dist/skeleton.css'

import {FC} from 'react'
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'

import {DotFlash} from './dots'

export const ViewLoader: FC<any> = ({height = 25, heightLabel = 20}) => {
  const LoopingSkeleton = () => {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((key: any) => {
      return (
        <div className='col-6 mt-3' key={key}>
          <Skeleton height={heightLabel} style={{width: '30%'}} />
          <Skeleton height={height} style={{width: '50%'}} />
        </div>
      )
    })
  }

  return (
    <SkeletonTheme baseColor='#f5f5f5' highlightColor='#fafafa'>
      <div className='row m-5'>{LoopingSkeleton()}</div>
    </SkeletonTheme>
  )
}

export const TextLoader: FC<any> = ({text = 'loading', height = 'auto', size = 50}) => {
  return (
    <div className='d-flex align-items-center justify-content-center w-100' style={{height}}>
      <div className='w-100 text-center'>
        <div className={`spinner-border spinner-border-sm text-primary w-${size}px h-${size}px`} />
        <div className='mt-5 fw-light fs-7 text-primary'>
          {text} <DotFlash />
        </div>
      </div>
    </div>
  )
}

export const Spinner: FC<any> = ({theme = 'primary', size = 50}) => {
  return (
    <div className={`d-flex flex-center h-${size}px`}>
      <span className='indicator-progress d-block text-center'>
        <span
          className={`spinner-border spinner-border-sm text-${theme} w-${size}px h-${size}px align-middle`}
        ></span>
      </span>
    </div>
  )
}
