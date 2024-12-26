import {lazy} from 'react'

const PO: any = lazy(() => import('@pages/purchase-order'))
const POAddEdit: any = lazy(() => import('@pages/purchase-order/AddEdit'))
const PODetail: any = lazy(() => import('@pages/purchase-order/detail/DetailPO'))
const POColumn: any = lazy(() => import('@pages/purchase-order/SetupColumn'))

const routes: any = [
  {
    path: 'purchase-order/*',
    children: [
      {index: true, permission: 'purchase-order.view', element: PO},
      {path: 'detail/:guid', permission: 'purchase-order.view', element: PODetail},
      {path: 'columns', permission: 'purchase-order.setup-column', element: POColumn},
      {path: 'add', permission: 'purchase-order.add', element: POAddEdit},
      {path: 'edit/:guid', permission: 'purchase-order.edit', element: POAddEdit},
    ],
  },
]

export default routes
