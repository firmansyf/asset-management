import {CalendarWidget} from '@components/calendar/Calendar'
import {preferenceDate, validationViewDate} from '@helpers'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'
import {renderToString} from 'react-dom/server'

import {getAvailabilityCalendar} from '../redux/AssetRedux'

let WidgetCalendar: FC<any> = ({keyword, orderCol, orderDir}) => {
  const pref_date = preferenceDate()
  const [eventCalendar, setEventCalendar] = useState<any>([])
  const [currentDate, setCurrentDate] = useState<any>(moment().format('YYYY-MM'))
  useEffect(() => {
    getAvailabilityCalendar({
      month: currentDate,
      keyword,
      orderCol,
      orderDir,
      page: 1,
      limit: 3,
    })
      .then(({data: {data: res}}: any) => {
        if (res) {
          const dataRes: any = []
          res.forEach((item: any) => {
            const {available, checkout, reservation} = item || {}

            if (available !== null) {
              available['dates'].forEach((result: any) => {
                dataRes.push({
                  original: available,
                  title: renderToString(
                    <div className='fw-bolder px-2'>
                      <p
                        className='text-truncate text-white text-capitalize fs-7 m-0'
                        style={{color: '#ebebeb'}}
                      >
                        {item['asset_name']}
                      </p>
                      <p
                        className='text-truncate text-white-500 fs-9 m-0'
                        style={{color: '#ebebeb'}}
                      >
                        {validationViewDate(result, pref_date)}
                      </p>
                    </div>
                  ),
                  start: moment(result).format('YYYY-MM-DD'),
                  end: moment(result).add(1, 'days').format('YYYY-MM-DD'),
                  backgroundColor: available['color'] || 'transparent',
                  borderColor: available['color'] || 'transparent',
                })
              })
            }

            if (checkout !== null) {
              checkout['dates'].forEach((result: any) => {
                dataRes.push({
                  original: checkout,
                  title: renderToString(
                    <div className='fw-bolder px-2'>
                      <p
                        className='text-truncate text-white text-capitalize fs-7 m-0'
                        style={{color: '#ebebeb'}}
                      >
                        {item['asset_name']}
                      </p>
                      <p
                        className='text-truncate text-white-500 fs-9 m-0'
                        style={{color: '#ebebeb'}}
                      >
                        {validationViewDate(result, pref_date)}
                      </p>
                    </div>
                  ),
                  start: moment(result).format('YYYY-MM-DD'),
                  end: moment(result).add(1, 'days').format('YYYY-MM-DD'),
                  backgroundColor: checkout['color'] || 'transparent',
                  borderColor: checkout['color'] || 'transparent',
                })
              })
            }

            if (reservation !== null) {
              reservation['dates'].forEach((result: any) => {
                dataRes.push({
                  original: reservation,
                  title: renderToString(
                    <div className='fw-bolder px-2'>
                      <p
                        className='text-truncate text-dark text-capitalize fs-7 m-0'
                        style={{color: '#000'}}
                      >
                        {item['asset_name']}
                      </p>
                      <p className='text-truncate text-dark-500 fs-9 m-0' style={{color: '#000'}}>
                        {validationViewDate(result, pref_date)}
                      </p>
                    </div>
                  ),
                  start: moment(result).format('YYYY-MM-DD'),
                  end: moment(result).add(1, 'days').format('YYYY-MM-DD'),
                  backgroundColor: reservation['color'] || 'transparent',
                  borderColor: reservation['color'] || 'transparent',
                })
              })
            }
          })

          setEventCalendar(dataRes)
        }
      })
      .catch(() => '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate, keyword, orderCol, orderDir])

  return (
    <CalendarWidget
      editable={false}
      events={eventCalendar}
      onSelectDate={(e: any) => e}
      onEventChange={(e: any) => e}
      onChangeMonth={(e: any) => {
        setCurrentDate(moment(e).format('YYYY-MM'))
      }}
      onEventClick={(e: any) => e}
    />
  )
}
WidgetCalendar = memo(
  WidgetCalendar,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {WidgetCalendar}
