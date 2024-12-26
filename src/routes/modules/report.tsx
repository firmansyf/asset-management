import {lazy} from 'react'

const AssetStatus: any = lazy(() => import('@pages/reports/asset-status/AssetStatus'))
const AuditStatus: any = lazy(() => import('@pages/reports/audit-status/AuditStatus'))
const AutomatedReport: any = lazy(() => import('@pages/reports/automated-report'))
const CategoryManufacture: any = lazy(
  () => import('@pages/reports/category-manufacurer/CategoryManufacture')
)
const AddCustomReport: any = lazy(() => import('@pages/reports/custom-report/AddCustomReport'))
const CustomReport: any = lazy(() => import('@pages/reports/custom-report/CustomReport'))
const Department: any = lazy(() => import('@pages/reports/department/Department'))
const Employee: any = lazy(() => import('@pages/reports/employee/Employee'))
const HistoryReport: any = lazy(() => import('@pages/reports/history-report/HistoryReport'))
const Maintenance: any = lazy(() => import('@pages/reports/maintenance/Maintenance'))
const QRCode: any = lazy(() => import('@pages/reports/qrcode/QRCode'))

const routes: any = [
  {
    path: 'reports/*',
    children: [
      {
        path: 'automated-report',
        permission: 'reports.automation_report.view',
        element: AutomatedReport,
      },
      {path: 'custom-report', permission: 'reports.custom-report.create', element: CustomReport},
      {
        path: 'list-custom-report',
        permission: 'reports.custom-report.create',
        element: AddCustomReport,
      },
      {path: 'asset-status', permission: 'reports.asset_by_status', element: AssetStatus},
      {path: 'audit-status', permission: 'reports.asset_by_audit_status', element: AuditStatus},
      {
        path: 'category-manufacturer',
        permission: 'reports.asset_by_category_manufacture',
        element: CategoryManufacture,
      },
      {path: 'department', permission: 'reports.asset_by_department', element: Department},
      {path: 'employee', permission: 'reports.asset_by_employee', element: Employee},
      {
        path: 'history-reports',
        permission: 'reports.asset_by_history_report',
        element: HistoryReport,
      },
      {path: 'qrcode', permission: 'reports.asset_by_qr_codes', element: QRCode},
      {path: 'maintenance', permission: 'reports.asset_by_maintenance', element: Maintenance},
    ],
  },
]

export default routes
