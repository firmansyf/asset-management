import {Alert} from '@components/alert'
import {DataTable} from '@components/datatable'
import {matchColumns} from '@components/dnd/table'
import {ToastMessage} from '@components/toast-message'
import {configClass} from '@helpers'
import {clearDataFeeds, getDataFeeds} from '@pages/dashboard/redux/DashboardService'
import {useQuery, useQueryClient} from '@tanstack/react-query'
import {FC, memo, useState} from 'react'

type Props = {
  data?: string
  title: string
  dashboard_guid?: any
  unique_id: any
  height?: any
  permissions?: any
}

const dataOption: any = [
  {
    value: 'inventory-updated',
    label: 'Inventory Updated',
    column: [
      {value: 'inventory_id', header: 'Inventory ID'},
      {value: 'inventory_name', header: 'Inventory Name'},
      {value: 'datetime', header: 'Date Time'},
      {value: 'location', header: 'Location'},
      {value: 'update_detail', header: 'Update Detail'},
      {value: 'added_by', header: 'Added By'},
    ],
  },
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
      {value: 'added_by', header: 'Added By'},
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
]

let InventoryTable: FC<Props> = ({
  // data,
  title,
  // dashboard_guid,
  // unique_id,
  height,
  permissions = [],
}) => {
  const [columns, setColumns] = useState(dataOption?.[0]?.column)
  const [page, setPage] = useState(1)
  const [selectedOption, setSelectedOption] = useState(dataOption?.[0]?.value)
  const [limit, setLimit] = useState(10)
  const [totalPage, setTotalPage] = useState(0)
  const [showModalClearFeeds, setShowModalClearFeeds] = useState(false)

  const queryClient: any = useQueryClient()
  const dataQueryKey: any = ['getDataWidgetTable', {selectedOption, page, limit, columns}]
  const dataQuery: any = useQuery({
    initialData: [],
    queryKey: dataQueryKey,
    queryFn: async () => {
      if (selectedOption) {
        const api: any = await getDataFeeds(selectedOption, {
          page,
          limit,
          orderCol: 'changed_at',
          orderDir: 'desc',
        })
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

  const clearFeeds = () => {
    clearDataFeeds(selectedOption)
      .then(({data: {message}}: any) => {
        queryClient.invalidateQueries({queryKey: dataQueryKey})
        setShowModalClearFeeds(false)
        setSelectedOption(dataOption[0]?.value)
        ToastMessage({type: 'success', message})
      })
      .catch((err: any) => {
        setShowModalClearFeeds(false)
        ToastMessage({type: 'error', message: err?.response?.data?.message})
      })
  }

  return (
    <>
      <div className='card card-custom'>
        <div className='card-header'>
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0'>{title}</h3>
          </div>
          <div className='card-toolbar'>
            {permissions?.includes('dashboard-others.asset_feed_update') && (
              <div className='d-flex align-items-center'>
                {selectedOption && permissions?.includes('dashboard-others.asset_feed_update') && (
                  <div
                    className='text-nowrap btn-link cursor-pointer me-3 fw-bolder fs-5'
                    onClick={() => setShowModalClearFeeds(true)}
                  >
                    Clear Feeds
                  </div>
                )}
                {permissions?.includes('dashboard-others.asset_feed_list') && (
                  <select
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
        <div className='card-body'>
          <div style={{maxHeight: height ? height + 'px' : 'auto', overflow: 'auto'}}>
            <DataTable
              loading={!dataQuery?.isFetched}
              limit={limit}
              total={totalPage}
              data={dataWidget}
              columns={columns}
              customEmptyTable='No Data Available'
              onChangePage={(e: any) => setPage(e)}
              onChangeLimit={(e: any) => {
                setLimit(e)
                setPage(1)
              }}
            />
          </div>
        </div>
      </div>
      <Alert
        setShowModal={setShowModalClearFeeds}
        showModal={showModalClearFeeds}
        loading={false}
        body={
          <span>
            Are you sure want to clear <strong>All Feeds</strong> ?
          </span>
        }
        type={'delete'}
        title={'Clear Feeds'}
        confirmLabel={'Clear All'}
        onConfirm={clearFeeds}
        onCancel={() => {
          setShowModalClearFeeds(false)
        }}
      />
    </>
  )
}

InventoryTable = memo(
  InventoryTable,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {InventoryTable}
