/* eslint-disable react-hooks/exhaustive-deps */
import {
  checkDeleteBulkStatus,
  exportCompany,
  getCompany,
  getCompanyOptionsColumns,
} from '@api/company'
import {getCompanyColumn} from '@api/Service'
import {DataTable} from '@components/datatable'
import {matchColumns, toColumns} from '@components/dnd/table'
import {ExportPdfExcel} from '@components/export/ExportPdfExcel'
import {FilterAll, FilterColumns} from '@components/filter/FilterAll'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import ToolbarImport from '@components/ToolbarActions/import'
import {hasPermission, KTSVG, permissionValidator, setColumn} from '@helpers'
import {useQuery} from '@tanstack/react-query'
import {FC, useEffect, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {useNavigate} from 'react-router-dom'

import {DetailCompany} from './DetailCompany'

const label: any = 'Company'

type Props = {
  onDelete: any
  reloadDelete: any
  dataChecked: any
  setDataChecked: any
  setShowModalConfirmBulk: any
  reloadCompany: any
  setReloadCompany: any
  setAssignCompany: any
  setLoading: any
  setCheckErrorStatusDeleteBulk: any
  setCantDeleteInfoBulk: any
  companyDetail?: any
  setCompanyDetail: any
  setShowModalAdd: any
  deletePermission: any
  setDataCheckedSelect: any
  setPage: any
  page: any
  setTotalPerPage: any
  resetKeyword: any
  setResetKeyword: any
  totalPage: any
  setTotalPage: any
  totalPerPage: any
}

const CardCompany: FC<Props> = ({
  onDelete,
  reloadDelete,
  dataChecked,
  setDataChecked,
  setShowModalConfirmBulk,
  reloadCompany,
  setReloadCompany,
  setAssignCompany,
  setLoading,
  setCheckErrorStatusDeleteBulk,
  setCantDeleteInfoBulk,
  companyDetail,
  setCompanyDetail,
  setShowModalAdd,
  deletePermission,
  setDataCheckedSelect,
  setPage,
  page,
  setTotalPerPage,
  resetKeyword,
  setResetKeyword,
  totalPage,
  setTotalPage,
  totalPerPage,
}) => {
  const navigate = useNavigate()
  const setupColumnCompany: any = hasPermission('setup-column.setup_column_company') || false

  const [meta, setMeta] = useState<any>()
  const [filter] = useState<any>([])
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [filterAll, setFilterAll] = useState<any>({})

  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('name')
  const [showModalDetail, setShowModalDetail] = useState<boolean>(false)

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  const onExport = (e: any) => {
    const fields: any = columns?.filter(({value}: any) => value)?.map(({value}: any) => value)
    exportCompany({
      type: e,
      orderDir,
      orderCol,
      columns: fields?.join(','),
      keyword,
      ...(filterAll?.child || {}),
    })
      .then(({data: res}) => {
        const {data, message}: any = res || {}
        const {url}: any = data || {}
        ToastMessage({message, type: 'success'})
        setTimeout(() => {
          if (totalPage <= 500) {
            window.open(url, '_blank')
          }
        }, 2000)
      })
      .catch(({response}: any) => {
        const {message} = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }

  const onChangeLimit = (e: any) => {
    setDataChecked([])
    setLimit(e)
  }

  const onPageChange = (e: any) => {
    setDataChecked([])
    setPage(e)
  }

  const onDetail = (e: any) => {
    setCompanyDetail(e)
    setShowModalDetail(true)
  }

  const onAdd = () => {
    setCompanyDetail(undefined)
    setShowModalAdd(true)
  }

  const onEdit = (e: any) => {
    setCompanyDetail(e)
    setShowModalAdd(true)
  }

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e ? `*${e}*` : '')
  }

  const onChecked = (e: any) => {
    const ar_guid: any = []
    const ar_select: any = []
    e?.forEach((ck: any) => {
      const {checked}: any = ck
      if (checked) {
        const {original}: any = ck
        const {guid, name}: any = original || {}
        ar_guid?.push(guid)
        ar_select?.push({
          value: guid,
          label: name,
        })
      }
    })
    setDataChecked(ar_guid)
    setDataCheckedSelect(ar_select)
  }

  const onDeleteBulk = () => {
    if (!deletePermission) {
      permissionValidator(deletePermission, 'Delete Company')
    } else {
      setShowModalConfirmBulk(true)
      checkDeleteBulkStatus({guids: dataChecked})
        .then(({data: {error}}: any) => setCheckErrorStatusDeleteBulk(error))
        .catch(({response}: any) => {
          const {error, data}: any = response?.data || {}
          const {data: res}: any = data || {}

          const reassign_name: any = []
          res?.map((item: any) => reassign_name?.push(item?.name))
          setCantDeleteInfoBulk(reassign_name as never[])
          setCheckErrorStatusDeleteBulk(error)
          setLoading(false)
        })
    }
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const columnsQuery: any = useQuery({
    queryKey: ['getCompanyColumn'],
    queryFn: async () => {
      const res: any = await getCompanyColumn()
      const {fields}: any = res?.data?.data || {}
      const mapColumns: any = toColumns(fields, {checked: true, order: true})?.map(
        ({value, label: header}: any) => {
          return {
            value,
            header,
            sort: true,
          }
        }
      )
      const dataResult: any = setColumn(mapColumns)
      return dataResult
    },
  })
  const columns: any = columnsQuery?.data || []

  const dataCompanyQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: [
      'getCompany',
      {
        page,
        limit,
        keyword,
        filter,
        reloadCompany,
        reloadDelete,
        orderDir,
        orderCol,
        filterAll,
        columns,
      },
    ],
    queryFn: async () => {
      if (columns?.length > 0) {
        const res: any = await getCompany({
          page,
          limit,
          keyword,
          orderDir,
          orderCol,
          ...(filterAll?.child || {}),
        })
        const {current_page, per_page, total, from}: any = res?.data?.meta || {}
        setLimit(per_page)
        setTotalPage(total)
        setTotalPerPage(from)
        setPage(current_page)
        setMeta(res?.data?.meta || {})
        const dataResult: any = res?.data?.data?.map((m: any) => ({
          ...m,
          original: m,
          country: m?.country?.name || '-',
          financial_year_begin: m?.financial_year_begin?.date_format || '-',
        }))

        const assign: any = res?.data?.data?.map(({guid, name}: any) => ({
          value: guid,
          label: name,
        }))
        setAssignCompany(assign)
        return matchColumns(dataResult, columns)
      } else {
        return []
      }
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })

  const dataCompany: any = dataCompanyQuery?.data || []

  useEffect(() => {
    if (totalPerPage === 0 && Object.keys(meta || {})?.length > 0) {
      setPage(meta?.current_page > 1 ? meta?.current_page - 1 : 1)
    }
  }, [totalPerPage, meta, setPage])

  useEffect(() => {
    if (resetKeyword) {
      onSearch('')
      setResetKeyword(false)
    }
  }, [resetKeyword, setResetKeyword])

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
              <FilterAll columns={columns} filterAll={filterAll} onChange={setFilterAll} />
            </div>
            <div className='d-flex my-1'>
              <div style={{marginRight: '5px'}}>
                {dataChecked?.length > 0 && (
                  <button
                    type='button'
                    data-cy='btnBulkDelete'
                    className='btn btn-sm btn-primary me-2'
                    onClick={() => onDeleteBulk()}
                  >
                    <span className='indicator-label'>Delete Selected</span>
                  </button>
                )}
                <button
                  className='btn btn-sm btn-primary'
                  data-cy='addCompany'
                  type='button'
                  onClick={onAdd}
                >
                  + Add New {label}
                </button>
              </div>
              <div className='dropdown' data-cy='actions' style={{marginRight: '5px'}}>
                <Dropdown>
                  <Dropdown.Toggle variant='light-primary' size='sm' id='dropdown-basic'>
                    Actions
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {hasPermission('setting.company.export') && (
                      <ExportPdfExcel onExport={onExport} />
                    )}
                    <ToolbarImport
                      type='company'
                      pathName='/tools/import'
                      actionName='Import New Company'
                      permission='import-export.import_company'
                    />
                    {setupColumnCompany && (
                      <Dropdown.Item
                        href='#'
                        onClick={() => navigate('/setup/settings/company/columns')}
                      >
                        Setup Column
                      </Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>

          <FilterColumns
            api={getCompanyOptionsColumns}
            filterAll={filterAll}
            onChange={setFilterAll}
            setPage={setPage}
          />
        </div>
        <div className='card-body'>
          <DataTable
            page={page}
            loading={!dataCompanyQuery?.isFetched || !columnsQuery?.isFetched}
            limit={limit}
            total={totalPage}
            data={dataCompany}
            columns={columns}
            onChangePage={onPageChange}
            onChangeLimit={onChangeLimit}
            onDelete={onDelete}
            onDetail={onDetail}
            onEdit={onEdit}
            onChecked={onChecked}
            onSort={onSort}
          />
        </div>
      </div>

      <DetailCompany
        showModal={showModalDetail}
        setShowModal={setShowModalDetail}
        companyDetail={companyDetail}
        reloadCompany={reloadCompany}
        setReloadCompany={setReloadCompany}
      />
    </>
  )
}

export {CardCompany}
