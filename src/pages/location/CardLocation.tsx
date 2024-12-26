/* eslint-disable react-hooks/exhaustive-deps */
import {
  exportLocation,
  getLocation,
  getLocationDetail,
  getOptionsColumns,
  getSetupColumnLocation,
} from '@api/Service'
import {DataTable} from '@components/datatable'
import {matchColumns, toColumns} from '@components/dnd/table'
import {ExportPdfExcel} from '@components/export/ExportPdfExcel'
import {FilterAll, FilterColumns} from '@components/filter/FilterAll'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import ToolbarImport from '@components/ToolbarActions/import'
import {errorValidation, hasPermission, KTSVG, preferenceDateTime} from '@helpers'
import {useQuery} from '@tanstack/react-query'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {useNavigate} from 'react-router-dom'

import AddLocation from './AddLocation'

let CardLocation: FC<any> = ({
  setShowModalConfirm,
  setLocationGuid,
  setTotalAsset,
  setLocationName,
  reloadDelete,
  dataChecked,
  setDataChecked,
  setShowModalConfirmBulk,
  reloadBulkLocation,
  page,
  setPage,
  setPageFrom,
  totalPage,
  setTotalPage,
  resetKeyword,
  setResetKeyword,
}) => {
  const navigate: any = useNavigate()
  const pref_date_time: any = preferenceDateTime()

  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [filterAll, setFilterAll] = useState<any>({})
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('name')
  const [locationDetail, setLocationDetail] = useState<any>()
  const [onClickForm, setOnClickForm] = useState<boolean>(true)
  const [reloadLocation, setReloadLocation] = useState<number>(1)
  const [showModal, setShowModalLocation] = useState<boolean>(false)

  const PermissionAdd: any = hasPermission('location.add') || false
  const PermissionEdit: any = hasPermission('location.edit') || false
  const PermissionDelete: any = hasPermission('location.delete') || false
  const PermissionExport: any = hasPermission('location.export') || false
  const PermissionSetup: any = hasPermission('setup-column.setup_column_location') || false

  const mapLocation: any = (res: any) => {
    const result: any = res?.map((m: any) => ({
      ...m,
      long: m?.long || '',
      re: m?.re?.name || '-',
      tm: m?.tm?.name || '-',
      country_name: m?.country_name || '',
      re_super1: m?.re_super1?.name || '-',
      re_super2: m?.re_super2?.name || '-',
      tm_super1: m?.tm_super1?.name || '-',
      tm_super2: m?.tm_super2?.name || '-',
      re_digital: m?.re_digital?.name || '-',
      status_name: m?.status_name || '-',
      location_subs: m?.location_subs?.length || 0,
      digital_super1: m?.digital_super1?.name || '-',
      digital_super2: m?.digital_super2?.name || '-',
      created_at: m?.created_at ? moment(m?.created_at || '')?.format(pref_date_time) : '-',
      updated_at: m?.updated_at ? moment(m?.updated_at || '')?.format(pref_date_time) : '-',
    }))

    return result as never[]
  }

  const onExport = (e: any) => {
    const filters: any = filterAll?.child || {}
    const fields: any = columns
      ?.filter(({value}: any) => value)
      ?.map(({value}: any) => value)
      ?.join()

    exportLocation({type: e, orderDir, orderCol, columns: fields, ...filters, keyword})
      .then(({data: res}: any) => {
        const {data, message}: any = res || {}
        const {url}: any = data || {}
        ToastMessage({message, type: 'success'})
        setTimeout(() => totalPage <= 500 && window.open(url, '_blank'), 1000)
      })
      .catch(({response}: any) => {
        const {message}: any = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }

  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
    setDataChecked([])
  }

  const onPageChange = (e: any) => {
    setPage(e)
    setDataChecked([])
  }

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e ? `${e}` : '')
  }

  const onChecked = (e: any) => {
    const ar_guid: any = []
    e?.forEach((ck: any) => {
      const {checked}: any = ck || {}
      if (checked) {
        const {original}: any = ck || {}
        const {guid}: any = original || {}
        ar_guid?.push(guid)
      }
    })
    setDataChecked(ar_guid as never[])
  }

  const onDelete = (e: any) => {
    const {guid, name, total_asset}: any = e || {}
    setShowModalConfirm(true)
    setLocationGuid(guid || '')
    setLocationName(name || '')
    setTotalAsset(total_asset || 0)
  }

  const onDetail = (e: any) => {
    const {guid}: any = e || {}
    navigate(`/location/location/detail/${guid || ''}`)
  }

  const onEdit = ({guid}: any) => {
    guid &&
      getLocationDetail(guid || '').then(({data: {data: res}}: any) => {
        setLocationDetail(res || {})
        setShowModalLocation(true)
      })
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const setMapColumns = (fields: any) => {
    const mapColumns: any = toColumns(fields, {checked: true, order: true})?.map(
      ({value, label: header, is_sortable}: any) => {
        let val: any = value
        value === 'availability' && (val = 'status_name')

        let head: any = header
        header === 'Address' && (head = 'Address 1')
        header === 'Street / Building' && (head = 'Address 2')
        const change: string = 'Checkbox '
        header === 'Checkbox' && (head = change)

        return {
          value: val,
          header: head,
          sort: is_sortable === 1 ? true : false,
        }
      }
    )
    return mapColumns
  }

  const columnsQuery: any = useQuery({
    queryKey: ['getLocationColumn'],
    queryFn: async () => {
      const res: any = await getSetupColumnLocation({})
      const {fields}: any = res?.data?.data || {}
      const mapColumns: any = setMapColumns(fields)

      let resDataColumns: any = []
      let resDataColumnsFilter: any = []

      if (mapColumns?.length) {
        resDataColumns = [
          {header: 'checkbox', width: '20px'},
          {header: 'View', width: '20px'},
          ...mapColumns,
          {header: 'Edit', width: '20px'},
          {header: 'Delete', width: '20px'},
        ]
      }

      const mapColumnsFilter = toColumns(fields, {checked: true, order: true})
        ?.filter(({is_filter}: any) => is_filter === 1)
        ?.map(({value, label: header, is_sortable}: any) => {
          let val: any = value
          value === 'availability' && (val = 'status_name')
          let head: any = header
          header === 'Address' && (head = 'Address 1')
          header === 'Street / Building' && (head = 'Address 2')
          return {
            value: val,
            header: head,
            sort: is_sortable === 1 ? true : false,
          }
        })

      if (mapColumnsFilter?.length) {
        resDataColumnsFilter = [
          {header: 'checkbox', width: '20px'},
          {header: 'View', width: '20px'},
          ...mapColumnsFilter,
          {header: 'Edit', width: '20px'},
          {header: 'Delete', width: '20px'},
        ]
      }

      return {columns: resDataColumns, columnsFilter: resDataColumnsFilter}
    },
  })
  const {columns, columnsFilter}: any = columnsQuery?.data || {}

  const dataLocationParam: any = {
    page,
    limit,
    orderDir,
    orderCol,
    keyword,
    ...(filterAll?.child || {}),
  }

  const dataLocationQuery: any = useQuery({
    queryKey: [
      'getLocation',
      {...dataLocationParam, reloadLocation, reloadDelete, reloadBulkLocation, columns},
    ],
    queryFn: async () => {
      if (columns?.length > 0) {
        const res: any = await getLocation(dataLocationParam)
        const {current_page, total, from}: any = res?.data?.meta || {}
        setPageFrom(from)
        setTotalPage(total)
        setPage(current_page)

        const dataResult: any = matchColumns(mapLocation(res?.data?.data || []), columns)
        return dataResult
      } else {
        return []
      }
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: (err: any) => {
      Object.values(errorValidation(err))?.map((message: any) =>
        ToastMessage({message, type: 'error'})
      )
    },
  })
  const dataLocation: any = dataLocationQuery?.data || {}

  useEffect(() => {
    if (resetKeyword) {
      onSearch('')
      setResetKeyword(false)
    }
  }, [resetKeyword])

  return (
    <>
      <div className='card card-custom card-table'>
        <div className='card-table-header'>
          <div className='d-flex flex-wrap flex-stack'>
            <div className='d-flex align-items-center position-relative me-4 my-1'>
              <KTSVG
                path='/media/icons/duotone/General/Search.svg'
                className='svg-icon-3 position-absolute ms-3'
              />

              <Search
                bg='solid'
                onChange={onSearch}
                resetKeyword={resetKeyword}
                setResetKeyword={setResetKeyword}
              />

              <FilterAll columns={columnsFilter} filterAll={filterAll} onChange={setFilterAll} />
            </div>

            <div className='d-flex my-1'>
              <div style={{marginRight: '5px'}}>
                {dataChecked?.length > 0 && (
                  <button
                    type='button'
                    data-cy='btnBulkDelete'
                    className='btn btn-sm btn-primary me-2'
                    onClick={() => setShowModalConfirmBulk(true)}
                  >
                    <span className='indicator-label'>Delete Selected</span>
                  </button>
                )}

                {PermissionAdd && (
                  <button
                    type='button'
                    data-cy='addLocation'
                    className='btn btn-sm btn-primary'
                    onClick={() => {
                      setShowModalLocation(true)
                      setLocationDetail(undefined)
                    }}
                  >
                    + Add New Location
                  </button>
                )}
              </div>
              <div className='dropdown' data-cy='actions' style={{marginRight: '5px'}}>
                <Dropdown>
                  <Dropdown.Toggle variant='light-primary' size='sm' id='dropdown-basic'>
                    Actions
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {PermissionExport && <ExportPdfExcel onExport={onExport} />}
                    <ToolbarImport
                      type='location'
                      pathName='/tools/import'
                      actionName='Import New Location'
                      permission='import-export.import_locations'
                    />
                    {PermissionSetup && (
                      <Dropdown.Item href='#' onClick={() => navigate('/location/columns')}>
                        Setup Column
                      </Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>

          <FilterColumns
            setPage={setPage}
            filterAll={filterAll}
            onChange={setFilterAll}
            api={getOptionsColumns}
          />
        </div>

        <div className='card-body'>
          <DataTable
            page={page}
            limit={limit}
            onEdit={onEdit}
            onSort={onSort}
            total={totalPage}
            columns={columns}
            data={dataLocation}
            onDelete={onDelete}
            onDetail={onDetail}
            onChecked={onChecked}
            edit={PermissionEdit}
            del={PermissionDelete}
            onChangePage={onPageChange}
            onChangeLimit={onChangeLimit}
            loading={!dataLocationQuery?.isFetched || !columnsQuery?.isFetched}
          />
        </div>
      </div>

      <AddLocation
        showModal={showModal}
        onClickForm={onClickForm}
        reloadLocation={reloadLocation}
        locationDetail={locationDetail}
        setOnClickForm={setOnClickForm}
        setReloadLocation={setReloadLocation}
        setShowModalLocation={setShowModalLocation}
      />
    </>
  )
}

CardLocation = memo(
  CardLocation,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default CardLocation
