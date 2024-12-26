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

const CardReportAssetStatus: FC<any> = () => {
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

  const PermissionView: any = hasPermission('reports.automation_report.view') || false
  const PermissionAdd: any = hasPermission('reports.automation_report.add') || false
  const columns: any = [
    {header: 'Asset ID', sort: true, value: 'asset_id'},
    {header: 'Asset Name', sort: true, value: 'asset_name'},
    {header: 'Asset Status', sort: true, value: 'status_name'},
    {header: 'Owner Company', sort: true, value: 'owner_company'},
    {header: 'Owner Department', sort: true, value: 'owner_department'},
  ]

  const onExport = (e: any) => {
    const params: any = [
      'asset_id',
      'asset_name',
      'status_name',
      'owner_company',
      'owner_department',
    ]

    exportMyAsset({type: e, columns: params?.join(','), report_name: 'Asset Status'})
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

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e ? `${e}` : '')
  }

  const onPageChange = (e: any) => {
    setPage(e)
  }

  const dataAssetStatusParam: any = {page, limit, keyword, orderDir, orderCol}
  const dataAssetStatusQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getAssetAssetStatus', {...dataAssetStatusParam}],
    queryFn: async () => {
      if (columns?.length > 0) {
        const res: any = await getAsset(dataAssetStatusParam)
        const {current_page, total}: any = res?.data?.meta || {}
        const thisLimit: any = limit
        setTotalPage(total)
        setPage(current_page)
        setLimit(thisLimit)

        const dataResult: any = res?.data?.data?.map((m: any) => {
          const {asset_id, asset_name, status_name, owner_company, owner_department}: any = m || {}

          return {
            asset_id: asset_id || '-',
            name: asset_name || '-',
            status_name: status_name || '-',
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
  const dataAssetStatus: any = dataAssetStatusQuery?.data || []

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
            <div className='d-flex align-items-center position-relative me-4 search-report-asset-status my-1'>
              <KTSVG
                path='/media/icons/duotone/General/Search.svg'
                className='svg-icon-3 position-absolute ms-3'
              />

              <Search bg='solid' onChange={onSearch} />
            </div>

            <div className='d-flex my-1'>
              <div className='dropdown' style={{marginRight: '5px'}}>
                <Dropdown>
                  <Dropdown.Toggle
                    variant='light-primary'
                    size='sm'
                    data-cy='actions'
                    id='dropdown-basic'
                  >
                    Actions
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {PermissionAdd && isFeature?.automated_report === 1 && (
                      <Dropdown.Item
                        data-cy='automatedReport'
                        onClick={() => setShowModalAutomatedReport(true)}
                      >
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
            columns={columns}
            total={totalPage}
            data={dataAssetStatus}
            onChangePage={onPageChange}
            onChangeLimit={onChangeLimit}
            loading={!dataAssetStatusQuery?.isFetched}
          />
        </div>
      </div>

      {PermissionView && (
        <ModalAutomatedReport
          type={'add'}
          columns={columns}
          showModal={showModalAutomatedReport}
          setShowModal={setShowModalAutomatedReport}
          detail={{name: 'Asset Status', type: 'asset'}}
          onSubmit={() => {
            setShowModalAutomatedReport(false)
            navigate('/reports/automated-report')
          }}
        />
      )}
    </>
  )
}

let ReportAssetStatus: FC = () => {
  const intl: any = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.REPORTS.ASSET_STATUS'})}
      </PageTitle>
      <CardReportAssetStatus />
    </>
  )
}

ReportAssetStatus = memo(
  ReportAssetStatus,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default ReportAssetStatus
