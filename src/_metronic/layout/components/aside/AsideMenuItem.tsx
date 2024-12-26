import {checkIsActive, KTSVG} from '@helpers'
import {useLayout} from '@metronic/layout/core'
import clsx from 'clsx'
import {FC, memo} from 'react'
import {useLocation} from 'react-router'
import {Link} from 'react-router-dom'

type Props = {
  to: string
  title: any
  icon?: string
  fontIcon?: string
  hasBullet?: boolean
  truncate?: boolean
  className?: string | undefined
  children?: any
}

let AsideMenuItem: FC<Props> = ({
  children,
  to,
  title,
  icon,
  fontIcon,
  hasBullet = false,
  truncate = false,
  className = '',
}) => {
  const {pathname, search} = useLocation()
  const isActive = checkIsActive(pathname + search, to)
  const {config} = useLayout()
  const {aside} = config
  const {theme} = aside
  const fontColor = theme === 'light' ? (isActive ? 'text-primary' : 'text-dark') : ''

  return (
    <div className={clsx('menu-item', className)}>
      <Link
        className={clsx('menu-link without-sub', {active: isActive})}
        to={to}
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
        <span className={`menu-title ${truncate ? 'd-inline-block text-truncate' : ''}`}>
          {title}
        </span>
      </Link>
      {children}
    </div>
  )
}

AsideMenuItem = memo(
  AsideMenuItem,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {AsideMenuItem}
