import {lazy} from 'react'

const AssetAddEdit: any = lazy(() => import('@pages/asset-management/add-edit'))
const Asset: any = lazy(() => import('@pages/asset-management/AssetManagement'))
const AssetCalendar: any = lazy(() => import('@pages/asset-management/AvailabilityCalendar'))
const AssetDetail: any = lazy(() => import('@pages/asset-management/detail-asset/DetailAsset'))
const AssetMove: any = lazy(() => import('@pages/asset-management/move-asset/MoveAsset'))
const AssetRequest: any = lazy(
  () => import('@pages/asset-management/request-add-asset/RequestAsset')
)
const AssetColumn: any = lazy(() => import('@pages/asset-management/SetupColumn'))
const MyAsset: any = lazy(() => import('@pages/my-assets/MyAssetsWrapper'))
const MyAssetColumn: any = lazy(() => import('@pages/my-assets/SetupColumns'))

const routes: any = [
  // MY ASSET
  {
    path: 'my-assets/*',
    children: [
      {index: true, permission: 'my-assets.view', element: MyAsset},
      {path: 'columns', permission: 'my-assets.view', element: MyAssetColumn},
    ],
  },
  // ASSET MANAGGEMENT
  {
    path: 'asset-management/*',
    children: [
      {path: 'all', permission: 'asset-management.view', element: Asset},
      {path: 'add', permission: 'asset-management.add', element: AssetAddEdit},
      {path: 'edit', permission: 'asset-management.edit', element: AssetAddEdit},
      {path: 'detail/:guid', permission: 'asset-management.view', element: AssetDetail},
      {path: 'move', permission: 'asset-management.view', element: AssetMove},
      {path: 'calendar', permission: 'asset-management.view', element: AssetCalendar},
      {path: 'request-add-asset', permission: 'asset-management.add', element: AssetRequest},
      {path: 'columns', permission: 'asset-management.view', element: AssetColumn},
    ],
  },
]

export default routes
