/* eslint-disable react-hooks/exhaustive-deps */
import {Alert} from '@components/alert'
import {DataTable} from '@components/datatable'
import {matchColumns, toColumns} from '@components/dnd/table'
import {ExportPdfExcel} from '@components/export/ExportPdfExcel'
import {FilterAll, FilterColumns} from '@components/filter/FilterAll'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import {guidBulkChecked, KTSVG, setColumn} from '@helpers'
import {
  exportItemCode,
  getColumn,
  getItemCode,
  getItemCodeOptionsColumns,
} from '@pages/setup/settings/item-code/Service'
import {useQuery} from '@tanstack/react-query'
import {FC, memo, useEffect, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {useNavigate} from 'react-router-dom'

import {AddItemCode} from './AddItemCode'
import {DetailItemCode} from './DetailItemCode'

const label = 'Item Code'
type Props = {
  onDelete: any
  reloadData: any
  onBulkDelete: any
  dataChecked: any
  setDataChecked: any
  setPage: any
  totalPage: any
  setTotalPage: any
  setPageFrom: any
  page: any
  resetKeyword: any
  setResetKeyword: any
}

let CardItemCode: FC<Props> = ({
  onDelete,
  reloadData,
  onBulkDelete,
  dataChecked,
  setDataChecked,
  page,
  setPage,
  totalPage,
  setTotalPage,
  resetKeyword,
  setPageFrom,
  setResetKeyword,
}) => {
  const navigate: any = useNavigate()

  const [meta, setMeta] = useState<any>({})
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [filterAll, setFilterAll] = useState<any>({})
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('code')
  const [messageAlert, setMessage] = useState<boolean>(false)
  const [totalPerPage, setTotalPerPage] = useState<number>(0)
  const [itemCodeDetail, setItemCodeDetail] = useState<any>()
  const [reloadItemCode, setReloadItemCode] = useState<any>([])
  const [showModalAdd, setShowModal] = useState<boolean>(false)
  const [showModalDetail, setShowModalDetail] = useState<boolean>(false)
  const [showModalBulk, setShowModalConfirmBulk] = useState<boolean>(false)

  const setMessageAlert: any = [
    `Are you sure want to delete `,
    <strong key='str1'>{dataChecked?.length || 0}</strong>,
    ` item code?`,
  ]

  const onExport = (e: string) => {
    exportItemCode({type: e, keyword, ...(filterAll?.child || {})})
      .then(({data: {data, message}}: any) => {
        ToastMessage({type: 'success', message})
        setTimeout(() => totalPage <= 500 && window.open(data.url, '_blank'), 2000)
      })
      .catch(({response}: any) => {
        const {message}: any = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }

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

  const onDetail = ({original}: any) => {
    setShowModalDetail(true)
    setItemCodeDetail(original || {})
  }

  const onEdit = ({original}: any) => {
    setShowModal(true)
    setItemCodeDetail(original || {})
  }

  const onChecked = (e: any) => {
    const ar_guid: any = guidBulkChecked(e)
    setDataChecked(ar_guid)
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const columnsQuery: any = useQuery({
    queryKey: ['getItemCodeColumn'],
    queryFn: async () => {
      const res: any = await getColumn()
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

  const dataItemCodeParam: any = {
    page,
    limit,
    orderDir,
    orderCol,
    keyword,
    ...(filterAll?.child || {}),
  }
  const dataItemCodeQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getItemCode', {...dataItemCodeParam, reloadItemCode, reloadData, columns}],
    queryFn: async () => {
      if (columns?.length > 0) {
        const res: any = await getItemCode(dataItemCodeParam)
        const {current_page, per_page, total, from}: any = res?.data?.meta || {}
        setLimit(per_page)
        setMeta(res?.data?.meta || {})
        setTotalPage(total)
        setPage(current_page)
        setPageFrom(from)
        const dataResult: any = res?.data?.data?.map((m: any) => ({
          ...m,
          original: m,
          category_name: m?.category?.name || '-',
          type_name: m?.type?.name || '-',
          manufacturer_name: m?.manufacturer?.name || '-',
          model_name: m?.manufacturer_model?.name || '-',
          brand_name: m?.manufacturer_brand?.name || '-',
        }))

        setTotalPerPage(dataResult?.length || 0)
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

  const dataItemCode: any = dataItemCodeQuery?.data || []

  useEffect(() => {
    if (totalPerPage === 0 && Object.keys(meta || {})?.length > 0) {
      setPage(meta?.current_page > 1 ? meta?.current_page - 1 : 1)
    }
  }, [totalPerPage, meta])

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
                    className='btn btn-sm btn-primary me-2'
                    onClick={() => {
                      setMessage(setMessageAlert)
                      setShowModalConfirmBulk(true)
                    }}
                  >
                    <span className='indicator-label'>Delete Selected</span>
                  </button>
                )}
                <button
                  className='btn btn-sm btn-primary'
                  type='button'
                  onClick={() => {
                    setShowModal(true)
                    setItemCodeDetail(undefined)
                  }}
                >
                  + Add New {label || ''}
                </button>
              </div>

              <div className='dropdown' style={{marginRight: '5px'}}>
                <Dropdown>
                  <Dropdown.Toggle variant='light-primary' size='sm'>
                    Actions
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <ExportPdfExcel onExport={onExport} />
                    <Dropdown.Item
                      href='#'
                      onClick={() => navigate('/setup/settings/item-codes/columns')}
                    >
                      Setup Column
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
          <FilterColumns
            api={getItemCodeOptionsColumns}
            filterAll={filterAll}
            onChange={setFilterAll}
          />
        </div>

        <div className='card-body'>
          <DataTable
            page={page}
            limit={limit}
            onEdit={onEdit}
            onSort={onSort}
            total={totalPage}
            loading={!dataItemCodeQuery?.isFetched || !columnsQuery?.isFetched}
            columns={columns}
            onDelete={onDelete}
            onDetail={onDetail}
            data={dataItemCode}
            onChecked={onChecked}
            onChangePage={onPageChange}
            onChangeLimit={onChangeLimit}
          />
        </div>
      </div>

      <AddItemCode
        detail={itemCodeDetail}
        showModal={showModalAdd}
        setShowModal={setShowModal}
        reloadItemCode={reloadItemCode}
        setReloadItemCode={setReloadItemCode}
      />

      <DetailItemCode
        showModal={showModalDetail}
        itemCodeDetail={itemCodeDetail}
        setShowModal={setShowModalDetail}
      />

      <Alert
        loading={false}
        type={'delete'}
        body={messageAlert}
        confirmLabel={'Delete'}
        showModal={showModalBulk}
        title={'Delete Item Code'}
        setShowModal={setShowModalConfirmBulk}
        onCancel={() => setShowModalConfirmBulk(false)}
        onConfirm={() => {
          setDataChecked([])
          onBulkDelete(dataChecked)
          setShowModalConfirmBulk(false)
        }}
      />
    </>
  )
}

CardItemCode = memo(
  CardItemCode,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {CardItemCode}
