import {lazy} from 'react'

const Agents: any = lazy(() => import('@pages/computer-management/Agents'))
const Computers: any = lazy(() => import('@pages/computer-management/Computers'))

const routes: any = [
  {
    path: 'computer-management/*',
    children: [
      {path: 'computer', element: Computers},
      {path: 'agent', element: Agents},
    ],
  },
]

export default routes
