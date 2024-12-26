import 'react-datetime/css/react-datetime.css'

import {getLocationV1} from '@api/Service'
import {getUserV1} from '@api/UserCRUD'
import {InputText} from '@components/InputText'
import {PageLoader} from '@components/loader/cloud'
import {Select as Option} from '@components/select/ajax'
import {ClearIndicator, customStyles, DropdownIndicator} from '@components/select/config'
import {ToastMessage} from '@components/toast-message'
import {
  configClass,
  errorValidation,
  staticDate,
  staticDayLists,
  staticDayWithId,
  staticMonth,
  useTimeOutMessage,
} from '@helpers'
import {addMeter, editMeter, getAssetLite} from '@pages/maintenance/Service'
import cx from 'classnames'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import {useNavigate} from 'react-router-dom'
import Select from 'react-select'

import {MeterAddFile} from './add-file'

type AddEditMeterProps = {
  showModal: any
  setShowModal: any
  setReloadMeter: any
  reloadMeter: any
  meterDetail: any
  meterSchema: any
}

let Add: FC<AddEditMeterProps> = ({
  showModal,
  setShowModal,
  setReloadMeter,
  reloadMeter,
  meterDetail,
  meterSchema,
}) => {
  const intl: any = useIntl()
  const navigate: any = useNavigate()
  const require_filed_message: any = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})
  const dates: any = staticDate() || {}
  const yearly: any = staticMonth() || {}
  const day: any = staticDayWithId() || {}
  const dayList: any = staticDayLists() || {}

  const [validation, setValidation] = useState<any>()
  const [workerData, setWorkerData] = useState<any>([])
  const [errForm, setErrForm] = useState<boolean>(true)
  const [frequencyList, setFrequencyList] = useState<any>([])
  const [loadingForm, setLoadingForm] = useState<boolean>(true)
  const [loadingMeter, setLoadingMeter] = useState<boolean>(false)
  const [frequencyValueDay, setFrequencyValueDay] = useState<string>('')
  const [frequencyValueMonth, setFrequencyValueMonth] = useState<string>('')

  useEffect(() => {
    setLoadingForm(true)
    showModal && setTimeout(() => setLoadingForm(false), 500)
    showModal &&
      getUserV1({
        page: 1,
        orderDir: 'asc',
        orderCol: 'first_name',
        'filter[role_name]': 'worker;vendor',
      }).then(({data: {data: res}}: any) => {
        if (res) {
          const data_user: any = res?.map(({guid, first_name, last_name}: any) => {
            return {
              value: guid || '',
              label: `${first_name || ''} ${last_name || ''}`,
            }
          })
          setWorkerData(data_user as never[])
        }
      })
  }, [showModal])

  const handleOnSubmit = (values: any, actions: any) => {
    setLoadingMeter(true)

    let frequency_time: any = []
    if (values?.frequency === 'monthly') {
      frequency_time = values?.frequency_value_monthly?.split(',')
    } else if (values?.frequency === 'yearly') {
      frequency_time = [values?.frequency_value_day + ' ' + values?.frequency_value_month]
    } else if (values?.frequency === 'daily' || values?.frequency === 'weekly') {
      frequency_time = frequencyList
    } else {
      //
    }

    const params: any = {
      name: values?.name || '',
      files: values?.files || [],
      frequency: values?.frequency || '',
      unit_of_measurement: values?.unit_of_measurement || '',
      asset_guid: values?.asset_guid?.value || values?.asset_guid || '',
      frequency_value: frequency_time === 0 ? undefined : frequency_time,
      location_guid: values?.location_guid?.value || values?.location_guid || '',
      workers:
        values?.workers && values?.workers?.length > 0
          ? values?.workers?.map(({value}: any) => value)
          : [],
    }

    if (meterDetail) {
      const {guid} = meterDetail || {}

      editMeter(params, guid)
        .then(({data: {message}}: any) => {
          setLoadingMeter(false)
          setReloadMeter(reloadMeter + 1)
          useTimeOutMessage('clear', 100)
          useTimeOutMessage('success', 150, message)
          setTimeout(() => {
            setShowModal(false)
            navigate('/maintenance/meter/detail/' + guid || '')
          }, 1000)
        })
        .catch(({response}: any) => {
          setLoadingMeter(false)
          const {data, message} = response?.data || {}
          const {fields} = data || {}
          const {name} = fields || {}

          if (fields !== undefined) {
            actions.setFieldError('location', name || '')
            const error: any = fields || {}
            for (const key in error) {
              const value: any = error?.[key] || ''
              ToastMessage({type: 'error', message: value?.[0] || ''})
            }
          } else {
            ToastMessage({type: 'error', message})
          }
        })
    } else {
      addMeter(params)
        .then(({data: dataRes}: any) => {
          const {data, message}: any = dataRes || {}
          const {guid}: any = data || {}

          setLoadingMeter(false)
          setReloadMeter(reloadMeter + 1)
          useTimeOutMessage('clear', 100)
          useTimeOutMessage('success', 150, message)
          setTimeout(() => navigate('/maintenance/meter/detail/' + guid), 1000)
        })
        .catch((err: any) => {
          setLoadingMeter(false)
          setValidation(errorValidation(err))
          const {response} = err || {}

          if (response) {
            const {data, message} = response?.data || {}
            const {fields} = data || {}
            const {name} = fields || {}

            if (fields !== undefined) {
              actions.setFieldError('location', name || '')
              const error: any = fields || {}

              for (const key in error) {
                const value: any = error?.[key] || ''
                ToastMessage({type: 'error', message: value?.[0] || ''})
              }
            } else {
              ToastMessage({type: 'error', message})
            }
          }
        })
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setErrForm(true)
    ToastMessage({type: 'clear'})
  }

  useEffect(() => {
    if (showModal && meterDetail !== undefined && meterDetail?.frequency === 'yearly') {
      setFrequencyValueDay(meterDetail?.frequency_value?.[0]?.split(' ')?.[0])
      setFrequencyValueMonth(meterDetail?.frequency_value?.[0]?.split(' ')?.[1])
    }
  }, [showModal, meterDetail])

  const initialValues: any = {
    name: meterDetail?.name || '',
    frequency: meterDetail?.frequency || '',
    frequency_value_day: frequencyValueDay,
    frequency_value_month: frequencyValueMonth,
    location_name: meterDetail?.location?.name || '',
    unit_of_measurement: meterDetail?.unit_of_measurement || '',
    asset_guid: {value: meterDetail?.asset?.guid || '', label: meterDetail?.asset?.name || ''},
    location_guid: {
      value: meterDetail?.location?.guid || '',
      label: meterDetail?.location?.name || '',
    },
    workers:
      meterDetail?.workers && meterDetail?.workers?.length > 0
        ? meterDetail?.workers?.map(({guid, name}: any) => {
            return {
              label: name || '',
              value: guid || '',
            }
          })
        : [],
  }

  useEffect(() => {
    showModal && meterDetail && setFrequencyList(meterDetail?.frequency_value)
  }, [showModal, meterDetail])

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => closeModal()}>
      <Formik
        enableReinitialize
        onSubmit={handleOnSubmit}
        initialValues={initialValues}
        validationSchema={meterSchema}
      >
        {({values, setFieldValue, isSubmitting, setSubmitting, errors, isValidating}: any) => {
          if (isSubmitting && errForm && Object.keys(errors || {})?.length > 0) {
            ToastMessage({
              message: require_filed_message,
              type: 'error',
            })
            setErrForm(false)
            setSubmitting(false)
          }

          if (isSubmitting && isValidating && !errForm && Object.keys(errors || {})?.length > 0) {
            ToastMessage({
              message: require_filed_message,
              type: 'error',
            })
          }

          return (
            <Form className='justify-content-center' noValidate>
              <Modal.Header>
                <Modal.Title>{meterDetail ? 'Edit' : 'Add'} Meter</Modal.Title>
              </Modal.Header>
              {loadingForm ? (
                <div className='row'>
                  <div className='col-12 text-center'>
                    <PageLoader height={250} />
                  </div>
                </div>
              ) : (
                <Modal.Body>
                  <div className=''>
                    <div className='row'>
                      <div className='col-md-12 mb-4'>
                        <div className='mb-1'>
                          <label htmlFor='name' className={`${configClass?.label} required`}>
                            Meter Name
                          </label>
                          <Field
                            type='text'
                            name='name'
                            placeholder='Enter Meter Name'
                            className={configClass?.form}
                          />
                          <div className='fv-plugins-message-container invalid-feedback mt-2'>
                            <ErrorMessage name='name' />
                          </div>
                        </div>
                      </div>

                      <div className='col-md-12 mb-4'>
                        <div className='mb-1'>
                          <label htmlFor='name' className={`${configClass?.label} required`}>
                            Unit of Measurement
                          </label>
                          <Field
                            type='text'
                            name='unit_of_measurement'
                            placeholder='Enter Unit of Measurement'
                            className={configClass?.form}
                          />
                          <div className='fv-plugins-message-container invalid-feedback mt-2'>
                            <ErrorMessage name='unit_of_measurement' />
                          </div>
                        </div>
                      </div>

                      <div className='col-md-12 mb-4'>
                        <label htmlFor='location_guid' className={`${configClass?.label} required`}>
                          Location
                        </label>
                        <Option
                          sm={true}
                          reload={false}
                          className='col p-0'
                          isClearable={false}
                          api={getLocationV1}
                          name='location_guid'
                          placeholder='Choose Location'
                          params={{orderCol: 'name', orderDir: 'asc'}}
                          defaultValue={{
                            value: meterDetail?.location?.guid || '',
                            label: meterDetail?.location?.name || '',
                          }}
                          onChange={({value, label}: any) => {
                            setFieldValue('location_guid', value || '')
                            setFieldValue('location_name', label || '')
                          }}
                          parse={({guid, name}: any) => ({value: guid || '', label: name || ''})}
                        />
                        <div className='fv-plugins-message-container invalid-feedback mt-2'>
                          <ErrorMessage name='location_guid' />
                        </div>
                      </div>

                      <div className='col-md-12 mb-4'>
                        <label htmlFor='asset_guid' className={`${configClass?.label} required`}>
                          Asset by location
                        </label>
                        <Option
                          sm={true}
                          reload={false}
                          name='asset_guid'
                          api={getAssetLite}
                          params={{
                            orderCol: 'name',
                            orderDir: 'asc',
                            guid: values?.location_guid || '0',
                          }}
                          defaultValue={{
                            value: meterDetail?.asset?.guid || '',
                            label: meterDetail?.asset?.name || '',
                          }}
                          className='col p-0'
                          isClearable={false}
                          placeholder='Choose Asset'
                          onChange={({value}: any) => setFieldValue('asset_guid', value || '')}
                          parse={({guid, name}: any) => ({value: guid || '', label: name || ''})}
                        />
                        <div className='fv-plugins-message-container invalid-feedback mt-2'>
                          <ErrorMessage name='asset_guid' />
                        </div>
                      </div>

                      <div className='col-md-12 mb-4'>
                        <div className='col-md-12 mb-5'>
                          <label className={`${configClass?.label}`} htmlFor='frequency'>
                            Frequency
                          </label>
                        </div>

                        <div className='row'>
                          <div className='col'>
                            <div className='form-check mb-4 form-check-solid'>
                              <input
                                id='daily'
                                type='radio'
                                name='frequency'
                                className='form-check-input'
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
                              <label className='form-check-label ps-2' htmlFor='daily'>
                                Daily
                              </label>
                            </div>
                          </div>

                          <div className='col'>
                            <div className='form-check mb-4 form-check-solid'>
                              <input
                                id='weekly'
                                type='radio'
                                name='frequency'
                                className='form-check-input'
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
                              <label className='form-check-label ps-2' htmlFor='newsletter1'>
                                Weekly
                              </label>
                            </div>
                          </div>

                          {/* <div className='row'> */}
                          <div className='col'>
                            <div className='form-check mb-4 form-check-solid'>
                              <input
                                id='monthly'
                                type='radio'
                                name='frequency'
                                className='form-check-input'
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
                              <label className='form-check-label ps-2' htmlFor='newsletter1'>
                                Monthly
                              </label>
                            </div>
                          </div>

                          <div className='col'>
                            <div className='form-check mb-4 form-check-solid'>
                              <input
                                id='yearly'
                                type='radio'
                                name='frequency'
                                className='form-check-input'
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
                              <label className='form-check-label ps-2' htmlFor='newsletter1'>
                                Yearly
                              </label>
                            </div>
                          </div>
                        </div>

                        {values?.frequency === 'daily' && (
                          <div
                            className={cx('d-flex mb-4 flex-column justify-content-between days')}
                          >
                            <div className='daily d-flex justify-content-between meter-daily-frequency'>
                              {dayList &&
                                dayList?.length > 0 &&
                                dayList?.map((weekday: any, index: any) => {
                                  const [Day, day]: any = weekday
                                  const isDayActive: any = frequencyList
                                    ? frequencyList?.find((dx: any) => dx === day)
                                    : false
                                  return (
                                    <label
                                      key={index}
                                      title={Day}
                                      className={cx({active: isDayActive})}
                                    >
                                      {Day?.[0]}
                                      <Field
                                        name={day}
                                        type='checkbox'
                                        checked={isDayActive}
                                        onChange={() => {
                                          setFrequencyList((e: any) => {
                                            if (e) {
                                              const res = e?.find(
                                                (day_find: any) => day_find === day
                                              )
                                              if (res) {
                                                setFieldValue(
                                                  'frequency_value',
                                                  e?.filter((day_filter: any) => day_filter !== day)
                                                )
                                                return e?.filter(
                                                  (day_filter: any) => day_filter !== day
                                                )
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
                          </div>
                        )}

                        {values?.frequency === 'weekly' && (
                          <div className={cx('d-flex mb-4 justify-content-between days')}>
                            <Select
                              options={day}
                              placeholder='Day'
                              className='col h-auto'
                              inputId='frequency_value'
                              name='frequency_value_day'
                              styles={customStyles(true, {option: {color: 'black'}})}
                              value={day?.find(
                                ({value}: any) =>
                                  value === (values?.frequency_value || frequencyList?.[0] || '')
                              )}
                              onChange={({value}: any) => {
                                const selectWeekly: any = [value || '']
                                setFrequencyList(selectWeekly as never[])
                                setFieldValue('frequency_value', value || '')
                              }}
                            />
                          </div>
                        )}

                        {values?.frequency === 'monthly' && (
                          <>
                            <div className={cx('justify-content-between days')}>
                              <InputText
                                type='text'
                                placeholder='Enter Date'
                                name='frequency_value_monthly'
                                defaultValue={
                                  values?.frequency_value?.join(',') ||
                                  frequencyList?.join(',') ||
                                  ''
                                }
                              />
                            </div>
                            <div
                              className='mb-5 fv-plugins-message-container'
                              style={{fontSize: '10px'}}
                            >
                              * Separate multiple date with comma (,)
                            </div>
                          </>
                        )}

                        {values?.frequency === 'yearly' && (
                          <div className='d-flex align-items-center input-group input-group-sm'>
                            <Select
                              options={yearly}
                              className='col m-3'
                              placeholder='Month'
                              name='frequency_value_month'
                              inputId='frequency_value_month'
                              styles={customStyles(true, {option: {color: 'black'}})}
                              onChange={({value}: any) =>
                                setFieldValue('frequency_value_month', value || '')
                              }
                              value={yearly?.find(
                                ({value}: any) =>
                                  value ===
                                  (values?.frequency_value_month ||
                                    frequencyList?.[0]?.split(' ')?.[1] ||
                                    '')
                              )}
                            />

                            <Select
                              options={dates}
                              className='col h-auto'
                              name='frequency_value_day'
                              inputId='frequency_value_day'
                              onChange={({value}: any) => {
                                setFieldValue('frequency_value_day', value)
                              }}
                              styles={customStyles(true, {option: {color: 'black'}})}
                              placeholder='Date'
                              value={dates?.find(
                                ({value}: any) =>
                                  value === (values?.frequency_value_day || frequencyValueDay || '')
                              )}
                            />
                          </div>
                        )}
                      </div>

                      <div className='col-md-12 mb-4'>
                        <label htmlFor='workers' className={`${configClass?.label} required`}>
                          Worker
                        </label>
                        <Select
                          name='workers'
                          isMulti={true}
                          isClearable={false}
                          options={workerData}
                          value={values?.workers || ''}
                          placeholder={`Choose Workers`}
                          components={{DropdownIndicator, ClearIndicator}}
                          styles={customStyles(true, {option: {color: 'black'}})}
                          onChange={(props: any) => setFieldValue('workers', props)}
                          noOptionsMessage={(e: any) => (e.inputValue = 'No Data...')}
                          className={`${configClass?.form} select-custom p-0 additional-select`}
                        />
                        <div className='fv-plugins-message-container invalid-feedback mt-2'>
                          <ErrorMessage name='workers' />
                        </div>
                      </div>
                    </div>

                    <div className='row'>
                      <div className='col-md-12'>
                        <MeterAddFile
                          validation={validation}
                          files={meterDetail?.files}
                          setFieldValue={setFieldValue}
                        />
                      </div>
                    </div>
                  </div>
                </Modal.Body>
              )}
              <Modal.Footer>
                <Button type='submit' variant='primary' className='btn-sm' disabled={loadingMeter}>
                  {!loadingMeter && (
                    <span className='indicator-label'>{meterDetail ? 'Save' : 'Add'}</span>
                  )}
                  {loadingMeter && (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Please wait...
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}
                </Button>
                <Button className='btn-sm' variant='secondary' onClick={() => closeModal()}>
                  Cancel
                </Button>
              </Modal.Footer>
            </Form>
          )
        }}
      </Formik>
    </Modal>
  )
}

Add = memo(Add, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default Add
