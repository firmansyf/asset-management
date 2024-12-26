import {lazy} from 'react'

const Billing: any = lazy(() => import('@pages/billing'))
const BillingHistory: any = lazy(() => import('@pages/billing/BillingHistory'))
const ChangePlan: any = lazy(() => import('@pages/billing/BillingMenu/ChangePlan'))
const BillingOverview: any = lazy(() => import('@pages/billing/BillingOverview'))
const ConfirmationPlanForm: any = lazy(() => import('@pages/billing/ConfirmationPlanForm'))
const ConfirmCard: any = lazy(() => import('@pages/billing/ConfirmationPlanForm/ConfirmCard'))
const PaymentDetail: any = lazy(() => import('@pages/billing/PaymentDetail'))

const routes: any = [
  {
    path: 'billing/*',
    children: [
      {index: true, allUser: true, element: Billing},
      {path: 'confirm-form', allUser: true, element: ConfirmationPlanForm},
      {path: 'confirm-form-card', allUser: true, element: ConfirmCard},
      {path: 'history', allUser: true, element: BillingHistory},
      {path: 'detail', allUser: true, element: PaymentDetail},
      {path: 'billing-overview', allUser: true, element: BillingOverview},
      {path: 'change-plan', allUser: true, element: ChangePlan},
    ],
  },
]

export default routes
