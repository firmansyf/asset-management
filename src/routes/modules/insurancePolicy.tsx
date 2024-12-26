import {lazy} from 'react'

const PolicyDetail: any = lazy(
  () => import('@pages/insurance/policies/detail-policies/DetailPolicy')
)
const Policy: any = lazy(() => import('@pages/insurance/policies/InsurancePolicy'))
const PolicyColumn: any = lazy(() => import('@pages/insurance/policies/SetupColumn'))

const routes: any = [
  {
    path: 'insurance/policies/*',
    children: [
      {index: true, permission: 'insurance_policy.view', element: Policy},
      {path: 'detail/:guid', permission: 'insurance_policy.view', element: PolicyDetail},
      {
        path: 'columns',
        permission: 'setup-column.setup_column_insurance_policies',
        element: PolicyColumn,
      },
    ],
  },
]

export default routes
