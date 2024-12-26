import {CalendarWidget} from '@components/calendar/Calendar'
import {preferenceDate} from '@helpers'
import {getDataWidget} from '@pages/dashboard/redux/DashboardService'
import {useQuery} from '@tanstack/react-query'
import flattenDeep from 'lodash/flattenDeep'
import moment from 'moment'
import {FC, memo} from 'react'
import {renderToString} from 'react-dom/server'

let WidgetCalendar: FC<any> = ({
  guid,
  unique_id,
  height = 'auto',
  weekday = 'short',
  className = '',
}) => {
  const pref_date = preferenceDate()

  const eventCalendarQuery: any = useQuery({
    initialData: [],
    queryKey: ['getDataWidgetCalendar', {guid, unique_id, pref_date}],
    queryFn: async () => {
      if (guid && unique_id) {
        const api: any = await getDataWidget(guid, unique_id)
        const {data: res, widget}: any = api?.data
        let dataRes: any = flattenDeep(Object.values(res || {}))?.map((m: any) => {
          const event_name = m['name'] || m['name'] !== null ? m['name'] : '-'
          let url: string = ''
          const pageGuid: string = m?.page_guid || ''
          if (pageGuid !== '') {
            switch (m?.alert_type) {
              case 'warranty':
              case 'asset_checkout':
                url = `/asset-management/detail/${pageGuid}`
                break
              case 'insurance':
                url = `/insurance/policies/detail/${pageGuid}`
                break
              case 'helpdesk_ticket':
                url = `/help-desk/ticket/detail/${pageGuid}`
                break
              case 'maintenance':
                url = `/maintenance/work-order/detail/${pageGuid}`
                break
              default:
                url = ''
            }
          }
          return {
            original: m,
            title: renderToString(
              <div className='fw-bolder px-2'>
                <p className='text-truncate text-primary text-capitalize fs-7 m-0'>{event_name}</p>
                <p className='text-truncate text-gray-500 fs-9 m-0'>
                  {moment(m['date']).format(pref_date)}
                </p>
              </div>
            ),
            start: moment(m['date']).format('YYYY-MM-DD'),
            end: moment(m['date']).add(1, 'days').format('YYYY-MM-DD'),
            color: 'transparent',
            textColor: '#000',
            url: url,
          }
        })
        if (widget?.create_account) {
          dataRes = dataRes.concat({
            title: renderToString(
              <div className='fw-bolder px-2'>
                <p className='text-truncate text-primary text-capitalize fs-7 m-0'>
                  Account Created
                </p>
                <p className='text-truncate text-gray-500 fs-9 m-0'>
                  {moment(widget?.create_account).format(pref_date)}
                </p>
              </div>
            ),
            start: moment(widget?.create_account).format('YYYY-MM-DD'),
            end: moment(widget?.create_account)
              .add(1, 'days')
              .format('YYYY-MM-DD'),
            color: 'transparent',
            textColor: '#000',
          })
        }

        return dataRes
      } else {
        return []
      }
    },
  })

  const eventCalendar: any = eventCalendarQuery?.data || []

  return (
    <CalendarWidget
      height={height}
      editable={false}
      events={eventCalendar}
      onSelectDate={(e: any) => e}
      onEventChange={(e: any) => e}
      onChangeMonth={(e: any) => e}
      onEventClick={(e: any) => e}
      weekday={weekday}
      className={className}
    />
  )
}

WidgetCalendar = memo(
  WidgetCalendar,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {WidgetCalendar}
