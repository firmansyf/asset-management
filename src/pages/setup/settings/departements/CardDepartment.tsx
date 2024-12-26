/* eslint-disable react-hooks/exhaustive-deps */
import {exportDepartment, getDepartment, getDepartmentOptionsColumns} from '@api/department'
import {DataTable} from '@components/datatable'
import {ExportPdfExcel} from '@components/export/ExportPdfExcel'
import {FilterAll, FilterColumns} from '@components/filter/FilterAll'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import ToolbarImport from '@components/ToolbarActions/import'
import {guidBulkChecked, hasPermission, KTSVG} from '@helpers'
import {useQuery} from '@tanstack/react-query'
import {FC, useEffect, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'

const label = 'Department'
type Props = {
  onDelete: any
  onBulkDelete: any
  company: any
  setShowModal: any
  setDepartmentDetail: any
  reloadDelete: any
  reloadDepartment: any
  departemenDetail: any
  showModalDetail: any
  setShowModalDetail: any
  dataChecked: any
  setDataChecked: any
  showModalBulk: any
  setShowModalConfirmBulk: any
  setMessage: any
  messageAlert: any
  totalPage: any
  setTotalPage: any
  setTotalPerPage: any
  page: any
  setPage: any
  resetKeyword: any
  setResetKeyword: any
  totalPerPage: any
}

const CardDepartment: FC<Props> = ({
  onDelete,
  setShowModal,
  setDepartmentDetail,
  reloadDelete,
  reloadDepartment,
  setShowModalDetail,
  dataChecked,
  setDataChecked,
  setShowModalConfirmBulk,
  setMessage,
  totalPage,
  setTotalPage,
  setTotalPerPage,
  page,
  setPage,
  resetKeyword,
  setResetKeyword,
  totalPerPage,
  // company,
  // onBulkDelete,
  // departemenDetail,
  // showModalDetail,
  // showModalBulk,
  // messageAlert,
}) => {
  const [limit, setLimit] = useState(10)

  const [keyword, setKeyword] = useState('')
  const [filterCompany] = useState()
  const [orderCol, setOrderCol] = useState('name')
  const [orderDir, setOrderDir] = useState('asc')
  const [filterAll, setFilterAll] = useState<any>({})
  const [meta, setMeta] = useState<any>({})

  const columns: any = [
    {header: 'checkbox', width: '20px'},
    {header: 'View', width: '20px'},
    {header: 'Department', sort: true, value: 'name'},
    {header: 'Company Name', sort: true, value: 'company_name'},
    {header: 'Edit', width: '20px'},
    {header: 'Delete', width: '20px'},
  ]

  const onExport = (e: string) => {
    exportDepartment({type: e, keyword, ...(filterAll?.child || {})})
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

  const onDetail = (department: any) => {
    setDepartmentDetail(department)
    setShowModalDetail(true)
  }

  const onEdit = (e: any) => {
    setDepartmentDetail(e)
    setShowModal(true)
  }

  const onChecked = (e: any) => {
    const ar_guid: any = guidBulkChecked(e)
    setDataChecked(ar_guid)
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const dataDepartmentParam: any = {
    page,
    limit,
    keyword,
    orderCol,
    orderDir,
    filter: {company_guid: filterCompany},
    ...(filterAll?.child || {}),
  }
  const dataDepartmentQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: [
      'getDepartment',
      {...dataDepartmentParam, filterCompany, reloadDepartment, reloadDelete},
    ],
    queryFn: async () => {
      const res: any = await getDepartment(dataDepartmentParam)
      const {total, from}: any = res?.data?.meta || {}
      setMeta(res?.data?.meta || {})
      setTotalPage(total)
      setTotalPerPage(from)
      const dataResult: any = res?.data?.data?.map((department: any) => {
        const {guid, name, company}: any = department || {}
        const {name: company_name}: any = company || {}
        return {
          original: department,
          guid: guid,
          checkbox: department,
          view: 'view',
          name,
          company_name: company_name || '-',
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

  const dataDepartment: any = dataDepartmentQuery?.data || []

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
                    setShowModalConfirmBulk(true)
                    setMessage([
                      `Are you sure want to delete `,
                      <strong key='str1'>{dataChecked?.length}</strong>,
                      ` ${dataChecked?.length > 1 ? 'departments' : 'department'} ?`,
                    ])
                  }}
                >
                  <span className='indicator-label'>Delete Selected</span>
                </button>
              )}
              <button
                className='btn btn-sm btn-primary'
                type='button'
                data-cy='addDepartment'
                onClick={() => {
                  setDepartmentDetail(undefined)
                  setShowModal(true)
                }}
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
                  {hasPermission('setting.department.export') && (
                    <ExportPdfExcel onExport={onExport} />
                  )}
                  <ToolbarImport
                    actionName='Import New Departments'
                    pathName='/tools/import'
                    type='department'
                    permission='import-export.import_department'
                  />
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
        <FilterColumns
          api={getDepartmentOptionsColumns}
          filterAll={filterAll}
          onChange={setFilterAll}
          setPage={setPage}
        />
      </div>
      <div className='card-body'>
        <DataTable
          page={page}
          loading={!dataDepartmentQuery?.isFetched}
          limit={limit}
          total={totalPage}
          data={dataDepartment}
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
  )
}

export default CardDepartment
