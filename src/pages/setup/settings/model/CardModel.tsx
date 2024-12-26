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

import {AddManufacturer} from '../manufacture/AddManufacturer'
import {AddModel} from './AddModel'
import {DetailModel} from './DetailModel'
import {exportModel, getModel, getModelOptionsColumns} from './Service'

const label = 'Model'
type Props = {
  onDelete: any
  onBulkDelete: any
  reloadDelete: any
  dataChecked: any
  setDataChecked: any
  page: any
  setPage: any
  setTotalPerPage: any
  totalPage: any
  setTotalPage: any
  resetKeyword: any
  setResetKeyword: any
  totalPerPage: any
}

let CardModel: FC<Props> = ({
  onDelete,
  onBulkDelete,
  reloadDelete,
  dataChecked,
  setDataChecked,
  page,
  setPage,
  setTotalPerPage,
  totalPage,
  setTotalPage,
  setResetKeyword,
  resetKeyword,
  totalPerPage,
}) => {
  const [meta, setMeta] = useState<any>({})
  const [limit, setLimit] = useState<number>(10)
  const [filtermanufacturer] = useState<string>('')
  const [keyword, setKeyword] = useState<string>('')
  const [filterAll, setFilterAll] = useState<any>({})
  const [detailModel, setDetailModel] = useState<any>()
  const [messageAlert, setMessage] = useState<any>(false)
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('name')
  const [reloadModel, setReloadModel] = useState<number>(1)
  const [showModalAdd, setShowModalAdd] = useState<boolean>(false)
  const [manufacturerDetail, setManufacturerDetail] = useState<any>()
  const [showModalDetail, setShowModalDetail] = useState<boolean>(false)
  const [reloadManufacturer, setReloadManufacturer] = useState<number>(0)
  const [showModalBulk, setShowModalConfirmBulk] = useState<boolean>(false)
  const [showModalManufacturer, setShowModalManufacturer] = useState<boolean>(false)

  const PermissionExport: any = hasPermission('setting.model.export') || false

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  const columns: any = [
    {header: 'checkbox', width: '20px'},
    {header: 'View', width: '20px'},
    {header: 'Model', value: 'name', sort: true},
    {header: 'Manufacturer', value: 'manufacturer_name', sort: true},
    {header: 'Edit', width: '20px'},
    {header: 'Delete', width: '20px'},
  ]

  const setMessageAlert: any = [
    `Are you sure want to delete `,
    <strong key='chcek-bulk'>{dataChecked?.length || 0}</strong>,
    ` ${dataChecked?.length > 1 ? 'models' : 'model'} ?`,
  ]

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  const onExport = (e: string) => {
    exportModel({type: e, keyword, ...(filterAll?.child || {})})
      .then(({data: res}) => {
        const {data, message}: any = res || {}
        const {url}: any = data || {}
        ToastMessage({message, type: 'success'})
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
    setDetailModel(e)
    setShowModalDetail(true)
  }

  const onChecked = (e: any) => {
    const ar_guid: any = guidBulkChecked(e)
    setDataChecked(ar_guid)
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onEdit = (e: any) => {
    setDetailModel(e)
    setShowModalAdd(true)
  }

  const dataModelParam: any = {
    page,
    limit,
    keyword,
    orderCol,
    orderDir,
    ...(filterAll?.child || {}),
  }
  const dataModelQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getModel', {...dataModelParam, reloadModel, reloadDelete, filtermanufacturer}],
    queryFn: async () => {
      const res: any = await getModel(dataModelParam, filtermanufacturer)
      const {total, from}: any = res?.data?.meta || {}
      setMeta(res?.data?.meta || {})
      setTotalPage(total)
      setTotalPerPage(from)
      const dataResult: any = res?.data?.data?.map((model: any) => {
        const {guid, name, manufacturer}: any = model || {}
        const {name: manufacture_name}: any = manufacturer || {}
        return {
          original: model,
          guid: guid,
          checkbox: model,
          view: 'view',
          name,
          manufacture_name: manufacture_name || '-',
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

  const dataModel: any = dataModelQuery?.data || []

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
                    onClick={() => {
                      setMessage(setMessageAlert)
                      setShowModalConfirmBulk(true)
                    }}
                  >
                    <span className='indicator-label'>Delete Selected</span>
                  </button>
                )}

                <button
                  type='button'
                  data-cy='addModel'
                  className='btn btn-sm btn-primary'
                  onClick={() => {
                    setShowModalAdd(true)
                    setDetailModel(undefined)
                  }}
                >
                  + Add New {label || ''}
                </button>
              </div>

              <div className='dropdown' data-cy='actions' style={{marginRight: '5px'}}>
                <Dropdown>
                  <Dropdown.Toggle variant='light-primary' size='sm' id='dropdown-basic'>
                    Actions
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {PermissionExport && <ExportPdfExcel onExport={onExport} />}
                    <ToolbarImport
                      actionName='Import New Model'
                      pathName='/tools/import'
                      type='model'
                      permission='import-export.import_model'
                    />
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
          <FilterColumns
            api={getModelOptionsColumns}
            filterAll={filterAll}
            onChange={setFilterAll}
            setPage={setPage}
          />
        </div>

        <div className='card-body'>
          <DataTable
            page={page}
            loading={!dataModelQuery?.isFetched}
            limit={limit}
            onEdit={onEdit}
            onSort={onSort}
            data={dataModel}
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

      <DetailModel
        modelDetail={detailModel}
        showModal={showModalDetail}
        setShowModal={setShowModalDetail}
      />

      <AddModel
        showModal={showModalAdd}
        modelDetail={detailModel}
        reloadModel={reloadModel}
        setShowModal={setShowModalAdd}
        setReloadModel={setReloadModel}
        reloadManufacturer={reloadManufacturer}
        setManufacturerDetail={setManufacturerDetail}
        setShowModalManufacturer={setShowModalManufacturer}
      />

      <AddManufacturer
        showModal={showModalManufacturer}
        reloadManufacturer={reloadManufacturer}
        manufacturerDetail={manufacturerDetail}
        setShowModal={setShowModalManufacturer}
        setReloadManufacturer={setReloadManufacturer}
      />

      <Alert
        loading={false}
        type={'delete'}
        body={messageAlert}
        title={'Delete Model'}
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

CardModel = memo(CardModel, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default CardModel
