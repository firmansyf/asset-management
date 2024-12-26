import {lazy} from 'react'

const WarantyColumn: any = lazy(() => import('@pages/warranty/SetupWarrantyColumn'))
const Waranty: any = lazy(() => import('@pages/warranty/Warranty'))

const routes: any = [
  {
    path: 'warranty/*',
    children: [
      {index: true, permission: 'warranty.view', element: Waranty},
      {path: 'columns', permission: 'setup-column.setup_column_warranty', element: WarantyColumn},
    ],
  },
]

export default routes
