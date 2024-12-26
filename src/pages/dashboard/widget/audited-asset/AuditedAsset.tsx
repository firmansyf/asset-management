import {DataTable} from '@components/datatable'
import {configClass, preferenceDateTime} from '@helpers'
import {getDataAuditAsset} from '@pages/dashboard/redux/DashboardService'
import {useQuery} from '@tanstack/react-query'
import moment from 'moment'
import {FC, useMemo, useState} from 'react'
import {Link} from 'react-router-dom'

type Props = {
  title: string
  dashboard_guid?: any
  unique_id?: any
  height?: any
}

const AuditedAsset: FC<Props> = ({title, height}) => {
  const pref_date_time: any = preferenceDateTime()
  const [page, setPage] = useState<number>(1)
  const [periodTime, setSelectedOption] = useState<string>('today')
  const [limit, setLimit] = useState<number>(10)
  const [totalPage, setTotalPage] = useState<number>(0)

  const onChangeLimit = (e: any) => {
    setLimit(e)
    setPage(1)
  }

  const onPageChange = (e: any) => {
    setPage(e)
  }

  const auditAssetQuery: any = useQuery({
    initialData: [],
    queryKey: ['getDataAuditAsset', {periodTime, page, limit}],
    queryFn: async () => {
      const api: any = await getDataAuditAsset({periodTime, page, limit})
      const {data: res_data, meta}: any = api?.data || {}
      const {total} = meta || {}
      setTotalPage(total || 0)
      const result: any = res_data?.map((e: any) => {
        const {asset_id, asset_name, location, added_by, datetime} = e || {}
        const {lat, lng} = location || {}
        return {
          original: e,
          asset_id,
          asset_name,
          location: lat + ', ' + lng,
          datetime,
          added_by,
        }
      })
      return result
    },
  })

  const dataWidget: any = auditAssetQuery?.data || []

  const columns = useMemo(
    () => [
      {header: 'Asset ID'},
      {header: 'Asset Name'},
      {header: 'Location'},
      {header: 'Audit Date'},
      {header: 'Auditor'},
    ],
    []
  )

  return (
    <div className='card h-100 border border-gray-300'>
      <div
        className='card-header d-flex align-items-center bg-light-primary border-bottom border-gray-300 p-4'
        style={{minHeight: 'unset'}}
      >
        <div className='fw-bolder fs-7 text-primary'>{title}</div>
        <div className='card-toolbar m-0'>
          <div className='d-flex align-items-center'>
            <select
              className={configClass?.select}
              onChange={({target}: any) => {
                const {value} = target
                setSelectedOption(value)
              }}
            >
              <option value='today'>Today</option>
              <option value='30-days'>Last 30 days</option>
              <option value='3-months'>Last 3 months</option>
              <option value='8-months'>Last 8 months</option>
            </select>
          </div>
        </div>
      </div>
      <div className='card-body px-3 py-0'>
        <div
          className='mb-5'
          style={{
            minHeight: height ? height + 'px' : 'auto',
            maxHeight: '350px',
            overflow: 'auto',
          }}
        >
          <DataTable
            loading={!auditAssetQuery?.isFetched}
            limit={limit}
            total={totalPage}
            data={dataWidget}
            columns={columns}
            customEmptyTable='No Data Available'
            onChangePage={onPageChange}
            onChangeLimit={onChangeLimit}
            render={(val: any, original: any) => {
              return {
                datetime: val ? moment(val).format(pref_date_time) : '-',
                asset_id: val ? (
                  <Link to={`/asset-management/detail/${original?.original?.asset_guid}`}>
                    {`${val}`}
                  </Link>
                ) : (
                  '-'
                ),
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

export {AuditedAsset}
