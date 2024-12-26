import {configClass, preferenceDate} from '@helpers'
import {ErrorMessage} from 'formik'
import moment from 'moment'
import {FC, memo, useState} from 'react'
import Datetime from 'react-datetime'

let DateField: FC<any> = ({setFieldValue}) => {
  const pref_date = preferenceDate()
  const [checkoutDate, setCheckoutDate] = useState<any>()
  const [dueDate, setDueDate] = useState<any>()
  const [noDueDate, setNoDueDate] = useState(false)
  return (
    <div className='col-md-12 mt-4'>
      <div className='row'>
        <div className='col-md-6'>
          <label htmlFor='checkout_date' className={`${configClass?.label} required`}>
            Check Out Date
          </label>
          <div className='input-group input-group-solid'>
            <span className='input-group-text pe-0'>
              <i className='fa fa-calendar-alt text-primary' />
            </span>
            <Datetime
              closeOnSelect
              inputProps={{
                autoComplete: 'off',
                className: `${configClass?.form} rdt-filter-date`,
                name: 'checkout_date',
                placeholder: 'Enter Check Out Date',
                readOnly: true,
              }}
              onChange={(e: any) => {
                const m = moment(e).format('YYYY-MM-DD')
                setCheckoutDate(m)
                setFieldValue('checkout_date', m)
              }}
              isValidDate={(currentDate: any) =>
                dueDate ? currentDate.isSameOrBefore(dueDate) : true
              }
              dateFormat={pref_date}
              value={checkoutDate || moment().format(pref_date)}
              timeFormat={false}
            />
          </div>
          <div className='fv-plugins-message-container invalid-feedback'>
            <ErrorMessage name='checkout_date' />
          </div>
          <div className='mt-5 mb-4'>
            <div className='d-flex align-items-center form-check form-check-sm form-check-custom form-check-solid mb-1 mt-1'>
              <input
                id='no_due_date'
                name='no_due_date'
                type='checkbox'
                checked={noDueDate}
                className='form-check-input border border-gray-300'
                onChange={({target: {checked}}) => {
                  setNoDueDate(!noDueDate)
                  if (checked) {
                    setDueDate('')
                    setFieldValue('due_date', '')
                  }
                }}
              />
              <label
                htmlFor='no_due_date'
                className={`${configClass?.label} ms-2 user-select-none cursor-pointer required`}
              >
                No Due Date
              </label>
            </div>
          </div>
        </div>
        {!noDueDate && (
          <div className='col-md-6'>
            <label htmlFor='due_date' className={`${configClass?.label}`}>
              Due Date
            </label>
            <div className='input-group input-group-solid'>
              <span className='input-group-text pe-0'>
                <i className='fa fa-calendar-alt text-primary'></i>
              </span>
              <Datetime
                closeOnSelect
                inputProps={{
                  autoComplete: 'off',
                  className: `${configClass?.form} rdt-filter-date`,
                  name: 'due_date',
                  placeholder: 'Enter Due Date',
                  readOnly: true,
                }}
                onChange={(e: any) => {
                  const m = moment(e).format('YYYY-MM-DD')
                  setDueDate(m)
                  setFieldValue('due_date', m)
                }}
                isValidDate={(currentDate: any) => currentDate.isSameOrAfter(checkoutDate)}
                dateFormat={pref_date}
                value={dueDate}
                timeFormat={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

DateField = memo(DateField, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default DateField
