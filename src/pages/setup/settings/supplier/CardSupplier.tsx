/* eslint-disable react-hooks/exhaustive-deps */
import {DataTable} from '@components/datatable'
import {matchColumns, toColumns} from '@components/dnd/table'
import {ExportPdfExcel} from '@components/export/ExportPdfExcel'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import ToolbarImport from '@components/ToolbarActions/import'
import {guidBulkChecked, hasPermission, KTSVG, setColumn} from '@helpers'
import {useQuery} from '@tanstack/react-query'
import {FC, memo, useEffect, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {useNavigate} from 'react-router-dom'

import {AddSupplier} from './AddSupplier'
import {DetailSupplier} from './DetailSupplier'
import {exportSupplier, getSupplier, getSupplierColumn} from './Service'

const label = 'Supplier'
type Props = {
  deleteReload: any
  setShowModalConfirmBulk: any
  dataChecked: any
  setDataChecked: any
  setSupplierName: any
  setSupplierGuid: any
  setShowModalConfirm: any
  page: any
  setPage: any
  setTotalPerPage: any
  totalPage: any
  setTotalPage: any
  setResetKeyword: any
  resetKeyword: any
  totalPerPage: any
}

let CardSupplier: FC<Props> = ({
  deleteReload,
  setShowModalConfirmBulk,
  dataChecked,
  setDataChecked,
  setSupplierName,
  setSupplierGuid,
  setShowModalConfirm,
  page,
  setPage,
  setTotalPerPage,
  totalPage,
  setTotalPage,
  setResetKeyword,
  resetKeyword,
  totalPerPage,
}) => {
  const navigate: any = useNavigate()
  const [meta, setMeta] = useState<any>({})
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('name')
  const [editCountry, setEditCountry] = useState<string>('')
  const [detailSupplier, setDetailSupplier] = useState<any>()
  const [reloadSupplier, setReloadSupplier] = useState<number>(1)
  const [showModalSupplier, setShowModalSupplier] = useState<boolean>(false)
  const [showModalSupplierDetail, setShowModalSupplierDetail] = useState<boolean>(false)

  const PermissionExport: any = hasPermission('setting.supplier.export') || false
  const setupColumn: any = hasPermission('setup-column.setup_column_supplier') || false

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  const onExport = (e: any) => {
    const fields: any = columns?.filter(({value}: any) => value)?.map(({value}: any) => value)
    exportSupplier({type: e, keyword, orderDir, orderCol, columns: fields?.join(',')})
      .then(({data: res}: any) => {
        const {data, message}: any = res || {}
        const {url}: any = data || {}
        ToastMessage({message, type: 'success'})
        totalPage <= 500 && window.open(url, '_blank')
      })
      .catch(({response}: any) => {
        const {message}: any = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }

  const onChangeLimit = (e: any) => {
    setLimit(e)
    setDataChecked([])
  }

  const onPageChange = (e: any) => {
    setPage(e)
    setDataChecked([])
  }

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e ? `*${e}*` : '')
  }

  const onDelete = (e: any) => {
    const {name, guid}: any = e || {}
    setSupplierName(name || '')
    setSupplierGuid(guid || '')
    setShowModalConfirm(true)
  }

  const onDetail = (e: any) => {
    setDetailSupplier(e)
    setShowModalSupplierDetail(true)
  }

  const onEdit = (e: any) => {
    setEditCountry('')
    setDetailSupplier(e)
    setShowModalSupplier(true)
  }

  const onChecked = (e: any) => {
    const ar_guid: any = guidBulkChecked(e)
    setDataChecked(ar_guid)
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onRender = (val: any) => ({
    contact_number: val && val?.length > 0 ? <span>{`+${val || ''}`}</span> : '-',
  })

  const columnsQuery: any = useQuery({
    queryKey: ['getSupplierColumn'],
    queryFn: async () => {
      const res: any = await getSupplierColumn()
      const {fields}: any = res?.data?.data || {}
      const mapColumns: any = toColumns(fields, {checked: true, order: true})?.map(
        ({value, label: header}: any) => {
          let val: any = header
          header === 'Address' && (val = 'Address 1')
          if (/Street\/Building/gi.test(header)) {
            val = 'Address 2'
          }
          return {
            value,
            header: val,
            sort: true,
          }
        }
      )
      const dataResult: any = setColumn(mapColumns)
      return dataResult
    },
  })
  const columns: any = columnsQuery?.data || []

  const dataSupplierParam: any = {page, limit, keyword, orderDir, orderCol}
  const dataSupplierQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getSupplier', {...dataSupplierParam, columns, reloadSupplier, deleteReload}],
    queryFn: async () => {
      if (columns?.length > 0) {
        const res: any = await getSupplier(dataSupplierParam)
        const {current_page, per_page, total}: any = res?.data?.meta || {}
        setLimit(per_page)
        setTotalPage(total)
        setPage(current_page)
        setMeta(res?.data?.meta || {})
        const dataResult: any = res?.data?.data?.map((m: any) => ({
          ...m,
          financial_year_begin: m?.financial_year_begin?.date_format || '-',
          address: m?.address_1 || '',
          street: m?.address_2 || '',
        }))

        setTotalPerPage(res?.data?.data?.length || 0)
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

  const dataSupplier: any = dataSupplierQuery?.data || []

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
            </div>

            <div className='d-flex my-1'>
              <div style={{marginRight: '5px'}}>
                {dataChecked?.length > 0 && (
                  <button
                    type='button'
                    data-cy='bulkDeleteSupplier'
                    className='btn btn-sm btn-primary me-2'
                    onClick={() => setShowModalConfirmBulk(true)}
                  >
                    <span className='indicator-label'>Delete Selected</span>
                  </button>
                )}

                <button
                  type='button'
                  data-cy='addSupplier'
                  className='btn btn-sm btn-primary'
                  onClick={() => {
                    setShowModalSupplier(true)
                    setDetailSupplier(undefined)
                  }}
                >
                  + Add New {label || ''}
                </button>
              </div>

              <div className='dropdown' style={{marginRight: '5px'}}>
                <Dropdown>
                  <Dropdown.Toggle
                    size='sm'
                    id='dropdown-basic'
                    variant='light-primary'
                    data-cy='actionSupplier'
                  >
                    Actions
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {PermissionExport && <ExportPdfExcel onExport={onExport} />}
                    <ToolbarImport
                      type='supplier'
                      pathName='/tools/import'
                      actionName='Import New Supplier'
                      permission='import-export.import_supplier'
                    />
                    {setupColumn && (
                      <Dropdown.Item
                        href='#'
                        data-cy='setupColumnSupplier'
                        onClick={() => navigate('/setup/settings/suppliers/columns')}
                      >
                        Setup Column
                      </Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>

        <div className='card-body'>
          <DataTable
            page={page}
            limit={limit}
            onEdit={onEdit}
            onSort={onSort}
            render={onRender}
            total={totalPage}
            loading={!dataSupplierQuery?.isFetched || !columnsQuery?.isFetched}
            columns={columns}
            data={dataSupplier}
            onDelete={onDelete}
            onDetail={onDetail}
            onChecked={onChecked}
            onChangePage={onPageChange}
            onChangeLimit={onChangeLimit}
          />
        </div>
      </div>

      <AddSupplier
        editCountry={editCountry}
        showModal={showModalSupplier}
        reloadSupplier={reloadSupplier}
        setEditCountry={setEditCountry}
        detailSupplier={detailSupplier}
        setShowModal={setShowModalSupplier}
        setReloadSupplier={setReloadSupplier}
      />

      <DetailSupplier
        detailSupplier={detailSupplier}
        showModal={showModalSupplierDetail}
        setShowModal={setShowModalSupplierDetail}
      />
    </>
  )
}

CardSupplier = memo(
  CardSupplier,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {CardSupplier}
