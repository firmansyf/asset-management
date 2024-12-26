/* eslint-disable react-hooks/exhaustive-deps */
import {AddInputBtn} from '@components/button/Add'
import {InputText} from '@components/InputText'
import {PageLoader} from '@components/loader/cloud'
import {Select as SelectAjax} from '@components/select/ajax'
import {Select as SelectMultiple} from '@components/select/ajaxMultiple'
import {Select} from '@components/select/select'
import {ToastMessage} from '@components/toast-message'
import {
  configClass,
  errorExpiredToken,
  FieldMessageError,
  staticDate,
  staticDay,
  staticDayLists,
  staticMonth,
  useTimeOutMessage,
} from '@helpers'
import cx from 'classnames'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import * as Yup from 'yup'

import {AddAlertTeam} from '../team/AddAlertTeam'
import {
  addAlertSetting,
  editAlertSetting,
  getModuleAlertSetting,
  getTeamAlertSetting,
  getTypeAlertSetting,
} from './Service'

const AlertTeamSchema: any = Yup.object().shape({
  name: Yup.string().required('Name is required').nullable(),
  module_guid: Yup.string().required('Module is required').nullable(),
  module_field_guid: Yup.string().required('Field is required').nullable(),
  alert_type_guids: Yup.array().test({
    name: 'alert_type_guid',
    test: function () {
      const {alert_type_guid}: any = this.parent || {}
      if (alert_type_guid?.length <= 0) {
        return this.createError({message: `Type of Alert is required`})
      }
      return true
    },
  }),
  start_time: Yup.string().required('From (HH MM) is required').nullable(),
  end_time: Yup.string().required('To (HH MM) is required').nullable(),
  frequency: Yup.string().required('Frequency is required').nullable(),
  team_guid: Yup.string().required('Team Name is required').nullable(),
  frequency_value: Yup.string()
    .nullable()
    .when('frequency', {
      is: 'weekly',
      then: () => Yup.string().required('Weekly Day is Null').nullable(),
    } as any),
  frequency_value_day: Yup.string().when('frequency', {
    is: 'yearly',
    then: () => Yup.string().required('Yearly Date is Null').nullable(),
  } as any),
  frequency_value_month: Yup.string().when('frequency', {
    is: 'yearly',
    then: () => Yup.string().required('Yearly Month is Null').nullable(),
  } as any),
})

let AddAlertSetting: FC<any> = ({
  showModal,
  setShowModal,
  setReload,
  reload,
  detail,
  setDetail,
}) => {
  const intl: any = useIntl()
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {feature}: any = preferenceStore || {}

  const dates: any = staticDate() || {}
  const yearly: any = staticMonth() || {}
  const day: any = staticDay() || {}
  const dayList: any = staticDayLists() || {}

  const [modules, setModules] = useState<any>([])
  const [setTeam, setTeamDetail] = useState<any>()
  const [helpDesk, setHelpDesk] = useState<number>(0)
  const [warranty, setWarranty] = useState<number>(0)
  const [errForm, setErrForm] = useState<boolean>(true)
  const [moduleList, setModuleList] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [reloadTeam, setReloadTeam] = useState<number>(0)
  const [moduleField, setModuleField] = useState<any>([])
  const [isActive, setIsActive] = useState<boolean>(false)
  const [frequencyList, setFrequencyList] = useState<any>([])
  const [loadingForm, setLoadingForm] = useState<boolean>(true)
  const [insuranceClaim, setInsuranceClaim] = useState<number>(0)
  const [showModalTeam, setShowModalTeam] = useState<boolean>(false)
  const [featureInventory, setFeatureInventory] = useState<number>(0)
  const [insurancePolicyFeature, setInsurancePolicyFeature] = useState<number>(0)

  const require_filed_message: any = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})

  useEffect(() => {
    setLoadingForm(true)
    showModal && setTimeout(() => setLoadingForm(false), 400)
  }, [showModal])

  const handleSubmit = (value: any) => {
    setLoading(true)
    const {alert_type_guids}: any = value || {}
    const {guid} = detail || {}

    let frequency_time: any = []
    if (value?.frequency === 'monthly') {
      frequency_time = value?.frequency_value_monthly?.split(',')
    } else if (value?.frequency === 'yearly') {
      frequency_time = [value?.frequency_value_day + ' ' + value?.frequency_value_month]
    } else if (value?.frequency === 'daily' || value?.frequency === 'weekly') {
      frequency_time = frequencyList as never[]
    } else {
      //
    }

    const params: any = {
      name: value?.name || '',
      is_active: value?.is_active || 0,
      end_time: value?.end_time || null,
      team_guid: value?.team_guid || '',
      frequency: value?.frequency || null,
      start_time: value?.start_time || null,
      module_guid: value?.module_guid || null,
      alert_type_guids: alert_type_guids || [],
      module_field_guid: value?.module_field_guid || null,
      frequency_value: frequency_time?.length === 0 ? undefined : frequency_time,
    }

    if (guid) {
      editAlertSetting(params, guid)
        .then(({data: {message}}: any) => {
          setLoading(false)
          setShowModal(false)
          setReload(reload + 1)
          useTimeOutMessage('clear', 200)
          useTimeOutMessage('success', 250, message)
        })
        .catch((err: any) => {
          setLoading(false)
          errorExpiredToken(err)
          FieldMessageError(err, ['alert-setting-edit'])
        })
    } else {
      addAlertSetting(params)
        .then(({data: {message}}: any) => {
          setLoading(false)
          setShowModal(false)
          setReload(reload + 1)
          useTimeOutMessage('clear', 200)
          useTimeOutMessage('success', 250, message)
        })
        .catch((err: any) => {
          setLoading(false)
          errorExpiredToken(err)
          FieldMessageError(err, ['alert-setting-add'])
        })
    }
  }

  useEffect(() => {
    const {frequency_value, is_active}: any = detail || {}
    setFrequencyList(frequency_value)
    setIsActive(!!is_active)
  }, [detail])

  useEffect(() => {
    if (showModal && feature) {
      feature
        ?.filter((features: {unique_name: any}) => features?.unique_name === 'insurance_claim')
        ?.map((feature: any) => setInsuranceClaim(feature?.value))
      feature
        ?.filter((features: {unique_name: any}) => features?.unique_name === 'help_desk')
        ?.map((feature: any) => setHelpDesk(feature?.value))
      feature
        ?.filter((features: {unique_name: any}) => features?.unique_name === 'warranty')
        ?.map((feature: any) => setWarranty(feature?.value))
      feature
        ?.filter((features: {unique_name: any}) => features?.unique_name === 'inventory')
        ?.map((feature: any) => setFeatureInventory(feature?.value))
      feature
        ?.filter((features: {unique_name: any}) => features?.unique_name === 'insurance')
        ?.map((feature: any) => setInsurancePolicyFeature(feature?.value))
    }
  }, [showModal, feature])

  useEffect(() => {
    showModal &&
      getModuleAlertSetting({}).then(({data: {data: res}}: any) => {
        res && setModules(res)
      })
  }, [showModal])

  useEffect(() => {
    if (modules?.length > 0) {
      const arr_data: any = []
      modules?.forEach(({guid, name}: any) => {
        if (name?.toLowerCase() === 'insurance claim') {
          if (insuranceClaim === 1 || detail?.module?.name?.toLowerCase() === 'insurance claim') {
            arr_data?.push({
              value: guid || '',
              label: name || '',
            })
          }
        } else if (name?.toLowerCase() === 'inventory') {
          if (featureInventory === 1 || detail?.module?.name?.toLowerCase() === 'inventory') {
            arr_data?.push({
              value: guid || '',
              label: name || '',
            })
          }
        } else if (name?.toLowerCase() === 'warranty') {
          if (warranty === 1 || detail?.module?.name?.toLowerCase() === 'warranty') {
            arr_data?.push({
              value: guid || '',
              label: name || '',
            })
          }
        } else if (name?.toLowerCase() === 'helpdesk') {
          if (helpDesk === 1 || detail?.module?.name?.toLowerCase() === 'helpdesk') {
            arr_data?.push({
              value: guid || '',
              label: name || '',
            })
          }
        } else if (name?.toLowerCase() === 'insurance policy') {
          if (
            insurancePolicyFeature === 1 ||
            detail?.module?.name?.toLowerCase() === 'insurance policy'
          ) {
            arr_data?.push({
              value: guid || '',
              label: name || '',
            })
          }
        } else if (
          name?.toLowerCase() !== 'warranty' &&
          name?.toLowerCase() !== 'inventory' &&
          name?.toLowerCase() !== 'helpdesk' &&
          name?.toLowerCase() !== 'insurance policy' &&
          name?.toLowerCase() !== 'insurance claim'
        ) {
          arr_data?.push({
            value: guid || '',
            label: name || '',
          })
        }
      })
      setModuleList(arr_data as never[])
    }
  }, [
    detail,
    modules,
    warranty,
    helpDesk,
    insuranceClaim,
    featureInventory,
    insurancePolicyFeature,
  ])

  useEffect(() => {
    const module: any = modules?.find(({guid}: any) => guid === detail?.module?.guid)
    if (module !== undefined) {
      const {fields}: any = module || {}
      setModuleField(fields?.map(({guid, name}: any) => ({value: guid || '', label: name || ''})))
    } else {
      setModuleField([])
    }
  }, [modules, detail])

  const initialValue: any = {
    name: detail?.name || '',
    is_active: detail?.is_active || 0,
    frequency: detail?.frequency || '',
    team_guid: detail?.team?.guid || '',
    module_guid: detail?.module?.guid || '',
    frequency_value: detail?.frequency_value?.[0] || '',
    module_field_guid: detail?.module_field?.guid || '',
    alert_type_guids: detail?.types?.map(({guid}: any) => guid) as never[],
    alert_type_guid: detail?.types?.map(({guid, name}: any) => {
      return {value: guid || '', label: name || ''}
    }) as never[],
    end_time: detail
      ? detail?.end_time?.split(':')?.[0] + ':' + detail?.end_time?.split(':')?.[1] || ''
      : '',
    start_time: detail
      ? detail?.start_time?.split(':')?.[0] + ':' + detail?.start_time?.split(':')?.[1] || ''
      : '',
    frequency_value_monthly:
      detail?.frequency === 'monthly' ? detail?.frequency_value?.join(',') : null,
    frequency_value_day:
      detail?.frequency === 'yearly' && detail?.frequency_value !== undefined
        ? detail?.frequency_value?.[0]?.split(' ')?.[0]?.toString()
        : '',
    frequency_value_month:
      detail?.frequency === 'yearly' && detail?.frequency_value !== undefined
        ? detail?.frequency_value?.[0]?.split(' ')?.[1]?.toString()
        : '',
  }

  const closeModal = () => {
    setDetail({})
    setErrForm(true)
    setShowModal(false)
    setFrequencyList([])
    useTimeOutMessage('clear', 400)
  }

  return (
    <>
      <Modal dialogClassName='modal-md' show={showModal} onHide={closeModal}>
        <Formik
          initialValues={initialValue}
          validationSchema={AlertTeamSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({values, setFieldValue, setSubmitting, isSubmitting, errors, isValidating}: any) => {
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
              setErrForm(false)
            }

            return (
              <Form className='justify-content-center' noValidate>
                <Modal.Header closeButton>
                  <Modal.Title>{detail ? 'Edit' : 'Add'} Alert Setting</Modal.Title>
                </Modal.Header>
                {loadingForm ? (
                  <div className='row'>
                    <div className='col-12 text-center'>
                      <PageLoader height={250} />
                    </div>
                  </div>
                ) : (
                  <Modal.Body>
                    <div className='row'>
                      <div className={`col-12 mb-4`}>
                        <label className={`${configClass?.label} required`} htmlFor='name'>
                          Name
                        </label>
                        <InputText
                          type='text'
                          name='name'
                          placeholder='Enter Name'
                          className={configClass?.form}
                        />
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='name' />
                        </div>
                      </div>
                      <div className={`col-12 mb-4`}>
                        <label className={`${configClass?.label} required`} htmlFor='module_guid'>
                          Module
                        </label>
                        <Select
                          sm={true}
                          data={moduleList}
                          id='module_guid'
                          name='module_guid'
                          isClearable={false}
                          placeholder='Select Module'
                          defaultValue={detail?.module?.guid !== null ? values?.module_guid : ''}
                          onChange={({value}: any) => {
                            const module: any = modules?.find(({guid}: any) => guid === value)
                            const {fields}: any = module || {}

                            setFieldValue('module_guid', value)
                            setFieldValue('field', '')
                            setModuleField(
                              fields?.map(({guid, name}: any) => ({
                                value: guid || '',
                                label: name || '',
                              }))
                            )
                          }}
                        />
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='module_guid' />
                        </div>
                      </div>
                      <div className={`col-12 mb-4`}>
                        <label
                          className={`${configClass?.label} required`}
                          htmlFor='module_field_guid'
                        >
                          Field
                        </label>
                        <Select
                          sm={true}
                          data={moduleField}
                          isClearable={false}
                          name='module_field_guid'
                          placeholder='Select Field'
                          id='module_field_guid'
                          onChange={({value}: any) => setFieldValue('module_field_guid', value)}
                          defaultValue={
                            detail !== undefined && detail?.module_field?.guid !== undefined
                              ? values?.module_field_guid
                              : ''
                          }
                        />
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='module_field_guid' />
                        </div>
                      </div>
                      <div className={`col-12 mb-4`}>
                        <label
                          className={`${configClass?.label} required`}
                          htmlFor='alert_type_guids'
                        >
                          Type of Alert
                        </label>
                        <SelectMultiple
                          sm={true}
                          isMulti={true}
                          params={false}
                          reload={false}
                          isClearable={false}
                          className='col p-0'
                          api={getTypeAlertSetting}
                          placeholder='Select Type'
                          defaultValue={values?.alert_type_guid || ''}
                          parse={({guid, name}: any) => ({value: guid || '', label: name || ''})}
                          onChange={(value: any) => {
                            const type: any = value ? value?.map(({value}: any) => value) : []
                            setFieldValue('alert_type_guids', type)
                            setFieldValue('alert_type_guid', value)
                          }}
                        />
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='alert_type_guids' />
                        </div>
                      </div>
                      <div className={`col-12 mb-4`}>
                        <label className={`${configClass?.label} required`} htmlFor='start_time'>
                          From (HH MM)
                        </label>
                        <InputText
                          type='time'
                          name='start_time'
                          className={configClass?.form}
                          placeholder='Enter From (HH MM)'
                        />
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='start_time' />
                        </div>
                      </div>
                      <div className={`col-12 mb-4`}>
                        <label className={`${configClass?.label} required`} htmlFor='end_time'>
                          To (HH MM)
                        </label>
                        <InputText
                          type='time'
                          name='end_time'
                          className={configClass?.form}
                          placeholder='Enter To (HH MM)'
                        />
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='end_time' />
                        </div>
                      </div>
                      <div className={`col-12 mb-4`}>
                        <label
                          className={`${configClass?.label} required mb-4`}
                          htmlFor='description'
                        >
                          Frequency
                        </label>
                        <div className='row'>
                          <div className='col'>
                            <div className='form-check mb-4 form-check-solid'>
                              <input
                                className='form-check-input'
                                type='radio'
                                id='daily'
                                name='frequency'
                                checked={values?.frequency === 'daily'}
                                onChange={() => {
                                  setFieldValue('frequency', 'daily')
                                  setFieldValue('frequency_value', null)
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
                                className='form-check-input'
                                type='radio'
                                id='weekly'
                                name='frequency'
                                checked={values?.frequency === 'weekly'}
                                onChange={() => {
                                  setFieldValue('frequency', 'weekly')
                                  setFieldValue('frequency_value', null)
                                  setFrequencyList([])
                                }}
                              />
                              <label className='form-check-label ps-2' htmlFor='newsletter1'>
                                Weekly
                              </label>
                            </div>
                          </div>
                          <div className='col'>
                            <div className='form-check mb-4 form-check-solid'>
                              <input
                                className='form-check-input'
                                type='radio'
                                id='monthly'
                                name='frequency'
                                checked={values?.frequency === 'monthly'}
                                onChange={() => {
                                  setFieldValue('frequency', 'monthly')
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
                                className='form-check-input'
                                type='radio'
                                name='frequency'
                                id='yearly'
                                checked={values?.frequency === 'yearly'}
                                onChange={() => {
                                  setFieldValue('frequency', 'yearly')
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
                          <div className={cx('d-flex mb-4 justify-content-between days')}>
                            {dayList?.map((weekday: any, index: any) => {
                              const [Day, day] = weekday
                              const isDayActive: any = frequencyList
                                ? frequencyList?.find((dx: any) => dx === day)
                                : false

                              return (
                                <label
                                  key={index || 0}
                                  title={Day || ''}
                                  className={cx({active: isDayActive || false})}
                                >
                                  {Day?.[0] || ''}
                                  <Field
                                    name={day || ''}
                                    type='checkbox'
                                    checked={isDayActive || false}
                                    onChange={() => {
                                      setFrequencyList((e: any) => {
                                        if (e) {
                                          const res: any = e?.find(
                                            (day_find: any) => day_find === day
                                          )

                                          if (res) {
                                            return e?.filter(
                                              (day_filter: any) => day_filter !== day
                                            )
                                          } else {
                                            const new_arr: any = [...e]
                                            new_arr?.push(day)
                                            return new_arr as never[]
                                          }
                                        } else {
                                          const new_arr: any = []
                                          new_arr?.push(day)
                                          return new_arr as never[]
                                        }
                                      })
                                    }}
                                  />
                                </label>
                              )
                            })}
                          </div>
                        )}
                        {errors?.frequency_value && (
                          <div className='fv-plugins-message-container invalid-feedback'>
                            {errors?.frequency}
                          </div>
                        )}

                        {values?.frequency === 'weekly' && (
                          <div className={cx('d-flex mb-4 justify-content-between days')}>
                            <Select
                              sm={true}
                              data={day as never[]}
                              className='col m-3'
                              name='frequency_value'
                              placeholder='Select Day'
                              id='frequency_value'
                              defaultValue={values?.frequency_value}
                              onChange={({value}: any) => {
                                setFieldValue('frequency_value', value || '')
                                setFrequencyList([value || ''] as never)
                              }}
                            />
                          </div>
                        )}
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
                              Separate multiple date with comma (,)
                            </div>
                          </>
                        )}
                        {values?.frequency === 'yearly' && (
                          <div className='d-flex align-items-center input-group input-group-sm'>
                            <Select
                              sm={true}
                              data={yearly as never[]}
                              className='col m-3'
                              placeholder='Select Month'
                              name='frequency_value_month'
                              id='frequency_value_month'
                              defaultValue={values?.frequency_value_month}
                              onChange={({value}: any) => {
                                setFieldValue('frequency_value_month', value || '')
                              }}
                            />

                            <Select
                              sm={true}
                              data={dates}
                              className='col h-auto'
                              placeholder='Select Date'
                              name='frequency_value_day'
                              id='frequency_value_day'
                              defaultValue={values?.frequency_value_day}
                              onChange={({value}: any) => {
                                setFieldValue('frequency_value_day', value || '')
                              }}
                            />
                          </div>
                        )}
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='frequency_value' />
                        </div>
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='frequency_value_month' />
                        </div>
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='frequency_value_day' />
                        </div>
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='frequency' />
                        </div>
                      </div>
                      <div className={`col-12 mb-4`}>
                        <label className={`${configClass?.label} required`} htmlFor='field'>
                          Team Name
                        </label>
                      </div>
                      <div className='col-12'>
                        <div className='d-flex align-items-center input-group input-group-solid'>
                          <SelectAjax
                            sm={true}
                            name='team_guid'
                            reload={reloadTeam}
                            isClearable={false}
                            className='col p-0'
                            placeholder='Select Team'
                            api={getTeamAlertSetting}
                            params={{orderCol: 'name', orderDir: 'asc'}}
                            defaultValue={{
                              value: detail?.team?.guid || '',
                              label: detail?.team?.name || '',
                            }}
                            onChange={({value}: any) => setFieldValue('team_guid', value || '')}
                            parse={({guid, name}: any) => ({value: guid || '', label: name || ''})}
                          />

                          <AddInputBtn
                            size={'sm'}
                            onClick={() => {
                              setShowModalTeam(true)
                              setTeamDetail(undefined)
                            }}
                          />
                        </div>
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='team_guid' />
                        </div>
                      </div>
                    </div>

                    <div className='mt-4'>
                      <div className='form-check form-check-custom form-check-solid'>
                        <input
                          id='is_active'
                          type='checkbox'
                          name='is_active'
                          checked={isActive}
                          className='form-check-input me-3'
                          onChange={({target: {checked}}: any) => {
                            setIsActive(checked || false)
                            setFieldValue('is_active', checked ? 1 : 0)
                          }}
                        />
                        <div className='fw-bolder fs-12px text-dark'> Active</div>
                      </div>
                    </div>
                  </Modal.Body>
                )}

                <Modal.Footer>
                  <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                    {!loading && <span className='indicator-label'>{detail ? 'Save' : 'Add'}</span>}
                    {loading && (
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

      <AddAlertTeam
        showModal={showModalTeam}
        setShowModal={setShowModalTeam}
        setReload={setReloadTeam}
        reload={reloadTeam}
        detail={setTeam}
      />
    </>
  )
}

AddAlertSetting = memo(
  AddAlertSetting,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)

export {AddAlertSetting}
