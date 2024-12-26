import {lazy} from 'react'
import {Navigate} from 'react-router-dom'

const DashboardWrapper: any = lazy(() => import('@pages/dashboard/DashboardWrapper'))
const ManageDashboard: any = lazy(() => import('@pages/dashboard/manage-dashboard/ManageDashboard'))

const routes: any = [
  {path: '/', element: <Navigate to='/dashboard' />},
  {path: 'dashboard', permission: 'dashboard.all', allUser: true, element: DashboardWrapper},
  {path: 'manage-dashboard', permission: 'manage-dashboard.manage', element: ManageDashboard},
]

export default routes
