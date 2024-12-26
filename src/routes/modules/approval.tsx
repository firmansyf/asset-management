import {lazy} from 'react'

const ApprovalHistory: any = lazy(() => import('@pages/approval/History'))
const ApprovalInsurance: any = lazy(() => import('@pages/approval/Insurance'))
const ApprovalMaintenance: any = lazy(() => import('@pages/approval/Maintenance'))
const NewApprovalMyAssets: any = lazy(() =>
  import('@pages/approval/MyAssets').then(({NewApprovalMyAssets}: any) => ({
    default: NewApprovalMyAssets,
  }))
)
const UpdateApprovalMyAssets: any = lazy(() =>
  import('@pages/approval/MyAssets').then(({UpdateApprovalMyAssets}: any) => ({
    default: UpdateApprovalMyAssets,
  }))
)

const routes: any = [
  {
    path: 'approval/*',
    children: [
      {path: 'history', permission: 'approval.list.history', element: ApprovalHistory},
      {
        path: 'insurance-claim',
        permission: 'approval.list.insurance_claim',
        element: ApprovalInsurance,
      },
      {path: 'maintenance', permission: 'approval.list.maintenance', element: ApprovalMaintenance},
      {path: 'new-assets', allUser: true, element: NewApprovalMyAssets},
      {path: 'asset-updates', allUser: true, element: UpdateApprovalMyAssets},
    ],
  },
]

export default routes
