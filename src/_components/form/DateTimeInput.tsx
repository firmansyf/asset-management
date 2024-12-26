import {configClass, preferenceDate, preferenceDateTime, preferenceTime} from '@helpers'
import {ErrorMessage} from 'formik'
import moment from 'moment'
import {FC, useEffect, useState} from 'react'
import Datetime from 'react-datetime'
const DateTimeInput: FC<any> = ({
  name,
  label,
  placeholder = label || 'Choose Date & Time',
  defaultValue = moment(),
  format = preferenceDate(),
  className,
  required,
  setFieldValue,
  validation,
  onChange,
  nullable,
  controlled,
  dataCY,
}) => {
  const pref_date_time: any = preferenceDateTime()
  const pref_time: any = preferenceTime()
  const [date, setDate] = useState<any>(
    defaultValue && moment(defaultValue).isValid()
      ? moment(defaultValue)
      : nullable
      ? undefined
      : moment()
  )
  useEffect(() => {
    if (controlled) {
      if (defaultValue && moment(defaultValue).isValid()) {
        setDate(moment(defaultValue))
      } else if (!defaultValue && nullable) {
        setDate(undefined)
      } else {
        setDate(moment())
      }
    }
  }, [controlled, defaultValue, nullable])

  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className={`mb-2 ${required && 'required'}`}>
          {' '}
          {label}{' '}
        </label>
      )}
      <div className='input-group input-group-solid flex-nowrap'>
        <span className='input-group-text pe-0'>
          {' '}
          <i className='fa fa-calendar-alt text-primary' style={{lineHeight: 0}} />{' '}
        </span>
        <Datetime
          closeOnSelect
          inputProps={{
            name,
            placeholder,
            'data-cy': dataCY,
            autoComplete: 'off',
            className: configClass?.form,
            readOnly: !nullable,
          }}
          onChange={(e: any) => {
            let m: any = undefined
            let formatted = ''
            if (moment(e).isValid()) {
              m = moment(e)
              formatted = moment(e).format('YYYY-MM-DD HH:mm:ss')
            }
            setDate(moment(m).format(pref_date_time))
            setFieldValue && setFieldValue(name, formatted)
            onChange && onChange(m)
          }}
          dateFormat={format}
          value={date}
          timeFormat={pref_time}
          isValidDate={validation}
        />
      </div>
      <div className='fv-plugins-message-container invalid-feedback'>
        <ErrorMessage name={name} />
      </div>
    </div>
  )
}
export const DateTime: FC<any> = ({
  name,
  label,
  placeholder = label || 'Choose Date & Time',
  defaultValue,
  format = preferenceDate(),
  className,
  required,
  validation,
  onChange,
  nullable,
  controlled,
}) => {
  const pref_date_time: any = preferenceDateTime()
  const pref_time: any = preferenceTime()
  const [defaultDate, setDefaultDate] = useState<any>(undefined)
  const [date, setDate] = useState<any>(
    defaultValue && moment(defaultValue).isValid()
      ? moment(defaultValue)
      : nullable
      ? undefined
      : moment()
  )

  useEffect(() => {
    if (controlled) {
      if (defaultValue && moment(defaultValue).isValid()) {
        setDate(moment(defaultValue).format(pref_date_time))
      } else if (!defaultValue && nullable) {
        setDate(undefined)
      } else {
        setDate(moment())
      }
    }
  }, [controlled, defaultValue, nullable, pref_date_time])

  useEffect(() => {
    if (defaultValue && moment(defaultValue).isValid()) {
      setDefaultDate(moment(defaultValue).format(pref_date_time))
    } else {
      setDefaultDate(undefined)
    }
  }, [defaultValue, pref_date_time])

  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className={`mb-2 ${required && 'required'}`}>
          {label}
        </label>
      )}
      <div className='input-group input-group-solid flex-nowrap'>
        <span className='input-group-text pe-0'>
          <i className='fa fa-calendar-alt text-primary' style={{lineHeight: 0}} />
        </span>
        <Datetime
          closeOnSelect
          inputProps={{
            name,
            placeholder,
            autoComplete: 'off',
            className: configClass?.form,
            readOnly: !nullable,
          }}
          initialValue={defaultDate}
          value={date}
          onChange={(e: any) => {
            let formatted: any = ''
            if (moment(e).isValid()) {
              formatted = moment(e).format('YYYY-MM-DD HH:mm:ss')
              setDate(moment(e).format(pref_date_time))
              onChange && onChange(formatted)
            }
          }}
          dateFormat={format}
          timeFormat={pref_time}
          isValidDate={validation}
        />
      </div>
    </div>
  )
}
export default DateTimeInput
