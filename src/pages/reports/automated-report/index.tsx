import {Alert as DeleteAutomatedReport} from '@components/alert'
import {DataTable} from '@components/datatable'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import {hasPermission, KTSVG} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {deleteAutomatedReport, getAutomatedReport} from '@pages/reports/Service'
import {useQuery} from '@tanstack/react-query'
import {FC, memo, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'

import ModalAutomatedReport from '../automated-report/ModalAddEdit'

let AutomatedReport: FC<any> = () => {
  const intl: any = useIntl()

  const [meta, setMeta] = useState<any>({})
  const [page, setPage] = useState<number>(1)
  const [detail, setDetail] = useState<any>({})
  const [limit, setLimit] = useState<number>(10)
  const [type, setType] = useState<string>('add')
  const [keyword, setKeyword] = useState<string>('')
  const [pageFrom, setPageFrom] = useState<number>(0)
  const [reload, setReload] = useState<boolean>(false)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('name')
  const [totalPerPage, setTotalPerPage] = useState<number>(0)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false)
  const [showModalAutomatedReport, setShowModalAutomatedReport] = useState<boolean>(false)

  const PermissionEdit: any = hasPermission('reports.automation_report.edit') || false
  const PermissionView: any = hasPermission('reports.automation_report.view') || false
  const PermissionDelete: any = hasPermission('reports.automation_report.delete') || false

  const columns: any = [
    {header: 'Name', value: 'name', sort: true},
    {header: 'Team', value: 'team_name', sort: true},
    {header: 'Frequency', value: 'frequency', sort: true},
    {header: 'Time', value: 'time', sort: true},
    {header: 'Edit', width: '20px'},
    {header: 'Delete', width: '20px'},
  ]

  const onDeleteAutomatedReport = () => {
    deleteAutomatedReport(detail?.guid)
      .then(({data: {message}}: any) => {
        setReload(!reload)
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
        setShowModalDelete(false)
        ToastMessage({type: 'success', message})
      })
      .catch(() => '')
  }

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e ? `*${e}*` : '')
  }

  const onDelete = (e: any) => {
    setDetail(e)
    setShowModalDelete(true)
  }

  const onEdit = (e: any) => {
    setDetail(e)
    setType('edit')
    setShowModalAutomatedReport(true)
  }

  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onChangePage = (e: any) => {
    setPage(e)
  }

  const dataAutomatedReportParam: any = {page, limit, keyword, orderDir, orderCol}
  const dataAutomatedReportQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getAutomatedReport', {...dataAutomatedReportParam}],
    queryFn: async () => {
      if (columns?.length > 0) {
        const res: any = await getAutomatedReport(dataAutomatedReportParam)
        const {current_page, from, total}: any = res?.data?.meta || {}
        const thisLimit: any = limit
        setLimit(thisLimit)
        setMeta(res?.data?.meta || {})
        setTotalPage(total)
        setPage(current_page)
        setPageFrom(from)

        const dataResult: any = res?.data?.data?.map((m: any) => {
          return {
            original: m,
            name: m?.name || '-',
            team_name: m?.team?.name || '-',
            frequency: `${m?.frequency?.charAt(0)?.toUpperCase() + m?.frequency?.slice(1)} ${
              !!m?.frequency_value &&
              `(${
                m?.frequency_value?.join(', ')?.charAt(0)?.toUpperCase() +
                m?.frequency_value?.join(', ')?.slice(1)
              })`
            }`,
            time: m?.time?.split(':')?.slice(0, 2)?.join(':') || '-',
            edit: 'edit',
            delete: 'delete',
          }
        })

        setTotalPerPage(dataResult?.length || 0)
        return dataResult
      } else {
        return []
      }
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })
  const dataAutomatedReport: any = dataAutomatedReportQuery?.data || []

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  useEffect(() => {
    if (resetKeyword) {
      onSearch('')
      setResetKeyword(false)
    }
  }, [resetKeyword])

  useEffect(() => {
    if (totalPerPage === 0 && Object.keys(meta || {})?.length > 0) {
      setPage(meta?.current_page > 1 ? meta?.current_page - 1 : 1)
    }
  }, [totalPerPage, meta])

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.REPORTS.AUTOMATED_REPORT'})}
      </PageTitle>

      <div className='p-4 bg-light mb-5'>
        <p className='h6 fw-normal'>
          Automated reports can help you to set up a schedule to send a report automatically. You
          can add an automated report from the report you choose via the action button.
        </p>
      </div>

      <div className='card card-custom card-table'>
        <div className='card-table-header'>
          <div className='d-flex align-items-center position-relative'>
            <KTSVG
              path='/media/icons/duotone/General/Search.svg'
              className='svg-icon-3 position-absolute ms-3'
            />

            <Search
              bg='solid'
              width='300px'
              onChange={onSearch}
              resetKeyword={resetKeyword}
              setResetKeyword={setResetKeyword}
            />
          </div>
        </div>

        <div className='card-body table-responsive'>
          <DataTable
            page={page}
            limit={limit}
            onSort={onSort}
            onEdit={onEdit}
            total={totalPage}
            columns={columns}
            onDelete={onDelete}
            edit={PermissionEdit}
            del={PermissionDelete}
            data={dataAutomatedReport}
            onChangePage={onChangePage}
            onChangeLimit={onChangeLimit}
            loading={!dataAutomatedReportQuery?.isFetched}
          />
        </div>
      </div>

      {PermissionView && (
        <ModalAutomatedReport
          type={type}
          detail={detail}
          onHide={() => setDetail({})}
          showModal={showModalAutomatedReport}
          setShowModal={setShowModalAutomatedReport}
          onSubmit={() => {
            setReload(!reload)
            setShowModalAutomatedReport(false)
          }}
        />
      )}

      <DeleteAutomatedReport
        loading={false}
        type={'delete'}
        title={'Confirm Delete'}
        confirmLabel={'Delete'}
        showModal={showModalDelete}
        setShowModal={setShowModalDelete}
        onConfirm={onDeleteAutomatedReport}
        onCancel={() => {
          setDetail({})
          setShowModalDelete(false)
        }}
        body={
          <span>
            Are you sure want to delete <strong>{detail?.name || ''}</strong> ?
          </span>
        }
      />
    </>
  )
}

AutomatedReport = memo(
  AutomatedReport,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default AutomatedReport
