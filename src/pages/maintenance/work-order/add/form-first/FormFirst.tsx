/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable-next-line react-hooks/exhaustive-deps */
import 'react-datetime/css/react-datetime.css'
import '../custom.css'

import {InputText} from '@components/InputText'
import {Select as AjaxSelect} from '@components/select/ajax'
import {ClearIndicator, customStyles, DropdownIndicator} from '@components/select/config'
import {configClass, preferenceDate} from '@helpers'
import {getMaintenancePriority} from '@pages/maintenance/Service'
import cx from 'classnames'
import {ErrorMessage, Field, useFormikContext} from 'formik'
import moment from 'moment'
import {FC, memo} from 'react'
import Datetime from 'react-datetime'
import Select from 'react-select'

type Props = {
  data: any
  frequencyList: any
  setFrequencyList: any
  dayList: any
  yearly: any
  dates: any
  day: any
  database: any
}

let FormFirst: FC<Props> = ({
  data,
  frequencyList,
  setFrequencyList,
  dayList,
  yearly,
  dates,
  day,
  database,
}) => {
  const pref_date: any = preferenceDate()
  const {values, setFieldValue}: any = useFormikContext()
  const {
    title: databaseTitle,
    description: databaseDescription,
    maintenance_priority_guid: databasePriority,
    start_date: databaseStartDate,
    end_date: databaseEndDate,
    duedate: databaseDueDate,
  }: any = database || {}

  const dateFormatInput = (date_value: any) => {
    if (date_value !== null) {
      const dateFormat: any = moment(date_value).format('YYYY-MM-DD')
      if (dateFormat !== '1970-01-01' && date_value !== 'N/A') {
        return new Date(date_value)
      } else {
        return ''
      }
    } else {
      return undefined
    }
  }

  return (
    <>
      {databaseTitle?.is_selected && (
        <div className={configClass?.grid}>
          <label
            className={`${configClass?.label} ${databaseTitle?.is_required ? 'required' : ''}`}
          >
            Work Order Name
          </label>
          <Field
            type='text'
            name='title'
            placeholder={`Enter Work Order Name`}
            className={configClass?.form}
          />
          <div className='fv-plugins-message-container invalid-feedback'>
            <ErrorMessage name='title' />
          </div>
        </div>
      )}

      {databaseDescription?.is_selected && (
        <div className={configClass?.grid}>
          <label
            className={`${configClass?.label} ${
              databaseDescription?.is_required ? 'required' : ''
            }`}
          >
            {databaseDescription?.label}
          </label>
          <Field
            type='text'
            name='description'
            placeholder={`Enter ${databaseDescription?.label}`}
            className={configClass?.form}
          />
          <div className='fv-plugins-message-container invalid-feedback'>
            <ErrorMessage name='description' />
          </div>
        </div>
      )}

      {databasePriority?.is_selected && (
        <div className={configClass?.grid}>
          <label
            className={`${configClass?.label} ${databasePriority?.is_required ? 'required' : ''}`}
          >
            {databasePriority?.label}
          </label>
          <AjaxSelect
            params={false}
            reload={false}
            className='col p-0'
            api={getMaintenancePriority}
            sm={configClass?.size === 'sm'}
            name='maintenance_priority_guid'
            defaultValue={data?.maintenance_priority_guid}
            placeholder={`Choose ${databasePriority?.label}`}
            parse={({guid, name}: any) => ({value: guid, label: name})}
            onChange={({value}: any) => setFieldValue('maintenance_priority_guid', value)}
          />
          <div className='fv-plugins-message-container invalid-feedback'>
            <ErrorMessage name='maintenance_priority_guid' />
          </div>
        </div>
      )}

      {databaseStartDate?.is_selected && (
        <div className={configClass?.grid}>
          <label
            className={`${configClass?.label} ${databaseStartDate?.is_required ? 'required' : ''}`}
          >
            {databaseStartDate?.label}
          </label>
          <Datetime
            closeOnSelect
            inputProps={{
              autoComplete: 'off',
              className: configClass?.form,
              name: 'manual_started_at',
              placeholder: `Enter ${databaseStartDate?.label}`,
            }}
            onChange={(e: any) => {
              setFieldValue('manual_started_at', e)
            }}
            initialValue={dateFormatInput(values?.manual_started_at)}
            dateFormat={pref_date}
            timeFormat={false}
          />
          <div className='fv-plugins-message-container invalid-feedback'>
            <ErrorMessage name='manual_started_at' />
          </div>
        </div>
      )}

      {databaseEndDate?.is_selected && (
        <div className={configClass?.grid}>
          <label
            className={`${configClass?.label} ${databaseEndDate?.is_required ? 'required' : ''}`}
          >
            {databaseEndDate?.label}
          </label>
          <Datetime
            closeOnSelect
            inputProps={{
              autoComplete: 'off',
              className: configClass?.form,
              name: 'manual_ended_at',
              placeholder: `Enter ${databaseEndDate?.label}`,
            }}
            onChange={(e: any) => {
              setFieldValue('manual_ended_at', e)
            }}
            initialValue={dateFormatInput(values?.manual_ended_at)}
            dateFormat={pref_date}
            timeFormat={false}
          />
          <div className='fv-plugins-message-container invalid-feedback'>
            <ErrorMessage name='manual_ended_at' />
          </div>
        </div>
      )}

      {databaseDueDate?.is_selected && (
        <div className={configClass?.grid}>
          <label
            className={`${configClass?.label} ${databaseDueDate?.is_required ? 'required' : ''}`}
          >
            {databaseDueDate?.label}
          </label>
          <Datetime
            closeOnSelect
            inputProps={{
              autoComplete: 'off',
              className: configClass?.form,
              name: 'duedate',
              placeholder: `Enter ${databaseDueDate?.label}`,
            }}
            onChange={(e: any) => {
              setFieldValue('duedate', e)
            }}
            initialValue={dateFormatInput(values?.duedate)}
            dateFormat={pref_date}
            timeFormat={false}
          />
          <div className='fv-plugins-message-container invalid-feedback'>
            <ErrorMessage name='duedate' />
          </div>
        </div>
      )}

      <div className='row'>
        <div className='col-12'>
          <div className='d-flex align-items-center'>
            <label htmlFor='is_repeat_schedule' className='ms-2'>
              <strong>Repeating Schedule</strong>
            </label>
            <input
              className='mx-4'
              id='is_repeat_schedule'
              name='is_repeat_schedule'
              type='checkbox'
              checked={values?.is_repeat_schedule}
              onChange={(e: any) => {
                setFieldValue('is_repeat_schedule', e?.target?.checked)
                setFieldValue('frequency_value_day', undefined)
                setFieldValue('frequency_value_month', undefined)
                setFieldValue('frequency_value_monthly', undefined)
                setFrequencyList([])

                if (!values?.is_repeat_schedule) {
                  setFieldValue('frequency', null)
                  setFieldValue('frequency_value', [])
                } else {
                  setFieldValue('frequency_value', undefined)
                }
              }}
            />
          </div>
        </div>
      </div>
      {values?.is_repeat_schedule && (
        <>
          <div className='row space-3 border-dark-700'>
            <div className='col-12'>
              <label
                className={`${configClass?.label} mt-7 mb-5 fw-bolder required`}
                htmlFor='description'
              >
                Frequency
              </label>
            </div>
            <div className='row'>
              <div className='col-lg-6'>
                <div className='form-check mb-4 form-check-solid'>
                  <input
                    className='form-check-input'
                    type='radio'
                    id='daily'
                    name='frequency'
                    checked={values?.frequency === 'daily'}
                    onChange={() => {
                      setFieldValue('frequency', 'daily')
                      setFieldValue('frequency_value', undefined)
                      setFieldValue('frequency_value_day', undefined)
                      setFieldValue('frequency_value_month', undefined)
                      setFieldValue('frequency_value_monthly', undefined)
                      setFrequencyList([])
                    }}
                  />
                  <label className='form-check-label fw-bolder ps-2' htmlFor='daily'>
                    Daily
                  </label>
                </div>
                {values?.frequency === 'daily' && (
                  <div className={cx('d-flex mb-4 flex-column justify-content-between days')}>
                    <div
                      className='daily d-flex justify-content-between required'
                      style={{width: '35rem'}}
                    >
                      {dayList?.map((weekday: any, index: number) => {
                        const [Day, day] = weekday
                        const isDayActive = frequencyList
                          ? frequencyList?.find((dx: any) => dx === day)
                          : false
                        return (
                          <label key={index} title={Day} className={cx({active: isDayActive})}>
                            {Day ? Day[0] : ''}
                            <Field
                              name={day}
                              type='checkbox'
                              checked={isDayActive}
                              onChange={() => {
                                setFrequencyList((e: any) => {
                                  if (e) {
                                    const res = e.find((day_find: any) => day_find === day)
                                    if (res) {
                                      setFieldValue(
                                        'frequency_value',
                                        e?.filter((day_filter: any) => day_filter !== day)
                                      )
                                      return e?.filter((day_filter: any) => day_filter !== day)
                                    } else {
                                      const new_arr: any = [...e]
                                      new_arr?.push(day)
                                      setFieldValue('frequency_value', new_arr)
                                      return new_arr
                                    }
                                  } else {
                                    const new_arr: any = []
                                    new_arr?.push(day)
                                    setFieldValue('frequency_value', new_arr)
                                    return new_arr
                                  }
                                })
                              }}
                            />
                          </label>
                        )
                      })}
                    </div>
                    <div className='mt-3 mx-3'>
                      <p
                        className='fw-bolder'
                        style={{
                          margin: '5px 0px',
                          fontSize: '10px',
                          color: '#000',
                        }}
                      >
                        Daily cannot be empty
                      </p>
                      <br />
                    </div>
                  </div>
                )}
              </div>
              <div className='col-lg-6'>
                <div className='form-check mb-4 form-check-solid'>
                  <input
                    className='form-check-input'
                    type='radio'
                    id='weekly'
                    name='frequency'
                    checked={values?.frequency === 'weekly'}
                    onChange={() => {
                      setFieldValue('frequency', 'weekly')
                      setFieldValue('frequency_value', undefined)
                      setFieldValue('frequency_value_day', undefined)
                      setFieldValue('frequency_value_month', undefined)
                      setFieldValue('frequency_value_monthly', undefined)
                      setFrequencyList([])
                    }}
                  />
                  <label className='form-check-label fw-bolder ps-2' htmlFor='newsletter1'>
                    Weekly
                  </label>
                </div>
                {values?.frequency === 'weekly' && (
                  <div className={cx('d-flex mb-4 justify-content-between days')}>
                    <Select
                      className='col h-auto'
                      options={day}
                      inputId='frequency_value'
                      name='frequency_value'
                      styles={customStyles(true, {})}
                      components={{ClearIndicator, DropdownIndicator}}
                      placeholder='Day'
                      value={day?.find(
                        ({value}: any) =>
                          value ===
                          (values?.frequency_value?.length > 0 ? values?.frequency_value[0] : '')
                      )}
                      onChange={({value}: any) => {
                        const selectWeekly = [value]
                        setFrequencyList(selectWeekly as never[])
                        setFieldValue('frequency_value', value)
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className='row'>
              <div className='col-lg-6'>
                <div className='form-check mb-4 form-check-solid'>
                  <input
                    className='form-check-input'
                    type='radio'
                    id='monthly'
                    name='frequency'
                    checked={values?.frequency === 'monthly'}
                    onChange={() => {
                      setFieldValue('frequency', 'monthly')
                      setFieldValue('frequency_value', undefined)
                      setFieldValue('frequency_value_day', undefined)
                      setFieldValue('frequency_value_month', undefined)
                      setFieldValue('frequency_value_monthly', undefined)
                      setFrequencyList([])
                    }}
                  />
                  <label className='form-check-label fw-bolder ps-2' htmlFor='newsletter1'>
                    Monthly
                  </label>
                </div>
                {values?.frequency === 'monthly' && (
                  <>
                    <div className={cx('justify-content-between days')}>
                      <InputText
                        name='frequency_value_monthly'
                        type='text'
                        placeholder='Enter Date'
                      />
                    </div>
                    <div className='mb-5 fv-plugins-message-container'>
                      <p
                        className='mx-2 fw-bolder'
                        style={{
                          margin: '5px 0px',
                          fontSize: '10px',
                          color: '#000',
                        }}
                      >
                        Separate multiple date with comma (,)
                      </p>
                    </div>
                  </>
                )}
              </div>
              <div className='col-lg-6'>
                <div className='form-check mb-4 form-check-solid'>
                  <input
                    className='form-check-input'
                    type='radio'
                    name='frequency'
                    id='yearly'
                    checked={values?.frequency === 'yearly'}
                    onChange={() => {
                      setFieldValue('frequency', 'yearly')
                      setFieldValue('frequency_value', undefined)
                      setFieldValue('frequency_value_day', undefined)
                      setFieldValue('frequency_value_month', undefined)
                      setFieldValue('frequency_value_monthly', undefined)
                      setFrequencyList([])
                    }}
                  />
                  <label className='form-check-label fw-bolder ps-2' htmlFor='newsletter1'>
                    Yearly
                  </label>
                </div>
                {values?.frequency === 'yearly' && (
                  <div className='d-flex align-items-center input-group input-group-sm'>
                    <Select
                      className='col m-3'
                      options={yearly}
                      inputId='frequency_value_month'
                      name='frequency_value_month'
                      styles={customStyles(true, {})}
                      components={{ClearIndicator, DropdownIndicator}}
                      placeholder='Month'
                      value={yearly?.find(
                        ({value}: any) => value === values?.frequency_value_month
                      )}
                      onChange={({value}: any) => {
                        setFieldValue('frequency_value_month', value)
                      }}
                    />
                    <Select
                      className='col h-auto'
                      options={dates}
                      inputId='frequency_value_day'
                      name='frequency_value_day'
                      styles={customStyles(true, {})}
                      components={{ClearIndicator, DropdownIndicator}}
                      placeholder='Date'
                      value={dates?.find(({value}: any) => value === values?.frequency_value_day)}
                      onChange={({value}: any) => {
                        setFieldValue('frequency_value_day', value)
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className='fv-plugins-message-container invalid-feedback'>
            <ErrorMessage name='frequency' />
          </div>
        </>
      )}
      <div className='mb-5'>&nbsp;</div>
    </>
  )
}

FormFirst = memo(FormFirst, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default FormFirst
