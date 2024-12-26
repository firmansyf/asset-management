/* eslint-disable react-hooks/exhaustive-deps */
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

import {getCategory} from '../categories/redux/CategoryCRUD'
import {AddType} from './AddType'
import {DetailType} from './DetailType'
import {exportType, getType, getTypeOptionsColumns} from './Service'

const label = 'Type'
type Props = {
  dataChecked: any
  reloadDelete: any
  setDataChecked: any
  setShowModalConfirmBulk: any
  setUserFullname: any
  setUserGuid: any
  setShowModalConfirm: any
  optCategory: any
  setOptionCategory: any
  page: any
  setPage: any
  setTotalPage: any
  totalPage: any
  setTotalPerPage: any
  setResetKeyword: any
  resetKeyword: any
}

let CardType: FC<Props> = ({
  dataChecked,
  reloadDelete,
  setDataChecked,
  setShowModalConfirmBulk,
  setUserFullname,
  setUserGuid,
  setShowModalConfirm,
  optCategory: _optCategory,
  setOptionCategory,
  page,
  setPage,
  setTotalPage,
  totalPage,
  setTotalPerPage,
  setResetKeyword,
  resetKeyword,
}) => {
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [typeDetail, setDetailType] = useState<any>()
  const [filterAll, setFilterAll] = useState<any>({})
  const [reloadType, setReloadType] = useState<number>(1)
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('name')
  const [showModalType, setShowModalType] = useState<boolean>(false)
  const [showModalTypeDetail, setShowModalTypeDetail] = useState<boolean>(false)

  const columns: any = [
    {header: 'checkbox', width: '20px'},
    {header: 'View', width: '20px'},
    {header: 'Type', value: 'name', sort: true},
    {header: 'Asset Category', value: 'category_name', sort: true},
    {header: 'Edit', width: '20px'},
    {header: 'Delete', width: '20px'},
  ]

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  const onExport = (e: any) => {
    const filters: any = filterAll?.child || {}
    const fields: any = columns
      ?.filter(({value}: any) => value)
      ?.map(({value}: any) => value)
      ?.join()
    exportType({type: e, orderDir, keyword, orderCol, columns: fields, ...filters})
      .then(({data: res}) => {
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
    setKeyword(e ? `*${e}*` : '')
  }

  const onDetail = (e: any) => {
    setDetailType(e)
    setShowModalTypeDetail(true)
  }

  const onEdit = (e: any) => {
    setDetailType(e)
    setShowModalType(true)
  }

  const onDelete = (e: any) => {
    const {name, guid} = e || {}
    setUserGuid(guid || '')
    setUserFullname(name || '')
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

  useEffect(() => {
    getCategory({}).then(({data: {data: res_category}}: any) => {
      setOptionCategory(res_category)
    })
  }, [setOptionCategory])

  const dataTypeParam: any = {
    page,
    limit,
    keyword,
    orderDir,
    orderCol,
    ...(filterAll?.child || {}),
  }
  const dataTypeQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getType', {...dataTypeParam, reloadType, reloadDelete}],
    queryFn: async () => {
      const res: any = await getType(dataTypeParam)
      const {total, from}: any = res?.data?.meta || {}
      setTotalPage(total)
      setTotalPerPage(from)
      const dataResult: any = res?.data?.data?.map((type: any) => {
        const {guid, name, category}: any = type || {}
        const {name: category_name}: any = category || {}
        return {
          original: type,
          checkbox: type,
          view: 'view',
          guid: guid,
          name: name,
          category_name: category_name || {},
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

  const dataType: any = dataTypeQuery?.data || []

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
                      setShowModalConfirmBulk(true)
                    }}
                  >
                    <span className='indicator-label'>Delete Selected</span>
                  </button>
                )}
                <button
                  className='btn btn-sm btn-primary'
                  type='button'
                  data-cy='addType'
                  onClick={() => {
                    setDetailType(undefined)
                    setShowModalType(true)
                  }}
                >
                  + Add New {label}
                </button>
              </div>
              <div className='dropdown' style={{marginRight: '5px'}}>
                <Dropdown>
                  <Dropdown.Toggle variant='light-primary' size='sm' id='dropdown-basic'>
                    Actions
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {hasPermission('setting.type.export') && <ExportPdfExcel onExport={onExport} />}
                    <ToolbarImport
                      actionName='Import New Type'
                      pathName='/tools/import'
                      type='type'
                      permission='import-export.import_type'
                    />
                  </Dropdown.Menu>
                </Dropdown>
                {/* <Export onExport={onExport} /> */}
              </div>
            </div>
          </div>
          <FilterColumns
            api={getTypeOptionsColumns}
            filterAll={filterAll}
            onChange={setFilterAll}
            setPage={setPage}
          />
        </div>
        <div className='card-body'>
          <DataTable
            page={page}
            loading={!dataTypeQuery?.isFetched}
            limit={limit}
            total={totalPage}
            data={dataType}
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

      <AddType
        showModal={showModalType}
        setShowModal={setShowModalType}
        setReloadType={setReloadType}
        reloadType={reloadType}
        typeDetail={typeDetail}
      />

      <DetailType
        data={typeDetail}
        show={showModalTypeDetail}
        onHide={() => setShowModalTypeDetail(false)}
        setShowModal={() => setShowModalTypeDetail(false)}
      />
    </>
  )
}

CardType = memo(CardType, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default CardType
