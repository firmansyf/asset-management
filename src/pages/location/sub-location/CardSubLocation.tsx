/* eslint-disable react-hooks/exhaustive-deps */
import {getLocation} from '@api/Service'
import {DataTable} from '@components/datatable'
import {ExportPdfExcel} from '@components/export/ExportPdfExcel'
import {FilterAll, FilterColumns} from '@components/filter/FilterAll'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import ToolbarImport from '@components/ToolbarActions/import'
import {errorValidation, hasPermission, KTSVG} from '@helpers'
import {useQuery} from '@tanstack/react-query'
import {FC, useEffect, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'

import {exportSubLocation, getOptionsColumns, getSubLocation} from './redux/SubLocationCRUD'

const label = 'Sub Location'
type Props = {
  onDelete: any
  setShowModalSubLocation: any
  setShowModalSubLocationDetail: any
  setSubLocationDetail: any
  reloadSubLocation: any
  reloadDelete: any
  setShowModalConfirmBulk: any
  dataChecked: any
  setDataChecked: any
  setOptionLocation: any
  page: any
  setPage: any
  setPageFrom: any
  totalPage: any
  setTotalPage: any
  resetKeyword: any
  setResetKeyword: any
}

const CardSubLocation: FC<Props> = ({
  onDelete,
  setShowModalSubLocation,
  setShowModalSubLocationDetail,
  setSubLocationDetail,
  reloadSubLocation,
  reloadDelete,
  setShowModalConfirmBulk,
  dataChecked,
  setDataChecked,
  setOptionLocation,
  page,
  setPage,
  setPageFrom,
  totalPage,
  setTotalPage,
  resetKeyword,
  setResetKeyword,
}) => {
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [filterAll, setFilterAll] = useState<any>({})
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('name')

  const PermissionAdd: any = hasPermission('sub-location.add') || false
  const PermissionEdit: any = hasPermission('sub-location.edit') || false
  const PermissionDelete: any = hasPermission('sub-location.delete') || false
  const PermissionExport: any = hasPermission('sub-location.export') || false

  const columns: any = [
    {header: 'checkbox', width: '20px'},
    {header: 'View', width: '20px'},
    {header: 'Sub Location', value: 'name', sort: true},
    {header: 'Location', value: 'location_name', sort: true},
    {header: 'Description', value: 'description', sort: true},
    {header: 'Edit', width: '20px'},
    {header: 'Delete', width: '20px'},
  ]

  const onExport = (e: any) => {
    const filters: any = filterAll?.child || {}
    exportSubLocation({type: e, orderDir, orderCol, ...filters, keyword})
      .then(({data: res}) => {
        const {data, message}: any = res || {}
        const {url}: any = data || {}
        ToastMessage({message, type: 'success'})
        setTimeout(() => totalPage <= 500 && window.open(url, '_blank'), 1000)
      })
      .catch(({response}: any) => {
        const {message} = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }

  const onChangeLimit = (e: any) => {
    setPage(1)
    setDataChecked([])
    setLimit(e)
  }

  const onPageChange = (e: any) => {
    setDataChecked([])
    setPage(e)
  }

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e ? `*${e}*` : '')
  }

  const onDetail = (e: any) => {
    setSubLocationDetail(e)
    setShowModalSubLocationDetail(true)
  }

  const onEdit = (e: any) => {
    setSubLocationDetail(e)
    setShowModalSubLocation(true)
  }

  const onChecked = (e: any) => {
    const ar_guid: any = []
    e?.forEach((ticked: any) => {
      const {checked}: any = ticked || {}
      if (checked) {
        const {original}: any = ticked || {}
        const {guid}: any = original || {}
        ar_guid.push(guid)
      }
    })
    setDataChecked(ar_guid as never[])
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const dataLocationParam: any = {
    page,
    limit,
    keyword,
    orderCol,
    orderDir,
    ...(filterAll?.child || {}),
  }

  const dataSubLocationQuery: any = useQuery({
    queryKey: ['getSubLocation', {...dataLocationParam, reloadSubLocation, reloadDelete}],
    queryFn: async () => {
      const res: any = await getSubLocation(dataLocationParam)
      const {current_page, total, from}: any = res?.data?.meta || {}
      setPageFrom(from)
      setTotalPage(total)
      setPage(current_page)

      const dataResult: any = res?.data?.data?.map((sub_location_res: any) => {
        const {guid, name, location, description}: any = sub_location_res || {}
        const {name: location_name}: any = location || {}
        return {
          original: sub_location_res,
          guid: guid,
          checkbox: 'Checkbox',
          view: 'view',
          name: name || '-',
          location: location_name || '-',
          description: description || '-',
          edit: 'Edit',
          delete: 'Delete',
        }
      })

      return dataResult
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: (err: any) => {
      Object.values(errorValidation(err))?.map((message: any) =>
        ToastMessage({message, type: 'error'})
      )
    },
  })
  const dataSubLocation: any = dataSubLocationQuery?.data || {}

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  useEffect(() => {
    getLocation({})
      .then(({data: {data: res_location}}) => {
        setOptionLocation(res_location)
      })
      .catch(() => '')
  }, [setOptionLocation])

  useEffect(() => {
    if (resetKeyword) {
      onSearch('')
      setResetKeyword(false)
    }
  }, [resetKeyword])

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
            <FilterAll columns={columns} filterAll={filterAll} onChange={setFilterAll} />
          </div>

          <div className='d-flex my-1'>
            <div style={{marginRight: '5px'}}>
              {dataChecked?.length > 0 && (
                <button
                  type='button'
                  data-cy='btnBulkDelete'
                  className='btn btn-sm btn-primary me-2'
                  onClick={() => setShowModalConfirmBulk(true)}
                >
                  <span className='indicator-label'>Delete Selected</span>
                </button>
              )}

              {PermissionAdd && (
                <button
                  type='button'
                  className='btn btn-sm btn-primary'
                  onClick={() => {
                    setShowModalSubLocation(true)
                    setSubLocationDetail(undefined)
                  }}
                >
                  + Add New {label || ''}
                </button>
              )}
            </div>

            <div className='dropdown' data-cy='actions' style={{marginRight: '5px'}}>
              <Dropdown>
                <Dropdown.Toggle variant='light-primary' size='sm' id='dropdown-basic'>
                  Actions
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {PermissionExport && <ExportPdfExcel onExport={onExport} />}
                  <ToolbarImport
                    type='sub-location'
                    pathName='/tools/import'
                    actionName='Import New Sub Location'
                    permission='import-export.import_location_sub'
                  />
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>

        <FilterColumns
          setPage={setPage}
          filterAll={filterAll}
          api={getOptionsColumns}
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
          columns={columns}
          onDelete={onDelete}
          onDetail={onDetail}
          onChecked={onChecked}
          edit={PermissionEdit}
          del={PermissionDelete}
          data={dataSubLocation}
          onChangePage={onPageChange}
          onChangeLimit={onChangeLimit}
          loading={!dataSubLocationQuery?.isFetched}
        />
      </div>
    </div>
  )
}

export {CardSubLocation}
