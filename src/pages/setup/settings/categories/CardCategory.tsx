/* eslint-disable react-hooks/exhaustive-deps */
import {DataTable} from '@components/datatable'
import {ExportPdfExcel} from '@components/export/ExportPdfExcel'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import ToolbarImport from '@components/ToolbarActions/import'
import {guidBulkChecked, hasPermission, KTSVG} from '@helpers'
import {useQuery} from '@tanstack/react-query'
import {FC, useEffect, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'

import {checkCategoryDeleteBulkStatus, exportCategory, getCategory} from './redux/CategoryCRUD'

type Props = {
  onDelete: any
  onDetail: any
  setShowModalCategory: any
  setDetailCategory: any
  reloadCategory: any
  setAssignCategory: any
  dataChecked: any
  setDataChecked: any
  setCheckErrorStatusDeleteBulk: any
  setCantDeleteInfoBulk: any
  setShowModalConfirmBulk: any
  setTotalPerPage: any
  page: any
  setPage: any
  resetKeyword: any
  setResetKeyword: any
  setTotalPage: any
  totalPage: any
  totalPerPage: any
}

const CardCategory: FC<Props> = ({
  onDelete,
  onDetail,
  setShowModalCategory,
  setDetailCategory,
  reloadCategory,
  setAssignCategory,
  dataChecked,
  setDataChecked,
  setCheckErrorStatusDeleteBulk,
  setCantDeleteInfoBulk,
  setShowModalConfirmBulk,
  setTotalPerPage,
  page,
  setPage,
  resetKeyword,
  setResetKeyword,
  setTotalPage,
  totalPage,
  totalPerPage,
}) => {
  const [meta, setMeta] = useState<any>({})
  const [reloadDelete] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('name')
  const PermissionExport: any = hasPermission('setting.category.export') || false

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  const onExport = (e: string) => {
    exportCategory({type: e, keyword}).then(({data: res}: any) => {
      const {data, message}: any = res || {}
      const {url}: any = data || {}
      ToastMessage({message, type: 'success'})
      setTimeout(() => totalPage <= 500 && window.open(url, '_blank'), 2000)
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

  const onEdit = (e: any) => {
    setDetailCategory(e)
    setShowModalCategory(true)
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onChecked = (e: any) => {
    const ar_guid: any = guidBulkChecked(e)
    setDataChecked(ar_guid)
  }

  const onDeleteBulk = () => {
    setShowModalConfirmBulk(true)
    checkCategoryDeleteBulkStatus({guids: dataChecked})
      .then(({data: {error}}: any) => setCheckErrorStatusDeleteBulk(error))
      .catch(({response}: any) => {
        const {error, data}: any = response?.data || {}
        const {data_category}: any = data || {}

        const reassign_name: any = []
        data_category?.map((item: any) => reassign_name?.push(item))
        setCantDeleteInfoBulk(reassign_name as never[])
        setCheckErrorStatusDeleteBulk(error)
      })
  }

  const dataCategoryQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: [
      'getCategory',
      {page, limit, keyword, orderDir, orderCol, reloadCategory, reloadDelete},
    ],
    queryFn: async () => {
      const res: any = await getCategory({page, limit, keyword, orderDir, orderCol})
      const {total, from}: any = res?.data?.meta || {}
      setMeta(res?.data?.meta || {})
      setTotalPage(total || 0)
      setTotalPerPage(from)
      const dataResult: any = res?.data?.data?.map((category: any) => {
        const {guid, name}: any = category || {}
        return {
          original: category,
          checkbox: category,
          guid: guid,
          view: 'view',
          name,
          edit: 'Edit',
          delete: 'Delete',
        }
      })

      setTotalPerPage(dataResult?.length || 0)
      const assign = res?.data?.data?.map(({guid, name}: any) => ({value: guid, label: name}))
      setAssignCategory(assign)
      return dataResult
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })

  const dataCategory: any = dataCategoryQuery?.data || []

  const columns: any = [
    {header: 'checkbox', width: '20px'},
    {header: 'View', width: '20px'},
    {header: 'Asset Category', sort: true, value: 'name'},
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
                  data-cy='bulkDelete'
                  onClick={() => onDeleteBulk()}
                  className='btn btn-sm btn-primary me-2'
                >
                  <span className='indicator-label'>Delete Selected</span>
                </button>
              )}
              <button
                type='button'
                data-cy='addCategory'
                className='btn btn-sm btn-primary'
                onClick={() => {
                  setDetailCategory(undefined)
                  setShowModalCategory(true)
                }}
              >
                + Add New Category
              </button>
            </div>
            <div className='dropdown' style={{marginRight: '5px'}}>
              <Dropdown>
                <Dropdown.Toggle variant='light-primary' size='sm' id='dropdown-basic'>
                  Actions
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {PermissionExport && <ExportPdfExcel onExport={onExport} />}
                  <ToolbarImport
                    type='category'
                    pathName='/tools/import'
                    actionName='Import New Category'
                    permission='import-export.import_categories'
                  />
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
          total={totalPage}
          loading={!dataCategoryQuery?.isFetched}
          columns={columns}
          onDelete={onDelete}
          data={dataCategory}
          onChecked={onChecked}
          onChangePage={onPageChange}
          onChangeLimit={onChangeLimit}
          onDetail={(e: any) => onDetail(e)}
        />
      </div>
    </div>
  )
}

export {CardCategory}
