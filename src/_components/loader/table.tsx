import 'react-loading-skeleton/dist/skeleton.css'
import './style.scss'

import {FC} from 'react'
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'

export const DatatableLoader: FC<any> = ({count = 3, height = 25}) => {
  return (
    <SkeletonTheme baseColor='#f5f5f5' highlightColor='#fafafa'>
      <div className='row'>
        <div className='col-auto'>
          <Skeleton className='my-3' width={height} height={height} count={count} circle />
        </div>
        <div className='col-2'>
          <Skeleton className='my-3' height={height} count={count} />
        </div>
        <div className='col'>
          <Skeleton className='my-3' height={height} count={count} />
        </div>
        <div className='col-1'>
          <Skeleton className='my-3' height={height} count={count} />
        </div>
      </div>
    </SkeletonTheme>
  )
}

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>
interface DatatableLoaderProps {
  height?: number
  size?: IntRange<1, 100>
}

export const DatatableCircleLoader: FC<DatatableLoaderProps> = ({height = 250, size = 100}) => {
  return (
    <div
      className='d-flex flex-center position-relative'
      style={{height: `${height}px`, transform: `scale(${size / 50})`}}
    >
      <span className='indicator-progress d-block text-center'>
        <span className='spinner-border spinner-border-md w-100px h-100px align-middle text-primary d-flex flex-center'></span>
      </span>
      <div className='text-primary fs-8 fw-bolder position-absolute'>Loading...</div>
    </div>
  )
}
