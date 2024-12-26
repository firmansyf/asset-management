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
import {ModalMyAsset} from '@pages/setup/settings/feature/ModalMyAsset'
import {useQuery} from '@tanstack/react-query'
import moment from 'moment'
import qs from 'qs'
import {FC, memo, useEffect, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {useNavigate} from 'react-router-dom'

import {
  deleteBulkAsset,
  exportMyAsset,
  getAssetOptions,
  myAsset,
} from '../asset-management/redux/AssetRedux'
import {getColumnsMyAsset} from './Service'

const fieldSort: any = [
  'actual_date_received',
  'asset_assigned_audit',
  'asset_description',
  'asset_guid',
  'asset_id',
  'asset_name',
  'asset_part_number',
  'asset_type',
  'assign_asset',
  'assign_to',
  'assign_to_name',
  'assigned_user_guid',
  'audit_by',
  'audit_by_guid',
  'audit_location',
  'audit_status',
  'audit_timestamp',
  'brand_guid',
  'brand_name',
  'category_guid',
  'category_name',
  'cheque_date',
  'cheque_number',
  'computer',
  'data_source',
  'delivery_order_date',
  'delivery_order_number',
  'disposal_date',
  'guid',
  'has_checkout',
  'has_warranty',
  'invoice_date',
  'invoice_number',
  'is_non_fixed',
  'is_pre_asset',
  'location_gps_coordinate',
  'location_guid',
  'location_name',
  'location_sub_guid',
  'location_sub_name',
  'manufacturer_guid',
  'manufacturer_name',
  'model_guid',
  'model_name',
  'order_number',
  'owner_company',
  'owner_company_guid',
  'owner_department',
  'owner_department_guid',
  'part_number',
  'purchase_date',
  'purchase_price_currency',
  'qr_code',
  'serial_number',
  'status_comment',
  'status_guid',
  'status_name',
  'supplier_guid',
  'supplier_name',
  'total_cost',
  'total_quantity',
  'unit_cost',
  'voucher_date',
  'voucher_number',
]

let CardMyAsset: FC<any> = ({
  setAssetGuid,
  setAssetName,
  setShowModalConfirm,
  setReloadDelete,
  reloadDelete,
  user_guid,
  setDataChecked,
  dataChecked,
  page,
  setPage,
  pageFrom,
  setPageFrom,
  totalPage,
  setTotalPage,
  resetKeyword,
  setResetKeyword,
}) => {
  const navigate: any = useNavigate()
  const pref_date: any = preferenceDate()

  const [filter] = useState<any>({})
  const [limit, setLimit] = useState<number>(10)
  const [messageAlert, setMessage] = useState<any>()
  const [keyword, setKeyword] = useState<string>('')
  const [filterAll, setFilterAll] = useState<any>({})
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('asset_id')
  const [modalMyAsset, setModalMyAsset] = useState<boolean>(false)
  const [showModalBulk, setShowModalConfirmBulk] = useState<boolean>(false)

  const viewMyAsset: any = hasPermission('my-assets.view') || false
  const editMyAsset: any = hasPermission('my-assets.edit') || false
  const setupColumnMyAsset: any = hasPermission('setup-column.setup_column_myasset') || false

  const onExport = (e: any) => {
    const fields: any = columns?.filter(({value}: any) => value)?.map(({value}: any) => value)
    let filters: any = filterAll?.child || {}
    filters = qs.parse(filters)
    const params_filter: any = {
      ...filter,
      assigned_user_guid: user_guid || '',
    }

    exportMyAsset({
      type: e,
      keyword,
      orderDir,
      orderCol,
      filter: params_filter,
      export_type: 'my-asset',
      columns: fields?.join(','),
      ...filters,
    })
      .then(({data: {data, message}}: any) => {
        ToastMessage({type: 'success', message})
        const {url} = data || {}
        setTimeout(() => totalPage <= 500 && window.open(url, '_blank'), 1000)
      })
      .catch(({response}: any) => {
        const {message}: any = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }

  const onDelete = (e: any) => {
    const {guid, name}: any = e || {}
    setAssetGuid(guid || '')
    setAssetName(name || '')
    setShowModalConfirm(true)
  }

  const onDetail = ({asset_guid}: any) => {
    navigate(`/asset-management/detail/${asset_guid || ''}`)
  }

  const onEdit = ({asset_guid}: any) => {
    navigate(`/asset-management/edit?id=${asset_guid || ''}`)
  }

  const onChecked = (e: any) => {
    const ar_guid: any = guidBulkChecked(e)
    setDataChecked(ar_guid)
  }

  const onBulkDelete = (e: any) => {
    deleteBulkAsset({guids: e})
      .then(({data: {message}}: any) => {
        const total_data_page: number = totalPage - pageFrom
        if (total_data_page - dataChecked?.length === 0) {
          if (page > 1) {
            setPage(page - 1)
          } else {
            setPage(page)
            setResetKeyword(true)
          }
        } else {
          setPage(page)
        }
        setDataChecked([])
        setReloadDelete(reloadDelete + 1)
        ToastMessage({type: 'success', message})
      })
      .catch(({response}: any) => {
        const {message}: any = response?.data || {}
        ToastMessage({type: 'error', message})
      })
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e || '')
  }

  const onPage = (e: any) => {
    setPage(e || 1)
  }

  const onLimit = (e: any) => {
    setLimit(e || 10)
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

  const message_alert_bulk: any = [
    `Are you sure want to delete `,
    <strong key='str1'>{dataChecked?.length || 0}</strong>,
    ` ${dataChecked?.length > 1 ? 'my assets' : 'my asset'} ?`,
  ]

  const columnsQuery: any = useQuery({
    queryKey: ['getColumnsMyAsset'],
    queryFn: async () => {
      const res: any = await getColumnsMyAsset()
      const {fields}: any = res?.data?.data || {}
      const mapColumns: any = toColumns(fields, {checked: true, order: true})?.map(
        ({value, label: header, is_filter}: any) => {
          let head: any = header
          const change: string = 'Checkbox '
          header === 'Checkbox' && (head = change)
          return {
            value,
            header: head,
            sort: fieldSort?.includes(value),
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

  const myAssetQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: [
      'myAsset',
      {
        page,
        limit,
        keyword,
        reloadDelete,
        user_guid,
        orderDir,
        orderCol,
        columns,
        filterAll,
      },
    ],
    queryFn: async () => {
      if (columns && columns?.length > 0) {
        const filters: any = filterAll?.child || {}
        const params_filter: any = {
          assigned_user_guid: user_guid,
        }
        const res: any = await myAsset({
          page,
          keyword,
          orderCol,
          orderDir,
          limit: limit || 10,
          filter: params_filter,
          ...filters,
        })
        const {current_page, total, from}: any = res?.data?.meta || {}
        setPageFrom(from)
        setTotalPage(total)
        setPage(current_page)

        const resData: any = res?.data?.data?.map((m: any) => ({
          ...m,
          guid: m?.asset_guid,
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
  const dataAsset: any = myAssetQuery?.data || []

  useEffect(() => {
    useTimeOutMessage('clear', 2000)
  }, [])

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
              {viewMyAsset && (
                <>
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
                </>
              )}

              <FilterAll columns={columnsFilter} filterAll={filterAll} onChange={setFilterAll} />
            </div>

            <div className='d-flex my-1'>
              <div style={{marginRight: '5px'}}>
                {dataChecked?.length > 0 && (
                  <button
                    type='button'
                    className='btn btn-sm btn-primary me-2'
                    onClick={() => {
                      setShowModalConfirmBulk(true)
                      setMessage(message_alert_bulk)
                    }}
                  >
                    <span className='indicator-label'>Delete Selected</span>
                  </button>
                )}
              </div>

              <div className='setup-my-assets' style={{marginRight: '5px'}}>
                <button
                  className='btn btn-sm btn-primary me-2'
                  onClick={() => setModalMyAsset(true)}
                >
                  Setup My Assets
                </button>
              </div>

              <div className='dropdown' style={{marginRight: '5px'}}>
                <Dropdown>
                  <Dropdown.Toggle
                    size='sm'
                    data-cy='actions'
                    id='dropdown-basic'
                    variant='light-primary'
                  >
                    Actions
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <ExportPdfExcel onExport={onExport} length={Number(columns?.length) - 4} />
                    {setupColumnMyAsset && (
                      <Dropdown.Item onClick={() => navigate('/my-assets/columns')}>
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
            api={getAssetOptions}
            filterAll={filterAll}
            onChange={setFilterAll}
            params={{assigned_user_guid: user_guid}}
          />
        </div>

        <div className='card-body'>
          <DataTable
            page={page}
            limit={limit}
            onEdit={onEdit}
            onSort={onSort}
            data={dataAsset}
            total={totalPage}
            columns={columns}
            render={onRender}
            edit={editMyAsset}
            onDelete={onDelete}
            onDetail={onDetail}
            onChangePage={onPage}
            onChecked={onChecked}
            onChangeLimit={onLimit}
            loading={!myAssetQuery?.isFetched || !columnsQuery?.isFetched}
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
          onBulkDelete(dataChecked)
          setShowModalConfirmBulk(false)
        }}
      />

      <ModalMyAsset setShowModal={setModalMyAsset} showModal={modalMyAsset} />
    </>
  )
}

CardMyAsset = memo(
  CardMyAsset,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default CardMyAsset
