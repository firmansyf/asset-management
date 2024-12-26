import DateRange from '@components/form/date-range'
import {InputText} from '@components/InputText'
import {PageLoader} from '@components/loader/cloud'
import {Select} from '@components/select/select'
import {ToastMessage} from '@components/toast-message'
import {configClass, errorValidation, preferenceDate, staticDay} from '@helpers'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {sortBy} from 'lodash'
import moment from 'moment'
import {FC, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import * as Yup from 'yup'

import {addWorkingHour, editWorkingHour} from './Service'

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Working Name is required').nullable(),
  timezone: Yup.string().required('Timezone is required').nullable(),
  description: Yup.string().required('Working Description is required').nullable(),
})

const AddEdit: FC<any> = ({showModal, setShowModal, setReload, reload, detail}) => {
  const intl = useIntl()
  const require_filed_message = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})
  const pref_date = preferenceDate()
  const getPreference: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {timezone, preference: dataPreference} = getPreference || {}
  const days: any = staticDay() || {}

  const [preference, setPreference] = useState<any>({})
  const [loading, setLoading] = useState<any>(false)
  const [workingHour, setWorkingHour] = useState<any>([])
  const [holidays, setHolidays] = useState<any>([])
  const [errForm, setErrForm] = useState<any>(true)
  const [onClickForm, setOnClickForm] = useState<boolean>(true)
  const [loadingForm, setLoadingForm] = useState<boolean>(true)
  const [timeZone, setTimeZone] = useState<any>([])

  useEffect(() => {
    setLoadingForm(true)
    if (showModal) {
      setTimeout(() => {
        setLoadingForm(false)
      }, 400)
    }
  }, [showModal])

  useEffect(() => {
    if (dataPreference) {
      setPreference(dataPreference)
    }
  }, [dataPreference])

  useEffect(() => {
    if (timezone) {
      const time_zone = timezone?.map(({key: value, key: label}: any) => ({value, label}))
      setTimeZone(sortBy(time_zone, 'label'))
    }
  }, [timezone])

  useEffect(() => {
    if (detail?.guid) {
      setWorkingHour(
        detail?.days
          ?.filter(({day}: any) => day)
          ?.map(({day, start_time, end_time}: any) => ({
            day,
            start_time: start_time?.split(':')?.slice(0, 2)?.join(':'),
            end_time: end_time?.split(':')?.slice(0, 2)?.join(':'),
          }))
      )
      if (detail?.holidays?.length > 0) {
        setHolidays(
          detail?.holidays?.map(({start_date, end_date, description}: any) => ({
            start_date,
            end_date,
            description,
          }))
        )
      }
    } else {
      setWorkingHour([])
      setHolidays([])
    }
  }, [detail])

  const initialValues: any = {
    name: detail?.name || '',
    timezone: detail?.timezone || preference?.timezone || '',
    type: detail?.type || 'fix',
    description: detail?.description || '',
  }

  const successMessage = (message: any) => {
    setTimeout(() => ToastMessage({type: 'clear'}), 300)
    setTimeout(() => ToastMessage({type: 'success', message}), 400)
  }

  const onSubmit: any = (value: any) => {
    setLoading(true)
    if (value?.type === 'custom') {
      value.working_hour_detail = workingHour?.filter(
        ({start_time, end_time}: any) => start_time && end_time
      )
    } else {
      delete value.working_hour_detail
    }
    if (holidays?.length > 0) {
      value.holidays = holidays
    }
    if (detail) {
      editWorkingHour(value, detail?.guid)
        .then(({data: {message}}: any) => {
          successMessage(message)
          setLoading(false)
          setShowModal(false)
          setReload(!reload)
          setWorkingHour([])
          setHolidays([])
        })
        .catch((e: any) => {
          setLoading(false)
          Object.values(errorValidation(e))?.map((message: any) =>
            ToastMessage({type: 'error', message})
          )
        })
    } else {
      addWorkingHour(value)
        .then(({data: {message}}: any) => {
          successMessage(message)
          setLoading(false)
          setShowModal(false)
          setReload(!reload)
          setWorkingHour([])
          setHolidays([])
        })
        .catch((e: any) => {
          setLoading(false)
          Object.values(errorValidation(e))?.map((message: any) =>
            ToastMessage({type: 'error', message})
          )
        })
    }
  }
  const closeModal = () => {
    setShowModal(false)
    setWorkingHour([])
    setHolidays([])
    setErrForm(true)
    setShowModal(false)
    ToastMessage({type: 'clear'})
  }
  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={closeModal}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({values, setFieldValue, setSubmitting, isSubmitting, errors, isValidating}) => {
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
                <Modal.Title>{detail?.guid ? 'Edit' : 'Add'} Working Hour</Modal.Title>
              </Modal.Header>
              {loadingForm ? (
                <div className='row'>
                  <div className='col-12 text-center'>
                    <PageLoader height={250} />
                  </div>
                </div>
              ) : (
                <Modal.Body>
                  <div className='mb-5'>
                    <label htmlFor='name' className={`${configClass?.label} required`}>
                      {' '}
                      Working Name{' '}
                    </label>
                    <InputText
                      name='name'
                      type='text'
                      placeholder='Enter Working Name'
                      className={configClass?.form}
                      errors={errors}
                      onClickForm={onClickForm}
                    />
                  </div>
                  <div className='mb-5'>
                    <label htmlFor='name' className={`${configClass?.label} required`}>
                      Timezone
                    </label>
                    <Select
                      sm={configClass?.size === 'sm'}
                      name='timezone'
                      placeholder='Choose Timezone'
                      isClearable={false}
                      defaultValue={values?.timezone}
                      data={timeZone}
                      onChange={({value: val}: any) => {
                        setFieldValue('timezone', val)
                      }}
                    />
                    <div className='fv-plugins-message-container invalid-feedback'>
                      <ErrorMessage name='timezone' />
                    </div>
                  </div>
                  <div className='mb-5'>
                    <div className='form-check form-switch form-check-custom form-check-solid d-inline-flex border border-gray-300 p-2 radius-50 bg-fb'>
                      <Field
                        name='type'
                        type='checkbox'
                        className='form-check-input h-20px w-30px'
                        id='type'
                        checked={values?.type === 'custom'}
                        onChange={({target: {checked}}: any) => {
                          setFieldValue('type', checked ? 'custom' : 'fix')
                          !checked && setWorkingHour([])
                        }}
                      />
                      <label className='form-check-label fw-bold fs-7 me-2' htmlFor='type'>
                        {' '}
                        Custom Working Hours{' '}
                      </label>
                    </div>
                  </div>
                  {values?.type === 'custom' && (
                    <div className='mb-5'>
                      <h6 className=''>Working Hours</h6>
                      {days?.map(({value, label}: any, index: number) => (
                        <div className='row' key={index}>
                          <div className='col-md-4 my-1'>
                            <label className='form-check form-check-custom form-check-sm form-check-solid bg-f7 rounded px-2'>
                              <input
                                type='checkbox'
                                className='form-check-input border border-gray-400'
                                checked={
                                  !!workingHour?.filter(({day}: any) => day === value)?.length
                                }
                                onChange={({target: {checked}}: any) => {
                                  const excluded: any = workingHour?.filter(
                                    (m: any) => m.day && m.day !== value
                                  )
                                  if (checked) {
                                    setWorkingHour(excluded?.concat([{day: value}]))
                                  } else {
                                    setWorkingHour(excluded)
                                  }
                                }}
                              />
                              <span className='m-2 cursor-pointer fw-bold text-dark fs-7'>
                                {label}
                              </span>
                            </label>
                          </div>
                          {workingHour?.find(({day}: any) => day === value) && (
                            <div className='col-md-8 mt-1'>
                              <div className='input-group input-group-solid'>
                                <input
                                  type='time'
                                  placeholder='Start Time'
                                  value={
                                    workingHour?.find(({day}: any) => day === value)?.start_time
                                  }
                                  className={configClass?.form}
                                  onChange={({target: {value: val}}: any) => {
                                    setWorkingHour(
                                      workingHour?.map((m: any) => {
                                        m.day === value && (m.start_time = val)
                                        return m
                                      })
                                    )
                                  }}
                                />
                                <div className={configClass?.form}>to</div>
                                <input
                                  type='time'
                                  placeholder='End Time'
                                  value={workingHour?.find(({day}: any) => day === value)?.end_time}
                                  className={configClass?.form}
                                  onChange={({target: {value: val}}: any) => {
                                    setWorkingHour(
                                      workingHour?.map((m: any) => {
                                        m.day === value && (m.end_time = val)
                                        return m
                                      })
                                    )
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className='mb-5'>
                    <label htmlFor='holidays' className={`${configClass?.label} d-block`}>
                      {' '}
                      Holidays{' '}
                    </label>
                    <div className='row mx-n2'>
                      {holidays?.map(({start_date, end_date, description}: any, index: number) => (
                        <div
                          className='d-inline-flex align-items-center col-auto m-2 btn btn-sm btn-light-primary radius-50 p-2'
                          key={index}
                        >
                          <DateRange
                            value={{startDate: start_date, endDate: end_date, description}}
                            description={true}
                            onChange={({startDate, endDate, description}: any) => {
                              const result: any = holidays?.map((opt: any, i: number) => {
                                if (index === i) {
                                  opt = {
                                    start_date: moment(startDate).format('YYYY-MM-DD'),
                                    end_date: moment(endDate).format('YYYY-MM-DD'),
                                    description,
                                  }
                                }
                                return opt
                              })
                              setHolidays(result)
                            }}
                            btnClass='btn-light-success'
                            className=''
                          >
                            <span className='px-2'>
                              {!start_date || !end_date ? (
                                <span className='text-gray-400'>Select Date</span>
                              ) : start_date === end_date ? (
                                <span>{moment(start_date).format(pref_date)}</span>
                              ) : (
                                <span>
                                  {moment(start_date).format(pref_date)} -{' '}
                                  {moment(end_date).format(pref_date)}
                                </span>
                              )}
                            </span>
                          </DateRange>
                          <span
                            className='btn btn-icon w-20px h-20px btn-danger rounded-circle'
                            onClick={() => {
                              const optHolidays: any = holidays
                              optHolidays?.splice(index, 1)
                              setHolidays([...optHolidays])
                            }}
                          >
                            <i className='las la-times text-white' />
                          </span>
                        </div>
                      ))}
                      <div
                        onClick={() => {
                          setHolidays([...holidays, {}])
                        }}
                        className='d-inline-flex align-items-center col-auto m-2 btn btn-sm btn-primary radius-50 p-2'
                      >
                        <span className='px-2'>Add Holiday</span>
                        <span className='btn btn-icon w-20px h-20px btn-primary rounded-circle'>
                          <i className='las la-plus text-white' />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='mb-5'>
                    <label htmlFor='holidays' className={`${configClass?.label} required d-block`}>
                      {' '}
                      Working Description{' '}
                    </label>
                    <InputText
                      name='description'
                      as='textarea'
                      type='text'
                      placeholder='Enter Working Description'
                      className={`${configClass?.form} required`}
                      errors={errors}
                      onClickForm={onClickForm}
                    />
                  </div>
                </Modal.Body>
              )}
              <Modal.Footer>
                <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                  {!loading ? (
                    <span
                      className='indicator-label'
                      onClick={() => {
                        setOnClickForm(true)
                      }}
                    >
                      {detail?.guid ? 'Save' : 'Add'}
                    </span>
                  ) : (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Please wait...
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}
                </Button>
                <Button className='btn-sm' variant='secondary' onClick={closeModal}>
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

export {AddEdit}
