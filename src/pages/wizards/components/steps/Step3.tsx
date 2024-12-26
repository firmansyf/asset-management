import {Alert} from '@components/alert'
import {DataTable} from '@components/datatable'
import {ToastMessage} from '@components/toast-message'
import {deleteSubLocation, getSubLocation} from '@pages/wizards/redux/WizardService'
import {FC, memo, useCallback, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'

type Props = {
  filterSubLocation: any
  setShowModalSubLocation: any
  setSubLocationDetail: any
  reload: any
}

let Step3: FC<Props> = ({setShowModalSubLocation, setSubLocationDetail, reload}) => {
  const intl: any = useIntl()
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('name')
  const [reloadDelete, setReloadDelete] = useState<number>(1)
  const [dataSubLocation, setDataSubLocation] = useState<any>([])
  const [showModal, setShowModalConfirm] = useState<boolean>(false)
  const [locationsubname, setLocationSubName] = useState<boolean>(false)
  const [location_sub_guid, setSubLocationGuid] = useState<boolean>(false)
  const [meta, setMeta] = useState<any>()
  const [totalPerPage, setTotalPerPage] = useState<number>(0)

  const columns: any = [
    {header: 'Sub Location', value: 'name', sort: true},
    {header: 'Location', value: 'location_name', sort: true},
    {header: 'Edit', width: '20px'},
    {header: 'Delete', width: '20px'},
  ]

  const msg_alert: any = [
    'Are you sure you want to delete this sub location ',
    <strong key='sub_location_name'>{locationsubname}</strong>,
    ' ?',
  ]

  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
  }

  const onPageChange = (e: any) => {
    setPage(e)
  }

  const onDelete = (e: any) => {
    const {guid, name} = e || {}
    setSubLocationGuid(guid || '')
    setLocationSubName(name || '')
    setShowModalConfirm(true)
  }

  const onEdit = (e: any) => {
    setSubLocationDetail(e)
    setShowModalSubLocation(true)
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  useEffect(() => {
    getSubLocation({page, limit, orderCol, orderDir})
      .then(({data: res}: any) => {
        const {data: result, meta}: any = res || {}
        const {total}: any = meta || {}
        setTotalPage(total)
        setMeta(meta || {})

        if (result) {
          const data = result.map((res: any) => {
            const {name, location}: any = res || {}
            const {name: location_name}: any = location || {}
            return {
              name: name || '-',
              location_name: location_name || '-',
              edit: 'Edit',
              delete: 'Delete',
              original: res,
            }
          })
          setDataSubLocation(data)
          setTotalPerPage(result?.length || 0)
        }
      })
      .catch(() => '')
  }, [page, limit, reload, reloadDelete, orderCol, orderDir])

  const confirmDeleteSubLocation = useCallback(() => {
    setLoading(true)
    deleteSubLocation(location_sub_guid)
      .then(({data: {message}}: any) => {
        setTimeout(() => {
          setLoading(false)
          setShowModalConfirm(false)
          setReloadDelete(reloadDelete + 1)
          ToastMessage({message, type: 'success'})
        }, 1000)
      })
      .catch(() => '')
  }, [location_sub_guid, reloadDelete])

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
              <h3 className='fw-bolder text-dark'>
                {intl.formatMessage({id: 'LIST_OF_SUB_LOCATIONS'})}
              </h3>
            </div>
            <div className='text-black-600 fs-6'>
              <p className='mb-0'>
                {intl.formatMessage({id: 'YOU_MAY_ALSO_ADD_SUB_LOCATIONS'})}
                <br />
                {intl.formatMessage({
                  id: 'SUB_LOCATION_MAY_BE_A_SPECIFIC_ROOM_OFFICE_OR_FLOOR_WITHIN_THE_LOCATION',
                })}
              </p>
            </div>
          </div>
          <div className=''>
            <div className='d-flex justify-content-between pb-10'>
              <button
                type='button'
                className='btn btn-primary'
                data-cy='btn-add-sub-location'
                onClick={() => {
                  setShowModalSubLocation(true)
                  setSubLocationDetail(undefined)
                }}
              >
                <span className='indicator-label'>+ Add New Sub Location</span>
              </button>
            </div>
            <div className='fw-bold'>
              If you have a long list of sub locations, you may choose to upload them using the
              Import feature available on AssetData after you are done with the Setup Wizard.
            </div>
          </div>
        </div>

        <DataTable
          limit={limit}
          total={totalPage}
          data={dataSubLocation}
          loading={false}
          columns={columns}
          onChangePage={onPageChange}
          onChangeLimit={onChangeLimit}
          onDelete={onDelete}
          onEdit={onEdit}
          onSort={onSort}
          customEmptyTable='No Sub Location Added'
        />
      </div>
      <Alert
        setShowModal={setShowModalConfirm}
        showModal={showModal}
        loading={loading}
        body={msg_alert}
        type={'delete'}
        title={'Delete Sub Location'}
        confirmLabel={'Delete'}
        onConfirm={() => {
          confirmDeleteSubLocation()
        }}
        onCancel={() => {
          setShowModalConfirm(false)
        }}
      />
    </>
  )
}

Step3 = memo(Step3, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export {Step3}
