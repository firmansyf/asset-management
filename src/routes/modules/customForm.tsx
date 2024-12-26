import {lazy} from 'react'

const Asset: any = lazy(() => import('@pages/setup/custom-form/assets'))
const Inventory: any = lazy(() => import('@pages/setup/custom-form/inventory'))

const routes: any = [
  {
    path: 'setup/custom-form/*',
    children: [
      {path: 'assets', permission: 'asset-management.customize_form', element: Asset},
      {path: 'inventory', permission: 'inventory.view', element: Inventory},
    ],
  },
]

export default routes
