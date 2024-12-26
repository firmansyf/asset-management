/* eslint-disable react-hooks/exhaustive-deps */
import {DataTable} from '@components/datatable'
import {ToastMessage} from '@components/toast-message'
import {preferenceDateTime} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {useQuery} from '@tanstack/react-query'
import moment from 'moment'
import {FC, lazy, useMemo, useState} from 'react'
import {Button} from 'react-bootstrap'
import {useIntl} from 'react-intl'

import {getReportSF} from '../Service'

const DetailSF: any = lazy(() =>
  import('./DetailSF').then(({DetailSF}: any) => ({default: DetailSF}))
)
const ManualImport: any = lazy(() =>
  import('./Manualmport').then(({ManualImport}: any) => ({default: ManualImport}))
)
const SettingEmailAlert: any = lazy(() =>
  import('./SettingEmailAlert').then(({SettingEmailAlert}: any) => ({default: SettingEmailAlert}))
)

const InsuranceSFImportHistory: FC = () => {
  const intl: any = useIntl()
  const pref_date_time: any = preferenceDateTime()

  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [reload, setReload] = useState<number>(1)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [detailImport, setDetailmport] = useState<any>({})
  const [orderDir, setOrderDir] = useState<string>('desc')
  const [orderCol, setOrderCol] = useState<string>('date')
  const [showManualImport, setShowManualImport] = useState<boolean>(false)
  const [showDetailImport, setShowDetailImport] = useState<boolean>(false)
  const [showEmailAlert, setShowSettingEmailAlert] = useState<boolean>(false)

  const columns = useMemo(
    () => [
      {header: 'View', width: '20px'},
      {header: 'Date and Time', value: 'date', sort: true},
      {header: 'Success Import', value: 'pass_import', sort: true},
      {header: 'Failed Import', value: 'failed_import', sort: true},
      {header: 'Total Case', value: 'total_case', sort: true},
    ],
    []
  )

  const onChangeLimit = (e: any) => {
    setLimit(e)
  }

  const onPageChange = (e: any) => {
    setPage(e)
  }

  const onDetail = (e: any) => {
    setDetailmport(e)
    setShowDetailImport(true)
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const reportSFQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getReportSF', {page, limit, reload, pref_date_time, orderDir, orderCol}],
    queryFn: async () => {
      const res: any = await getReportSF({page, limit, orderDir, orderCol})
      const {total}: any = res?.data?.meta || {}
      setTotalPage(total)

      const dataResult: any = res?.data?.data?.map((item: any) => {
        const {guid, date, failed_import, pass_import, total_case} = item
        return {
          original: item,
          guid: guid,
          view: 'view',
          date: moment(date || '')?.format(pref_date_time) || '-',
          pass_import: pass_import || '0',
          failed_import: failed_import || '0',
          total_case: total_case || '0',
        }
      })

      return dataResult
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })
  const dataSF: any = reportSFQuery?.data || []

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.INSURANCE.SF'})}</PageTitle>
      <div className='card card-custom card-table'>
        <div className='card-table-header'>
          <div className='text-end'>
            <Button
              type='submit'
              variant='primary'
              className='btn-sm mx-1'
              onClick={() => setShowSettingEmailAlert(true)}
            >
              Setup Email Notification
            </Button>

            <Button
              type='submit'
              variant='primary'
              className='btn-sm mx-1'
              onClick={() => setShowManualImport(true)}
            >
              Manual Import
            </Button>
          </div>
        </div>

        <div className='card-body'>
          <DataTable
            hoverRow
            page={page}
            limit={limit}
            data={dataSF}
            onSort={onSort}
            total={totalPage}
            columns={columns}
            onDetail={onDetail}
            onChangePage={onPageChange}
            onChangeLimit={onChangeLimit}
            loading={!reportSFQuery?.isFetched}
          />
        </div>
      </div>

      <ManualImport
        reload={reload}
        setReload={setReload}
        showModal={showManualImport}
        setShowModal={setShowManualImport}
      />

      <SettingEmailAlert
        reload={reload}
        setReload={setReload}
        showModal={showEmailAlert}
        setShowModal={setShowSettingEmailAlert}
      />

      <DetailSF
        detail={detailImport}
        showModal={showDetailImport}
        dateTimeCustom={pref_date_time}
        setShowModal={setShowDetailImport}
      />
    </>
  )
}

export default InsuranceSFImportHistory
