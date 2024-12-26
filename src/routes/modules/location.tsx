import {lazy} from 'react'

const LocationAddEdit: any = lazy(() => import('@pages/location/AddLocation'))
const Location: any = lazy(() => import('@pages/location/Location'))
const LocationDetail: any = lazy(() => import('@pages/location/LocationDetail'))
const LocationColumn: any = lazy(() => import('@pages/location/SetupColumn'))
const SubLocation: any = lazy(() => import('@pages/location/sub-location/SubLocation'))

const routes: any = [
  {
    path: 'location/*',
    children: [
      {path: 'location', permission: 'location.view', element: Location},
      {path: 'add', permission: 'location.add', element: LocationAddEdit},
      {path: 'columns', permission: 'setup-column.setup_column_location', element: LocationColumn},
      {path: 'location/detail/:guid', permission: 'location.view', element: LocationDetail},
      {path: 'sub-location', permission: 'sub-location.view', element: SubLocation},
    ],
  },
]

export default routes
