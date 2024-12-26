import {ErrorPage} from '@pages/errors'
import {RegisterPage} from '@pages/register/Register'
import {lazy, Suspense} from 'react'

const Logout: any = lazy(() => import('@auth').then(({Logout}: any) => ({default: Logout})))
const AccountAlreadyActivated: any = lazy(() =>
  import('@pages/auth/components/AccountAlreadyActivated').then(
    ({AccountAlreadyActivated}: any) => ({default: AccountAlreadyActivated})
  )
)
const AccountDeleted: any = lazy(() => import('@pages/auth/components/AccountDeleted'))
const ChangePassword: any = lazy(() =>
  import('@pages/auth/components/ChangePassword').then(({ChangePassword}: any) => ({
    default: ChangePassword,
  }))
)
const DeleteAccountConfirm: any = lazy(() =>
  import('@pages/auth/components/DeleteAccountConfirm').then(({DeleteAccountConfirm}: any) => ({
    default: DeleteAccountConfirm,
  }))
)
const ExpiredRegister: any = lazy(() =>
  import('@pages/auth/components/ExpiredRegister').then(({ExpiredRegister}: any) => ({
    default: ExpiredRegister,
  }))
)
const ExpiredTime: any = lazy(() =>
  import('@pages/auth/components/ExpiredTime').then(({ExpiredTime}: any) => ({
    default: ExpiredTime,
  }))
)
const ExpiredUser: any = lazy(() =>
  import('@pages/auth/components/ExpiredUser').then(({ExpiredUser}: any) => ({
    default: ExpiredUser,
  }))
)
const TwoFactorAuthentication: any = lazy(() =>
  import('@pages/auth/TwoFactorAuth').then(({TwoFactorAuthentication}: any) => ({
    default: TwoFactorAuthentication,
  }))
)
const ResetPassword: any = lazy(() =>
  import('@pages/reset-password/ResetPassword').then(({ResetPassword}: any) => ({
    default: ResetPassword,
  }))
)
const Shared: any = lazy(() => import('@pages/share').then(({Shared}: any) => ({default: Shared})))

const Error403: any = lazy(() =>
  import('@pages/errors').then(({Error403}: any) => ({default: Error403}))
)
const Error404: any = lazy(() =>
  import('@pages/errors').then(({Error404}: any) => ({default: Error404}))
)
const Error500: any = lazy(() =>
  import('@pages/errors').then(({Error500}: any) => ({default: Error500}))
)
const PasswordExpiry: any = lazy(() =>
  import('@pages/auth/components/PasswordExpiry').then(({PasswordExpiry}: any) => ({
    default: PasswordExpiry,
  }))
)

const fullUri = window.location.host
const subdomain = fullUri?.split('.')?.[0]
const isRegisterPage: any = ['secure', 'register', 'registration'].includes(subdomain)

const SuspenseEl: any = ({el}: any) => {
  const Element: any = el
  return (
    <Suspense fallback=''>
      <Element />
    </Suspense>
  )
}

export const globalRoutes: any = isRegisterPage
  ? [{path: '*', element: <RegisterPage />}]
  : [
      {
        path: 'error/*',
        element: (
          <Suspense fallback=''>
            <ErrorPage />
          </Suspense>
        ),
        children: [
          {path: '403', element: <Error403 />},
          {path: '404', element: <Error404 />},
          {path: '500', element: <Error500 />},
          {path: '*', element: <Error404 />},
        ],
      },
      {path: 'auth/password-expiry', element: <SuspenseEl el={PasswordExpiry} />},
      {path: 'auth/change-password', element: <SuspenseEl el={ChangePassword} />},
      {path: 'auth/2fa', element: <SuspenseEl el={TwoFactorAuthentication} />},
      {path: 'logout', element: <SuspenseEl el={Logout} />},
      {path: 'register', element: <SuspenseEl el={RegisterPage} />},
      {path: 'expired-register', element: <SuspenseEl el={ExpiredRegister} />},
      {path: 'expired-user', element: <SuspenseEl el={ExpiredUser} />},
      {path: 'set-password', element: <SuspenseEl el={ResetPassword} />},
      {path: 'delete-confirm', element: <SuspenseEl el={DeleteAccountConfirm} />},
      {path: 'deleted-confirm', element: <SuspenseEl el={AccountDeleted} />},
      {path: 'already-activated', element: <SuspenseEl el={AccountAlreadyActivated} />},
      {path: 'expired-time', element: <SuspenseEl el={ExpiredTime} />},
      {path: 'shared/:encode', element: <SuspenseEl el={Shared} />},
    ]
