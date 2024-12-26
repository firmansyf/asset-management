import {DataTable} from '@components/datatable'
import {ExportPdfExcel} from '@components/export/ExportPdfExcel'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import {hasPermission, KTSVG} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {exportMyAsset, getAsset} from '@pages/asset-management/redux/AssetRedux'
import {useQuery} from '@tanstack/react-query'
import {keyBy, mapValues} from 'lodash'
import {FC, memo, useEffect, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

import ModalAutomatedReport from '../automated-report/ModalAddEdit'

const CardReportAuditStatus: FC<any> = () => {
  const navigate: any = useNavigate()
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {feature}: any = preferenceStore || {}

  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [isFeature, setFeature] = useState<any>({})
  const [keyword, setKeyword] = useState<string>('')
  const [totalPage, setTotalPage] = useState<number>(0)
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('asset_name')
  const [showModalAutomatedReport, setShowModalAutomatedReport] = useState<boolean>(false)

  const PermissionAdd: any = hasPermission('reports.automation_report.add') || false
  const PermissionView: any = hasPermission('reports.automation_report.view') || false

  const columns: any = [
    {header: 'Asset ID', sort: true, value: 'asset_id'},
    {header: 'Asset Name', sort: true, value: 'asset_name'},
    {header: 'QR Code', sort: true, value: 'qr_code'},
    {header: 'Asset Category', sort: true, value: 'category_name'},
    {header: 'Asset Type', sort: true, value: 'asset_type'},
    {header: 'Audit Location', sort: true, value: 'location_gps_coordinate'},
  ]

  const onExport = (e: any) => {
    const params: any = [
      'asset_id',
      'asset_name',
      'qr_code',
      'category_name',
      'asset_type',
      'location_gps_coordinate',
    ]

    exportMyAsset({type: e, columns: params?.join(','), report_name: 'Audit Status'})
      .then(({data: res}) => {
        const {data, message}: any = res || {}
        const {url}: any = data || {}
        ToastMessage({message, type: 'success'})
        setTimeout(() => totalPage <= 500 && window.open(url, '_blank'), 1000)
      })
      .catch(({response}: any) => {
        const {message}: any = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }

  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
  }

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e ? `${e}` : '')
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onPageChange = (e: any) => {
    setPage(e)
  }

  const dataAuditStatusParam: any = {page, limit, keyword, orderDir, orderCol}
  const dataAuditStatusQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getAssetAuditStatus', {...dataAuditStatusParam}],
    queryFn: async () => {
      if (columns?.length > 0) {
        const res: any = await getAsset(dataAuditStatusParam)
        const {current_page, total}: any = res?.data?.meta || {}
        const thisLimit: any = limit
        setTotalPage(total)
        setPage(current_page)
        setLimit(thisLimit)

        const dataResult: any = res?.data?.data?.map((m: any) => {
          const {
            asset_id,
            asset_name,
            qr_code,
            category_name,
            asset_type,
            location_gps_coordinate,
          }: any = m || {}
          return {
            asset_id: asset_id || '-',
            name: asset_name || '-',
            qr_code: qr_code || '-',
            category_name: category_name || '-',
            asset_type: asset_type || '-',
            location_gps_coordinate:
              location_gps_coordinate === 'lat :  long : ' ? '-' : location_gps_coordinate,
            original: m,
          }
        })

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
  const dataAuditStatus: any = dataAuditStatusQuery?.data || []

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  useEffect(() => {
    if (feature) {
      const resObj: any = keyBy(feature, 'unique_name')
      setFeature(mapValues(resObj, 'value'))
    }
  }, [feature])

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

              <Search bg='solid' onChange={onSearch} />
            </div>

            <div className='d-flex my-1'>
              <div className='dropdown' style={{marginRight: '5px'}}>
                <Dropdown>
                  <Dropdown.Toggle variant='light-primary' size='sm' id='dropdown-basic'>
                    Actions
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {PermissionAdd && isFeature?.automated_report === 1 && (
                      <Dropdown.Item href='#' onClick={() => setShowModalAutomatedReport(true)}>
                        Automated Report
                      </Dropdown.Item>
                    )}
                    <ExportPdfExcel onExport={onExport} />
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
            onSort={onSort}
            total={totalPage}
            columns={columns}
            data={dataAuditStatus}
            onChangePage={onPageChange}
            onChangeLimit={onChangeLimit}
            loading={!dataAuditStatusQuery?.isFetched}
          />
        </div>
      </div>

      {PermissionView && (
        <ModalAutomatedReport
          type={'add'}
          columns={columns}
          showModal={showModalAutomatedReport}
          setShowModal={setShowModalAutomatedReport}
          detail={{name: 'Audit Status', type: 'asset'}}
          onSubmit={() => {
            setShowModalAutomatedReport(false)
            navigate('/reports/automated-report')
          }}
        />
      )}
    </>
  )
}

let ReportAuditStatus: FC = () => {
  const intl: any = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.REPORTS.AUDIT_STATUS'})}
      </PageTitle>
      <CardReportAuditStatus />
    </>
  )
}

ReportAuditStatus = memo(
  ReportAuditStatus,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default ReportAuditStatus