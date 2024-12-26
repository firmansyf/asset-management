import {ToastMessage} from '@components/toast-message'
import {PageTitle} from '@metronic/layout/core'
import {useQuery} from '@tanstack/react-query'
import {keyBy, mapValues, orderBy} from 'lodash'
import {FC, useEffect, useState} from 'react'
import {Tab, Tabs} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import {useLocation, useNavigate} from 'react-router-dom'

import DatabaseTable from './DatabaseTable'
import {
  getDatabaseAsset,
  getDatabaseEmployee,
  getDatabaseInsurance,
  getDatabaseInventory,
  getDatabaseLocation,
  getDatabaseRequest,
  getDatabaseTicket,
  getDatabaseWarranty,
  getDatabaseWorkOrder,
  updateDatabaseAsset,
  updateDatabaseEmployee,
  updateDatabaseInsurance,
  updateDatabaseInventory,
  updateDatabaseLocation,
  updateDatabaseRequest,
  updateDatabaseTicket,
  updateDatabaseWarranty,
  updateDatabaseWorkOrder,
} from './Serivce'

const CardDatabases: FC<any> = () => {
  const navigate: any = useNavigate()
  const location: any = useLocation()
  const hash: any = location?.hash?.substring(1)
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {feature}: any = preferenceStore || {}
  const featureObj: any = keyBy(feature, 'unique_name')
  const features: any = mapValues(featureObj, 'value')

  const [reloadData, setReloadData] = useState<any>(0)

  const assetDBQuery: any = useQuery({
    queryKey: ['getDatabaseAsset', {hash, reloadData}],
    queryFn: async () => {
      if (hash === 'asset' || !hash) {
        const res: any = await getDatabaseAsset({})
        const {data}: any = res
        const result: any = data?.data || []

        return orderBy(result, 'is_default', 'desc')
      } else {
        return []
      }
    },
  })

  const employeeDBQuery: any = useQuery({
    queryKey: ['getDatabaseEmployee', {hash}],
    queryFn: async () => {
      if (hash === 'employee') {
        const res: any = await getDatabaseEmployee({})
        return orderBy(res?.data?.data, 'is_default', 'desc')
      } else {
        return []
      }
    },
  })

  const warrantyDBQuery: any = useQuery({
    queryKey: ['getDatabaseWarranty', {hash, features}],
    queryFn: async () => {
      if (hash === 'warranty' && features?.warranty) {
        const res: any = await getDatabaseWarranty({})
        return orderBy(res?.data?.data, 'is_default', 'desc')
      } else {
        return []
      }
    },
  })

  const insuranceDBQuery: any = useQuery({
    queryKey: ['getDatabaseInsurance', {hash, features}],
    queryFn: async () => {
      if (hash === 'insurance' && features?.insurance) {
        const res: any = await getDatabaseInsurance({})
        return orderBy(res?.data?.data, 'is_default', 'desc')
      } else {
        return []
      }
    },
  })

  const inventoryDBQuery: any = useQuery({
    queryKey: ['getDatabaseInventory', {hash, features}],
    queryFn: async () => {
      if (hash === 'inventory' && features?.inventory) {
        const res: any = await getDatabaseInventory({})
        const result: any = res?.data?.data?.map((m: any) => {
          if (m.field === 'location_guid') {
            m.is_default = true
            m.is_required = true
            m.is_selected = true
          }
          return m
        })
        return orderBy(result, 'is_default', 'desc')
      } else {
        return []
      }
    },
  })

  const ticketDBQuery: any = useQuery({
    queryKey: ['getDatabaseTicket', {hash, features}],
    queryFn: async () => {
      if (hash === 'ticket' && features?.help_desk) {
        const res: any = await getDatabaseTicket({})
        return orderBy(res?.data?.data, 'is_default', 'desc')
      } else {
        return []
      }
    },
  })

  const workOrderDBQuery: any = useQuery({
    queryKey: ['getDatabaseWorkOrder', {hash, features}],
    queryFn: async () => {
      if (hash === 'wo' && features?.maintenance) {
        const res: any = await getDatabaseWorkOrder({})
        return orderBy(res?.data?.data, 'is_default', 'desc')
      } else {
        return []
      }
    },
  })

  const requestDBQuery: any = useQuery({
    queryKey: ['getDatabaseRequest', {hash, features}],
    queryFn: async () => {
      if (hash === 'request' && features?.maintenance) {
        const res: any = await getDatabaseRequest({})
        return orderBy(res?.data?.data, 'is_default', 'desc')
      } else {
        return []
      }
    },
  })

  const locationDBQuery: any = useQuery({
    queryKey: ['getDatabaseLocation', {hash, features}],
    queryFn: async () => {
      if (hash === 'location') {
        const insuranceFeature: any = features?.insurance_claim
        const res: any = await getDatabaseLocation({})
        const data: any = res?.data?.data
        let result: any = data
        if (!insuranceFeature) {
          result = data?.filter(
            ({field}: any) =>
              field !== 're' &&
              field !== 'tm' &&
              field !== 're_super1' &&
              field !== 're_super2' &&
              field !== 'tm_super1' &&
              field !== 'tm_super2'
          )
        }
        return orderBy(result, 'is_default', 'desc')
      } else {
        return []
      }
    },
  })

  const assetDB: any = assetDBQuery?.data || []
  const employeeDB: any = employeeDBQuery?.data || []
  const warrantyDB: any = warrantyDBQuery?.data || []
  const insuranceDB: any = insuranceDBQuery?.data || []
  const inventoryDB: any = inventoryDBQuery?.data || []
  const ticketDB: any = ticketDBQuery?.data || []
  const workOrderDB: any = workOrderDBQuery?.data || []
  const requestDB: any = requestDBQuery?.data || []
  const locationDB: any = locationDBQuery?.data || []

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  const setupText: any =
    'Field Name with asterisk ( * ) are required fields. Check the boxes next to the field names you want to include.'

  return (
    <div className='card card-custom'>
      <div className='card-header p-6'>
        <h4>Setting Databases</h4>
      </div>
      <div className='card-body'>
        <div style={{display: 'block', paddingTop: 5, paddingBottom: 5}}>
          <Tabs
            defaultActiveKey={hash || 'asset'}
            variant='pills'
            onSelect={(e: any) => {
              navigate({...location, hash: e}, {replace: true})
            }}
          >
            <Tab eventKey='asset' title='Asset Table'>
              <DatabaseTable
                updateApi={updateDatabaseAsset}
                databaseData={assetDB}
                setupText={setupText}
                fieldName={'_assets'}
                loadingPage={!assetDBQuery?.isFetched}
                setReloadData={setReloadData}
                reloadData={reloadData}
              />
            </Tab>
            <Tab eventKey='location' title='Location Table'>
              <DatabaseTable
                updateApi={updateDatabaseLocation}
                databaseData={locationDB}
                setupText={setupText}
                fieldName={'_db_location'}
                loadingPage={!locationDBQuery?.isFetched}
              />
            </Tab>
            <Tab eventKey='employee' title='Employee Table'>
              <DatabaseTable
                updateApi={updateDatabaseEmployee}
                databaseData={employeeDB}
                setupText={setupText}
                fieldName={'_employee'}
                loadingPage={!employeeDBQuery?.isFetched}
              />
            </Tab>
            {features?.warranty === 1 && (
              <Tab eventKey='warranty' title='Warranty Table'>
                <DatabaseTable
                  updateApi={updateDatabaseWarranty}
                  databaseData={warrantyDB}
                  setupText={setupText}
                  fieldName={'_warranty'}
                  loadingPage={!warrantyDBQuery?.isFetched}
                />
              </Tab>
            )}
            {features?.insurance === 1 && (
              <Tab eventKey='insurance' title='Insurance Table'>
                <DatabaseTable
                  updateApi={updateDatabaseInsurance}
                  databaseData={insuranceDB}
                  setupText={setupText}
                  fieldName={'_insurance'}
                  loadingPage={!insuranceDBQuery?.isFetched}
                />
              </Tab>
            )}
            {features?.inventory === 1 && (
              <Tab eventKey='inventory' title='Inventory Table'>
                <DatabaseTable
                  updateApi={updateDatabaseInventory}
                  databaseData={inventoryDB}
                  setupText={setupText}
                  fieldName={'_inventory'}
                  loadingPage={!inventoryDBQuery?.isFetched}
                />
              </Tab>
            )}
            {features?.help_desk === 1 && (
              <Tab eventKey='ticket' title='Ticket Table'>
                <DatabaseTable
                  updateApi={updateDatabaseTicket}
                  databaseData={ticketDB}
                  setupText={setupText}
                  fieldName={'_ticket'}
                  loadingPage={!ticketDBQuery?.isFetched}
                />
              </Tab>
            )}
            {features?.maintenance === 1 && (
              <Tab eventKey='wo' title='Work Order Table'>
                <DatabaseTable
                  updateApi={updateDatabaseWorkOrder}
                  databaseData={workOrderDB}
                  setupText={setupText}
                  fieldName={'_work_order'}
                  loadingPage={!workOrderDBQuery?.isFetched}
                />
              </Tab>
            )}
            {features?.maintenance === 1 && (
              <Tab eventKey='request' title='Request Table'>
                <DatabaseTable
                  updateApi={updateDatabaseRequest}
                  databaseData={requestDB}
                  setupText={setupText}
                  fieldName={'_request'}
                  loadingPage={!requestDBQuery?.isFetched}
                />
              </Tab>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  )
}

const Databases: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.SETUP.DATABASES'})}</PageTitle>
      <CardDatabases />
    </>
  )
}

export default Databases
