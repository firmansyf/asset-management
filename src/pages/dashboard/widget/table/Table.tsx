import {DataTable} from '@components/datatable'
import {matchColumns} from '@components/dnd/table'
import {configClass, preferenceDate, preferenceTime} from '@helpers'
import {getDataAuditAsset, getDataFeeds} from '@pages/dashboard/redux/DashboardService'
import {useQuery} from '@tanstack/react-query'
import sortBy from 'lodash/sortBy'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'

const tableOption: any = [
  {
    value: 'inventory-stock-add',
    label: 'Stock Added',
    column: [
      {value: 'inventory_id', header: 'Inventory ID'},
      {value: 'inventory_name', header: 'Inventory Name'},
      {value: 'datetime', header: 'Date Time'},
      {value: 'location', header: 'Location'},
      {value: 'added_stock', header: 'Added Stock'},
      {value: 'total_qty', header: 'Total Quantity'},
      {value: 'added_by', header: 'Action By'},
    ],
  },
  {
    value: 'inventory-stock-reduced',
    label: 'Stock Reduced',
    column: [
      {value: 'inventory_id', header: 'Inventory ID'},
      {value: 'inventory_name', header: 'Inventory Name'},
      {value: 'datetime', header: 'Date Time'},
      {value: 'location', header: 'Location'},
      {value: 'removed_stock', header: 'Removed Stock'},
      {value: 'total_qty', header: 'Total Quantity'},
      {value: 'added_by', header: 'Reduced By'},
    ],
  },
  {
    value: 'inventory-reservation',
    label: 'Reservation',
    column: [
      {value: 'inventory_id', header: 'Inventory ID'},
      {value: 'inventory_name', header: 'Inventory Name'},
      {value: 'from_date', header: 'Start Date'},
      {value: 'to_date', header: 'End Date'},
      {value: 'total_qty', header: 'Quantity'},
      {value: 'location', header: 'Location'},
      {value: 'added_by', header: 'Reserved By'},
    ],
  },
  {
    value: 'location-update',
    label: 'Location Update',
    column: [
      {value: 'location_name', header: 'Location Name'},
      {value: 'datetime', header: 'Datetime'},
      {value: 'update_detail', header: 'Update Detail'},
      {value: 'added_by', header: 'Action By'},
    ],
  },
  {
    value: 'setup-update',
    label: 'Setup Update',
    column: [
      {value: 'datetime', header: 'Datetime'},
      {value: 'update_detail', header: 'Update Detail'},
      {value: 'added_by', header: 'Action By'},
    ],
  },
  {
    value: 'user-update',
    label: 'User Update',
    column: [
      {value: 'name', header: 'Name'},
      {value: 'datetime', header: 'Datetime'},
      {value: 'update_detail', header: 'Update Detail'},
      {value: 'added_by', header: 'Action By'},
    ],
  },
  // {
  //   value: 'computer-update',
  //   label: 'Computer Update',
  //   column: [
  //     {value: 'computer_name', header: 'Computer Name'},
  //     {value: 'datetime', header: 'Datetime'},
  //     {value: 'update_detail', header: 'Update Detail'},
  //     {value: 'added_by', header: 'Action By'},
  //   ],
  // },
  {
    value: 'audit-status',
    label: 'Audit Status',
    column: [
      {value: 'asset_name', header: 'Asset Name'},
      {value: 'datetime', header: 'Datetime'},
      {value: 'location_name', header: 'Location'},
      {value: 'added_by', header: 'Action By'},
    ],
  },
  {
    value: 'new-asset',
    label: 'Asset New',
    column: [
      {value: 'asset_name', header: 'Asset Name'},
      {value: 'asset_id', header: 'Asset ID'},
      {value: 'datetime', header: 'Datetime'},
      {value: 'added_by', header: 'Action By'},
    ],
  },
  {
    value: 'update-asset',
    label: 'Asset Update',
    column: [
      {value: 'asset_name', header: 'Asset Name'},
      {value: 'asset_id', header: 'Asset ID'},
      {value: 'datetime', header: 'Datetime'},
      {value: 'added_by', header: 'Action By'},
    ],
  },
  {
    value: 'all-update',
    label: 'All Updates',
    column: [
      {value: 'name', header: 'Name'},
      {value: 'event_name', header: 'Event Name'},
      {value: 'module', header: 'Module'},
      {value: 'description', header: 'Description'},
      {value: 'created_at', header: 'Created At'},
      {value: 'created_by', header: 'Action By'},
    ],
  },
]

type Props = {
  data?: string
  title: string
  dashboard_guid?: any
  unique_id: any
  height?: any
  permissions?: any
  feature?: any
}

let Table: FC<Props> = ({title, unique_id, height, permissions = [], feature}) => {
  const pref_date: any = preferenceDate()
  const pref_time: any = preferenceTime()
  const [page, setPage] = useState<number>(1)
  const [periodTime, setPeriodTime] = useState<string>('today')
  const [limit, setLimit] = useState<number>(10)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [featureInventory, setFeatureInventory] = useState<any>(0)

  let tableOptions: any = []
  if (featureInventory === 1) {
    tableOptions = [
      ...tableOption,
      {
        value: 'inventory-updated',
        label: 'Inventory Update',
        column: [
          {value: 'inventory_id', header: 'Inventory ID'},
          {value: 'inventory_name', header: 'Inventory Name'},
          {value: 'datetime', header: 'Date Time'},
          {value: 'location', header: 'Location'},
          {value: 'update_detail', header: 'Update Detail'},
          {value: 'added_by', header: 'Action By'},
        ],
      },
    ]
  } else {
    tableOptions = tableOption
  }

  const dataOption: any = sortBy(tableOptions, 'label')
  const [selectedOption, setSelectedOption] = useState<any>(dataOption?.[0]?.value)
  const [columns, setColumns] = useState<any>(dataOption?.[0].column)

  useEffect(() => {
    if (feature) {
      feature
        ?.filter((features: {unique_name: any}) => features.unique_name === 'inventory')
        ?.forEach((feature: any) => {
          setFeatureInventory(feature?.value || 0)
        })
    }
  }, [feature])

  // const [showModalClearFeeds, setShowModalClearFeeds] = useState(false)

  // const clearFeeds = () => {
  //   clearDataFeeds(selectedOption)
  //   .then(({data: {message}}: any) => {
  //     setReloadFeeds(!reloadFeeds)
  //     setShowModalClearFeeds(false)
  //     setSelectedOption(dataOption[0]?.value)
  //     ToastMessage({type: 'success', message})
  //   })
  //   .catch((err: any) => {
  //     setShowModalClearFeeds(false)
  //     ToastMessage({type: 'error', message: err?.response?.data?.message})
  //   })
  // }

  const dataQuery: any = useQuery({
    initialData: [],
    queryKey: ['getDataWidgetTable', {selectedOption, page, limit, columns, periodTime}],
    queryFn: async () => {
      if (selectedOption) {
        let api: any = {}
        if (selectedOption === 'audit-status') {
          api = await getDataAuditAsset({periodTime, page, limit})
        } else {
          let filter: any = {}
          if (selectedOption !== 'all-update') {
            filter = {page, limit, orderCol: 'changed_at', orderDir: 'desc'}
          }
          api = await getDataFeeds(selectedOption, {page, limit, ...filter})
        }
        const {data, meta}: any = api?.data
        const {total} = meta || {}
        setTotalPage(total || 0)
        return data ? matchColumns(data, columns) : []
      } else {
        return []
      }
    },
  })

  const dataWidget: any = dataQuery?.data || []

  return (
    <>
      <div className='card h-100 border border-gray-300'>
        <div
          className='card-header d-flex align-items-center bg-light-primary border-bottom border-gray-300 p-4'
          style={{minHeight: 'unset'}}
        >
          <div className='fw-bolder fs-7 text-primary'>{title}</div>
          <div className='card-toolbar m-0'>
            {permissions?.includes('dashboard-others.asset_feed_update') &&
              unique_id === 'feeds' && (
                <div className='d-flex align-items-center'>
                  {/*
                {permissions?.includes('dashboard-others.asset_feed_update') && selectedOption && (
                  <div
                    className='text-nowrap btn btn-sm btn-light-danger cursor-pointer me-3 fw-bold fs-8 py-1 px-3 rounded border border-danger'
                    onClick={() => setShowModalClearFeeds(true)}
                  >
                    <i className='fa fa-times-circle'/>
                    Clear Feeds
                  </div>
                )}
                */}
                  {permissions?.includes('dashboard-others.asset_feed_list') &&
                    unique_id === 'feeds' && (
                      <select
                        id='feedsOption'
                        className={configClass?.select}
                        value={selectedOption}
                        onChange={({target: {value}}: any) => {
                          const column =
                            dataOption.find(({value: val}: any) => val === value)?.column || []
                          setColumns(column)
                          setSelectedOption(value)
                        }}
                      >
                        {dataOption?.map(({label, value}: any, index: number) => {
                          return (
                            <option key={index} value={value}>
                              {label}
                            </option>
                          )
                        })}
                      </select>
                    )}
                </div>
              )}
          </div>
        </div>
        <div className='card-body px-3 py-0'>
          <div
            className='mb-5'
            style={{
              height: height ? height + 'px' : 'auto',
              maxHeight: '350px',
              overflow: 'auto',
            }}
          >
            {selectedOption === 'audit-status' && (
              <div className='d-flex align-items-center flex-row-reverse mt-3'>
                <div style={{width: '140px'}}>
                  <select
                    className={configClass?.select}
                    onChange={({target: {value}}: any) => setPeriodTime(value)}
                  >
                    <option value='today'>Today</option>
                    <option value='30-days'>Last 30 days</option>
                    <option value='3-months'>Last 3 months</option>
                    <option value='8-months'>Last 8 months</option>
                  </select>
                </div>
                <div className='text-nowrap me-3 fw-bold fs-8'> Choose Period </div>
              </div>
            )}
            <DataTable
              height='200px'
              className='table-sm'
              loading={!dataQuery?.isFetched}
              limit={limit}
              total={totalPage}
              data={dataWidget}
              columns={columns}
              customEmptyTable='No Data Available'
              onChangePage={setPage}
              onChangeLimit={(e: any) => {
                setLimit(e)
                setPage(1)
              }}
              render={(val: any, _data: any) => {
                return {
                  name: (
                    <span className='fw-bold text-nowrap'>
                      <i className='fa fa-user-circle text-primary me-2' />
                      {val}
                    </span>
                  ),
                  asset_name: (
                    <span className='fw-bold text-nowrap'>
                      <i className='fa fa-print text-primary me-2' />
                      {val}
                    </span>
                  ),
                  asset_id: <span className='badge badge-light text-dark text-nowrap'>{val}</span>,
                  location_name: (
                    <span className='fw-bold text-nowrap'>
                      <i className='fa fa-map-marker-alt text-danger me-2' />
                      {val}
                    </span>
                  ),
                  update_detail: (
                    <span className='fw-bold text-muted'>
                      <i className='fas fa-check-double text-success me-2' />
                      {val}
                    </span>
                  ),
                  event_name: (
                    <span className='fw-bold text-muted'>
                      <i className='fas fa-check-double text-success me-2' />
                      {val}
                    </span>
                  ),
                  added_by: <span className='badge badge-light-primary'>{val}</span>,
                  created_by: <span className='badge badge-light-primary'>{val}</span>,
                  datetime: val
                    ? () => (
                        <div className=''>
                          <p className='m-0 fs-8 fw-bold text-nowrap'>
                            <i className='fa fs-8 fa-calendar-alt text-primary me-1' />{' '}
                            {moment(val).utc().format(pref_date)}
                          </p>
                          <p className='m-0 fs-8 text-muted text-nowrap'>
                            <i className='fa fs-8 fa-clock text-muted me-1' />{' '}
                            {moment(val).utc().format(pref_time)}
                          </p>
                        </div>
                      )
                    : '-',
                  created_at: val
                    ? () => (
                        <div className=''>
                          <p className='m-0 fs-8 fw-bold text-nowrap'>
                            <i className='fa fs-8 fa-calendar-alt text-primary me-1' />{' '}
                            {moment(val).utc().format(pref_date)}
                          </p>
                          <p className='m-0 fs-8 text-muted text-nowrap'>
                            <i className='fa fs-8 fa-clock text-muted me-1' />{' '}
                            {moment(val).utc().format(pref_time)}
                          </p>
                        </div>
                      )
                    : '-',
                  from_date: val
                    ? () => (
                        <div className=''>
                          <p className='m-0 fs-8 fw-bold text-nowrap'>
                            <i className='fa fs-8 fa-calendar-alt text-primary me-1' />{' '}
                            {moment(val).format(pref_date)}
                          </p>
                        </div>
                      )
                    : '-',
                  to_date: val
                    ? () => (
                        <div className=''>
                          <p className='m-0 fs-8 fw-bold text-nowrap'>
                            <i className='fa fs-8 fa-calendar-alt text-primary me-1' />{' '}
                            {moment(val).format(pref_date)}
                          </p>
                        </div>
                      )
                    : '-',
                }
              }}
            />
          </div>
        </div>
      </div>
      {/* <Alert
        setShowModal={setShowModalClearFeeds}
        showModal={showModalClearFeeds}
        loading={false}
        body={(
          <span>Are you sure want to clear <strong>All Feeds</strong> ?</span>
        )}
        type={'delete'}
        title={'Clear Feeds'}
        confirmLabel={'Clear All'}
        onConfirm={clearFeeds}
        onCancel={() => {
          setShowModalClearFeeds(false)
        }}
      /> */}
    </>
  )
}

Table = memo(Table, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export {Table}
