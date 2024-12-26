import {Firebase} from '@api/firebase'
import TimeLog from '@components/alert/timeLog'
import TimeLogWO from '@components/alert/timeLogWO'
import {ErrorBoundaryPage} from '@components/pages'
// import {ToastNotif} from '@components/toast-message/notif'
import UserInactiveTimer from '@components/UserIdleTimer/inactive'
import UserIdleTimer from '@components/UserIdleTimer/index'
import {getJWTPayload} from '@helpers'
import {logout as dispatchLogout} from '@redux'
import cx from 'classnames'
import {pick} from 'lodash'
import moment from 'moment'
import {FC, useEffect, useState} from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {shallowEqual, useSelector} from 'react-redux'
import {Outlet, useLocation} from 'react-router-dom'

import {AsideDefault} from './components/aside/AsideDefault'
import {Content} from './components/Content'
import {Footer} from './components/Footer'
import {HeaderWrapper} from './components/header/HeaderWrapper'
import {ScrollTop} from './components/ScrollTop'
import {Toolbar} from './components/toolbar/Toolbar'
import {PageDataProvider} from './core'
import {MasterInit} from './MasterInit'

const MasterLayout: FC<any> = () => {
  const {currentUser: user, token}: any = useSelector(
    ({currentUser, token}: any) => ({currentUser, token}),
    shallowEqual
  )
  const {is_change_password}: any = user || {}
  const location: any = useLocation()
  const {pathname} = location
  // const fullUri = window.location.host
  // const subdomain = fullUri?.split('.')?.[0]
  const [minimizeCustom, setMinimizeCustom] = useState<any>(false)
  const [isWizard, setIsWizard] = useState<any>(false)
  const [isTrial, setIsTrial] = useState<any>(false)
  useEffect(() => {
    if (window?.location?.origin?.includes('assetdata.io')) {
      import('./SentryInit').then(({sentry, config}: any) => {
        if (process?.env?.NODE_ENV !== 'development') {
          const sentryUser: any = pick(user, [
            'guid',
            'first_name',
            'last_name',
            'email',
            'role_name',
            'user_status',
          ])
          sentryUser.url = window.location.href
          sentryUser.last_error = new Date().toString()
          sentry.init(config)
          sentry.setUser(sentryUser)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (pathname === '/setup/wizard') {
      setMinimizeCustom(true)
      setIsWizard(true)
    } else {
      setMinimizeCustom(false)
      setIsWizard(false)
    }
  }, [pathname])

  // window.onfocus = function () {
  //   checkTenant(subdomain).then((res: any) => {
  //     if (!res?.data?.exists) {
  //       logout()
  //       dispatchLogout()
  //     }
  //   })
  // }

  useEffect(() => {
    const {exp}: any = getJWTPayload(token) || {}
    const tokenIsExpired: any = moment.unix(exp).isBefore(moment())
    if (is_change_password || tokenIsExpired) {
      dispatchLogout()
    }
  })
  return (
    <ErrorBoundary
      fallbackRender={({error, resetErrorBoundary}: any) => (
        <ErrorBoundaryPage error={error} reset={resetErrorBoundary} />
      )}
      onError={(err: any) => err}
    >
      <PageDataProvider>
        <UserIdleTimer />
        <UserInactiveTimer />
        <TimeLogWO />
        <TimeLog />
        <Firebase trigger='deleted_at' onChange={(payload: any) => payload} />
        {/* <Firebase
          trigger='login'
          onChange={async (payload: any) => {
            const {ip, os, browser, address}: any = await (payload || {})
            const {ip: thisIP, os: thisOS, browser: thisBrowser}: any = await getClientInfo()
            if (ip !== thisIP || os !== thisOS || browser !== thisBrowser) {
              ToastNotif(
                {
                  message: (
                    <>
                      <div className='d-flex align-items-center mb-3'>
                        <div
                          className='w-35px h-35px me-4 radius-50 border border-gray-400'
                          style={{
                            background: `#eee url('/images/no-image-profile-blue.png') center / cover no-repeat`,
                          }}
                        />
                        <div className='fw-bolder fs-7' style={{lineHeight: 1.2}}>
                          Other user just login to your account
                        </div>
                      </div>
                      <table className='table g-0 m-0'>
                        <tbody>
                          <tr>
                            <th className='pe-3 text-nowrap'>From</th>
                            <td className='pe-2'>:</td>
                            <td className='fw-bolder fs-8'>{address}</td>
                          </tr>
                          <tr>
                            <th className='pe-3 text-nowrap'>IP</th>
                            <td className='pe-2'>:</td>
                            <td className='fw-bolder fs-8 text-primary'>{ip}</td>
                          </tr>
                          <tr>
                            <th className='pe-3 text-nowrap'>OS</th>
                            <td className='pe-2'>:</td>
                            <td className='fw-bolder fs-8'>{os}</td>
                          </tr>
                          <tr>
                            <th className='pe-3 text-nowrap'>Browser</th>
                            <td className='pe-2'>:</td>
                            <td className='fw-bolder fs-8'>{browser}</td>
                          </tr>
                        </tbody>
                      </table>
                    </>
                  ),
                },
                {autoClose: 50000}
              )
            }
          }}
        /> */}
        <div className='d-flex flex-column flex-root'>
          <div className='page d-flex flex-row flex-column-fluid'>
            {!isWizard && (
              <AsideDefault minimizeCustom={minimizeCustom} setMinimizeCustom={setMinimizeCustom} />
            )}
            <div
              className={cx('wrapper d-flex flex-column flex-row-fluid', {'pt-0': isWizard})}
              id='kt_wrapper'
            >
              {!isWizard && (
                <HeaderWrapper
                  minimizeCustom={minimizeCustom}
                  isTrial={isTrial}
                  setIsTrial={setIsTrial}
                />
              )}
              <div id='kt_content' className='content d-flex flex-column flex-column-fluid pt-10'>
                {!isWizard && <Toolbar isTrial={isTrial} />}
                <div className='post d-flex flex-column-fluid' id='kt_post'>
                  <Content>
                    <Outlet />
                  </Content>
                </div>
              </div>
              <Footer />
            </div>
          </div>
        </div>
        <MasterInit />
        <ScrollTop />
      </PageDataProvider>
    </ErrorBoundary>
  )
}

export {MasterLayout}
