/* eslint-disable react-hooks/exhaustive-deps */
import 'react-datetime/css/react-datetime.css'
import '../custom.css'

import {getLocationV1} from '@api/Service'
import {getUserV1} from '@api/UserCRUD'
import {AddInputBtn} from '@components/button/Add'
import {FormCF} from '@components/form/CustomField'
import {Title as FormTitle} from '@components/form/Title'
import {InputText} from '@components/InputText'
import {Select as AjaxSelect} from '@components/select/ajax'
import {ClearIndicator, customStyles, DropdownIndicator} from '@components/select/config'
import {configClass, preferenceDate} from '@helpers'
import {getCustomField} from '@pages//setup/custom-field/redux/ReduxCustomField'
import {
  getAssetLite,
  getDetailPreventive,
  getMaintenanceCategory,
  getMaintenancePriority,
} from '@pages/maintenance/Service'
import cx from 'classnames'
import {ErrorMessage, Field} from 'formik'
import {differenceWith, isEqual} from 'lodash'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'
import Datetime from 'react-datetime'
import Select from 'react-select'

let FormFirst: FC<any> = ({
  data,
  setFieldValue,
  values,
  frequencyList,
  setFrequencyList,
  dayList,
  reloadUser,
  yearly,
  dates,
  day,
  setLocationDetail,
  setShowModalLocation,
  setUserDetail,
  setShowModalUser,
  setMaintenanceCategoryDetail,
  setShowModalMaintenanceCategory,
  reloadMaintenanceCategory,
  defaultCustomField,
  setFiles,
  database,
  onClickForm,
  errors,
}) => {
  const pref_date: any = preferenceDate()

  const [dataUser, setDataUser] = useState<any>([])
  const [customField, setCustomField] = useState<any>([])
  const [workerSelected, setWorkerSelected] = useState<any>([])
  const [loadingUser, setLoadingUser] = useState<boolean>(true)
  const [resetOption, setResetOption] = useState<boolean>(false)
  const [clearOption, setClearOption] = useState<boolean>(false)
  const [additionalWorkerSelected, setAdditionalWorkerSelected] = useState<any>([])
  const [loadingMaintenanceCategory, setLoadingMaintenanceCategory] = useState<boolean>(true)

  const {
    title: databaseTitle,
    description: databaseDescription,
    maintenance_priority_guid: databasePriority,
    start_date: databaseStartDate,
    end_date: databaseEndDate,
    duedate: databaseDueDate,
    duration: databaseDuration,
    maintenance_category_guid: databaseCategory,
    location_guid: databaseLocation,
    assigned_user_guid: databaseWorker,
    assigned_additional_user: databaseWorkerAdditional,
  }: any = database || {}

  useEffect(() => {
    setLoadingMaintenanceCategory(false)
    setTimeout(() => {
      setLoadingMaintenanceCategory(true)
    }, 500)
  }, [reloadMaintenanceCategory])

  useEffect(() => {
    setLoadingUser(false)
    setTimeout(() => {
      setLoadingUser(true)
    }, 500)
  }, [reloadUser])

  useEffect(() => {
    if (data?.guid) {
      getDetailPreventive(data?.guid)
        .then(({data: {data: res}}: any) => {
          setCustomField(res?.custom_fields)
        })
        .catch(() => '')
    } else {
      getCustomField({'filter[section_type]': 'maintenance'})
        .then(({data: {data: res_cus}}: any) => {
          setCustomField(res_cus)
        })
        .catch(() => '')
    }
  }, [data])

  useEffect(() => {
    getUserV1({orderCol: 'first_name', orderDir: 'asc', 'filter[role_name]': 'worker'}).then(
      ({data: {data: res}}) => {
        const data_user = res
          ?.sort((a: any, b: any) => (a?.first_name > b?.first_name ? 1 : -1))
          ?.map(({guid, first_name, last_name}: any) => {
            return {
              value: guid || '',
              label: `${first_name || ''} ${last_name || ''}`,
            }
          })
        setDataUser(data_user as never[])
      }
    )
  }, [setDataUser, reloadUser])

  useEffect(() => {
    if (values?.assigned_user_guid !== '') {
      setWorkerSelected([data?.assigned_user_guid])
    }

    if (values?.assigned_additional_user?.length > 0) {
      const assignedAdditionalUserVal: any = values?.assigned_additional_user?.map(
        ({label, value}: any) => {
          return {
            value: value,
            label: label,
          }
        }
      )
      setAdditionalWorkerSelected(assignedAdditionalUserVal as never[])
    }
  }, [])

  return (
    <>
      <div className={`col-md-12 col-xl-12 mb-md-12 mb-xl-12`}>
        <label className={`${configClass?.label} required`}>Maintenance Preventive Name</label>
        <Field
          type='text'
          name='name'
          placeholder={`Enter Maintenance Preventive Name`}
          className={configClass?.form}
        />
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='name' />
        </div>
      </div>

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
            name='maintenance_priority_guid'
            sm={configClass?.size === 'sm'}
            className='col p-0'
            api={getMaintenancePriority}
            params={false}
            reload={false}
            placeholder={`Choose ${databasePriority?.label}`}
            defaultValue={values?.maintenance_priority_guid || {}}
            onChange={(e: any) => {
              setFieldValue('maintenance_priority_guid', e)
            }}
            parse={(e: any) => {
              return {
                value: e.guid,
                label: e.name,
              }
            }}
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
              const m = moment(e).format('YYYY-MM-DD')
              setFieldValue('manual_started_at', m)
            }}
            initialValue={
              values?.manual_started_at === null
                ? undefined
                : moment(values?.manual_started_at).format(pref_date) !== '1970-01-01' &&
                  values?.manual_started_at !== 'N/A'
                ? new Date(values?.manual_started_at)
                : ''
            }
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
              const m = moment(e).format('YYYY-MM-DD')
              setFieldValue('manual_ended_at', m)
            }}
            initialValue={
              values?.manual_ended_at === null
                ? undefined
                : moment(values?.manual_ended_at).format(pref_date) !== '1970-01-01' &&
                  values?.manual_ended_at !== 'N/A'
                ? new Date(values?.manual_ended_at)
                : ''
            }
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
              const m = moment(e).format('YYYY-MM-DD')
              setFieldValue('duedate', m)
            }}
            initialValue={
              values?.duedate === null
                ? undefined
                : moment(values?.duedate).format(pref_date) !== '1970-01-01' &&
                  values?.duedate !== 'N/A'
                ? new Date(values?.duedate)
                : ''
            }
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
                setFieldValue('is_repeat_schedule', e.target.checked)
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
          <div className='row space-3 fw-bolder border-dark-400'>
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
                  <div
                    className={cx('d-flex mb-4 fw-bolder flex-column justify-content-between days')}
                  >
                    <div
                      className='daily d-flex justify-content-between required'
                      style={{width: '35rem'}}
                    >
                      {dayList?.map((weekday: any, index: any) => {
                        const [Day, day] = weekday
                        const isDayActive = frequencyList
                          ? frequencyList.find((dx: any) => dx === day)
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
                                    const res = e?.find((day_find: any) => day_find === day)
                                    if (res) {
                                      setFieldValue(
                                        'frequency_value',
                                        e?.filter((day_filter: any) => day_filter !== day)
                                      )
                                      return e?.filter((day_filter: any) => day_filter !== day)
                                    } else {
                                      const new_arr: any = [...e]
                                      new_arr.push(day)
                                      setFieldValue('frequency_value', new_arr)
                                      return new_arr
                                    }
                                  } else {
                                    const new_arr: any = []
                                    new_arr.push(day)
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
                    <div className='mt-3 mx-2'>
                      <p
                        style={{
                          margin: '5px 0px',
                          // fontStyle: 'italic',
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
                      name='frequency_value_day'
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
                        className='mx-2'
                        style={{
                          margin: '5px 0px',
                          // fontStyle: 'italic',
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

      <div className={configClass?.grid}>
        <label className={`${configClass?.label}`}>End Recurring Date</label>
        <Datetime
          closeOnSelect
          inputProps={{
            autoComplete: 'off',
            className: configClass?.form,
            name: 'end_recurring_date',
            placeholder: 'Enter Due Date',
          }}
          onChange={(e: any) => {
            const m = moment(e).format('YYYY-MM-DD')
            setFieldValue('end_recurring_date', m)
          }}
          initialValue={
            values?.end_recurring_date === null
              ? undefined
              : moment(values?.end_recurring_date).format('YYYY-MM-DD') !== '1970-01-01' &&
                values?.end_recurring_date !== 'N/A'
              ? new Date(values?.end_recurring_date)
              : ''
          }
          dateFormat={pref_date}
          timeFormat={false}
        />
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='end_recurring_date' />
        </div>
      </div>

      {databaseDuration?.is_selected && (
        <div className={configClass?.grid}>
          <label
            className={`${configClass?.label} ${databaseDuration?.is_required ? 'required' : ''}`}
          >
            {databaseDuration?.label}
          </label>
          <Field
            type='text'
            maxLength='8'
            name='duration'
            placeholder={`Enter ${databaseDuration?.label}`}
            onChange={({target: {value}}: any) =>
              setFieldValue('duration', value.replace(/[^0-9]+/g, ''))
            }
            className={configClass?.form}
          />
          <div className='fv-plugins-message-container invalid-feedback'>
            <ErrorMessage name='duration' />
          </div>
        </div>
      )}

      {databaseCategory?.is_selected && (
        <div className={configClass?.grid}>
          <label
            className={`${configClass?.label} ${databaseCategory?.is_required ? 'required' : ''}`}
          >
            Work Orders Category
          </label>
          <div className='d-flex align-items-center input-group input-group-solid'>
            {loadingMaintenanceCategory && (
              <>
                <AjaxSelect
                  name='maintenance_category_guid'
                  sm={configClass?.size === 'sm'}
                  className='col p-0'
                  api={getMaintenanceCategory}
                  params={{orderCol: 'name', orderDir: 'asc'}}
                  reload={reloadMaintenanceCategory}
                  placeholder={`Choose Work Orders Category`}
                  defaultValue={data?.maintenance_category_guid || {}}
                  onChange={({value}: any) => {
                    setFieldValue('maintenance_category_guid', value)
                  }}
                  parse={(e: any) => {
                    return {
                      value: e?.guid,
                      label: e?.name
                        ? e?.name?.[0]?.toUpperCase() + e?.name?.toLowerCase()?.slice(1)
                        : '',
                    }
                  }}
                />
                <AddInputBtn
                  size={configClass?.size}
                  onClick={() => {
                    setMaintenanceCategoryDetail(undefined)
                    setShowModalMaintenanceCategory(true)
                  }}
                />
              </>
            )}
          </div>
          <div className='fv-plugins-message-container invalid-feedback'>
            <ErrorMessage name='maintenance_category_guid' />
          </div>
        </div>
      )}

      {databaseWorker?.is_selected && (
        <div className={configClass?.grid}>
          <label
            className={`${configClass?.label} ${databaseWorker?.is_required ? 'required' : ''}`}
          >
            {databaseWorker?.label}
          </label>
          <div className='d-flex align-items-center input-group input-group-solid'>
            {loadingUser && (
              <>
                <Select
                  noOptionsMessage={(e: any) => (e.inputValue = 'No Data...')}
                  name='assigned_user_guid'
                  defaultValue={data?.assigned_user_guid || ''}
                  styles={customStyles(true, {})}
                  components={{ClearIndicator, DropdownIndicator}}
                  className={`${configClass?.form} select-custom p-0 additional-select`}
                  placeholder={`Choose ${databaseWorker?.label}`}
                  options={
                    additionalWorkerSelected?.length > 0
                      ? differenceWith(dataUser, additionalWorkerSelected, isEqual)
                      : dataUser
                  }
                  onChange={({value, label}: any) => {
                    const propsData = [{value: value || '', label: label || ''}]
                    setFieldValue('assigned_user_guid', value)
                    setWorkerSelected(propsData)
                  }}
                />
                <AddInputBtn
                  size={configClass?.size}
                  onClick={() => {
                    setFiles([])
                    setUserDetail(undefined)
                    setShowModalUser(true)
                  }}
                />
              </>
            )}
          </div>
          <div className='fv-plugins-message-container invalid-feedback'>
            <ErrorMessage name='assigned_user_guid' />
          </div>
        </div>
      )}

      {databaseWorkerAdditional?.is_selected && (
        <div className={configClass?.grid}>
          <label
            className={`${configClass?.label} ${
              databaseWorkerAdditional?.is_required ? 'required' : ''
            }`}
          >
            {databaseWorkerAdditional?.label || ''}
          </label>
          <div className='d-flex align-items-center input-group input-group-solid'>
            {loadingUser && (
              <>
                <Select
                  noOptionsMessage={(e: any) => (e.inputValue = 'No Data...')}
                  name='assigned_additional_user'
                  isMulti={true}
                  isDisabled={workerSelected?.length > 0 ? false : true}
                  value={values?.assigned_additional_user || ''}
                  styles={customStyles(true, {})}
                  components={{ClearIndicator, DropdownIndicator}}
                  className={`${configClass?.form} select-custom p-0 additional-select`}
                  placeholder={`Choose ${databaseWorkerAdditional?.label}`}
                  options={
                    workerSelected?.length === 0
                      ? dataUser
                      : differenceWith(dataUser, workerSelected, isEqual)
                  }
                  onChange={(props: any) => {
                    setFieldValue('assigned_additional_user', props)
                    if (props?.length >= 1) {
                      setAdditionalWorkerSelected(props as never[])
                    }
                  }}
                />
                <AddInputBtn
                  size={configClass?.size}
                  onClick={() => {
                    setFiles([])
                    setUserDetail(undefined)
                    setShowModalUser(true)
                  }}
                />
              </>
            )}
          </div>
          <div className='fv-plugins-message-container invalid-feedback'>
            <ErrorMessage name='assigned_additional_user' />
          </div>
        </div>
      )}

      {databaseLocation?.is_selected && (
        <div className={configClass?.grid}>
          <label htmlFor='location_guid' className={`${configClass?.label} required`}>
            {databaseLocation?.label}
          </label>
          <div className='d-flex align-items-center input-group input-group-solid'>
            <AjaxSelect
              className='col p-0'
              api={getLocationV1}
              isClearable={false}
              name='location_guid'
              sm={configClass?.size === 'sm'}
              defaultValue={data?.location_guid || {}}
              params={{orderCol: 'name', orderDir: 'asc'}}
              placeholder={`Choose ${databaseLocation?.label}`}
              parse={({guid, name}: any) => ({value: guid, label: name})}
              onChange={({value}: any) => {
                setFieldValue('location_guid', value || '')
                if (value === '' || value !== data?.location_guid?.value) {
                  setFieldValue('asset_guid', '')
                  setResetOption(true)
                  setClearOption(true)
                }
              }}
            />
            <AddInputBtn
              size={configClass?.size}
              onClick={() => {
                setLocationDetail(undefined)
                setShowModalLocation(true)
              }}
            />
          </div>
          <div className='fv-plugins-message-container invalid-feedback'>
            <ErrorMessage name='location_guid' />
          </div>
        </div>
      )}

      <div className={configClass?.grid}>
        <label htmlFor='asset_guid' className={`${configClass?.label} required`}>
          Asset by Location
        </label>
        <AjaxSelect
          name='asset_guid'
          api={getAssetLite}
          className='col p-0'
          isClearable={false}
          clearOption={clearOption}
          resetOption={resetOption}
          sm={configClass?.size === 'sm'}
          setResetOption={setResetOption}
          defaultValue={values?.asset_guid || {}}
          placeholder={`Choose Asset by Location`}
          onChange={(e: any) => setFieldValue('asset_guid', e)}
          parse={({guid, name}: any) => ({value: guid, label: name})}
          params={{
            orderCol: 'name',
            orderDir: 'asc',
            guid: values?.location_guid || data?.location_guid?.value || '0',
          }}
        />
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='asset_guid' />
        </div>
      </div>

      <div className={configClass?.grid}>
        <label className={`${configClass?.label}`}>Purchase Order</label>
        <Field
          type='text'
          name='po_number'
          placeholder='Enter Purchase Order'
          className={configClass?.form}
        />
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='po_number' />
        </div>
      </div>

      {defaultCustomField?.length > 0 && (
        <>
          <FormTitle title='Custom Fields' sticky={false} />
          <div className='row mb-3'>
            {defaultCustomField?.length === 0 &&
              defaultCustomField?.filter(({conditions}: any) => conditions === undefined) && (
                <label htmlFor='no_cf' style={{padding: '0px 0px 10px 30px'}}>
                  No custom fields added
                </label>
              )}
            <FormCF
              type='maintenance'
              itemClass='col-md-4 mb-3'
              labelClass='col-md-5'
              errors={errors}
              defaultValue={customField}
              onChange={(e: any) => setFieldValue('global_custom_fields', e)}
              onClickForm={onClickForm}
            />
          </div>
        </>
      )}
    </>
  )
}

FormFirst = memo(FormFirst, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default FormFirst
