import {Moment} from 'moment'
import {FC, FocusEvent, FocusEventHandler, HTMLProps, ReactNode} from 'react'
declare module 'react-datetime' {
  export type ViewMode = 'years' | 'months' | 'days' | 'time'

  export interface TimeConstraint {
    min: number
    max: number
    step: number
  }

  export interface TimeConstraints {
    hours?: TimeConstraint
    minutes?: TimeConstraint
    seconds?: TimeConstraint
    milliseconds?: TimeConstraint
  }

  type EventOrValueHandler<Event> = (event: Event | Moment | string) => void
  type valueTypes = Date | string | Moment | undefined

  export interface DatetimepickerProps {
    value?: valueTypes
    initialValue?: valueTypes
    initialViewDate?: valueTypes
    initialViewMode?: ViewMode
    updateOnView?: string
    dateFormat?: boolean | string
    timeFormat?: boolean | string
    input?: boolean
    open?: boolean
    locale?: string
    utc?: boolean
    displayTimeZone?: string
    onChange?: (value: Moment | string) => void
    onOpen?: FocusEventHandler<any>
    onClose?: EventOrValueHandler<FocusEvent<any>>
    onNavigate?: (viewMode: string) => void
    onBeforeNavigate?: (nextView: string, currentView: string, viewDate: Moment) => string
    onNavigateBack?: (amount: number, type: string) => void
    onNavigateForward?: (amount: number, type: string) => void
    className?: string
    inputProps?: HTMLProps<HTMLInputElement>
    isValidDate?: (currentDate: any, selectedDate: any) => boolean
    renderView?: (viewMode: string, renderCalendar: any) => ReactNode
    renderDay?: (props: any, currentDate: any, selectedDate: any) => ReactNode
    renderMonth?: (props: any, month: number, year: number, selectedDate: any) => ReactNode
    renderYear?: (props: any, year: number, selectedDate: any) => ReactNode
    renderInput?: (props: any, openCalendar: any, closeCalendar: any) => ReactNode
    strictParsing?: boolean
    closeOnSelect?: boolean
    timeConstraints?: TimeConstraints
    closeOnClickOutside?: boolean
  }

  export interface DatetimepickerState {
    updateOn: string
    inputFormat: string
    viewDate: Moment
    selectedDate: Moment
    inputValue: string
    open: boolean
  }
  const DateTime: FC<DatetimepickerProps, DatetimepickerState>
  export default DateTime
}
