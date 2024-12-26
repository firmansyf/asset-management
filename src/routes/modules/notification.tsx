import {lazy} from 'react'

const Customize: any = lazy(() => import('@pages/help-desk/customize'))
const Asset: any = lazy(() => import('@pages/help-desk/notification/asset'))
const Comment: any = lazy(() => import('@pages/help-desk/notification/comment'))
const Expired: any = lazy(() => import('@pages/help-desk/notification/expired'))
const HelpDesk: any = lazy(() => import('@pages/help-desk/notification/helpdesk'))
const InsurancePolicy: any = lazy(() => import('@pages/help-desk/notification/insurance-policy'))
const Inventory: any = lazy(() => import('@pages/help-desk/notification/inventory'))
const Maintenance: any = lazy(() => import('@pages/help-desk/notification/maintenance'))
const Warranty: any = lazy(() => import('@pages/help-desk/notification/warranty'))

const routes: any = [
  {
    path: 'notification/*',
    children: [
      {path: 'assets', allUser: true, element: Asset},
      {path: 'comment', allUser: true, element: Comment},
      {path: 'customize', allUser: true, element: Customize},
      {path: 'expired', allUser: true, element: Expired},
      {path: 'inventory', allUser: true, element: Inventory},
      {path: 'insurance', allUser: true, element: InsurancePolicy},
      {path: 'helpdesk', allUser: true, element: HelpDesk},
      {path: 'maintenance', allUser: true, element: Maintenance},
      {path: 'warranty', allUser: true, element: Warranty},
    ],
  },
]

export default routes
