import {
  DrawerComponent,
  MenuComponent,
  ScrollComponent,
  ToggleComponent,
} from '@metronic/assets/ts/components'
import clsx from 'clsx'
import React, {memo, useEffect, useRef} from 'react'
import {useLocation} from 'react-router'

import {AsideMenuMain} from './AsideMenuMain'

type Props = {
  asideMenuCSSClasses: string[]
}

let AsideMenu: React.FC<Props> = ({asideMenuCSSClasses}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const {pathname} = useLocation()
  useEffect(() => {
    setTimeout(() => {
      MenuComponent.reinitialization()
      DrawerComponent.reinitialization()
      ToggleComponent.reinitialization()
      ScrollComponent.reinitialization()
      // if (scrollRef.current) {
      //   scrollRef.current.scrollTop = 0
      // }
    }, 50)
  }, [pathname])
  return (
    <div
      id='kt_aside_menu_wrapper'
      ref={scrollRef}
      className='hover-scroll-overlay-y'
      data-kt-scroll='true'
      data-kt-scroll-activate='{default: false, lg: true}'
      data-kt-scroll-height='auto'
      data-kt-scroll-dependencies='#kt_aside_logo, #kt_aside_footer'
      data-kt-scroll-wrappers='#kt_aside_menu'
      data-kt-scroll-offset='0'
    >
      <div
        id='#kt_aside_menu'
        data-kt-menu='true'
        className={clsx(
          'menu menu-column menu-title-gray-800 menu-state-title-primary menu-state-icon-primary menu-state-bullet-primary menu-arrow-gray-500',
          asideMenuCSSClasses.join(' ')
        )}
      >
        <AsideMenuMain />
      </div>
    </div>
  )
}

AsideMenu = memo(AsideMenu, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export {AsideMenu}
