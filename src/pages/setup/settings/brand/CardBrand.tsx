/* eslint-disable react-hooks/exhaustive-deps */
import {Alert} from '@components/alert'
import {DataTable} from '@components/datatable'
import {ExportPdfExcel} from '@components/export/ExportPdfExcel'
import {FilterAll, FilterColumns} from '@components/filter/FilterAll'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import ToolbarImport from '@components/ToolbarActions/import'
import {guidBulkChecked, hasPermission, KTSVG} from '@helpers'
import {useQuery} from '@tanstack/react-query'
import {FC, memo, useEffect, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'

import {AddBrand} from './AddBrand'
import {DetailBrand} from './DetailBrand'
import {exportBrand, getBrand, getBrandOptionsColumns} from './Service'

const label = 'Brand'
type Props = {
  onDelete: any
  reloadData: any
  onBulkDelete: any
  dataChecked: any
  setDataChecked: any
  page: number
  setPage: any
  setTotalPerPage: any
  totalPage: number
  setTotalPage: any
  resetKeyword: boolean
  setResetKeyword: any
  totalPerPage: any
}

const CardBrandCode: FC<Props> = ({
  onDelete,
  reloadData,
  onBulkDelete,
  dataChecked,
  setDataChecked,
  page,
  setPage,
  setTotalPerPage,
  totalPage,
  setTotalPage,
  resetKeyword,
  setResetKeyword,
  totalPerPage,
}) => {
  const [meta, setMeta] = useState<any>({})
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [filterAll, setFilterAll] = useState<any>({})

  const [brandDetail, setBrandDetail] = useState<any>()
  const [reloadBrand, setReloadBrand] = useState<any>([])
  const [messageAlert, setMessage] = useState<any>(false)
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('name')
  const [showModalAdd, setShowModal] = useState<boolean>(false)
  const [showModalDetail, setShowModalDetail] = useState<boolean>(false)
  const [showModalBulk, setShowModalConfirmBulk] = useState<boolean>(false)

  const PermissionExport: any = hasPermission('setting.brand.export') || false

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  const onExport = (e: string) => {
    exportBrand({type: e, keyword, ...(filterAll?.child || {})})
      .then(({data: {data, message}}: any) => {
        const {url} = data || {}
        ToastMessage({type: 'success', message})
        setTimeout(() => totalPage <= 500 && window.open(url, '_blank'), 2000)
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

  const onDetail = (e: any) => {
    setBrandDetail(e)
    setShowModalDetail(true)
  }

  const onEdit = (e: any) => {
    setBrandDetail(e)
    setShowModal(true)
  }

  // BulkDeleteMark
  const onChecked = (e: any) => {
    const ar_guid: any = guidBulkChecked(e)
    setDataChecked(ar_guid)
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const dataBrandParam: any = {
    page,
    limit,
    orderDir,
    orderCol,
    keyword,
    ...(filterAll?.child || {}),
  }
  const dataBrandQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getBrand', {...dataBrandParam, reloadBrand, reloadData}],
    queryFn: async () => {
      const res: any = await getBrand(dataBrandParam)
      const {total, from}: any = res?.data?.meta || {}
      setMeta(res?.data?.meta || {})
      setTotalPage(total || 0)
      setTotalPerPage(from)
      const dataResult: any = res?.data?.data?.map((brand: any) => {
        const {guid, name, manufacturer, manufacturer_model}: any = brand || {}
        const {name: manufacturer_model_name}: any = manufacturer_model || {}
        const {name: manufacturer_name}: any = manufacturer || {}
        return {
          original: brand,
          guid: guid,
          checkbox: brand,
          view: 'view',
          name,
          manufacturer_model_name: manufacturer_model_name || '-',
          manufacturer_name: manufacturer_name || '-',
          edit: 'Edit',
          delete: 'Delete',
        }
      })

      return dataResult
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })

  const dataBrand: any = dataBrandQuery?.data || []

  const columns: any = [
    {header: 'checkbox', width: '20px'},
    {header: 'View', width: '20px'},
    {header: 'Brand', sort: true, value: 'name'},
    {header: 'Model', sort: true, value: 'manufacturer_model_name'},
    {header: 'Manufacturer', sort: true, value: 'manufacturer_name'},
    {header: 'Edit', width: '20px'},
    {header: 'Delete', width: '20px'},
  ]

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
                    className='btn btn-sm btn-primary me-2'
                    data-cy='bulkDeleteBrand'
                    onClick={() => {
                      setShowModalConfirmBulk(true)
                      setMessage([
                        `Are you sure want to delete `,
                        <strong key='str1'>{dataChecked?.length || 0}</strong>,
                        ` ${dataChecked?.length > 1 ? 'brands' : 'brand'} ?`,
                      ])
                    }}
                  >
                    <span className='indicator-label'>Delete Selected</span>
                  </button>
                )}
                <button
                  className='btn btn-sm btn-primary'
                  type='button'
                  data-cy='addBrand'
                  onClick={() => {
                    setShowModal(true)
                    setBrandDetail(undefined)
                  }}
                >
                  + Add New {label || ''}
                </button>
              </div>
              <div className='dropdown' style={{marginRight: '5px'}}>
                <Dropdown>
                  <Dropdown.Toggle variant='light-primary' size='sm' data-cy='actionBrand'>
                    Actions
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {PermissionExport && <ExportPdfExcel onExport={onExport} />}
                    <ToolbarImport
                      type='brand'
                      pathName='/tools/import'
                      actionName='Import New Brand'
                      permission='import-export.import_brand'
                    />
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>

          <FilterColumns
            api={getBrandOptionsColumns}
            filterAll={filterAll}
            onChange={setFilterAll}
            setPage={setPage}
          />
        </div>

        <div className='card-body'>
          <DataTable
            page={page}
            limit={limit}
            onEdit={onEdit}
            onSort={onSort}
            data={dataBrand}
            loading={!dataBrandQuery?.isFetched}
            total={totalPage}
            columns={columns}
            onDelete={onDelete}
            onDetail={onDetail}
            onChecked={onChecked}
            onChangePage={onPageChange}
            onChangeLimit={onChangeLimit}
          />
        </div>
      </div>

      <AddBrand
        showModal={showModalAdd}
        brandDetail={brandDetail}
        reloadBrand={reloadBrand}
        setShowModal={setShowModal}
        setReloadBrand={setReloadBrand}
      />

      <DetailBrand
        brandDetail={brandDetail}
        showModal={showModalDetail}
        setShowModal={setShowModalDetail}
      />

      <Alert
        loading={false}
        type={'delete'}
        body={messageAlert}
        title={'Delete Brand'}
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
    </>
  )
}

const CardBrand = memo(
  CardBrandCode,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {CardBrand}
