import {lazy} from 'react'

const SentryPage: any = lazy(() => import('@pages/_testPage/sentry'))

const routes: any = [
  {
    path: 'test/*',
    children: [{path: 'sentry', allUser: true, element: SentryPage}],
  },
]

export default routes
