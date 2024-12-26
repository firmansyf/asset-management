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

const CardReportQRCode: FC<any> = () => {
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

  ;('error.You put wrong order column, only these column that supported: guid, asset_guid, asset_id, asset_name, asset_description, category_guid, category_name, qr_code, location_guid, location_name, location_sub_guid, location_sub_name, status_guid, status_name, owner_company_guid, owner_company, owner_department_guid, owner_department, manufacturer_guid, manufacturer_name, location_gps_coordinate, model_guid, model_name, brand_guid, brand_name, serial_number, part_number, asset_part_number, supplier_guid, supplier_name, audit_status, audit_timestamp, audit_by_guid, audit_by, audit_location, is_pre_asset, is_non_fixed, asset_type, assign_asset, data_source, unit_cost, order_number, purchase_date, purchase_price_currency, voucher_number, voucher_date, invoice_number, invoice_date, delivery_order_number, delivery_order_date, actual_date_received, cheque_number, cheque_date, total_quantity, total_cost, status_comment, disposal_date, assign_to, assigned_user_guid, assign_to_name, agent, confirm_status, approval_status, ticket_name, gcf_Currency2')

  const columns: any = [
    {header: 'Asset ID', sort: true, value: 'asset_id'},
    {header: 'Asset Name', sort: true, value: 'asset_name'},
    {header: 'QR Code', sort: true, value: 'qr_code'},
    {header: 'Owner Company', sort: true, value: 'owner_company'},
    {header: 'Owner Department', sort: true, value: 'owner_department'},
  ]

  const onExport = (e: any) => {
    const params: any = ['asset_id', 'asset_name', 'qr_code', 'owner_company', 'owner_department']

    exportMyAsset({type: e, columns: params?.join(','), report_name: 'QR Code'})
      .then(({data: res}: any) => {
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

  const onPageChange = (e: any) => {
    setPage(e)
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e ? `${e}` : '')
  }

  const dataQRCodeParam: any = {page, limit, keyword, orderDir, orderCol}
  const dataQRCodeQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getAssetAssetStatus', {...dataQRCodeParam}],
    queryFn: async () => {
      if (columns?.length > 0) {
        const res: any = await getAsset(dataQRCodeParam)
        const {current_page, total}: any = res?.data?.meta || {}
        const thisLimit: any = limit
        setTotalPage(total)
        setLimit(thisLimit)
        setPage(current_page)

        const dataResult: any = res?.data?.data?.map((m: any) => {
          const {asset_id, asset_name, owner_department, qr_code, owner_company}: any = m || {}
          return {
            asset_id: asset_id || '-',
            name: asset_name || '-',
            qr_code: qr_code || '-',
            owner_company: owner_company || '-',
            owner_department: owner_department || '-',
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
  const dataQRCode: any = dataQRCodeQuery?.data || []

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
            data={dataQRCode}
            columns={columns}
            onChangePage={onPageChange}
            onChangeLimit={onChangeLimit}
            loading={!dataQRCodeQuery?.isFetched}
          />
        </div>
      </div>
      {PermissionView && (
        <ModalAutomatedReport
          type={'add'}
          columns={columns}
          showModal={showModalAutomatedReport}
          setShowModal={setShowModalAutomatedReport}
          detail={{name: 'QR Codes', type: 'asset'}}
          onSubmit={() => {
            setShowModalAutomatedReport(false)
            navigate('/reports/automated-report')
          }}
        />
      )}
    </>
  )
}

let ReportQRCode: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.REPORTS.QR_CODES'})}</PageTitle>
      <CardReportQRCode />
    </>
  )
}

ReportQRCode = memo(
  ReportQRCode,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default ReportQRCode
