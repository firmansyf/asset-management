import 'react-datetime/css/react-datetime.css'

import {configClass, preferenceDate} from '@helpers'
import {ErrorMessage} from 'formik'
import moment from 'moment'
import {FC, useEffect, useState} from 'react'
import Datetime from 'react-datetime'
const DateInput: FC<any> = ({
  name,
  label,
  placeholder = label || 'Choose Date',
  defaultValue,
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
        setDate(null)
      }
    }
  }, [controlled, defaultValue, nullable])

  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className={`${configClass?.label} mb-2 ${required && 'required'}`}>
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
              formatted = moment(e).format('YYYY-MM-DD')
            }
            setDate(m)
            setFieldValue && setFieldValue(name, formatted)
            onChange && onChange(m)
          }}
          dateFormat={format}
          value={date}
          initialValue={defaultValue}
          timeFormat={false}
          isValidDate={validation}
        />
      </div>
      <div className='fv-plugins-message-container invalid-feedback'>
        <ErrorMessage name={name} />
      </div>
    </div>
  )
}
export const DateEl: FC<any> = ({
  name,
  label,
  placeholder = label || 'Choose Date',
  defaultValue,
  format = preferenceDate(),
  className,
  required,
  validation,
  onChange,
  nullable,
  controlled,
}) => {
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
          onChange={(e: any) => {
            let formatted: any = ''
            if (moment(e).isValid()) {
              formatted = moment(e).format('YYYY-MM-DD')
              setDate(formatted)
              onChange && onChange(formatted)
            }
          }}
          dateFormat={format}
          value={date}
          timeFormat={false}
          isValidDate={validation}
        />
      </div>
    </div>
  )
}
export default DateInput
