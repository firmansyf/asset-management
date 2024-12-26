import {AuthPage} from '@pages/auth/AuthPage'
import {lazy, Suspense} from 'react'
import {Navigate} from 'react-router-dom'

const Login: any = lazy(() =>
  import('@pages/auth/components/Login').then(({Login}: any) => ({default: Login}))
)
const ForgotPassword: any = lazy(() =>
  import('@pages/auth/components/ForgotPassword').then(({ForgotPassword}: any) => ({
    default: ForgotPassword,
  }))
)

export const publicRoutes: any = (path: any) => [
  {
    path: 'auth/*',
    element: (
      <Suspense fallback=''>
        <AuthPage />
      </Suspense>
    ),
    children: [
      {path: 'login', element: <Login />},
      {path: 'forgot-password', element: <ForgotPassword />},
    ],
  },
  {
    path: '*',
    element: (
      <Navigate
        to={{
          pathname: '/auth/login',
          search: `request=${btoa(path)}`,
        }}
      />
    ),
  },
]
