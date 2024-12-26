/* eslint-disable react-hooks/exhaustive-deps */
import {Alert as ModalBulkDelete, Alert as ModalDelete} from '@components/alert'
import {DataTable} from '@components/datatable'
import {matchColumns} from '@components/dnd/table'
import {ExportPdfExcel} from '@components/export/ExportPdfExcel'
import {FilterAll, FilterColumns} from '@components/filter/FilterAll'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import {errorValidation, guidBulkChecked, KTSVG} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {useQuery} from '@tanstack/react-query'
import {FC, useEffect, useMemo, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {useIntl} from 'react-intl'
import {useNavigate} from 'react-router-dom'

import {Detail} from './Detail'
import {
  deleteBulkScenario,
  deleteScenario,
  exportScenario,
  getScenario,
  getScenarioOptionsColumns,
} from './Service'

const Scenario: FC<any> = () => {
  const intl: any = useIntl()
  const navigate: any = useNavigate()

  const [page, setPage] = useState<number>(1)
  const [detail, setDetail] = useState<any>({})
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<any>('')
  const [filterAll, setFilterAll] = useState<any>({})
  const [orderCol, setOrderCol] = useState<string>('')
  const [reload, setReload] = useState<boolean>(false)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [dataChecked, setDataChecked] = useState<any>([])
  const [showModalDetail, setShowModalDetail] = useState<boolean>(false)
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false)
  const [loadingSubmitBtn, setLoadingSubmitBtn] = useState<boolean>(false)
  const [showModalBulkDelete, setShowModalBulkDelete] = useState<boolean>(false)
  const [pageFrom, setPageFrom] = useState<number>(0)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)

  const columns: any = useMemo(
    () => [
      {header: 'checkbox', width: '20px'},
      {header: 'View', width: '20px'},
      {header: 'Name', value: 'name', sort: true},
      {header: 'Description', value: 'description', sort: true},
      {header: 'Edit', width: '20px'},
      {header: 'Delete', width: '20px'},
    ],
    []
  )

  const onEdit = ({guid}: any) => {
    navigate(`/setup/help-desk/scenario/edit/${guid}`)
  }
  const onDetail = () => ''

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

  const confirmDelete = (guid: any) => {
    setLoadingSubmitBtn(true)
    deleteScenario(guid)
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
        setReload(!reload)
        setShowModalDelete(false)
        setLoadingSubmitBtn(false)
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
    deleteBulkScenario({guids: dataChecked})
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
        setReload(!reload)
        setDataChecked([])
        setLoadingSubmitBtn(false)
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
    const filters: any = filterAll?.child || {}
    const fields = columns
      ?.filter(({value}: any) => value)
      ?.map(({value}: any) => value)
      ?.join()
    exportScenario({type: e, keyword, columns: fields, ...filters})
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
  const onChecked = (e: any) => {
    const ar_guid: any = guidBulkChecked(e)
    setDataChecked(ar_guid)
  }

  useEffect(() => {
    setTimeout(() => ToastMessage({type: 'clear'}), 3000)
  }, [])

  const scenarioQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: [
      'getScenario',
      {columns, page, orderDir, orderCol, limit, keyword, reload, filterAll},
    ],
    queryFn: async () => {
      const filters: any = filterAll?.child || {}
      const res: any = await getScenario({
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

  const dataScenario: any = scenarioQuery?.data || []

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'HELPDESK.SCENARIO'})}</PageTitle>
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
                <button
                  data-cy='add'
                  className='btn btn-sm btn-primary'
                  type='button'
                  onClick={() => navigate(`/setup/help-desk/scenario/add`)}
                >
                  + Add New Scenario
                </button>
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
                  <Dropdown.Menu>
                    <ExportPdfExcel onExport={onExport} />
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
          <FilterColumns
            api={getScenarioOptionsColumns}
            filterAll={filterAll}
            onChange={setFilterAll}
            setPage={setPage}
          />
        </div>
        <div className='card-body'>
          <DataTable
            data={dataScenario}
            limit={limit}
            onEdit={onEdit}
            onSort={onSort}
            total={totalPage}
            page={page}
            loading={!scenarioQuery?.isFetched}
            columns={columns}
            onDelete={onDelete}
            onDetail={onDetail}
            onChecked={onChecked}
            onChangePage={onChangePage}
            onChangeLimit={onChangeLimit}
          />
        </div>
      </div>
      <Detail showModal={showModalDetail} setShowModal={setShowModalDetail} detail={detail} />
      <ModalDelete
        key='delete'
        type={'delete'}
        confirmLabel={'Delete'}
        title={'Delete Scenario'}
        loading={loadingSubmitBtn}
        showModal={showModalDelete}
        setShowModal={setShowModalDelete}
        onCancel={() => setShowModalDelete(false)}
        onConfirm={() => confirmDelete(detail?.guid)}
        body={
          <div className=''>
            Are you sure want to delete <span className='fw-bolder'>{detail?.name || ''}</span> ?
          </div>
        }
      />
      <ModalBulkDelete
        type={'delete'}
        key='bulkDelete'
        confirmLabel={'Delete'}
        title={'Delete Scenario'}
        loading={loadingSubmitBtn}
        onConfirm={confirmBulkDelete}
        showModal={showModalBulkDelete}
        setShowModal={setShowModalBulkDelete}
        onCancel={() => setShowModalBulkDelete(false)}
        body={
          <div className=''>
            Are you sure want to delete
            <span className='fw-bolder'>{(dataChecked || [])?.length || 0}</span> Scenario ?
          </div>
        }
      />
    </>
  )
}

export default Scenario
