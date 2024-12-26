import {useSize} from '@hooks'
import {FC, useState} from 'react'
export const Toolbar: FC<any> = ({children, dir, className = ''}) => {
  const [top, setTop] = useState<any>(0)
  const [height, setHeight] = useState<any>(0)
  const [width, setWidth] = useState<any>(0)
  useSize(() => {
    const toolBarEl: any = document.getElementById('kt_toolbar')
    const toolBarContainer: any = document.getElementById('kt_toolbar_container')
    let padding: any = 0
    if (toolBarContainer) {
      padding = parseInt(
        window?.getComputedStyle(toolBarContainer, null)?.getPropertyValue('padding-right')
      )
    }
    setHeight(toolBarEl?.clientHeight || 0)
    setTop(toolBarEl?.style?.top || 0)
    setWidth(toolBarContainer?.clientWidth - padding * 2)
  }, 2000)
  return (
    <div className={`position-fixed ${className}`} style={{zIndex: 99, top: top, width}}>
      <div
        className={`d-flex align-items-center justify-content-${dir === 'right' ? 'end' : 'start'}`}
        style={{height}}
      >
        {children}
      </div>
    </div>
  )
}
