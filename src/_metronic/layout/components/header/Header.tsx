import {toAbsoluteUrl} from '@helpers'
import {FC} from 'react'
import {Link} from 'react-router-dom'
// import {MenuInner} from './MenuInner'

const Header: FC<any> = ({minimizeCustom}) => {
  return (
    <div
      id='kt_aside'
      className='align-items-stretch' // header-menu
      data-kt-drawer='true'
      // data-kt-drawer-name='header-menu'
      data-kt-drawer-name='aside'
      data-kt-drawer-activate='{default: true, lg: false}'
      data-kt-drawer-overlay='true' // true
      // data-kt-drawer="true"
      data-kt-drawer-width="{default:'200px', '300px': '250px'}"
      data-kt-drawer-direction='end'
      data-kt-drawer-toggle='#kt_header_menu_mobile_toggle'
      data-kt-swapper='false'
      data-kt-swapper-mode='prepend'
      // data-kt-swapper-mode='prepend'
      data-kt-swapper-parent="{default: '#kt_body', lg: '#kt_header_nav'}"
      style={{zIndex: 100}}
    >
      <div
        className='menu menu-lg-rounded menu-column menu-lg-row menu-state-bg menu-title-gray-700 menu-state-title-primary menu-state-icon-primary menu-state-bullet-primary menu-arrow-gray-400 fw-bold my-5 my-lg-0 align-items-stretch'
        id='#kt_header_menu'
        data-kt-menu='true'
      >
        {minimizeCustom && (
          <div
            className='d-flex align-items-center flex-grow-1 flex-lg-grow-0'
            style={{position: 'relative', left: '-25px'}}
          >
            <Link to='/'>
              <img
                alt='Logo'
                src={toAbsoluteUrl('/media/logos/logo-assetdata.png')}
                className='h-35px'
              />
            </Link>
          </div>
        )}
        {/* <MenuInner /> */}
      </div>
    </div>
  )
}

export {Header}
