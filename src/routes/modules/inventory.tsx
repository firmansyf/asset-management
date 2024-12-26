import {lazy} from 'react'

const InventoryAddEdit: any = lazy(() => import('@pages/inventory/add-edit'))
const AddStockDetail: any = lazy(() => import('@pages/inventory/detail-inventory/AddStockDetail'))
const InventoryDetail: any = lazy(() => import('@pages/inventory/detail-inventory/DetailInventory'))
const Inventory: any = lazy(() => import('@pages/inventory/Inventory'))
const InventoryColumn: any = lazy(() => import('@pages/inventory/SetupInventoryColumn'))

const routes: any = [
  {
    path: 'inventory/*',
    children: [
      {index: true, permission: 'inventory.view', element: Inventory},
      {path: 'columns', allUser: true, element: InventoryColumn},
      {path: 'add', permission: 'inventory.add', element: InventoryAddEdit},
      {path: 'add-clone', permission: 'inventory.add', element: InventoryAddEdit},
      {path: 'detail/:guid', permission: 'inventory.view', element: InventoryDetail},
      {path: 'detail/:guid/add-stock-detail', permission: 'inventory.add', element: AddStockDetail},
    ],
  },
]

export default routes
