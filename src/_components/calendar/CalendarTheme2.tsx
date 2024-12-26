/* eslint-disable simple-import-sort/imports */
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import moment from 'moment'
import {FC, useRef} from 'react'

const CalendarWidget: FC<any> = ({
  height,
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
}) => {
  const calendarRef: any = useRef()
  const handleEvent = (e: any) => {
    e.jsEvent.preventDefault()
    onEventChange && onEventChange(e.event.toJSON())
  }
  const eventClick = (e: any) => {
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
  return (
    <div className='' style={{height: `${height || 'auto'}`, overflow: 'auto'}}>
      <FullCalendar
        themeSystem='bootstrap'
        bootstrapFontAwesome={{
          close: 'fa fa-times',
          prev: 'fa fa-angle-left',
          next: 'fa fa-angle-right',
          prevYear: 'fa fa-angle-double-left',
          nextYear: 'fa fa-angle-double-right',
        }}
        headerToolbar={{
          // left: 'dayGridMonth,dayGridWeek',
          left: 'title',
          center: '',
          right: 'today,prev,next',
        }}
        buttonText={{
          today: Math.ceil(Math.abs(now.diff(moment(), 'months', true))) ? 'Event' : 'Today',
        }}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        ref={calendarRef}
        businessHours
        height={'auto'}
        contentHeight='auto'
        // aspectRatio={2.5}
        // stickyHeaderDates={true}
        initialView='dayGridMonth'
        dayHeaderFormat={{weekday: 'short'}}
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
        firstDay={0}
        eventResizableFromStart
        eventDrop={handleEvent}
        eventResize={handleEvent}
        eventClick={eventClick}
        eventsSet={eventsSet}
        eventContent={(e: any) => (
          <div>
            {e.event.id === 'youtube' ? (
              <p className='mx-2 my-0 text-truncate'>
                <span data-cy='event-youtube' className='fa fa-youtube mr-1'></span>
                {e.event.title}
              </p>
            ) : (
              <p data-cy='event-name' className='mx-2 my-0 text-truncate'>
                {e.event.title}
              </p>
            )}
          </div>
        )}
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
