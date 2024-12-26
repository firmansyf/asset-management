/* eslint-disable react-hooks/exhaustive-deps */
import {Alert} from '@components/alert'
import {DataTable} from '@components/datatable'
import {matchColumns, toColumns} from '@components/dnd/table'
import {ExportPdfExcel} from '@components/export/ExportPdfExcel'
import {FilterAll, FilterColumns} from '@components/filter/FilterAll'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import ToolbarImport from '@components/ToolbarActions/import'
import {hasPermission, preferenceDate, setColumn} from '@helpers'
import {useQuery} from '@tanstack/react-query'
import moment from 'moment'
import {FC, memo, useCallback, useEffect, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {useNavigate} from 'react-router-dom'

import {
  deleteBulkInsurancePolicies,
  exportInsurancePolicies,
  getDetailInsurancePolicies,
  getInsurancePolicies,
  getPolicyOptionsColumns,
  getSetupColumnInsurancePolice,
} from './Service'

let CardPolicy: FC<any> = ({
  setShowModalConfirm,
  setShowModalPolicy,
  setPolicyDetail,
  reloadPolicy,
  reloadDelete,
  loading,
  setLoading,
  setReloadPolicy,
  dataChecked,
  setDataChecked,
  setPolicyName,
  setDefaultPhoneNumber,
  setMode = () => '',
  page,
  setPage,
  pageFrom,
  setPageFrom,
  totalPage,
  setTotalPage,
  loadingDeleteOnFilter,
  setLoadingDeleteOnFilter,
  resetKeyword,
  setResetKeyword,
  filterAll,
  setFilterAll,
}) => {
  const navigate: any = useNavigate()
  const pref_date: any = preferenceDate()

  const [meta, setMeta] = useState<any>({})
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('name')
  const [totalPerPage, setTotalPerPage] = useState<number>(0)
  const [showModalBulk, setShowModalConfirmBulk] = useState<boolean>(false)

  const PermissionAdd: any = hasPermission('insurance_policy.add') || false
  const PermissionEdit: any = hasPermission('insurance_policy.edit') || false
  const PermissionView: any = hasPermission('insurance_policy.view') || false
  const PermissionDelete: any = hasPermission('insurance_policy.delete') || false
  const PermissionSetup: any =
    hasPermission('setup-column.setup_column_insurance_policies') || false

  const msg_alert_bulk_delete: any = [
    'Are you sure you want to delete',
    <strong key='full_name'> {dataChecked?.length || 0} </strong>,
    'insurance data?',
  ]

  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
  }

  const onPageChange = (e: any) => {
    setPage(e)
  }

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e ? `*${e}*` : '')
  }

  const onDetail = (e: any) => {
    setMode('view')
    const {guid}: any = e || {}
    navigate(`/insurance/policies/detail/${guid || ''}`)
  }

  const onDelete = (e: any) => {
    const {name}: any = e || {}
    setPolicyDetail(e || {})
    setPolicyName(name || '')
    setShowModalConfirm(true)
  }

  const onEdit = ({guid}: any) => {
    setMode('edit')
    getDetailInsurancePolicies(guid).then(({data: {data: res}}: any) => {
      setShowModalPolicy(true)
      setPolicyDetail(res || {})
      const phoneNumber: any = res?.phone_number ? res?.phone_number?.replace('+', '') : ''
      setDefaultPhoneNumber(phoneNumber?.replace('-', '') || '')
    })
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onChecked = (e: any) => {
    const ar_guid: any = []
    e?.forEach((ticked: any) => {
      const {checked} = ticked || {}
      if (checked) {
        const {original} = ticked || {}
        const {guid} = original || {}
        ar_guid?.push(guid)
      }
    })
    setDataChecked(ar_guid as never[])
  }

  const onRender = (val: any) => ({
    is_active: (
      <span className={`badge badge-light-${val ? 'success' : 'info'}`}>
        {val ? 'Active' : 'Inactive'}
      </span>
    ),
    start_date: val ? moment(val || '')?.format(pref_date) : '-',
    end_date: val ? moment(val || '')?.format(pref_date) : '-',
    status: () => {
      switch (val?.toLowerCase()) {
        case 'active':
          return <span className='badge badge-light-success'>{val || ''}</span>
        case 'expired':
          return <span className='badge badge-light-danger'>{val || ''}</span>
        case 'expiring':
          return <span className='badge badge-light-info'>{val || ''}</span>
        default:
          return <span className='badge rounded-pill badge-light text-dark'>{val || ''}</span>
      }
    },
  })

  const onExport = (e: any) => {
    const filters: any = filterAll?.child || {}
    const fields: any = columns
      ?.filter(({value}: any) => value)
      ?.map(({value}: any) => value)
      ?.join()

    exportInsurancePolicies({type: e, orderDir, orderCol, keyword, columns: fields, ...filters})
      .then(({data: res}: any) => {
        const {data, message}: any = res || {}
        const {url}: any = data || {}
        ToastMessage({message, type: 'success'})
        setTimeout(() => totalPage <= 500 && window.open(url, '_blank'), 1000)
      })
      .catch(({response}: any) => {
        const {message} = response?.data || {}
        ToastMessage({type: 'error', message})
      })
  }

  const confirmDeleteBulkPolicies = useCallback(() => {
    setLoading(true)
    deleteBulkInsurancePolicies({guids: dataChecked})
      .then(({data: {message}}: any) => {
        const total_data_page: number = totalPage - pageFrom

        setFilterAll({})
        setLoading(false)
        setDataChecked([])
        setResetKeyword(true)
        setShowModalConfirmBulk(false)
        setReloadPolicy(reloadPolicy + 1)
        ToastMessage({type: 'success', message})
        setLoadingDeleteOnFilter(loadingDeleteOnFilter + 1)
        setPage(total_data_page - dataChecked?.length <= 0 ? page - 1 : page)
      })
      .catch(({response}: any) => {
        setLoading(false)
        const {message} = response?.data || {}
        ToastMessage({type: 'error', message})
      })
  }, [setDataChecked, dataChecked, reloadPolicy, setLoading, setReloadPolicy])

  const columnsQuery: any = useQuery({
    queryKey: ['getSetupColumnInsurancePolice'],
    queryFn: async () => {
      const res: any = await getSetupColumnInsurancePolice({})
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

  const insurancePoliciesQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: [
      'getAsset',
      {
        page,
        limit,
        keyword,
        reloadDelete,
        reloadPolicy,
        orderDir,
        orderCol,
        columns,
        filterAll,
      },
    ],
    queryFn: async () => {
      if (columns?.length > 0) {
        const filters: any = filterAll?.child || {}
        const res: any = await getInsurancePolicies({
          page,
          limit,
          keyword,
          orderDir,
          orderCol,
          ...filters,
        })
        const {current_page, per_page, total, from}: any = res?.data?.meta || {}
        setPageFrom(from)
        setLimit(per_page)
        setMeta(meta || {})
        setTotalPage(total)
        setPage(current_page)
        const resData: any = res?.data?.data?.map((m: any) => ({
          ...m,
          start_date: moment(m?.start_date || '')?.format('YYYY-MM-DD'),
          end_date: moment(m?.end_date || '')?.format('YYYY-MM-DD'),
          limit: (m?.currency_limit ? m?.currency_limit?.currency + ' ' : '') + m?.limit,
          premium: (m?.currency_premium ? m?.currency_premium?.currency + ' ' : '') + m?.premium,
          deductible:
            (m?.currency_deductible ? m?.currency_deductible?.currency + ' ' : '') + m?.deductible,
          is_active: m?.is_active !== 1 ? 0 : 1,
        }))
        setTotalPerPage(resData?.length || 0)
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
  const dataInsurancePolicies: any = insurancePoliciesQuery?.data || []

  useEffect(() => {
    if (totalPerPage === 0 && Object.keys(meta || {})?.length > 0) {
      setPage(meta?.current_page > 1 ? meta?.current_page - 1 : 1)
    }
  }, [loadingDeleteOnFilter, meta, totalPerPage])

  useEffect(() => {
    if (resetKeyword) {
      onSearch('')
      setResetKeyword(false)
    }
  }, [resetKeyword])

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  return (
    <div className='card card-custom card-table'>
      <div className='card-table-header'>
        <div className='d-flex flex-wrap flex-stack'>
          <div className='d-flex align-items-center position-relative me-4 my-1'>
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
                  data-cy='bulkDelete'
                  className='btn btn-sm btn-primary me-2'
                  onClick={() => setShowModalConfirmBulk(true)}
                >
                  <span className='indicator-label'>Delete Selected</span>
                </button>
              )}

              {PermissionAdd && insurancePoliciesQuery?.isFetched && (
                <button
                  type='button'
                  data-cy='addInsurancePolicy'
                  className='btn btn-sm btn-primary'
                  onClick={() => {
                    setMode('edit')
                    setShowModalPolicy(true)
                    setPolicyDetail(undefined)
                  }}
                >
                  + Add New Policy
                </button>
              )}
            </div>

            <div className='dropdown' style={{marginRight: '5px'}}>
              <Dropdown>
                <Dropdown.Toggle variant='light-primary' size='sm' id='dropdown-basic'>
                  Actions
                </Dropdown.Toggle>
                <Dropdown.Menu className='ml-auto'>
                  {PermissionEdit && <ExportPdfExcel onExport={onExport} />}
                  <ToolbarImport
                    type='insurance-policy'
                    pathName='/tools/import'
                    actionName='Import New Insurance Policies'
                    permission='import-export.import_insurance_policies'
                  />
                  {PermissionSetup && (
                    <Dropdown.Item href='#' onClick={() => navigate('/insurance/policies/columns')}>
                      Setup Column
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>

        <FilterColumns
          filterAll={filterAll}
          onChange={setFilterAll}
          api={getPolicyOptionsColumns}
        />
      </div>

      <div className='card-body'>
        <DataTable
          page={page}
          limit={limit}
          onEdit={onEdit}
          onSort={onSort}
          columns={columns}
          total={totalPage}
          render={onRender}
          onDelete={onDelete}
          onDetail={onDetail}
          onChecked={onChecked}
          edit={PermissionEdit}
          view={PermissionView}
          del={PermissionDelete}
          data={dataInsurancePolicies}
          onChangePage={onPageChange}
          onChangeLimit={onChangeLimit}
          loading={!insurancePoliciesQuery?.isFetched || !columnsQuery?.isFetched}
        />

        <Alert
          type={'delete'}
          loading={loading}
          confirmLabel={'Delete'}
          showModal={showModalBulk}
          body={msg_alert_bulk_delete}
          title={'Delete Insurance Policy'}
          setShowModal={setShowModalConfirmBulk}
          onConfirm={() => confirmDeleteBulkPolicies()}
          onCancel={() => setShowModalConfirmBulk(false)}
        />
      </div>
    </div>
  )
}

CardPolicy = memo(CardPolicy)
export {CardPolicy}
