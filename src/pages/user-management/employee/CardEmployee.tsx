/* eslint-disable react-hooks/exhaustive-deps */
import {DataTable} from '@components/datatable'
import {matchColumns, toColumns} from '@components/dnd/table'
import {ExportPdfExcel} from '@components/export/ExportPdfExcel'
import {FilterAll, FilterColumns} from '@components/filter/FilterAll'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import ToolbarImport from '@components/ToolbarActions/import'
import {hasPermission, KTSVG, setColumn} from '@helpers'
import {useDocumentTitle} from '@hooks'
import {useQuery} from '@tanstack/react-query'
import {FC, memo, useEffect, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {useNavigate} from 'react-router-dom'

import {
  exportEmployee,
  getColumnEmployee,
  getEmployee,
  getEmployeeDetail,
  getOptionsColumns,
} from '../redux/EmployeeCRUD'
import AddEmployee from './AddEmployee'
import DetailEmployee from './DetailEmployee'

let CardEmployee: FC<any> = ({
  setEmployeeGuid,
  setEmployeeName,
  setTotalPage,
  setShowModalConfirm,
  dataChecked,
  setDataChecked,
  setShowModalConfirmBulk,
  reloadDelete,
  setPageFrom,
  setPage,
  page,
  totalPage,
  limit,
  setLimit,
  filterAll,
  setFilterAll,
  orderCol,
  setOrderCol,
  orderDir,
  setOrderDir,
  keyword,
  setKeyword,
  reloadEmployee,
  setReloadEmployee,
  reloadLocation,
  setLocationDetail,
  setShowModalLocation,
  reloadCompany,
  setCompanyDetail,
  setShowModalCompany,
  reloadDepartment,
  setDepartmentDetail,
  setShowModalDepartment,
  onClickForm,
  setOnClickForm,
  resetKeyword,
  setResetKeyword,
}) => {
  const navigate: any = useNavigate()

  const [detail, setDetail] = useState<any>({})
  const [showModal, setShowModalEmployee] = useState<boolean>(false)
  const [showModalDetail, setShowModalDetail] = useState<boolean>(false)

  const PermissionAdd: any = hasPermission('employee.add') || false
  const employeeEdit: any = hasPermission('employee.edit') || false
  const employeeDelete: any = hasPermission('employee.delete') || false
  const PermissionExport: any = hasPermission('employee.export') || false

  useDocumentTitle('Employees')

  const onExport = (e: any) => {
    const filters: any = filterAll?.child || {}
    const fields: any = columns
      ?.filter(({value}: any) => value)
      ?.map(({value}: any) => value)
      ?.join()

    exportEmployee({type: e, orderDir, orderCol, columns: fields, ...filters, keyword})
      .then(({data: res}: any) => {
        const {data, message}: any = res || {}
        const {url}: any = data || {}
        ToastMessage({message, type: 'success'})
        setTimeout(() => url && totalPage <= 500 && window.open(url, '_blank'), 1000)
      })
      .catch(({response}: any) => {
        const {message} = response?.data || {}
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
    setLimit(limit)
    setKeyword(e || '')
  }

  const onDelete = (e: any) => {
    const {name, guid}: any = e || {}

    setEmployeeName(name || '')
    setEmployeeGuid(guid || '')
    setShowModalConfirm(true)
  }

  const onDetail = (e: any) => {
    setDetail(e)
    setShowModalDetail(true)
  }

  const onEdit = ({guid}: any) => {
    guid &&
      getEmployeeDetail(guid)
        .then(({data: {data}}: any) => {
          data && setDetail(data)
          data && setShowModalEmployee(true)
        })
        .catch(({response}: any) => {
          const {message} = response?.data || {}
          ToastMessage({message, type: 'error'})
        })
  }

  const onChecked = (e: any) => {
    const ar_guid: any = []
    e?.forEach((ck: any) => {
      const {checked}: any = ck || {}
      if (checked) {
        const {original}: any = ck || {}
        const {guid}: any = original || {}
        ar_guid?.push(guid)
      }
    })
    setDataChecked(ar_guid as never[])
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const columnsQuery: any = useQuery({
    queryKey: ['getColumnEmployee'],
    queryFn: async () => {
      const res: any = await getColumnEmployee({})
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

  const employeeQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: [
      'getEmployee',
      {
        columns,
        page,
        limit,
        keyword,
        reloadEmployee,
        reloadDelete,
        orderDir,
        orderCol,
        filterAll,
        setPage,
        setLimit,
      },
    ],
    queryFn: async () => {
      if (columns?.length > 0) {
        const filters: any = filterAll?.child || {}
        const res: any = await getEmployee({
          page,
          limit,
          keyword,
          orderDir,
          orderCol,
          ...filters,
        })

        const {current_page, total, from}: any = res?.data?.meta || {}
        setTotalPage(total)
        setPageFrom(from)
        setPage(current_page)

        const resData: any = res?.data?.data as never[]
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
  const dataEmployee: any = employeeQuery?.data || []

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

                {PermissionAdd && (
                  <button
                    type='button'
                    data-cy='addEmployee'
                    className='btn btn-sm btn-primary'
                    onClick={() => {
                      setDetail(undefined)
                      setShowModalEmployee(true)
                    }}
                  >
                    + Add New Employee
                  </button>
                )}
              </div>

              <div className='dropdown' style={{marginRight: '5px'}}>
                <Dropdown>
                  <Dropdown.Toggle
                    variant='light-primary'
                    data-cy='actions'
                    size='sm'
                    id='dropdown-basic'
                  >
                    Actions
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {PermissionExport && <ExportPdfExcel onExport={onExport} />}
                    <ToolbarImport
                      type='employee'
                      pathName='/tools/import'
                      actionName='Import New Employee'
                      permission='import-export.import_employee'
                    />
                    <Dropdown.Item
                      href='#'
                      data-cy='setupcolumns'
                      onClick={() => navigate({pathname: '/user-management/employee-columns'})}
                    >
                      Setup Column
                    </Dropdown.Item>
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
            data={dataEmployee}
            onDelete={onDelete}
            onDetail={onDetail}
            edit={employeeEdit}
            del={employeeDelete}
            onChecked={onChecked}
            onChangePage={onPageChange}
            onChangeLimit={onChangeLimit}
            loading={!employeeQuery?.isFetched || !columnsQuery?.isFetched}
          />
        </div>
      </div>

      <AddEmployee
        showModal={showModal}
        employeeDetail={detail}
        onClickForm={onClickForm}
        reloadCompany={reloadCompany}
        reloadEmployee={reloadEmployee}
        setOnClickForm={setOnClickForm}
        reloadLocation={reloadLocation}
        setCompanyDetail={setCompanyDetail}
        reloadDepartment={reloadDepartment}
        setReloadEmployee={setReloadEmployee}
        setLocationDetail={setLocationDetail}
        setDepartmentDetail={setDepartmentDetail}
        setShowModalCompany={setShowModalCompany}
        setShowModalEmployee={setShowModalEmployee}
        setShowModalLocation={setShowModalLocation}
        setShowModalDepartment={setShowModalDepartment}
      />

      <DetailEmployee
        data={detail}
        showModalDetail={showModalDetail}
        setShowModalDetail={setShowModalDetail}
      />
    </>
  )
}

CardEmployee = memo(
  CardEmployee,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default CardEmployee
