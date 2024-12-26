import {lazy} from 'react'

const Profile: any = lazy(() => import('@pages/profile/ProfilePage'))
const Session: any = lazy(() => import('@pages/profile/ProfileUserSession'))

const routes: any = [
  {
    path: 'profile/*',
    children: [
      {index: true, permission: 'profile.view', allUser: true, element: Profile},
      {path: 'sessions', permission: 'profile.view', allUser: true, element: Session},
    ],
  },
]

export default routes
