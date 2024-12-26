/* eslint-disable react-hooks/exhaustive-deps */
import {Alert} from '@components/alert'
import {DataTable} from '@components/datatable'
import {matchColumns} from '@components/dnd/table'
import {ExportPdfExcel} from '@components/export/ExportPdfExcel'
import {FilterAll, FilterColumns} from '@components/filter/FilterAll'
import {Search} from '@components/form/searchAlert' //search
import {ToastMessage} from '@components/toast-message'
import {errorValidation, guidBulkChecked, KTSVG} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {FC, memo, useCallback, useEffect, useMemo, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {useIntl} from 'react-intl'
import {Link, useNavigate} from 'react-router-dom'

import {
  bulkDeleteCannedForms,
  deleteCannedForms,
  getCannedForms,
  getCannedFormsOptionsColumns,
} from './Service'

let CannedForms: FC<any> = () => {
  const intl: any = useIntl()
  const navigate = useNavigate()
  const [data, setData] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(1)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [pageFrom, setPageFrom] = useState<number>(0)
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [orderCol, setOrderCol] = useState<string>('name')
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false)
  const [filterAll, setFilterAll] = useState<any>({})
  const [reload, setReload] = useState<any>([])
  const [CannedFormsName, setCannedFormsName] = useState<string>('')
  const [CannedFormsGuid, setCannedFormsGuid] = useState<string>('')
  const [showModalConfirmBulk, setShowModalConfirmBulk] = useState<boolean>(false)
  const [dataChecked, setDataChecked] = useState<any>([])
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)

  const columns: any = useMemo(
    () => [
      {header: 'checkbox', width: '20px'},
      {header: 'View', width: '20px'},
      {header: 'Canned Forms', value: 'name', sort: true, truncate: true},
      {header: 'Edit', width: '20px'},
      {header: 'Delete', width: '20px'},
    ],
    []
  )

  const onDelete = (e: any) => {
    const {name, guid}: any = e || {}
    setCannedFormsName(name)
    setCannedFormsGuid(guid)
    setShowModalDelete(true)
  }

  const onDetail = () => ''

  const onEdit = (e: any) => {
    const {guid} = e || {}
    navigate('/setup/help-desk/canned-forms/add?id=' + guid)
  }

  const onSort = (value: any) => {
    setDataChecked([])
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onChangePage = (e: any) => {
    setDataChecked([])
    setPage(e)
  }

  const onLimit = (e: any) => {
    setDataChecked([])
    setPage(1)
    setLimit(e)
  }

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e ? `*${e}*` : '')
  }

  useEffect(() => {
    if (resetKeyword) {
      onSearch('')
      setResetKeyword(false)
    }
  }, [resetKeyword])

  useEffect(() => {
    setTimeout(() => ToastMessage({type: 'clear'}), 3000)
  }, [])

  useEffect(() => {
    setLoading(true)
    const filters: any = filterAll?.child || {}
    getCannedForms({page, orderDir, orderCol, limit, keyword, ...filters})
      .then(({data: {data: res, meta}}: any) => {
        const {current_page, per_page, total, from}: any = meta || {}
        setTotalPage(total)
        setPage(current_page)
        setLimit(per_page)
        setPageFrom(from)
        setData(matchColumns(res, columns))
        setTimeout(() => {
          setLoading(false)
        }, 800)
      })
      .catch((err: any) => {
        Object.values(errorValidation(err))?.map((message: any) =>
          ToastMessage({message, type: 'error'})
        )
        setTimeout(() => {
          setLoading(false)
        }, 800)
      })
  }, [columns, page, orderDir, orderCol, limit, keyword, filterAll, reload])

  // BulkDeleteMark
  const onChecked = (e: any) => {
    const ar_guid: any = guidBulkChecked(e)
    setDataChecked(ar_guid)
  }

  const onExport = (e: any) => e

  const msg_alert: any = [
    'Are you sure to delete this response ',
    <strong key='doc_name'>{CannedFormsName || ''}</strong>,
    ' ?',
  ]

  const msg_alert_bulk: any = [
    'Are you sure to delete',
    <span className='text-dark fw-bolder' key='span'>
      {' '}
      {dataChecked?.length}{' '}
    </span>,
    'Canned Forms ?',
  ]

  const confirmDelete = () => {
    if (CannedFormsGuid !== '') {
      deleteCannedForms(CannedFormsGuid)
        .then((e: any) => {
          ToastMessage({message: e?.data?.message, type: 'success'})
          const total_data_page: number = totalPage - pageFrom
          const thisPage: any = page
          if (total_data_page - 1 <= 0) {
            if (thisPage > 1) {
              setPage(thisPage - 1)
            } else {
              setPage(thisPage)
              setResetKeyword(true)
            }
          } else {
            setPage(thisPage)
          }
          setLoading(false)
          setShowModalDelete(false)
          setReload(reload + 1)
          setDataChecked([])
        })
        .catch(() => {
          setLoading(false)
        })
    }
  }

  // bulk delete
  const confirmBulkDelete = useCallback(() => {
    setLoading(true)
    bulkDeleteCannedForms({guids: dataChecked})
      .then((res: any) => {
        setTimeout(() => {
          ToastMessage({message: res?.data?.message, type: 'success'})
          const total_data_page: number = totalPage - pageFrom
          const thisPage: any = page
          if (total_data_page - dataChecked?.length <= 0) {
            if (thisPage > 1) {
              setPage(thisPage - 1)
            } else {
              setPage(thisPage)
              setResetKeyword(true)
            }
          } else {
            setPage(thisPage)
          }
          setLoading(false)
          setShowModalConfirmBulk(false)
          setReload(reload + 1)
          setDataChecked([])
        }, 1000)
      })
      .catch((err: any) => {
        ToastMessage({message: err?.response?.data?.message, type: 'error'})
        setLoading(false)
      })
  }, [dataChecked, reload])

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'HELPDESK.CANNED.FORM'})}</PageTitle>
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
                    data-cy='bulkDelete'
                    type='button'
                    className='btn btn-sm btn-primary me-2'
                    onClick={() => {
                      setShowModalConfirmBulk(true)
                    }}
                  >
                    <span className='indicator-label'>Delete Selected</span>
                  </button>
                )}
                <Link className='btn btn-sm btn-primary' to='/setup/help-desk/canned-forms/add'>
                  + Add Canned Forms
                </Link>
              </div>
              <div className='dropdown' style={{marginRight: '5px'}}>
                <Dropdown>
                  <Dropdown.Toggle
                    variant='light-primary'
                    size='sm'
                    id='dropdown-basic'
                    data-cy='actions'
                  >
                    {' '}
                    Actions{' '}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <ExportPdfExcel onExport={onExport} />
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
          <FilterColumns
            api={getCannedFormsOptionsColumns}
            filterAll={filterAll}
            onChange={setFilterAll}
            setPage={setPage}
          />
        </div>
        <div className='card-body'>
          <DataTable
            loading={loading}
            limit={limit}
            total={totalPage}
            page={page}
            data={data}
            columns={columns}
            onChangePage={onChangePage}
            onChangeLimit={onLimit}
            onDelete={onDelete}
            onDetail={onDetail}
            onEdit={onEdit}
            onSort={onSort}
            onChecked={onChecked}
          />
        </div>
      </div>

      <Alert
        setShowModal={setShowModalDelete}
        showModal={showModalDelete}
        loading={loading}
        body={msg_alert}
        type={'delete'}
        title={'Delete Canned Forms'}
        confirmLabel={'Delete'}
        onConfirm={() => {
          confirmDelete()
        }}
        onCancel={() => {
          setShowModalDelete(false)
        }}
      />

      {/* bulk delete */}
      <Alert
        setShowModal={setShowModalConfirmBulk}
        showModal={showModalConfirmBulk}
        loading={loading}
        body={msg_alert_bulk}
        type={'blukdelete'}
        title={'Bulk Delete Canned Forms'}
        confirmLabel={'Delete'}
        onConfirm={() => {
          confirmBulkDelete()
        }}
        onCancel={() => {
          setShowModalConfirmBulk(false)
        }}
      />
    </>
  )
}

CannedForms = memo(
  CannedForms,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default CannedForms
