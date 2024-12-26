import {KTSVG, toAbsoluteUrl} from '@helpers'
import {useLayout} from '@metronic/layout/core'
import clsx from 'clsx'
import {FC, memo, useState} from 'react'
import {Link} from 'react-router-dom'

import {AsideMenu} from './AsideMenu'

let AsideDefault: FC<any> = ({minimizeCustom, setMinimizeCustom}) => {
  const [min, isMin] = useState<any>(false)
  const [hover, setHover] = useState<any>(false)
  const {config, classes} = useLayout()
  const {aside} = config
  return (
    <div
      id='kt_aside'
      className={clsx('aside', classes.aside.join(' '), min && hover && 'aside-hoverable')}
      data-kt-drawer='true'
      data-kt-drawer-name='aside'
      data-kt-drawer-activate='{default: true, lg: false}'
      data-kt-drawer-overlay='true'
      data-kt-drawer-width="{default:'200px', '300px': '250px'}"
      data-kt-drawer-direction='start'
      data-kt-drawer-toggle='#kt_aside_mobile_toggle'
    >
      {/* begin::Brand */}
      <div
        className='aside-logo flex-column-auto px-0 position-relative border-bottom border-secondary'
        id='kt_aside_logo'
        // style={{background: `#fff url(${toAbsoluteUrl(`/media/stock/600x400/img-45.jpg`)}) center / cover no-repeat`}}
      >
        {/* begin::Logo */}
        {aside.theme === 'dark' && (
          <Link to='/'>
            <img
              alt='Logo'
              className='h-15px logo'
              src={toAbsoluteUrl('/media/logos/logo-assetdata.png')}
            />
          </Link>
        )}
        {aside.theme === 'light' && (
          <Link to='/'>
            <img
              alt='Logo'
              className='w-100 logo mx-3'
              // style={{filter: 'brightness(0) invert(1)'}}
              src={toAbsoluteUrl('/media/logos/logo-assetdata.png')}
            />
          </Link>
        )}
        {/* end::Logo */}

        {/* begin::Aside toggler */}
        {aside.minimize && (
          <div
            id='kt_aside_toggle'
            className='btn btn-sm btn-flex flex-center btn-primary w-auto mx-3 aside-toggle h-35px w-35px'
            data-kt-toggle='true'
            data-kt-toggle-state='active'
            data-kt-toggle-target='body'
            data-kt-toggle-name='aside-minimize'
            style={{borderRadius: '100px', zIndex: 1}}
            onClick={() => {
              isMin(!min)
              setMinimizeCustom(!minimizeCustom)
            }}
          >
            <KTSVG
              path={'/media/icons/duotone/Navigation/Angle-double-left.svg'}
              className={'svg-icon-1 m-0 rotate-180'}
            />
          </div>
        )}
        {/* end::Aside toggler */}
      </div>
      {/* end::Brand */}

      {/* begin::Aside menu */}
      <div
        className='aside-menu flex-column-fluid'
        onMouseEnter={() => {
          setHover(true)
        }}
        onMouseLeave={() => {
          setHover(false)
        }}
        style={{
          // background: `#fff url(${toAbsoluteUrl(`/media/svg/shapes/abstract-5.svg`)}) center / cover no-repeat`
          background: '#fff',
        }}
      >
        <AsideMenu asideMenuCSSClasses={classes.asideMenu} />
      </div>
      {/* end::Aside menu */}

      {/* begin::Footer */}
      {/* <div className='aside-footer flex-column-auto pt-5 pb-7 px-5' id='kt_aside_footer'>
        <a
          target='_blank'
          className='btn btn-custom btn-primary w-100'
          href={process.env.REACT_APP_PREVIEW_DOCS_URL}
          data-bs-toggle='tooltip'
          data-bs-trigger='hover'
          data-bs-dismiss-='click'
          title='Check out the complete documentation with over 100 components'
        >
          <span className='btn-label'>Docs & Components</span>
          <span className='btn-icon svg-icon-2'>
            <KTSVG path='/media/icons/duotone/General/Clipboard.svg' />
          </span>
        </a>
      </div> */}
      {/* end::Footer */}
    </div>
  )
}

AsideDefault = memo(
  AsideDefault,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {AsideDefault}
