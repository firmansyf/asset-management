import BillAlert from '@components/alert/bill'
import {hasPermission, KTSVG, toAbsoluteUrl} from '@helpers'
import {useSize} from '@hooks'
import {MenuComponent} from '@metronic/assets/ts/components'
import {useLayout} from '@metronic/layout/core'
import DashbardCategories from '@pages/dashboard/DashboardCategories'
import clsx from 'clsx'
import {useCallback, useEffect} from 'react'
import {Link, useLocation} from 'react-router-dom'

import {Header} from './Header'
import {DefaultTitle} from './page-title/DefaultTitle'
import {Topbar} from './Topbar'

export function HeaderWrapper({minimizeCustom, isTrial, setIsTrial}: any) {
  const {pathname} = useLocation()
  const isDashboard: any = pathname === '/dashboard'
  const isManageDashboard: any = pathname === '/manage-dashboard'
  const {config, classes, attributes} = useLayout()
  const {header, aside} = config
  const hasPermissionManageDashboard: any = hasPermission('manage-dashboard.manage')

  const updateHeight: any = useCallback(() => {
    const headerHeight: any = document.getElementById('kt_header')?.offsetHeight || 0
    const toolbarHeight: any = document.getElementById('kt_toolbar')?.offsetHeight || 0
    const height: any = headerHeight + toolbarHeight
    const toolbar: any = document.getElementById('kt_toolbar') || undefined
    if (toolbar) {
      toolbar.style.top = `${headerHeight}px`
    }
    const cardTableHeader: any = document.querySelector('.card-table-header')
    if (cardTableHeader) {
      cardTableHeader.style.top = `${height}px`
    }
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(updateHeight, [])

  useSize(() => {
    // Event when window resizing
    updateHeight()
  }, 300)

  useEffect(() => {
    MenuComponent.reinitialization()
  }, [pathname])

  return (
    <div
      id='kt_header'
      className={clsx(
        'header',
        classes.header.join(' '),
        'align-items-stretch',
        isTrial ? 'd-block h-90px' : 'd-flex h-auto',
        {shadow: isDashboard || isManageDashboard}
      )}
      {...attributes.headerMenu}
    >
      {window.location.hostname !== 'sepurabukom.assetdata.io' &&
        window.location.hostname !== 'petronas.assetdata.io' && (
          <BillAlert isTrial={isTrial} setIsTrial={setIsTrial} />
        )}
      <div
        className={clsx(
          classes.headerContainer.join(' '),
          'd-flex align-items-stretch justify-content-between',
          isTrial ? 'mt-2' : 'my-lg-4'
        )}
      >
        {/* begin::Aside mobile toggle */}
        {aside.display && (
          <div className='d-flex align-items-center d-lg-none ms-n3 me-1' title='Show aside menu'>
            <div
              className='btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px'
              id='kt_aside_mobile_toggle'
            >
              <KTSVG path='/media/icons/duotone/Text/Menu.svg' className='svg-icon-2x mt-1' />
            </div>
          </div>
        )}
        {/* end::Aside mobile toggle */}
        {/* begin::Logo */}
        {!aside.display && (
          <div className='d-flex align-items-center'>
            {/* flex-grow-1 flex-lg-grow-0 */}
            <Link to='/dashboard' className='d-lg-none'>
              <img
                alt='Logo'
                src={toAbsoluteUrl('/media/logos/logo-assetdata.png')}
                className='h-15px'
              />
            </Link>
          </div>
        )}
        {/* end::Logo */}

        {aside.display && (
          <div className='d-flex align-items-center me-auto'>
            <Link to='/' className='d-lg-none'>
              <img
                alt='Logo'
                src={toAbsoluteUrl('/media/logos/logo-assetdata.png')}
                className='h-15px'
              />
            </Link>
          </div>
        )}

        {/* begin::Wrapper */}
        <div className='d-flex align-items-stretch justify-content-between flex-lg-grow-1'>
          {/* begin::Navbar */}
          {(isDashboard || isManageDashboard) && (
            <div className='d-flex' id='kt_header_nav'>
              <DefaultTitle />
            </div>
          )}

          {header.left === 'menu' && (
            <div className='d-flex align-items-stretch' id='kt_header_nav'>
              <Header minimizeCustom={minimizeCustom} />
            </div>
          )}

          <div className='d-flex align-items-stretch flex-shrink-0'>
            {isDashboard && (
              <div className='d-flex align-items-center'>
                {hasPermissionManageDashboard && (
                  <Link
                    to='/manage-dashboard'
                    className='btn btn-sm btn-primary me-5 d-none d-lg-block'
                  >
                    Manage Dashboard
                  </Link>
                )}
                <div className='d-none d-lg-block'>
                  <DashbardCategories />
                </div>
              </div>
            )}
            <Topbar />
          </div>
        </div>
        {/* end::Wrapper */}
      </div>
    </div>
  )
}
