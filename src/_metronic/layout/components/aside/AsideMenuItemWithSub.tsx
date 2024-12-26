import {checkIsActive, KTSVG} from '@helpers'
import {useLayout} from '@metronic/layout/core'
import clsx from 'clsx'
import {FC, useEffect, useState} from 'react'
import {useLocation} from 'react-router'

type Props = {
  to: string
  title: string
  icon?: string
  fontIcon?: string
  hasBullet?: boolean
  className?: string | undefined
  children?: any
}

const AsideMenuItemWithSub: FC<Props> = ({
  children,
  to,
  title,
  icon,
  fontIcon,
  hasBullet,
  className = '',
}) => {
  const {pathname} = useLocation()
  const isActive = checkIsActive(pathname, to)
  const {config} = useLayout()
  const {aside} = config
  const {theme} = aside
  const fontColor = theme === 'light' ? (isActive ? 'text-primary' : 'text-dark') : ''

  const [active, setActive] = useState<any>(false)

  useEffect(() => {
    setTimeout(() => {
      setActive(isActive)
    }, 100)
  }, [isActive])

  return (
    <div
      className={clsx('menu-item', {'here show': active}, 'menu-accordion')}
      data-kt-menu-trigger='click'
    >
      <span
        className={clsx('menu-link', className)}
        style={{paddingTop: '.45rem', paddingBottom: '.45rem'}}
      >
        {hasBullet && (
          <span className='menu-bullet'>
            <i className='las la-dot-circle' />
          </span>
        )}
        {icon && aside.menuIcon === 'svg' && (
          <span className='menu-icon'>
            <KTSVG path={icon} className='svg-icon-2' />
          </span>
        )}
        {fontIcon && aside.menuIcon === 'font' && (
          <i className={clsx('las fs-3 me-3', 'la-' + fontIcon, fontColor)}></i>
        )}
        <span className='menu-title'>{title}</span>
        <span className='menu-arrow'></span>
      </span>
      <div
        className={clsx('menu-sub menu-sub-accordion', {'menu-active-bg': active})}
        style={{display: active ? 'flex' : 'none'}}
      >
        {children}
      </div>
    </div>
  )
}

export {AsideMenuItemWithSub}
