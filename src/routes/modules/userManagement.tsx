import {lazy} from 'react'

const Team: any = lazy(() => import('@pages/setup/alert/team/AlertTeam'))
const Contact: any = lazy(() => import('@pages/user-management/contact/CardContact'))
const ContactColumn: any = lazy(() => import('@pages/user-management/contact/ContactColumn'))
const Employee: any = lazy(() => import('@pages/user-management/employee/Employee'))
const EmployeeColumn: any = lazy(() => import('@pages/user-management/employee/SetupColumns'))
const UserColumn: any = lazy(() => import('@pages/user-management/user/SetupColumn'))
const User: any = lazy(() => import('@pages/user-management/user/UsersPage'))
const VendorColumn: any = lazy(() => import('@pages/user-management/vendor/SetupVendorColumn'))
const Vendor: any = lazy(() => import('@pages/user-management/vendor/Vendor'))

const routes: any = [
  {
    path: 'user-management/*',
    children: [
      {path: 'contact', permission: 'contact.view', allUser: true, element: Contact},
      {
        path: 'contact-columns',
        permission: 'contact.setup-column',
        allUser: true,
        element: ContactColumn,
      },
      {path: 'employee', permission: 'employee.view', element: Employee},
      {
        path: 'employee-columns',
        permission: 'setup-column.setup_column_employee',
        element: EmployeeColumn,
      },
      // TEAM
      {path: 'team', permission: 'team.view', element: Team},
      // USER
      {path: 'users', permission: 'user-management.view', element: User},
      // VENDOR
      {path: 'vendor', allUser: true, element: Vendor},
    ],
  },
  {
    path: 'user/setup-column-user',
    permission: 'setup-column.setup_column_user',
    element: UserColumn,
  },
  {path: '/vendor/columns', permission: 'setup-column.setup_column_vendor', element: VendorColumn},
]

export default routes
