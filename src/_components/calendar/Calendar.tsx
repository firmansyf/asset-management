/* eslint-disable simple-import-sort/imports */
import './style.scss'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import moment from 'moment'
import {FC, useRef} from 'react'
import Tooltip from '@components/alert/tooltip'
import {useNavigate} from 'react-router-dom'

const CalendarWidget: FC<any> = ({
  // dashboard_guid,
  // unique_id,
  height = 'auto',
  className = '',
  onChangeMonth,
  onSelectDate,
  onDrop,
  onClick,
  editable,
  selectable,
  events,
  onEventClick,
  onEventChange,
  now = moment(),
  weekday = 'short',
}) => {
  const calendarRef: any = useRef()
  const navigate: any = useNavigate()
  const handleEvent = (e: any) => {
    e.jsEvent.preventDefault()
    onEventChange && onEventChange(e.event.toJSON())
  }
  const eventClick = (e: any) => {
    if (e?.el?.pathname !== '') {
      navigate(e?.el?.pathname)
    }
    e.jsEvent.preventDefault()
    onEventClick && onEventClick(e.event.toJSON())
  }
  const handleSelectDate = (e: any) => {
    onSelectDate &&
      onSelectDate({
        start: moment(e.start),
        end: moment(e.end).subtract(1, 'd'),
      })
  }
  const eventsSet = () => {
    if (calendarRef?.current) {
      const date = calendarRef?.current?.getApi()?.getDate()
      onChangeMonth && onChangeMonth(moment(date))
    }
  }
  // useEffect(() => {
  //   if (dashboard_guid) {
  //     getDataWidget(dashboard_guid, unique_id)
  //   }
  // }, [dashboard_guid, unique_id])
  return (
    <div className={className} style={{overflow: 'auto'}}>
      <FullCalendar
        themeSystem='bootstrap'
        // dayCellClassNames='ratio ratio-1x1'
        bootstrapFontAwesome={{
          close: 'fa fa-times',
          prev: 'fa fa-angle-left',
          next: 'fa fa-angle-right',
          prevYear: 'fa fa-angle-double-left',
          nextYear: 'fa fa-angle-double-right',
        }}
        headerToolbar={{
          // start: 'dayGridMonth,dayGridWeek',
          start: 'title',
          center: '',
          end: 'today,prev,next',
        }}
        buttonText={{
          today: Math.ceil(Math.abs(now.diff(moment(), 'months', true))) ? 'Event' : 'Today',
        }}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        ref={calendarRef}
        businessHours
        dayMaxEvents={3}
        height={height}
        // contentHeight='auto'
        // aspectRatio={2.5}
        // stickyHeaderDates={true}
        initialView='dayGridMonth'
        dayHeaderFormat={{weekday}}
        displayEventTime={true}
        snapDuration='00:025'
        now={now.toDate()}
        editable={editable}
        selectable={selectable}
        selectMirror
        locale='en'
        select={handleSelectDate}
        drop={(e: any) => {
          onDrop && onDrop(e)
        }}
        fixedWeekCount={false}
        firstDay={1}
        eventResizableFromStart
        eventDrop={handleEvent}
        eventResize={handleEvent}
        eventClick={eventClick}
        eventsSet={eventsSet}
        eventContent={(e: any) => {
          return (
            <div>
              {e.event.id === 'youtube' ? (
                <p className='mx-2 my-0 text-truncate'>
                  <span className='fa fa-youtube mr-1'></span>
                  {e.event.title}
                </p>
              ) : (
                <Tooltip
                  className='fc-tooltip'
                  placement='auto'
                  title={<div dangerouslySetInnerHTML={{__html: e.event.title}} />}
                >
                  <div className='scale-9' dangerouslySetInnerHTML={{__html: e.event.title}} />
                </Tooltip>
              )}
            </div>
          )
        }}
        dateClick={(e: any) => {
          onClick && onClick(moment(e.date))
        }}
        // hiddenDays={[0,6]}
        events={events}
      />
    </div>
  )
}
export {CalendarWidget}
