import {lazy} from 'react'

const Meter: any = lazy(() => import('@pages/maintenance/meter'))
const MeterDetail: any = lazy(() => import('@pages/maintenance/meter/detail'))
const MeterColumn: any = lazy(() => import('@pages/maintenance/meter/SetupColumn'))
const Preventive: any = lazy(() => import('@pages/maintenance/preventive'))
const PreventiveAddEdit: any = lazy(() => import('@pages/maintenance/preventive/add'))
const PreventiveColumn: any = lazy(() => import('@pages/maintenance/preventive/SetupColumn'))
const RequestAddEdit: any = lazy(() => import('@pages/maintenance/request/AddEditRequest'))
const RequestDetail: any = lazy(
  () => import('@pages/maintenance/request/detailRequest/DetailRequest')
)
const Request: any = lazy(() => import('@pages/maintenance/request/Request'))
const RequestColumn: any = lazy(() => import('@pages/maintenance/request/requestSetupColumns'))
const WorkOrder: any = lazy(() => import('@pages/maintenance/work-order'))
const WorkOrderAddEdit: any = lazy(() => import('@pages/maintenance/work-order/add'))
const WorkOrderDetail: any = lazy(() => import('@pages/maintenance/work-order/detail'))
const WorkOrderColumn: any = lazy(() => import('@pages/maintenance/work-order/setupColumn'))

const routes: any = [
  {
    path: 'maintenance/*',
    children: [
      // METER
      {
        path: 'meter/*',
        children: [
          {index: true, permission: 'maintenance.meter.view', element: Meter},
          {path: 'detail/:guid', permission: 'maintenance.meter.view', element: MeterDetail},
          {
            path: 'setup-column',
            permission: 'maintenance.meter.setup-column',
            element: MeterColumn,
          },
        ],
      },
      // PREVENTVE
      {
        path: 'preventive/*',
        children: [
          {index: true, permission: 'maintenance.preventive.view', element: Preventive},
          {path: 'add', permission: 'maintenance.preventive.add', element: PreventiveAddEdit},
          {path: 'edit', permission: 'maintenance.preventive.add', element: PreventiveAddEdit},
          {
            path: 'setup-column',
            permission: 'maintenance.preventive.setup-column',
            element: PreventiveColumn,
          },
        ],
      },
      // REQUEST
      {
        path: 'request/*',
        children: [
          {index: true, permission: 'maintenance.request.view', element: Request},
          {path: 'add', permission: 'maintenance.request.add', element: RequestAddEdit},
          {path: 'edit', permission: 'maintenance.request.edit', element: RequestAddEdit},
          {path: 'detail/:guid', permission: 'maintenance.request.view', element: RequestDetail},
          {path: 'setup-column', permission: 'maintenance.request.view', element: RequestColumn},
        ],
      },
      // WORK ORDER
      {
        path: 'work-order/*',
        children: [
          {index: true, permission: 'maintenance.list', element: WorkOrder},
          {path: 'add', permission: 'maintenance.add', element: WorkOrderAddEdit},
          {path: 'edit', permission: 'maintenance.edit', element: WorkOrderAddEdit},
          {path: 'detail/:guid', permission: 'maintenance.view', element: WorkOrderDetail},
          {path: 'setup-column', permission: 'maintenance.setup', element: WorkOrderColumn},
        ],
      },
    ],
  },
]

export default routes
