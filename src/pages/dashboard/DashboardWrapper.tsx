import Tooltip from '@components/alert/tooltip'
import {BarChart} from '@components/chart/Bar'
import {PieChart} from '@components/chart/Pie'
import {elementProperty} from '@components/layout/Sticky'
import {Toolbar} from '@components/layout/Toolbar'
import {PageLoader} from '@components/loader/cloud'
import {configClass, useTimeOutMessage} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import DashbardCategories from '@pages/dashboard/DashboardCategories'
import {useQuery} from '@tanstack/react-query'
import clsx from 'clsx'
import {filter as lodashFilter, groupBy, orderBy, uniq} from 'lodash'
import qs from 'qs'
import {FC, memo, useEffect, useLayoutEffect, useRef, useState} from 'react'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import {Link, useLocation} from 'react-router-dom'

import {getInsuranceClaimYears, getWidget} from './redux/DashboardService'
import {AuditedAsset} from './widget/audited-asset/AuditedAsset'
import {WidgetCalendar} from './widget/calendar/Calendar'
import {Summary} from './widget/summary/Summary'
import {Table} from './widget/table/Table'

type Props = {
  permissions: any
}

const DashboardPage: FC<Props> = ({permissions}) => {
  const {search} = useLocation()
  const pieRef: any = useRef(null)
  const currentYear: any = new Date()?.getFullYear()
  const selectFilter: any = qs.parse(search, {ignoreQueryPrefix: true})
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {feature}: any = preferenceStore || {}

  const [selectedYear, setSelectedYear] = useState<any>({})
  const [uniqeIdChangeYear, setUniqeIdChangeYear] = useState<any>('')

  useEffect(() => {
    useTimeOutMessage('clear', 5000)
  })

  const widgetQuery: any = useQuery({
    initialData: {charts: [], widgets: [], chartColumn: 12, widgetColumn: 12},
    queryKey: ['getWidget', {selectFilter, permissions}],
    queryFn: async () => {
      const filter: any = selectFilter?.value !== null &&
        selectFilter?.value !== '' && {feature_guid: selectFilter?.value}
      const api: any = await getWidget({
        limit: 100,
        orderCol: 'order_number',
        orderDir: 'asc',
        ...filter,
      })
      const {data: result, columns}: any = api?.data
      const active = lodashFilter(result, 'is_active')
      const {chart, widget, table}: any = groupBy(active, 'type')
      const activeChart = orderBy([...(chart || []), ...(table || [])], 'order_number', 'asc')?.map(
        (m: any) => {
          if (selectFilter !== undefined && selectFilter?.label === 'Help Desk') {
            m.permission = true
          } else {
            switch (m.unique_id) {
              case 'asset-category-by-audit-status':
                m.permission = permissions?.includes('dashboard-chart.asset_category_audit')
                break
              case 'asset-by-category':
                m.permission = permissions?.includes('dashboard-chart.asset_category')
                break
              case 'asset-by-company':
                m.permission = permissions?.includes('dashboard-chart.asset_company')
                break
              case 'asset-by-department':
                m.permission = permissions?.includes('dashboard-chart.asset_departement')
                break
              case 'asset-category-by-department':
                m.permission = permissions?.includes('dashboard-chart.asset_category_department')
                break
              case 'asset-location-by-status':
                m.permission =
                  permissions?.includes('dashboard-chart.asset_location_status') ||
                  permissions?.includes('dashboard-widget.asset_location_status')
                break
              case 'asset-category-by-location':
                m.permission = permissions?.includes('dashboard-chart.asset_category_location')
                break
              case 'asset-by-status':
                m.permission = permissions?.includes('dashboard-chart.asset_status')
                break
              case 'audited-asset':
                m.permission = permissions?.includes('dashboard-others.asset_audited')
                break
              case 'alert':
                m.permission = permissions?.includes('dashboard-others.asset_alert')
                break
              case 'feeds':
                m.permission = permissions?.includes('dashboard-others.asset_feeds')
                break
              case 'pending-invoice-by-region':
                m.permission = permissions?.includes(
                  'dashboard-insurance_claim.pending_invoice_ro_region'
                )
                break
              case 'amount-peril':
                m.permission = permissions?.includes('dashboard-insurance_claim.amount_peril')
                break
              case 'insurancestatus-year-region':
                m.permission = permissions?.includes(
                  'dashboard-insurance_claim.insurancestatus_year_region'
                )
                break
              case 'pending-policereport-region':
                m.permission = permissions?.includes(
                  'dashboard-insurance_claim.pending_policereport_region'
                )
                break
              case 'insurance-claim-by-status':
                m.permission = permissions?.includes(
                  'dashboard-insurance_claim.insurance_claim_status'
                )
                break
              case 'insurance-peril-region':
                m.permission = permissions?.includes(
                  'dashboard-insurance_claim.insurance_peril_region'
                )
                break
              case 'insurance-status-region':
                m.permission = permissions?.includes(
                  'dashboard-insurance_claim.insurance_status_region'
                )
                break
              case 'insurance-status-gr-region':
                m.permission = permissions?.includes(
                  'dashboard-insurance_claim.insurance_status_gr_region'
                )
                break
              case 'insurance-complete-percentage':
                m.permission = permissions?.includes(
                  'dashboard-insurance_claim.insurance_complete_percentage'
                )
                break
              case 'asset-by-supplier':
                m.permission = permissions?.includes('dashboard-chart.asset_supplier')
                break
              default:
                m.permission = true
            }
          }
          return m
        }
      )

      const activeWidget: any = (widget || [])?.map((m: any) => {
        if (selectFilter !== undefined && selectFilter?.label === 'Help Desk') {
          m.permission = true
        } else {
          switch (m.unique_id) {
            case 'total-expired-warranty':
              m.permission = permissions?.includes('dashboard-widget.total_expired_warranty')
              break
            case 'total-audited':
              m.permission = permissions?.includes('dashboard-widget.total_audited')
              break
            case 'total-policy':
              m.permission = permissions?.includes('dashboard-widget.total_policy')
              break
            case 'total-asset':
              m.permission = permissions?.includes('dashboard-widget.total_asset')
              break
            case 'total-user':
              m.permission = permissions?.includes('dashboard-widget.total_user')
              break
            case 'total-employee':
              m.permission = permissions?.includes('dashboard-widget.total_employee')
              break
            case 'total-unassigned':
              m.permission = permissions?.includes('dashboard-widget.total_unassigned')
              break
            case 'number-of-work-order':
              m.permission = permissions?.includes('dashboard-widget.number_of_work_order')
              break
            case 'overdue-work-order':
              m.permission = permissions?.includes('dashboard-widget.overdue_work_order')
              break
            default:
              m.permission = true
          }
        }
        return m
      })

      const charts: any = activeChart?.filter(({permission}: any) => permission)
      const widgets: any = activeWidget?.filter(({permission}: any) => permission)
      const chartColumn: any = columns?.chart ? 12 / columns?.chart : 4
      const widgetColumn: any = columns?.widget
      return {charts, widgets, chartColumn, widgetColumn}
    },
  })
  const {charts, widgets, chartColumn, widgetColumn}: any = widgetQuery?.data

  const insuranceClaimYearsQuery: any = useQuery({
    initialData: {optYears: [], year: currentYear},
    queryKey: ['getInsuranceClaimYears', {feature}],
    queryFn: async () => {
      if (feature) {
        const insuranceClaimFeature: any = feature?.find(
          ({unique_name}: any) => unique_name === 'insurance_claim'
        )
        if (insuranceClaimFeature?.value === 1) {
          const api: any = await getInsuranceClaimYears()
          const data: any = api?.data
          const dataYears: any = data?.filter((f: any) => ![null, undefined, 1970]?.includes(f))

          const sortedData: any = uniq([...dataYears, currentYear])
          sortedData?.sort((a: any, b: any) => b - a)
          return {optYears: sortedData, year: currentYear}
        } else {
          return {optYears: [], year: ''}
        }
      } else {
        return {optYears: [], year: ''}
      }
    },
  })
  const {optYears}: any = insuranceClaimYearsQuery?.data

  useLayoutEffect(() => {
    const {headerHeight, toolBarHeight}: any = elementProperty() || {}
    const wrapper: any = document.getElementById('kt_wrapper')
    wrapper.style.paddingTop = headerHeight + 'px'

    return () => {
      wrapper.style.paddingTop = headerHeight + (toolBarHeight || 0) + 'px'
    }
  }, [])

  return (
    <>
      {!widgetQuery?.isFetched ? (
        <PageLoader />
      ) : (
        <>
          <div className='row mb-3 ps-5 customTopMobile'>
            {Array.isArray(widgets) &&
              widgets?.map(({title, unique_id, dashboard_guid}) => {
                if (unique_id === 'computer-software-agent') {
                  return null
                }

                return (
                  <div
                    key={unique_id}
                    className={`grid-md-${widgetColumn} col-6 col-sm-4 col-md-3 col-lg-2 mb-5 pe-2`}
                  >
                    <Summary
                      title={title}
                      className='h-100'
                      unique_id={unique_id}
                      dashboard_guid={dashboard_guid}
                    />
                  </div>
                )
              })}
          </div>

          <div className='row'>
            {Array.isArray(charts) &&
              charts?.map(
                ({
                  title,
                  unique_id,
                  view_type,
                  type,
                  dashboard_guid,
                  widget_guid,
                  setting_column,
                }) => {
                  if (
                    type === 'table' &&
                    unique_id === 'audited-asset' &&
                    permissions?.includes('dashboard-others.asset_audited')
                  ) {
                    return (
                      <div
                        key={unique_id}
                        className={clsx(
                          `col-md-${setting_column ? setting_column * chartColumn : chartColumn}`,
                          'mb-5 mb-xl-10'
                        )}
                      >
                        <AuditedAsset
                          title={title}
                          unique_id={unique_id}
                          dashboard_guid={dashboard_guid}
                        />
                      </div>
                    )
                  }

                  if (
                    type === 'table' &&
                    unique_id === 'feeds' &&
                    permissions?.includes('dashboard-others.asset_feeds')
                  ) {
                    return (
                      <div
                        key={unique_id}
                        className={clsx(
                          `col-md-${setting_column ? setting_column * chartColumn : chartColumn}`,
                          'mb-5 mb-xl-10'
                        )}
                      >
                        <Table
                          title={title}
                          unique_id={unique_id}
                          dashboard_guid={dashboard_guid}
                          permissions={permissions}
                          height={200}
                        />
                      </div>
                    )
                  }

                  if (view_type === 'bar') {
                    return (
                      <div
                        key={unique_id}
                        className={clsx(
                          `col-md-${setting_column ? setting_column * chartColumn : chartColumn}`,
                          'mb-5 mb-xl-10'
                        )}
                        style={{minHeight: 250}}
                      >
                        <div className='card h-100 radius overflow-hidden border border-gray-300'>
                          {unique_id === 'insurancestatus-year-region' ||
                          unique_id === 'insurance-status-gr-region' ||
                          unique_id === 'insurance-peril-region' ||
                          unique_id === 'pending-policereport-region' ||
                          unique_id === 'pending-invoice-by-region' ||
                          unique_id === 'insurance-status-region' ||
                          unique_id === 'amount-peril' ? (
                            <div className='row mx-0 align-items-center p-2 bg-light-primary text-primary border-bottom border-gray-300'>
                              <div className='col fw-bolder fs-7'>{title || ''}</div>
                              <div className='col-auto px-0'>
                                <select
                                  name='select'
                                  defaultValue={currentYear}
                                  className={configClass?.select}
                                  onChange={({target: {value}}: any) => {
                                    setUniqeIdChangeYear(unique_id)
                                    setSelectedYear({...selectedYear, [unique_id]: value})
                                  }}
                                >
                                  <option value=''>All Years</option>
                                  {optYears?.map((y: any, key: number) => (
                                    <option key={key || 0} value={y || ''}>
                                      {y || ''}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          ) : (
                            <div className='fw-bolder fs-7 text-center p-2 bg-light-primary text-primary border-bottom border-gray-300'>
                              {title || ''}
                            </div>
                          )}
                          <div className='card-body p-2 w-100 d-flex flex-center mt-n5'>
                            <BarChart
                              render={true}
                              height={250}
                              title={title}
                              stacked={[
                                'insurance-status-gr-region',
                                'insurance-status-region',
                                'insurancestatus-year-region',
                                'insurance-peril-region',
                                'number-tickets-request-lastweek',
                                'asset-category-by-location',
                              ]?.includes(unique_id)}
                              unique_id={unique_id}
                              dashboard_guid={dashboard_guid}
                              widget_guid={widget_guid}
                              selectedYear={selectedYear?.[unique_id]}
                              uniqeIdChangeYear={uniqeIdChangeYear}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  }

                  if (
                    view_type === 'calendar' &&
                    permissions?.includes('dashboard-others.asset_alert')
                  ) {
                    return (
                      <div
                        key={unique_id}
                        className={clsx(
                          `col-md-${
                            setting_column ? setting_column * chartColumn : chartColumn
                          } col-md`,
                          'mb-5 mb-xl-10'
                        )}
                      >
                        <div className='card h-100 shadow border border-gray-300'>
                          <div className='card-body p-3'>
                            <WidgetCalendar
                              unique_id={unique_id}
                              guid={dashboard_guid}
                              height={`${250 + 25}px`}
                              weekday={setting_column * chartColumn < 4 ? 'narrow' : 'short'}
                              className='fc-compact'
                            />
                          </div>
                        </div>
                      </div>
                    )
                  }

                  if (view_type === 'pie') {
                    return (
                      <div
                        ref={pieRef}
                        key={unique_id}
                        className={clsx(
                          `col-md-${setting_column ? setting_column * chartColumn : chartColumn}`,
                          'mb-5 mb-xl-10'
                        )}
                      >
                        <div className='card h-100 rounded overflow-hidden border border-gray-300'>
                          {unique_id === 'insurance-claim-by-status' ? (
                            <div className='row mx-0 align-items-center p-2 bg-light-primary text-primary border-bottom border-gray-300'>
                              <div className='col fw-bolder fs-7'>{title}</div>
                              <div className='col-auto px-0'>
                                <select
                                  name='select'
                                  defaultValue={currentYear}
                                  className={configClass?.select}
                                  onChange={({target: {value}}: any) => {
                                    // setInsuranceClaimByStatus(value)
                                    setUniqeIdChangeYear(unique_id)
                                    setSelectedYear({...selectedYear, [unique_id]: value})
                                  }}
                                >
                                  <option value=''>All Years</option>
                                  {optYears?.map((y: any, key: number) => (
                                    <option key={key} value={y}>
                                      {y}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          ) : (
                            <div className='fw-bolder fs-7 text-center p-2 bg-light-primary text-primary border-bottom border-gray-300'>
                              {title}
                            </div>
                          )}
                          <div className='card-body p-2 w-100 d-flex flex-center'>
                            <PieChart
                              height={250}
                              size='0%'
                              title={title}
                              unique_id={unique_id}
                              dashboard_guid={dashboard_guid}
                              selectedYear={selectedYear?.[unique_id]}
                              uniqeIdChangeYear={uniqeIdChangeYear}
                              titleAlign={'bottom'}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  } else {
                    return null
                  }
                }
              )}
          </div>
          <style>{`
            @media screen and (max-width: 996px) {
              .customTopMobile {
                margin-top: 40px !important;
              }
            }
            
            @media screen and (max-width: 760px) {
              .customTopMobile {
                margin-top: 45px !important;
              }
            }

            @media screen and (max-width: 420px) {
              .customTopMobile {
                margin-top: 40px !important;
              }
            }
          `}</style>
        </>
      )}
    </>
  )
}

const ManageButton: FC<any> = () => (
  <div className='position-fixed' style={{bottom: '7.5rem', right: '1.5rem', zIndex: 9}}>
    <Tooltip placement='left' title='Manage Dashboard'>
      <Link to='/manage-dashboard' className='border border-primary radius-50 border-2 shadow-lg'>
        <div className='btn btn-lg btn-icon btn-primary radius-50 pulse pulse-white border border-secondary border-3'>
          <i className='las la-cog fs-1' />
          <span className='pulse-ring' />
        </div>
      </Link>
    </Tooltip>
  </div>
)

let DashboardWrapper: FC = () => {
  const intl: any = useIntl()
  const currentUser: any = useSelector(({currentUser}: any) => currentUser, shallowEqual)
  const permissions = currentUser?.permissions?.map(({name}: any) => name)

  return (
    <>
      <div className='row'>
        <Toolbar dir='right' className='d-block d-lg-none'>
          {permissions?.includes('manage-dashboard.manage') && (
            <Link to='/manage-dashboard' className='btn btn-sm btn-primary'>
              Manage Dashboard
            </Link>
          )}
        </Toolbar>

        <div className='d-block d-lg-none customFilterDashboard'>
          <DashbardCategories />
        </div>

        <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
        <div className='d-none'>
          <ManageButton />
        </div>
      </div>

      <DashboardPage permissions={permissions} />

      <style>
        {`
          .customFilterDashboard {
            padding-top: 40px;
            padding-bottom: 10px;
          }
        `}
      </style>
    </>
  )
}

DashboardWrapper = memo(
  DashboardWrapper,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default DashboardWrapper
