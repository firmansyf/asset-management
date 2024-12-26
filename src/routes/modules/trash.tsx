import {lazy} from 'react'

const Trash: any = lazy(() => import('@pages/trash/TrashPage'))

const routes: any = [
  {
    path: 'trash/*',
    children: [{index: true, permission: 'trash.view', element: Trash}],
  },
]

export default routes
