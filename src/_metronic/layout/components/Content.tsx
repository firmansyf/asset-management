import {DrawerComponent} from '@metronic/assets/ts/components'
import {useLayout} from '@metronic/layout/core'
import clsx from 'clsx'
import {FC, useEffect} from 'react'
import {useLocation} from 'react-router'

const Content: FC<any> = ({children}) => {
  const {classes} = useLayout()
  const location = useLocation()
  useEffect(() => {
    DrawerComponent.hideAll()
  }, [location])

  return (
    <div id='kt_content_container' className={clsx(classes.contentContainer.join(' '))}>
      {children}
    </div>
  )
}

export {Content}
