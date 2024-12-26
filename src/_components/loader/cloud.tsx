import './style.scss'

import {Properties as CSSProps} from 'csstype'
import {FC} from 'react'

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>
interface PageLoaderProps {
  height?: number | string
  size?: IntRange<1, 100>
  style?: CSSProps
}

export const PageLoader: FC<PageLoaderProps> = ({
  height = '50vh',
  size = 100,
  style = {opacity: 0.75},
}: any) => {
  const topScale: any = Number(size / 1.333)
  const textMarginTop: any = -Math.abs(parseInt(topScale))
  return (
    <div className='d-flex flex-center w-100' style={{...style, height}}>
      <div className='text-center'>
        <div
          className='cloud-page-loader'
          style={{transform: `scale(${size / 300})`, marginTop: '-75px'}}
        >
          <svg viewBox='0 -87 463.83425 463' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='m375.835938 112.957031c-5.851563 0-11.691407.582031-17.425782 1.742188-4.324218-21.582031-18.304687-39.992188-37.933594-49.957031-19.625-9.964844-42.738281-10.382813-62.714843-1.136719-18.078125-49.796875-73.101563-75.507813-122.898438-57.429688s-75.507812 73.105469-57.429687 122.898438c-43.621094 1.378906-78.078125 37.484375-77.4257815 81.121093.6562495 43.640626 36.1835935 78.691407 79.8281255 78.761719h296c48.597656 0 88-39.398437 88-88 0-48.601562-39.402344-88-88-88zm0 0'
              fill='#060990'
            />
          </svg>
          <svg viewBox='0 -87 463.83425 463' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='m375.835938 112.957031c-5.851563 0-11.691407.582031-17.425782 1.742188-4.324218-21.582031-18.304687-39.992188-37.933594-49.957031-19.625-9.964844-42.738281-10.382813-62.714843-1.136719-18.078125-49.796875-73.101563-75.507813-122.898438-57.429688s-75.507812 73.105469-57.429687 122.898438c-43.621094 1.378906-78.078125 37.484375-77.4257815 81.121093.6562495 43.640626 36.1835935 78.691407 79.8281255 78.761719h296c48.597656 0 88-39.398437 88-88 0-48.601562-39.402344-88-88-88zm0 0'
              fill='#4c4eb5'
            />
          </svg>
          <svg viewBox='0 -87 463.83425 463' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='m375.835938 112.957031c-5.851563 0-11.691407.582031-17.425782 1.742188-4.324218-21.582031-18.304687-39.992188-37.933594-49.957031-19.625-9.964844-42.738281-10.382813-62.714843-1.136719-18.078125-49.796875-73.101563-75.507813-122.898438-57.429688s-75.507812 73.105469-57.429687 122.898438c-43.621094 1.378906-78.078125 37.484375-77.4257815 81.121093.6562495 43.640626 36.1835935 78.691407 79.8281255 78.761719h296c48.597656 0 88-39.398437 88-88 0-48.601562-39.402344-88-88-88zm0 0'
              fill='#d7d8f4'
            />
          </svg>
        </div>
        <div
          className='d-flex flex-center fw-bolder text-primary'
          style={{marginTop: textMarginTop}}
        >
          Loading
          <div
            className='custom-loader-11'
            style={{transform: 'scale(0.35)', marginTop: '5px', marginLeft: '-10px'}}
          />
        </div>
      </div>
    </div>
  )
}
