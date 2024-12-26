import NoTenant from '@pages/NotFound/TenantNotFound'
import {useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'

import {App} from '../App'
import {globalRoutes} from './GlobalRoutes'
import {PrivateRoutes} from './PrivateRoutes'
import {publicRoutes} from './PublicRoutes'

const BrowserRouter: any = () => {
  const _token: any = useSelector(({token}: any) => token, shallowEqual)
  const {pathname, search, hash, host} = window.location
  const subdomain = host?.split('.')?.[0]
  const [isExistTenan, setIsExistTenan] = useState<boolean>(true)

  const authPersister: any = JSON.parse(localStorage.getItem('persist:auth') || '{}')
  const token: any = authPersister?.token?.replace(/"/g, '')

  // useEffect(() => {
  //   // enableSplashScreen()
  //   if (subdomain !== 'secure') {
  //     checkTenant(subdomain)
  //       .then((res: any) => {
  //         setIsExistTenan(res?.data?.exists)
  //         disableSplashScreen()
  //       })
  //       .catch(() => setIsExistTenan(false))
  //       .finally(() => disableSplashScreen())
  //   } else {
  //     setIsExistTenan(false)
  //     disableSplashScreen()
  //   }
  // }, [subdomain])

  const protectedRoutes: any =
    token && isExistTenan
      ? PrivateRoutes
      : !isExistTenan && !['/register', '/registration'].includes(pathname)
      ? [{path: '*', Component: NoTenant}]
      : publicRoutes(`${pathname}${search || ''}${hash || ''}`)

  const routes: any = [
    {
      Component: App,
      children: [...globalRoutes, ...protectedRoutes],
    },
  ]

  const router: any = createBrowserRouter(routes)
  return <RouterProvider router={router} />
}

export {BrowserRouter}
