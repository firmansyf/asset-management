import {elementProperty} from '@components/layout/Sticky'
import {PageLoader} from '@components/loader/cloud'
import {ClearIndicator, customStyles, DropdownIndicator} from '@components/select/config'
import {ToastMessage} from '@components/toast-message'
import {errorValidation, useTimeOutMessage} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {getOwnerSubscription} from '@pages/billing/Service'
import {filter, groupBy, orderBy} from 'lodash'
import {FC, useEffect, useLayoutEffect, useRef, useState} from 'react'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import Select from 'react-select'

import {getWidget, resetDefaultDashboard, saveWidget} from '../redux/DashboardService'
import Chart from './ChartNew'
import Widget from './WidgetNew'

const ManageDashboard: FC = () => {
  const intl: any = useIntl()
  const navigate: any = useNavigate()
  const cardOptionRef: any = useRef()
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {feature}: any = preferenceStore || {}

  const [chart, setChart] = useState<any>([])
  const [widget, setWidget] = useState<any>([])
  const [chartGrid, setChartGrid] = useState<any>()
  const [widgetGrid, setWidgetGrid] = useState<any>()
  const [saveBtn, setSaveBtn] = useState<boolean>(true)
  const [dataFilter, setDataFilter] = useState<any>([])
  const [isTrial, setIsTrial] = useState<boolean>(false)
  const [activeChart, setActiveChart] = useState<any>([])
  const [col_chart, setChartColumn] = useState<number>(1)
  const [activeWidget, setActiveWidget] = useState<any>([])
  const [col_widget, setWidgetColumn] = useState<number>(1)
  const [actionCardTop, setActionCardTop] = useState<any>(0)
  const [loadingPage, setLoadingPage] = useState<boolean>(true)
  const [loadingSaveBtn, setLoadingSaveBtn] = useState<boolean>(false)
  const [loadingResetBtn, setLoadingResetBtn] = useState<boolean>(false)
  const [selectFilter, setSelectFilter] = useState<any>({value: '', label: 'All Dashboard'})

  useEffect(() => {
    const filters: any = selectFilter?.value !== null &&
      selectFilter?.value !== '' && {feature_guid: selectFilter?.value || ''}

    getWidget({limit: 100, orderCol: 'order_number', orderDir: 'asc', ...filters})
      .then(({data: {data: result, columns}}) => {
        !result && setSaveBtn(false)
        const data: any = groupBy(result, 'type')

        // WIDGETS
        setWidgetColumn(8)
        setWidgetGrid(columns?.widget || 1)
        setWidget(filter(data?.widget, {is_active: 0}))
        setActiveWidget(filter(data?.widget, {is_active: 1}))

        // CHARTS
        const mergedChart: any = orderBy(
          [...(data?.table || []), ...(data?.chart || [])],
          'order_number',
          'asc'
        )

        setChartColumn(4)
        setLoadingPage(false)
        setChartGrid(columns?.chart || 3)
        setChart(filter(mergedChart, {is_active: 0}))
        setActiveChart(filter(mergedChart, {is_active: 1}))
      })
      .catch((err: any) => {
        setSaveBtn(false)
        setLoadingPage(false)
        Object.values(errorValidation(err))?.map((message: any) =>
          ToastMessage({type: 'error', message})
        )
      })
  }, [selectFilter, loadingResetBtn])

  const saveDashboard = () => {
    setLoadingSaveBtn(true)
    const params: any = [...widget, ...activeWidget, ...chart, ...activeChart]?.filter(
      (f: any) => f?.is_update
    )
    const columns: any = {
      widget: widgetGrid,
      chart: chartGrid,
    }

    let widgets: any = []
    if (params?.length) {
      widgets = params
    } else {
      widgets = [...widget, ...activeWidget, ...chart, ...activeChart]
    }

    widgets = widgets?.map(
      ({guid, is_active, order_number, setting_column, type}: any, index: number) => {
        let cols: any = 1
        if (type !== 'widget') {
          if (setting_column && setting_column > chartGrid) {
            cols = chartGrid
          } else {
            cols = setting_column || 1
          }
        }

        return {
          guid,
          is_active,
          order_number: order_number || index + 1,
          setting_column: cols,
        }
      }
    )
    saveWidget({widgets, columns})
      .then(({data: {message}}: any) => {
        navigate('/dashboard')
        setLoadingSaveBtn(false)
        ToastMessage({type: 'success', message})
      })
      .catch(({response}: any) => {
        setLoadingSaveBtn(false)
        const {message} = response?.data || {}
        ToastMessage({type: 'error', message})
      })
  }

  useEffect(() => {
    if (feature) {
      const array: any = []
      feature &&
        feature?.length > 0 &&
        feature?.forEach((item: any) => {
          if (item?.unique_name === 'help_desk' && item?.value === 1) {
            array.push(item)
          }
          if (item?.unique_name === 'my_asset' && item?.value === 1) {
            array.push(item)
          }
          if (item?.unique_name === 'insurance_claim' && item?.value === 1) {
            array.push(item)
          }
        })

      const dataFilter: any =
        array &&
        array?.length > 0 &&
        array?.map(({guid, name, unique_name}: any) => ({
          value: guid,
          label: unique_name === 'my_asset' ? 'Asset Management' : name,
        }))
      setDataFilter(dataFilter as never[])
    }

    getOwnerSubscription().then(({data: {data: res}}: any) => {
      const {subscription}: any = res || {}
      const {on_trial}: any = subscription || {}
      setIsTrial(on_trial)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useLayoutEffect(() => {
    const {headerHeight, toolBarHeight}: any = elementProperty() || {}
    const wrapper: any = document.getElementById('kt_wrapper')
    if (cardOptionRef?.current) {
      wrapper.style.paddingTop = headerHeight + 'px'
    } else {
      wrapper.style.paddingTop = headerHeight + 20 + 'px'
    }
    setActionCardTop(headerHeight - 20)

    return () => {
      wrapper.style.paddingTop = headerHeight + (toolBarHeight || 0) + 'px'
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardOptionRef?.current])

  const resetDashboard = () => {
    setLoadingResetBtn(true)
    resetDefaultDashboard()
      .then(({data: {message}}: any) => {
        setLoadingResetBtn(false)
        ToastMessage({type: 'success', message})
      })
      .catch(({response}: any) => {
        setLoadingResetBtn(false)
        const {message} = response?.data || {}
        ToastMessage({type: 'error', message})
      })
  }

  const backToDashboard = () => {
    navigate('/dashboard')
    useTimeOutMessage('clear', 200)
  }

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'PAGETITLE.MANAGE-DASHBOARD'})}
      </PageTitle>
      {loadingPage ? (
        <PageLoader />
      ) : (
        <>
          <div
            className='card mt-n9 mx-n5 mb-3 position-sticky p-5 radius-0 customTopMobile'
            style={{zIndex: 3, top: `${isTrial ? actionCardTop + 20 : actionCardTop}px`}}
            ref={cardOptionRef}
            data-cy='card-action'
          >
            <div className='row flex-center'>
              <div className='col-auto pe-0 mt-3'>Filter By :</div>
              <div className='col-auto mt-3 mt-1' data-cy='filter-container'>
                <Select
                  name='filter'
                  className='w-300px'
                  value={selectFilter}
                  placeholder='Select Filter'
                  onChange={(e: any) => setSelectFilter(e)}
                  getOptionValue={(option: any) => option?.value}
                  components={{ClearIndicator, DropdownIndicator}}
                  options={[{value: '', label: 'All Dashboard'}, ...dataFilter]}
                  styles={customStyles(true, {
                    control: {backgroundColor: '#eeefff', borderColor: '#eeefff', width: '200px'},
                    singleValue: {color: '#050990'},
                    option: {whiteSpace: 'nowrap', activeColor: '#050990'},
                  })}
                />
              </div>
              <div className='col mt-3 text-end'>
                <button className='btn btn-sm btn-light me-2 mt-2' onClick={backToDashboard}>
                  <i className='fa fa-arrow-left me-1' />
                  <span className='px-2 fw-bold'>Back</span>
                </button>

                <button
                  type='button'
                  onClick={resetDashboard}
                  disabled={loadingResetBtn}
                  className='btn btn-sm btn-primary me-1 mt-2'
                >
                  {loadingResetBtn ? (
                    <span className='indicator-progress d-inline-block'>
                      Please wait...
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  ) : (
                    'Reset'
                  )}
                </button>

                {saveBtn && (
                  <button
                    type='button'
                    onClick={saveDashboard}
                    disabled={loadingSaveBtn}
                    className='btn btn-sm btn-primary mt-2'
                  >
                    <i className='fa fa-check me-1' />
                    {loadingSaveBtn ? (
                      <span className='indicator-progress d-inline-block'>
                        Please wait...
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    ) : (
                      'Save Dashboard'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className={`mb-5 ${isTrial ? 'mt-10' : 'mt-5'} `}>
            <Widget
              widget={widget}
              col={col_widget}
              setWidget={setWidget}
              widgetGrid={widgetGrid}
              setCol={setWidgetColumn}
              activeWidget={activeWidget}
              setWidgetGrid={setWidgetGrid}
              setActiveWidget={setActiveWidget}
            />
          </div>

          <div className=''>
            <Chart
              chart={chart}
              col={col_chart}
              setChart={setChart}
              chartGrid={chartGrid}
              setCol={setChartColumn}
              activeChart={activeChart}
              setChartGrid={setChartGrid}
              setActiveChart={setActiveChart}
            />
          </div>

          <style>{`
            @media screen and (max-width: 996px) {
              .customTopMobile {
                padding-top: 55px !important;
              }
            }
          `}</style>
        </>
      )}
    </>
  )
}

export default ManageDashboard
