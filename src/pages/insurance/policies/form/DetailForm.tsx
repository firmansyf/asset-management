import 'react-datetime/css/react-datetime.css'

import {InputText} from '@components/InputText'
import {configClass} from '@helpers'
import {ErrorMessage, Field} from 'formik'
import moment from 'moment'
import {FC, memo} from 'react'
import Datetime from 'react-datetime'

type DetailFormProps = {
  setFieldValue: any
  country_code: any
  startDate: any
  setStartDate: any
  endDate: any
  setEndDate: any
  validation: any
  setValidation: any
  currency: any
}

let DetailForm: FC<DetailFormProps> = ({
  setFieldValue,
  country_code,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  validation,
  currency,
}) => {
  return (
    <>
      <div className='row mt-5 pt-3 mb-3'>
        <div className='col-md-6 mb-5'>
          <label htmlFor='description' className='mb-2 required'>
            Description
          </label>
          <Field
            name='description'
            as='textarea'
            type='text'
            placeholder='Enter Insurance Description'
            className={configClass?.form}
          />
          <div className='fv-plugins-message-container mt-0 invalid-feedback'>
            <ErrorMessage name='description' />
          </div>
        </div>

        <div className='col-md-6 mb-5'>
          <label htmlFor='email' className='mb-2'>
            Email
          </label>
          <InputText name='email' type='email' placeholder='Enter Contact Person Email' />
        </div>

        <div className='col-md-6 mb-5'>
          <label htmlFor='insurer' className='mb-2'>
            Insurer
          </label>
          <InputText name='insurer' type='text' placeholder='Enter Insurance Company Name' />
        </div>

        <div className='col-md-6 mb-5'>
          <label htmlFor='policy_no' className='mb-2'>
            Policy No
          </label>
          <InputText name='policy_no' type='text' placeholder='Enter Policy Number' />
        </div>

        <div className='col-md-6 mb-5'>
          <label htmlFor='contact_person' className='mb-2'>
            Contact Person
          </label>
          <InputText name='contact_person' type='text' placeholder='Enter Contact Person Name' />
        </div>

        <div className='col-md-6 mb-5'>
          <label htmlFor='coverage' className='mb-2'>
            Coverage
          </label>
          <InputText name='coverage' type='text' placeholder='Enter Coverage Period' />
        </div>

        <div className='col-md-6 mb-5'>
          <label htmlFor='phone_number' className='mb-2'>
            Phone Number
          </label>
          <div className='input-group input-group-solid'>
            <Field
              as='select'
              name='country_code'
              placeholder='Enter Country Code'
              className={configClass?.select}
            >
              {country_code?.map(({value, label}: any, index: number) => {
                return (
                  <option key={index} value={value || ''}>
                    {label || ''}
                  </option>
                )
              })}
            </Field>
            <Field
              name='phone_number'
              type='number'
              placeholder='Enter Contact Person'
              className={configClass?.form}
            />
          </div>
        </div>

        <div className='col-md-6 mb-5'>
          <label htmlFor='limit' className='mb-2 required'>
            Limit
          </label>
          <div className='input-group input-group-solid'>
            <Field
              as='select'
              name='currency_limit'
              placeholder='Enter Currency'
              className={configClass?.select}
            >
              {currency?.map(({value, label}: any, index: number) => {
                return (
                  <option key={index} value={value || ''}>
                    {label || ''}
                  </option>
                )
              })}
            </Field>
            <Field
              name='limit'
              type='number'
              placeholder='Enter Limit'
              className={configClass?.form}
            />
          </div>
          <div className='fv-plugins-message-container mt-0 invalid-feedback'>
            <ErrorMessage name='limit' />
          </div>
        </div>

        <div className='col-12 my-2'>
          <hr />
        </div>

        <div className='col-md-6'>
          <div className='mb-5'>
            <label htmlFor='start_date' className='mb-2 required'>
              Start Date
            </label>

            <div className='input-group input-group-solid'>
              <span className='input-group-text pe-0'>
                <i className='fa fa-calendar-alt text-primary'></i>
              </span>
              <Datetime
                closeOnSelect
                inputProps={{
                  autoComplete: 'off',
                  className: configClass?.form,
                  name: 'start_date',
                  placeholder: 'Enter Insurance Start Date',
                  readOnly: true,
                }}
                onChange={(e: any) => {
                  const m = moment(e).format('YYYY-MM-DD')
                  setStartDate(m)
                  setFieldValue('start_date', m)
                }}
                isValidDate={(currentDate: any) =>
                  endDate ? currentDate.isSameOrBefore(endDate) : true
                }
                dateFormat='DD/MM/YYYY'
                value={startDate}
                timeFormat={false}
              />
            </div>

            <div className='fv-plugins-message-container mt-0 invalid-feedback'>
              <ErrorMessage name='start_date' />
            </div>

            {validation.start_date && (
              <div className='fv-plugins-message-container mt-0 invalid-feedback'>
                {validation.start_date}
              </div>
            )}
          </div>

          <div className='mb-5'>
            <label htmlFor='end_date' className='mb-2 required'>
              End Date
            </label>

            <div className='input-group input-group-solid'>
              <span className='input-group-text pe-0'>
                <i className='fa fa-calendar-alt text-primary'></i>
              </span>
              <Datetime
                closeOnSelect
                inputProps={{
                  autoComplete: 'off',
                  className: configClass?.form,
                  name: 'end_date',
                  placeholder: 'Enter Insurance End Date',
                  readOnly: true,
                }}
                onChange={(e: any) => {
                  const m = moment(e).format('YYYY-MM-DD')
                  setEndDate(m)
                  setFieldValue('end_date', m)
                }}
                isValidDate={(currentDate: any) => currentDate.isSameOrAfter(startDate)}
                dateFormat='DD/MM/YYYY'
                value={endDate}
                timeFormat={false}
              />
            </div>

            <div className='fv-plugins-message-container mt-0 invalid-feedback'>
              <ErrorMessage name='end_date' />
            </div>

            {validation.end_date && (
              <div className='fv-plugins-message-container mt-0 invalid-feedback'>
                {validation.end_date}
              </div>
            )}
          </div>
        </div>

        <div className='col-md-6'>
          <div className='mb-5'>
            <label htmlFor='deductible' className='mb-2 required'>
              Deductible
            </label>

            <div className='input-group input-group-solid'>
              <Field
                as='select'
                name='currency_deductible'
                placeholder='Enter Currency'
                className={configClass?.select}
              >
                {currency?.map(({value, label}: any, index: number) => {
                  return (
                    <option key={index} value={value || ''}>
                      {label || ''}
                    </option>
                  )
                })}
              </Field>

              <Field
                name='deductible'
                type='number'
                placeholder='Enter Deductible Currency'
                className={configClass?.form}
              />
            </div>

            <div className='fv-plugins-message-container mt-0 invalid-feedback'>
              <ErrorMessage name='deductible' />
            </div>
          </div>

          <div className='mb-5'>
            <label htmlFor='premium' className='mb-2 required'>
              Premium
            </label>

            <div className='input-group input-group-solid'>
              <Field
                as='select'
                name='currency_premium'
                placeholder='Enter Currency'
                className={configClass?.select}
              >
                {currency?.map(({value, label}: any, index: number) => {
                  return (
                    <option key={index} value={value || ''}>
                      {label || ''}
                    </option>
                  )
                })}
              </Field>

              <Field
                name='premium'
                type='number'
                placeholder='Enter Premium Currency'
                className={configClass?.form}
              />
            </div>

            <div className='fv-plugins-message-container mt-0 invalid-feedback'>
              <ErrorMessage name='premium' />
            </div>
          </div>
        </div>
      </div>

      <div className='row'>
        <div className='col-12'>
          <div className='d-flex align-items-center'>
            <input
              id='is_active'
              name='is_active'
              type='checkbox'
              defaultChecked={true}
              onChange={(e: any) => {
                setFieldValue('is_active', e.target.checked)
              }}
            />
            <label htmlFor='is_active' className='ms-2'>
              <strong>Active</strong>
            </label>
          </div>
        </div>
      </div>
    </>
  )
}

DetailForm = memo(DetailForm)
export {DetailForm}
