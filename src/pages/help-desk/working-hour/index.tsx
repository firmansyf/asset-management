/* eslint-disable react-hooks/exhaustive-deps */
import {Alert as ModalBulkDelete, Alert as ModalDelete} from '@components/alert'
import {DataTable} from '@components/datatable'
import {matchColumns} from '@components/dnd/table'
import {ExportPdfExcel} from '@components/export/ExportPdfExcel'
import {FilterAll, FilterColumns} from '@components/filter/FilterAll'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import {errorValidation, hasPermission, KTSVG} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {useQuery} from '@tanstack/react-query'
import qs from 'qs'
import {FC, useEffect, useMemo, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {useIntl} from 'react-intl'

import {AddEdit} from './AddEdit'
import {Detail} from './Detail'
import {
  deleteBulkWorkingHour,
  deleteWorkingHour,
  detailWorkingHour,
  exportWorkingHour,
  getWorkingHour,
  getWorkingHourOptionsColumns,
} from './Service'

const WorkingHour: FC<any> = () => {
  const intl: any = useIntl()

  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [orderCol, setOrderCol] = useState<string>('name')
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [reload, setReload] = useState<boolean>(false)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [detail, setDetail] = useState<object | any>({})
  const [dataChecked, setDataChecked] = useState<any>([])
  const [showModalAdd, setShowModalAdd] = useState<boolean>(false)
  const [showModalDetail, setShowModalDetail] = useState<boolean>(false)
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false)
  const [showModalBulkDelete, setShowModalBulkDelete] = useState<boolean>(false)
  const [loadingSubmitBtn, setLoadingSubmitBtn] = useState<boolean>(false)
  // FILTER
  const [filterAll, setFilterAll] = useState<any>({})
  const [pageFrom, setPageFrom] = useState<number>(0)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)

  const edit: any = hasPermission('help-desk.working-hour.edit') || false
  const del: any = hasPermission('help-desk.working-hour.delete') || false
  const delbulk: any = hasPermission('help-desk.working-hour.delete') || false

  const columns: any = useMemo(
    () => [
      {header: 'checkbox', width: '20px'},
      {header: 'View', width: '20px'},
      {header: 'Working Hour Name', value: 'name', sort: true},
      {header: 'Timezone', value: 'timezone', sort: true},
      {header: 'Description', value: 'description', sort: true},
      {header: 'Edit', width: '20px'},
      {header: 'Delete', width: '20px'},
    ],
    []
  )

  useEffect(() => {
    setTimeout(() => ToastMessage({type: 'clear'}), 1000)
  }, [])

  const workingHourQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: [
      'getWorkingHour',
      {
        columns,
        page,
        orderDir,
        orderCol,
        limit,
        keyword,
        reload,
        filterAll,
      },
    ],
    queryFn: async () => {
      const filters: any = filterAll?.child || {}
      const res: any = await getWorkingHour({
        page,
        orderDir,
        orderCol,
        limit,
        keyword,
        ...filters,
      })
      const {current_page, per_page, total, from} = res?.data?.meta || {}
      setTotalPage(total)
      setPage(current_page)
      setLimit(per_page)
      setPageFrom(from)

      return matchColumns(res?.data?.data, columns)
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })

  const dataWorkingHour: any = workingHourQuery?.data || []

  const onDetail = (guid: any, type: any) => {
    detailWorkingHour(guid)
      .then(({data: {data: res}}: any) => {
        setDetail(res)
        type === 'edit' ? setShowModalAdd(true) : setShowModalDetail(true)
      })
      .catch(() => '')
  }

  const confirmDelete = (guid: any) => {
    setLoadingSubmitBtn(true)
    deleteWorkingHour(guid)
      .then(({data: {message}}: any) => {
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
        setDetail({})
        setLoadingSubmitBtn(false)
        setReload(!reload)
        setShowModalDelete(false)
        ToastMessage({type: 'success', message})
      })
      .catch((err: any) => {
        setLoadingSubmitBtn(false)
        setShowModalDelete(false)
        Object.values(errorValidation(err))?.map((message: any) =>
          ToastMessage({type: 'error', message})
        )
      })
  }

  const confirmBulkDelete = () => {
    setLoadingSubmitBtn(true)
    deleteBulkWorkingHour({guids: dataChecked})
      .then(({data: {message}}: any) => {
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
        setDetail({})
        setLoadingSubmitBtn(false)
        setReload(!reload)
        setDataChecked([])
        setShowModalBulkDelete(false)
        ToastMessage({type: 'success', message})
      })
      .catch((err: any) => {
        setLoadingSubmitBtn(false)
        setShowModalBulkDelete(false)
        Object.values(errorValidation(err))?.map((message: any) =>
          ToastMessage({type: 'error', message})
        )
      })
  }

  const onExport = (e: any) => {
    const fields = columns
      ?.filter(({value}: any) => value)
      ?.map(({value}: any) => value)
      ?.join()
    let filters: any = filterAll?.child || {}
    filters = qs.parse(filters)
    exportWorkingHour({type: e, keyword, columns: fields, ...filters})
      .then(
        ({
          data: {
            message,
            data: {url},
          },
        }: any) => {
          window.open(url, '_blank')
          ToastMessage({message, type: 'success'})
        }
      )
      .catch((err: any) => {
        Object.values(errorValidation(err))?.map((message: any) =>
          ToastMessage({type: 'error', message})
        )
      })
  }

  const onChangePage = (e: any) => {
    setDataChecked([])
    setPage(e)
  }

  const onChangeLimit = (e: any) => {
    setDataChecked([])
    setPage(1)
    setLimit(e)
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onDelete = (e: any) => {
    setDetail(e)
    setShowModalDelete(true)
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

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'HELPDESK.WORKING.HOUR'})}</PageTitle>
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
                    onClick={() => setShowModalBulkDelete(true)}
                  >
                    <span className='indicator-label'>Delete Selected</span>
                  </button>
                )}
                {hasPermission('help-desk.working-hour.add') && (
                  <button
                    data-cy='add'
                    className='btn btn-sm btn-primary'
                    type='button'
                    onClick={() => {
                      setDetail(undefined)
                      setShowModalAdd(true)
                    }}
                  >
                    + Add New Working Hour
                  </button>
                )}
              </div>
              <div className='dropdown' style={{marginRight: '5px'}}>
                <Dropdown>
                  <Dropdown.Toggle
                    variant='light-primary'
                    size='sm'
                    id='dropdown-basic'
                    data-cy='actions'
                  >
                    Actions
                  </Dropdown.Toggle>
                  {hasPermission('help-desk.working-hour.export') && (
                    <Dropdown.Menu>
                      <ExportPdfExcel onExport={onExport} />
                    </Dropdown.Menu>
                  )}
                </Dropdown>
              </div>
            </div>
          </div>
          <FilterColumns
            api={getWorkingHourOptionsColumns}
            filterAll={filterAll}
            onChange={setFilterAll}
            setPage={setPage}
          />
        </div>

        <div className='card-body'>
          <DataTable
            data={dataWorkingHour}
            limit={limit}
            loading={!workingHourQuery?.isFetched}
            columns={columns}
            total={totalPage}
            page={page}
            onChangePage={onChangePage}
            onChangeLimit={onChangeLimit}
            onDelete={onDelete}
            onDetail={({guid}: any) => onDetail(guid, 'detail')}
            onEdit={({guid}: any) => onDetail(guid, 'edit')}
            onSort={onSort}
            onChecked={(e: any) =>
              setDataChecked(e?.filter(({checked}: any) => checked)?.map(({guid}: any) => guid))
            }
            edit={edit}
            del={del}
            bulk={delbulk}
          />
        </div>
      </div>

      <AddEdit
        showModal={showModalAdd}
        setShowModal={setShowModalAdd}
        setReload={setReload}
        reload={reload}
        detail={detail}
      />

      <Detail showModal={showModalDetail} setShowModal={setShowModalDetail} detail={detail} />

      <ModalDelete
        showModal={showModalDelete}
        setShowModal={setShowModalDelete}
        loading={loadingSubmitBtn}
        type={'delete'}
        key='delete'
        title={'Delete Working Hour'}
        confirmLabel={'Delete'}
        body={
          <div>
            Are you sure want to delete <span className='fw-bolder'>{detail?.name}</span> ?
          </div>
        }
        onConfirm={() => confirmDelete(detail?.guid)}
        onCancel={() => setShowModalDelete(false)}
      />

      <ModalBulkDelete
        showModal={showModalBulkDelete}
        setShowModal={setShowModalBulkDelete}
        loading={loadingSubmitBtn}
        type={'delete'}
        key='bulkDelete'
        title={'Delete Working Hour'}
        confirmLabel={'Delete'}
        body={
          <div>
            Are you sure want to delete
            <span className='fw-bolder'>{(dataChecked || [])?.length}</span> Working Hour(s) ?
          </div>
        }
        onConfirm={confirmBulkDelete}
        onCancel={() => setShowModalBulkDelete(false)}
      />
    </>
  )
}

export default WorkingHour
