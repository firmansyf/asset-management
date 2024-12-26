import {useLayout} from '@metronic/layout/core'
import clsx from 'clsx'
import {FC, useEffect, useState} from 'react'
import {useLocation} from 'react-router-dom'

import {DefaultTitle} from '../header/page-title/DefaultTitle'

const Toolbar: FC<any> = ({isTrial}) => {
  const {pathname}: any = useLocation()
  const isDashboard: any = pathname?.match('dashboard')

  const {classes} = useLayout()
  const [headerHeight, setHeaderHeight] = useState<any>(0)
  const [toolbarHeight, setToolbarHeight] = useState<any>(0)

  useEffect(() => {
    setHeaderHeight(document.getElementById('kt_header')?.offsetHeight)
    setToolbarHeight(document.getElementById('kt_toolbar')?.offsetHeight)
  }, [isTrial])

  const table_header: any = document.querySelector('#kt_content')
  if (table_header) {
    table_header.style.paddingTop = toolbarHeight + 'px'
  }

  return (
    <div
      className={`toolbar ${isDashboard ? 'd-lg-none' : ''}`}
      id='kt_toolbar'
      style={{top: headerHeight}}
    >
      <div
        id='kt_toolbar_container'
        className={clsx(classes.toolbarContainer.join(' '), 'd-flex flex-stack')}
      >
        <DefaultTitle />
      </div>
    </div>
  )
}

export {Toolbar}
