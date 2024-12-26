import {useSize} from '@hooks'
import {FC, useEffect, useState} from 'react'

export const elementProperty: any = () => {
  const headerEl: any = document.getElementById('kt_header')
  const toolBarEl: any = document.getElementById('kt_toolbar')
  const headerHeight: any = parseInt(
    window?.getComputedStyle(headerEl, null)?.getPropertyValue('height')
  )
  const toolBarHeight: any = parseInt(
    window?.getComputedStyle(toolBarEl, null)?.getPropertyValue('height')
  )
  const toolBarIsHidden: any = window
    ?.getComputedStyle(toolBarEl, null)
    ?.getPropertyValue('display')
    ?.match('none')

  return {headerHeight, toolBarHeight, toolBarIsHidden}
}

export const Sticky: FC<any> = ({children}) => {
  const {headerHeight, toolBarHeight, toolBarIsHidden}: any = elementProperty() || {}
  const [top, setTop] = useState<any>(0)

  const wrapper: any = document.getElementById('kt_wrapper')
  const getHeight: any = headerHeight + (!toolBarIsHidden ? toolBarHeight || 0 : 0)

  useSize(() => {
    setTop(getHeight)
    wrapper.style.paddingTop = getHeight + 'px'
  }, 100)

  useEffect(() => {
    return () => {
      const wrapper: any = document.getElementById('kt_wrapper')
      wrapper.style.paddingTop = headerHeight + (toolBarHeight || 0) + 'px'
    }
  }, [headerHeight, toolBarHeight])

  return (
    <div className='position-sticky w-100' style={{zIndex: 99, top}}>
      {children}
    </div>
  )
}
