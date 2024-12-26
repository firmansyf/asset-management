import {DataTable} from '@components/datatable'
import {ToastMessage} from '@components/toast-message'
import {hasPermission, permissionValidator, preferenceDateTime} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {useQuery} from '@tanstack/react-query'
import moment from 'moment'
import {FC, lazy, useState} from 'react'
import {Button} from 'react-bootstrap'
import {useIntl} from 'react-intl'

import {getReportSAP} from '../Service'
const DetailSAP: any = lazy(() => import('./DetailSAP'))
const ManualImport: any = lazy(() => import('./Manualmport'))

const SAPHistory: FC = () => {
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

  const singleImportSapPermission: any = hasPermission('insurance_claim.single_import_sap') || false

  const columns: any = [
    {header: 'View', width: '20px'},
    {header: 'Date and Time', value: 'date', sort: true},
    {header: 'GR Incomplete ', value: 'gr_incomplete', sort: true},
    {header: 'Complete Invoice', value: 'invoice_complete', sort: true},
    {header: 'Incomplete invoice', value: 'invoice_incomplete', sort: true},
    {header: 'Total RO Number', value: 'total_case', sort: true},
  ]

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

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

  const reportSAPQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getReportSAP', {page, limit, reload, pref_date_time, orderDir, orderCol}],
    queryFn: async () => {
      const res: any = await getReportSAP({page, limit, orderDir, orderCol})
      const {total}: any = res?.data?.meta || {}
      setTotalPage(total)

      const dataResult: any = res?.data?.data?.map((item: any) => {
        const {guid, invoice_incomplete, date, gr_incomplete, invoice_complete, total_case}: any =
          item || {}

        return {
          guid,
          original: item,
          view: 'view',
          date: moment(date || '')?.format(pref_date_time) || '-',
          gr_incomplete: gr_incomplete || 0,
          invoice_complete: invoice_complete || 0,
          invoice_incomplete: invoice_incomplete || 0,
          total_case: total_case || 0,
        }
      })

      return dataResult as never[]
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })
  const dataSAP: any = reportSAPQuery?.data || []

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.INSURANCE.SAP'})}</PageTitle>
      <div className='card card-custom card-table'>
        <div className='card-table-header'>
          <div className='text-end'>
            <Button
              type='submit'
              variant='primary'
              className='btn-sm mx-1'
              onClick={() => {
                if (!singleImportSapPermission) {
                  permissionValidator(singleImportSapPermission, 'Single Import from SAP')
                } else {
                  setShowManualImport(true)
                }
              }}
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
            data={dataSAP}
            onSort={onSort}
            total={totalPage}
            columns={columns}
            onDetail={onDetail}
            onChangePage={onPageChange}
            onChangeLimit={onChangeLimit}
            loading={!reportSAPQuery?.isFetched}
          />
        </div>
      </div>

      <ManualImport
        reload={reload}
        setReload={setReload}
        showModal={showManualImport}
        setShowModal={setShowManualImport}
      />

      <DetailSAP
        detail={detailImport}
        showModal={showDetailImport}
        dateTimeCustom={pref_date_time}
        setShowModal={setShowDetailImport}
      />
    </>
  )
}

export default SAPHistory
