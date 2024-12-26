import {lazy} from 'react'

const ClaimDetail: any = lazy(() => import('@pages/insurance/claim/detail'))
const ClaimEdit: any = lazy(() => import('@pages/insurance/claim/edit-claim'))
const Claim: any = lazy(() => import('@pages/insurance/claim/InsuranceClaim'))
const ReportPendingClaim: any = lazy(() => import('@pages/insurance/claim/report-pending-claim'))
const ReportPercentage: any = lazy(() => import('@pages/insurance/claim/report-percentage'))
const RevertHistory: any = lazy(() => import('@pages/insurance/claim/revert-history'))
const SAPHistory: any = lazy(() => import('@pages/insurance/claim/sap-history'))
const ClaimColumn: any = lazy(() => import('@pages/insurance/claim/SetupColumn'))
const SFHistory: any = lazy(() => import('@pages/insurance/claim/sf-history'))

const routes: any = [
  {
    path: 'insurance-claims/*',
    children: [
      {path: 'all', permission: 'insurance_claim.view', element: Claim},
      {
        path: 'columns',
        permission: 'setup-column.setup_column_insurance_claim',
        element: ClaimColumn,
      },
      {path: ':guid/edit', permission: 'insurance_claim.edit', element: ClaimEdit},
      {path: ':guid/detail', permission: 'insurance_claim.view', element: ClaimDetail},
      {path: 'sf-history', permission: 'insurance_claim.view', element: SFHistory},
      {path: 'sap-history', permission: 'insurance_claim.view', element: SAPHistory},
      {path: 'revert-history', permission: 'insurance_claim.view', element: RevertHistory},
      {path: 'report-percentage', permission: 'insurance_claim.view', element: ReportPercentage},
      {
        path: 'report-pending-claim',
        permission: 'insurance_claim.view',
        element: ReportPendingClaim,
      },
    ],
  },
]

export default routes
