/* eslint-disable react-hooks/exhaustive-deps */
import {Alert} from '@components/alert'
import {DataTable} from '@components/datatable'
import {matchColumns, toColumns} from '@components/dnd/table'
import {ExportPdfExcel} from '@components/export/ExportPdfExcel'
import {FilterAll, FilterColumns} from '@components/filter/FilterAll'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import {
  guidBulkChecked,
  hasPermission,
  KTSVG,
  preferenceDate,
  setApprovalStatus,
  setColumn,
  setConfirmStatus,
  useTimeOutMessage,
} from '@helpers'
import {useQuery} from '@tanstack/react-query'
import {keyBy, mapValues} from 'lodash'
import moment from 'moment'
import qs from 'qs'
import {FC, memo, useCallback, useEffect, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {shallowEqual, useSelector} from 'react-redux'
import {useLocation, useNavigate} from 'react-router-dom'

import ModalQRCode from './qr-code/ModalQRCode'
import {exportAsset, getAsset, getAssetColumn, getAssetOptions} from './redux/AssetRedux'

let CardAssetManagement: FC<any> = ({
  setAssetGuid,
  setAssetName,
  setShowModalConfirm,
  reloadDelete,
  onBulkDelete,
  dataChecked,
  setDataChecked,
  page,
  setPage,
  setPageFrom,
  totalPage,
  setTotalPage,
  resetKeyword,
  setResetKeyword,
}) => {
  const pref_date: any = preferenceDate()
  const navigate: any = useNavigate()
  const location: any = useLocation()
  const params: any = new URLSearchParams(location?.search)
  const categoryParam: any = params.get('category') || ''
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {feature}: any = preferenceStore || {}

  const [limit, setLimit] = useState<number>(10)
  const [features, setFeatures] = useState<any>({})
  const [keyword, setKeyword] = useState<string>('')
  const [messageAlert, setMessage] = useState<any>()
  const [filterAll, setFilterAll] = useState<any>({})
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('asset_id')
  const [showModalQRCode, setShowModalQRCode] = useState<boolean>(false)
  const [showModalBulk, setShowModalConfirmBulk] = useState<boolean>(false)

  const PermissionView: any = hasPermission('asset-management.view') || false
  const PermissionEdit: any = hasPermission('asset-management.edit') || false
  const PermissionDelete: any = hasPermission('asset-management.delete') || false
  const PermissionImport: any = hasPermission('import-export.import_assets') || false
  const PermissionSetup: any = hasPermission('setup-column.setup_column_asset') || false

  const dataFilterParams = useCallback(
    (paramsUrl: any) => {
      const filterParams2: any = {}
      if (paramsUrl.get('filter[audit_status]') !== null) {
        filterParams2[`filter[audit_status]`] = paramsUrl.get(`filter[audit_status]`)
      }
      return filterParams2 || {}
    },
    [filterAll?.child]
  )

  const onExport = (e: any) => {
    let filters: any = filterAll?.child || {}
    categoryParam && (filters[`filter[category_name]`] = categoryParam)
    const fields: any = columns?.filter(({value}: any) => value)?.map(({value}: any) => value)
    filters = qs.parse(filters)

    exportAsset({
      type: e,
      keyword,
      orderCol,
      orderDir,
      columns: fields?.join(','),
      ...filters,
    })
      .then(({data: {data, message}}: any) => {
        const {url} = data || {}
        ToastMessage({type: 'success', message})
        setTimeout(() => totalPage <= 500 && window.open(url, '_blank'), 1000)
      })
      .catch(({response}: any) => {
        const {message}: any = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }

  const onDelete = (e: any) => {
    const {asset_guid, asset_name}: any = e || {}
    setAssetGuid(asset_guid || '')
    setAssetName(asset_name || '')
    setShowModalConfirm(true)
  }

  const onChecked = (e: any) => {
    const ar_guid: any = guidBulkChecked(e)
    setDataChecked(ar_guid)
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e || '')
  }

  const validationDateTime = (val: any, datePreference: any) => {
    if (val) {
      return moment(val || '')?.format(datePreference)
    } else {
      return '-'
    }
  }

  const onRender = (val: any, original: any) => {
    return {
      purchase_date: validationDateTime(val || '', pref_date),
      invoice_date: validationDateTime(val || '', pref_date),
      cheque_date: validationDateTime(val || '', pref_date),
      actual_date_received: validationDateTime(val || '', pref_date),
      voucher_date: validationDateTime(val || '', pref_date),
      delivery_order_date: validationDateTime(val || '', pref_date),
      disposal_date: validationDateTime(val || '', pref_date),
      gcf_date: validationDateTime(val || '', pref_date),
      gcf_Date: validationDateTime(val || '', pref_date),
      approval_status: setApprovalStatus(val, original),
      confirm_status: setConfirmStatus(val),
    }
  }

  const setRedirection = (filterAll: any, filterParams2: any) => {
    if (filterAll?.child !== undefined && Object.keys(filterAll?.child || {})?.length === 0) {
      if (keyword === '') {
        navigate(`/asset-management/all`)
      } else {
        navigate(`/asset-management/all?keyword=${keyword || ''}`)
      }
    } else if (filterParams2 !== '') {
      if (keyword === '') {
        navigate(`/asset-management/all${filterParams2}`)
      } else {
        navigate(`/asset-management/all${filterParams2}&keyword=${keyword || ''}`)
      }
    }
  }

  const onChangePage = (e: any) => {
    setPage(e)
  }

  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
  }

  const onEdit = ({asset_guid}: any) => {
    navigate('/asset-management/edit?id=' + (asset_guid || ''))
  }

  const onDetail = ({asset_guid}: any) => {
    navigate('/asset-management/detail/' + (asset_guid || ''))
  }

  const getDataMessage: any = [
    `Are you sure want to delete `,
    <strong key='str1'>{dataChecked?.length || 0}</strong>,
    ` ${dataChecked?.length > 1 ? 'assets' : 'asset'} ?`,
  ]

  const columnsQuery: any = useQuery({
    queryKey: ['getAssetColumn'],
    queryFn: async () => {
      const res: any = await getAssetColumn()
      const {fields}: any = res?.data?.data || {}
      const mapColumns: any = toColumns(fields, {checked: true, order: true})?.map(
        ({value, label: header, is_filter, is_sortable}: any) => {
          let head: any = header
          const change: string = 'Checkbox '
          header === 'Checkbox' && (head = change)
          return {
            value,
            header: head,
            sort: is_sortable === 1 ? true : false,
            is_filter,
          }
        }
      )
      const dataResult: any = setColumn(mapColumns)
      const columnsFilter: any = dataResult?.filter(({is_filter}: any) => is_filter === 1)
      return {columns: dataResult, columnsFilter}
    },
  })
  const {columns, columnsFilter}: any = columnsQuery?.data || []

  const assetManagementQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: [
      'getAsset',
      {
        page,
        limit,
        keyword,
        reloadDelete,
        orderDir,
        orderCol,
        filterAll,
        categoryParam,
        columns,
        dataFilterParams,
      },
    ],
    queryFn: async () => {
      if (columns?.length > 0) {
        const filterParams2: any = {}
        const filters: any = filterAll?.child || {}
        categoryParam && (filters[`filter[category_name]`] = categoryParam)
        const paramss: any = new URLSearchParams(window.location.search)
        const res: any = await getAsset({
          page,
          orderDir,
          orderCol,
          limit,
          keyword,
          ...filters,
          ...filterParams2,
          ...dataFilterParams(paramss),
        })

        const {current_page, total, from}: any = res?.data?.meta || {}
        setTotalPage(total)
        setPage(current_page)
        setPageFrom(from)
        const resData: any = res?.data?.data?.map((m: any) => ({
          ...m,
          guid: m.asset_guid,
          unit_cost: `${m.purchase_price_currency || ''} ${m.unit_cost || 0}`,
          total_cost: `${m.purchase_price_currency || ''} ${m.total_cost || 0}`,
          total_quantity: m.total_quantity || 0,
          Edit: m?.approval_status !== 'Pending Approval' || false,
        }))
        return matchColumns(resData, columns)
      } else {
        return []
      }
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })
  const dataAssetManagement: any = assetManagementQuery?.data || []

  useEffect(() => {
    useTimeOutMessage('clear', 2000)
  }, [])

  useEffect(() => {
    if (feature) {
      const resObj: any = keyBy(feature, 'unique_name')
      setFeatures(mapValues(resObj, 'value'))
    }
  }, [feature])

  useEffect(() => {
    if (resetKeyword) {
      onSearch('')
      setResetKeyword(false)
    }
  }, [resetKeyword])

  useEffect(() => {
    let filterParams2: any = ''
    const params: any = new URLSearchParams(window?.location?.search)
    if (filterAll?.child === undefined) {
      let filterColumnsChild: any = {}
      const filterColumnsParent: any = []

      columns?.forEach(({value, header}: any) => {
        if (value !== undefined && params.get(`filter[${value}]`) !== null) {
          const childKey: any = `filter[${value}]`
          filterColumnsChild = {
            ...filterColumnsChild,
            [childKey]: params.get(`filter[${value}]`),
          }

          filterColumnsParent?.push({
            value: value,
            label: header,
            filterOptions: false,
            checked: true,
          })

          filterParams2 =
            filterParams2 +
            `${filterParams2 === '' ? '?' : '&'}filter[${value}]=${params.get(`filter[${value}]`)}`
        }
      })

      if (Object.keys(filterColumnsChild || {})?.length > 0 && filterColumnsParent?.length > 0) {
        setFilterAll({
          parent: filterColumnsParent,
          child: filterColumnsChild,
        })
      }
    }

    if (filterAll?.child !== undefined) {
      Object.entries(filterAll?.child)?.forEach((m: any) => {
        if (m?.[1] !== '') {
          filterParams2 = filterParams2 + `${filterParams2 === '' ? '?' : '&'}${m?.[0]}=${m?.[1]}`
        }
      })
    }

    const filterParams: any = dataFilterParams(params) || {}
    if (Object.entries(filterParams)?.length > 0) {
      Object.entries(filterParams)?.forEach((arr: any) => {
        if (!filterParams2?.includes(arr?.[0])) {
          filterParams2 =
            filterParams2 + `${filterParams2 === '' ? '?' : '&'}${arr?.[0]}=${arr?.[1]}`
        }
      })
    }

    setRedirection(filterAll, filterParams2)
  }, [filterAll?.child, navigate, columns, dataFilterParams, keyword])

  return (
    <>
      <div className='card card-table card-custom'>
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
                    className='btn btn-sm btn-primary me-2'
                    onClick={() => {
                      setMessage(getDataMessage)
                      setShowModalConfirmBulk(true)
                    }}
                  >
                    <span className='indicator-label'>Delete Selected</span>
                  </button>
                )}
              </div>

              <div className='dropdown' style={{marginRight: '5px'}}>
                <Dropdown>
                  <Dropdown.Toggle variant='light-primary' size='sm' id='dropdown-basic'>
                    Actions
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href='#' onClick={() => navigate('/asset-management/calendar')}>
                      Availability Calendar
                    </Dropdown.Item>
                    <ExportPdfExcel onExport={onExport} length={Number(columns?.length) - 4} />

                    {PermissionImport && features?.bulk_import === 1 && (
                      <Dropdown.Item
                        href='#'
                        onClick={() => {
                          navigate({pathname: '/tools/import', search: 'type=asset'})
                        }}
                      >
                        Import New Assets
                      </Dropdown.Item>
                    )}

                    <Dropdown.Item href='#' onClick={() => navigate('/asset-management/move')}>
                      Move
                    </Dropdown.Item>

                    {PermissionSetup && (
                      <Dropdown.Item href='#' onClick={() => navigate('/asset-management/columns')}>
                        Setup Column
                      </Dropdown.Item>
                    )}

                    <Dropdown.Item href='#' onClick={() => setShowModalQRCode(true)}>
                      Generate QR Code
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>

          <FilterColumns
            setPage={setPage}
            api={getAssetOptions}
            filterAll={filterAll}
            onChange={setFilterAll}
          />
        </div>

        <div className='card-body table-responsive'>
          <DataTable
            page={page}
            limit={limit}
            onEdit={onEdit}
            onSort={onSort}
            total={totalPage}
            render={onRender}
            columns={columns}
            onDelete={onDelete}
            onDetail={onDetail}
            onChecked={onChecked}
            edit={PermissionEdit}
            view={PermissionView}
            del={PermissionDelete}
            data={dataAssetManagement}
            onChangePage={onChangePage}
            onChangeLimit={onChangeLimit}
            loading={!assetManagementQuery?.isFetched || !columnsQuery?.isFetched}
          />
        </div>
      </div>

      <Alert
        loading={false}
        type={'delete'}
        body={messageAlert}
        title={'Delete Asset'}
        confirmLabel={'Delete'}
        showModal={showModalBulk}
        setShowModal={setShowModalConfirmBulk}
        onCancel={() => setShowModalConfirmBulk(false)}
        onConfirm={() => {
          setDataChecked([])
          onBulkDelete(dataChecked)
          setShowModalConfirmBulk(false)
        }}
      />

      <ModalQRCode setShowModal={setShowModalQRCode} showModal={showModalQRCode} />
    </>
  )
}

CardAssetManagement = memo(
  CardAssetManagement,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default CardAssetManagement
