import {Alert} from '@components/alert'
import {DataTable} from '@components/datatable'
import {ToastMessage} from '@components/toast-message'
import {deleteLocation, getLocation} from '@pages/wizards/redux/WizardService'
import {FC, memo, useCallback, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'

type LocationProps = {
  setShowModalLocation: any
  setLocationDetail: any
  reload: any
  setReloadSubLocation: any
  reloadSubLocation: any
}

let Step2: FC<LocationProps> = ({
  setShowModalLocation,
  setLocationDetail,
  reload,
  setReloadSubLocation,
  reloadSubLocation,
}) => {
  const intl: any = useIntl()

  const [meta, setMeta] = useState<any>({})
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [totalasset, setTotalAsset] = useState<number>(0)
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('name')
  const [dataLocation, setDataLocation] = useState<any>([])
  const [totalPerPage, setTotalPerPage] = useState<number>(0)
  const [reloadDelete, setReloadDelete] = useState<number>(1)
  const [isTableLoading, setIsTableLoading] = useState<any>(true)
  const [locationname, setLocationName] = useState<boolean>(false)
  const [location_guid, setLocationGuid] = useState<boolean>(false)
  const [showModal, setShowModalConfirm] = useState<boolean>(false)

  const columns: any = [
    {header: 'Location Name', value: 'name', sort: true},
    {header: 'Location Status', value: 'status_name', sort: true},
    {header: 'City', value: 'city', sort: true},
    {header: 'State/Province', value: 'state', sort: true},
    {header: 'Country', value: 'country_name', sort: true},
    {header: 'Zip/Postal Code', value: 'postcode', sort: true},
    {header: 'Edit', width: '20px'},
    {header: 'Delete', width: '20px'},
  ]

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const confirmDeleteLocation = useCallback(() => {
    setLoading(true)
    deleteLocation(location_guid)
      .then(({data: {message}}: any) => {
        setTimeout(() => {
          setLoading(false)
          setShowModalConfirm(false)
          setReloadDelete(reloadDelete + 1)
          ToastMessage({message, type: 'success'})
          setReloadSubLocation(reloadSubLocation + 1)
        }, 1000)
      })
      .catch(() => setLoading(false))
  }, [location_guid, reloadDelete, reloadSubLocation, setReloadSubLocation])

  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
  }

  const onPageChange = (e: any) => {
    setPage(e)
  }

  const onEdit = (e: any) => {
    setLocationDetail(e)
    setShowModalLocation(true)
  }

  const onDelete = (e: any) => {
    const {guid, name, total_asset}: any = e || {}

    setShowModalConfirm(true)
    setLocationGuid(guid || '')
    setLocationName(name || '')
    setTotalAsset(total_asset || 0)
  }

  let total_asset_alert: any = [
    'Are you sure you want to delete this location ',
    <strong key='location_name'>{locationname || ''}</strong>,
    '?',
  ]

  if (totalasset > 0) {
    total_asset_alert = [
      'Are you sure you want to delete this location ',
      <strong key='location_name'>{locationname || ''}</strong>,
      '?',
      <br key='newline1' />,
      <br key='newline2' />,
      <strong key='total_asset'>{totalasset || 0}</strong>,
      ' asset(s) is/are currently being assigned to this location. if you proceed to delete this location, it will be removed from the asset(s)',
    ]
  }

  useEffect(() => {
    getLocation({page, limit, orderCol, orderDir}).then(({data: {data: res_loc, meta}}: any) => {
      const {current_page, per_page, total} = meta || {}
      setLimit(per_page)
      setMeta(meta || {})
      setTotalPage(total)
      setPage(current_page)

      if (res_loc) {
        const data: any = res_loc?.map((res: any) => {
          const {name, status_name, availability, city, state, country_name, postcode}: any =
            res || {}
          const {name: status_av}: any = availability || {}

          return {
            name: name || '-',
            location_status: status_av || status_name || '-',
            city: city || '-',
            state: state || '-',
            country: country_name || '-',
            postcode: postcode || '-',
            edit: 'Edit',
            delete: 'Delete',
            original: res,
          }
        })
        setIsTableLoading(false)
        setDataLocation(data as never[])
        setTotalPerPage(res_loc?.length || 0)
      }
    })
  }, [page, limit, reload, reloadDelete, orderCol, orderDir])

  useEffect(() => {
    if (totalPerPage === 0 && Object.keys(meta || {})?.length > 0) {
      setPage(meta?.current_page > 1 ? meta?.current_page - 1 : 1)
    }
  }, [meta, totalPerPage])

  return (
    <>
      <div className='w-100 mb-10'>
        <div className='form-row'>
          <div className='pb-lg-12'>
            <div className='row'>
              <h3 data-cy='titleHeaderStep2' className='fw-bolder text-dark'>
                List of Locations
              </h3>
            </div>

            <div className='text-black-600 fs-6'>
              <p data-cy='descHeader1LocationWizard' className='mb-0'>
                {intl.formatMessage({
                  id: 'ASSET_DATA_ALLOWS_YOU_TO_ENTER_MULTIPLE_LOCATIONS_FOR_EXAMPLE_THE_LOCATION_MAY_BE_A_BUILDING_OR_ADDRESS',
                })}
              </p>

              <p data-cy='descHeader2LocationWizard' className='mb-0'>
                {intl.formatMessage({
                  id: 'THIS_MEANS_THAT_YOU_CAN_BETTER_TRACK_EACH_ASSET_THAT_IS_ASSIGNED_TO_A_GIVEN_LOCATION',
                })}
              </p>
            </div>
          </div>

          <div className='d-flex justify-content-between pb-10'>
            <button
              type='button'
              data-cy='btn-add-location'
              className='btn btn-primary'
              onClick={() => {
                setShowModalLocation(true)
                setLocationDetail(undefined)
              }}
            >
              <span className='indicator-label'>+ Add New Location </span>
            </button>
          </div>
          <div className='fw-bold'>
            If you have a long list of locations, you may choose to upload them using the Import
            feature available on AssetData after you are done with the Setup Wizard.
          </div>
        </div>

        <DataTable
          page={page}
          limit={limit}
          onEdit={onEdit}
          onSort={onSort}
          columns={columns}
          total={totalPage}
          data={dataLocation}
          onDelete={onDelete}
          loading={isTableLoading}
          onChangePage={onPageChange}
          onChangeLimit={onChangeLimit}
          customEmptyTable='No Location Added'
        />
      </div>

      <Alert
        type={'delete'}
        loading={loading}
        showModal={showModal}
        confirmLabel={'Delete'}
        body={total_asset_alert}
        title={'Delete Location'}
        setShowModal={setShowModalConfirm}
        onConfirm={() => confirmDeleteLocation()}
        onCancel={() => setShowModalConfirm(false)}
      />
    </>
  )
}

Step2 = memo(Step2, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export {Step2}
