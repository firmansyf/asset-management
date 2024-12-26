import {configClass} from '@helpers'
import {ErrorMessage} from 'formik'
import moment from 'moment'
import {FC, useState} from 'react'
import Datetime from 'react-datetime'
const TimeInput: FC<any> = ({
  name,
  label,
  placeholder = label || '',
  defaultValue = moment(),
  className,
  required,
  setFieldValue,
  inputClass,
}) => {
  const [time, setTime] = useState(defaultValue)
  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className={`mb-2 ${required && 'required'}`}>
          {' '}
          {label}{' '}
        </label>
      )}
      <div className='input-group input-group-solid'>
        <span className='input-group-text pe-0'>
          {' '}
          <i className='fa fa-clock fa-lg text-primary' />{' '}
        </span>
        <div style={{width: '100px'}}>
          <Datetime
            inputProps={{
              name,
              placeholder,
              autoComplete: 'off',
              className: `${configClass?.form} ${inputClass}`,
              readOnly: true,
            }}
            onChange={(e: any) => {
              const m = moment(e).format('HH:mm')
              setTime(moment(e))
              setFieldValue && setFieldValue(name, m)
            }}
            dateFormat={false}
            value={time}
            timeFormat={'HH:mm'}
          />
        </div>
      </div>
      <div className='fv-plugins-message-container invalid-feedback'>
        <ErrorMessage name={name} />
      </div>
    </div>
  )
}
export default TimeInput
