import {lazy} from 'react'

const Import: any = lazy(() => import('@pages/import/Import'))
const Export: any = lazy(() => import('@pages/tools/export/Export'))

const routes: any = [
  {
    path: 'tools/*',
    children: [
      {path: 'import', permission: 'import-export.export', element: Import},
      {path: 'export', permission: 'import-export.export', element: Export},
    ],
  },
]

export default routes
