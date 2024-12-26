/* eslint-disable no-prototype-builtins */
import {InputText} from '@components/InputText'
import {PageLoader} from '@components/loader/cloud'
import {Select as Ajax} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {configClass, errorExpiredToken} from '@helpers'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import * as Yup from 'yup'

import {addSLA, editSLA, getWorkingHour} from './core/service'

const FormSchema: any = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  sla_target: Yup.string().test({
    name: 'sla_target',
    test: function () {
      const {
        high_resolve_value,
        high_respond_value,
        high_working_hour_guid,
        urgent_resolve_value,
        urgent_respond_value,
        urgent_working_hour_guid,
        medium_resolve_value,
        medium_respond_value,
        medium_working_hour_guid,
        low_resolve_value,
        low_respond_value,
        low_working_hour_guid,
      }: any = this.parent || {}

      if (
        urgent_resolve_value === undefined ||
        urgent_resolve_value === '' ||
        urgent_respond_value === undefined ||
        urgent_respond_value === '' ||
        urgent_working_hour_guid?.value === undefined ||
        high_resolve_value === undefined ||
        high_resolve_value === '' ||
        high_respond_value === undefined ||
        high_respond_value === '' ||
        high_working_hour_guid?.value === undefined ||
        medium_resolve_value === undefined ||
        medium_resolve_value === '' ||
        medium_respond_value === undefined ||
        medium_respond_value === '' ||
        medium_working_hour_guid?.value === undefined ||
        low_resolve_value === undefined ||
        low_resolve_value === '' ||
        low_respond_value === undefined ||
        low_respond_value === '' ||
        low_working_hour_guid?.value === undefined
      ) {
        return this.createError({
          message: `SLA Target is required`,
        })
      }
      return true
    },
  }),
})

let AddSLA: FC<any> = ({showModal, setShowModal, detail, reload, setReload, setDataChecked}) => {
  const intl: any = useIntl()

  const [initValue, setInitValue] = useState<any>({})
  const [prioritys, setPrioritys] = useState<any>([])
  const [errForm, setErrForm] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingForm, setLoadingForm] = useState<boolean>(true)
  const [loadingWorking, setLoadingWorking] = useState<boolean>(true)

  const require_filed_message: any = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})

  const successMessage = (message: any) => {
    setTimeout(() => ToastMessage({type: 'clear'}), 300)
    setTimeout(() => ToastMessage({type: 'success', message}), 400)
  }

  const handleSubmit = (value: any) => {
    setLoading(true)

    const params: any = {
      name: value?.name || '',
      description: value?.description || '',
      details: [
        {
          type: 'high',
          respond_value: value?.high_respond_value || 0,
          respond_type: value?.high_respond_type || '',
          resolve_value: value?.high_resolve_value || 0,
          resolve_type: value?.high_resolve_type || '',
          working_hour_guid:
            value?.high_working_hour_guid?.value !== undefined
              ? value?.high_working_hour_guid?.value
              : value?.high_working_hour_guid
              ? value?.high_working_hour_guid || ''
              : '',
          is_escalation: value?.high_is_escalation || false,
        },
        {
          type: 'urgent',
          respond_value: value?.urgent_respond_value || 0,
          respond_type: value?.urgent_respond_type || '',
          resolve_value: value?.urgent_resolve_value || 0,
          resolve_type: value?.urgent_resolve_type || '',
          working_hour_guid:
            value?.urgent_working_hour_guid?.value !== undefined
              ? value?.urgent_working_hour_guid?.value
              : value?.urgent_working_hour_guid
              ? value?.urgent_working_hour_guid || ''
              : '',
          is_escalation: value?.urgent_is_escalation || false,
        },
        {
          type: 'medium',
          respond_value: value?.medium_respond_value || 0,
          respond_type: value?.medium_respond_type || '',
          resolve_value: value?.medium_resolve_value || 0,
          resolve_type: value?.medium_resolve_type || '',
          working_hour_guid:
            value?.medium_working_hour_guid?.value !== undefined
              ? value?.medium_working_hour_guid?.value
              : value?.medium_working_hour_guid
              ? value?.medium_working_hour_guid || ''
              : '',
          is_escalation: value?.medium_is_escalation || false,
        },
        {
          type: 'low',
          respond_value: value?.low_respond_value || 0,
          respond_type: value?.low_respond_type || '',
          resolve_value: value?.low_resolve_value || 0,
          resolve_type: value?.low_resolve_type || '',
          working_hour_guid:
            value?.low_working_hour_guid?.value !== undefined
              ? value?.low_working_hour_guid?.value
              : value?.low_working_hour_guid
              ? value?.low_working_hour_guid || ''
              : '',
          is_escalation: value?.low_is_escalation || false,
        },
      ],
    }

    if (detail) {
      editSLA(params, detail?.guid)
        .then(({data: {message}}: any) => {
          setLoading(false)
          setDataChecked([])
          setShowModal(false)
          setReload(reload + 1)
          successMessage(message)
        })
        .catch((err: any) => {
          setLoading(false)
          errorExpiredToken(err)
          const {response} = err || {}
          const {devMessage, data, message} = response?.data || {}
          const {fields} = data || {}

          if (!devMessage) {
            if (fields === undefined) {
              ToastMessage({message, type: 'error'})
            }

            if (fields) {
              Object.keys(fields || {})?.map((item: any) => {
                if (item !== 'file.data' && item !== 'file.title') {
                  ToastMessage({message: fields?.[item]?.[0] || '', type: 'error'})
                }
                return true
              })
            }
          }
        })
    } else {
      addSLA(params)
        .then(({data: {message}}: any) => {
          setLoading(false)
          setDataChecked([])
          setShowModal(false)
          setReload(reload + 1)
          successMessage(message)
        })
        .catch((err: any) => {
          setLoading(false)
          errorExpiredToken(err)
          const {response} = err || {}
          const {devMessage, data, message} = response?.data || {}
          const {fields} = data || {}

          if (!devMessage) {
            if (fields === undefined) {
              ToastMessage({message, type: 'error'})
            }

            if (fields) {
              Object.keys(fields || {})?.map((item: any) => {
                if (item !== 'file.data' && item !== 'file.title') {
                  ToastMessage({message: fields?.[item]?.[0] || '', type: 'error'})
                }
                return true
              })
            }
          }
        })
    }
  }

  const onClose = () => {
    setShowModal(false)
    ToastMessage({type: 'clear'})
  }

  useEffect(() => {
    let data: any = {}
    const {detail: detailTarget}: any = detail || {}
    const priority: any = [
      {
        id: 'urgent',
        color: 'red',
        label: 'Urgent',
      },
      {
        id: 'high',
        color: 'yellow',
        label: 'High',
      },
      {
        id: 'medium',
        color: 'blue',
        label: 'Medium',
      },
      {
        id: 'low',
        color: 'green',
        label: 'Low',
      },
    ]

    if (detailTarget !== undefined) {
      detailTarget?.forEach((item: any) => {
        const {
          type,
          respond_value,
          respond_type,
          resolve_type,
          resolve_value,
          working_hour_guid,
          working_hour_name,
          is_escalation,
        }: any = item || {}

        data = {...data, [type + '_respond_type']: respond_type || 'minutes'}
        data = {...data, [type + '_respond_value']: respond_value || 'minutes'}
        data = {...data, [type + '_resolve_type']: resolve_type || 'minutes'}
        data = {...data, [type + '_resolve_value']: resolve_value || 'minutes'}
        data = {
          ...data,
          [type + '_working_hour_guid']: {
            value: working_hour_guid || '',
            label: working_hour_name || '',
          },
        }
        data = {...data, [type + '_is_escalation']: is_escalation === 1 ? true : false}
      })
    } else {
      priority?.forEach((item: any) => {
        const {id} = item || {}
        data = {...data, [id + '_respond_type']: 'minutes'}
        data = {...data, [id + '_respond_value']: ''}
        data = {...data, [id + '_resolve_type']: 'minutes'}
        data = {...data, [id + '_resolve_value']: ''}
        data = {...data, [id + '_working_hour_guid']: {value: '', label: ''}}
        data = {...data, [id + '_is_escalation']: false}
      })
    }

    const initVal: any = {
      name: detail?.name || '',
      description: detail?.description || '',
      ...data,
    }

    setInitValue(initVal || {})
    setPrioritys(priority as never[])
  }, [detail, showModal])

  useEffect(() => {
    setLoadingWorking(false)
    setTimeout(() => setLoadingWorking(true), 500)

    showModal && setLoadingForm(true)
    showModal && setTimeout(() => setLoadingForm(false), 600)
  }, [showModal])

  return (
    <Modal dialogClassName='modal-lg' show={showModal} onHide={onClose}>
      <Formik
        initialValues={initValue}
        validationSchema={FormSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({setFieldValue, setSubmitting, isSubmitting, values, isValidating, errors}: any) => {
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
                <Modal.Title>{detail ? 'Edit' : 'Add'} SLA Policies</Modal.Title>
              </Modal.Header>
              {loadingForm ? (
                <div className='row'>
                  <div className='col-12 text-center'>
                    <PageLoader height={250} />
                  </div>
                </div>
              ) : (
                <Modal.Body>
                  <div className='row mb-5'>
                    <div className='col-sm-12 col-md-4 col-sm-2 mt-2'>
                      <label htmlFor='name' className={`${configClass?.label} required`}>
                        Name
                      </label>
                    </div>

                    <div className='col-sm-12 col-md-6 col-sm-6 mb-3'>
                      <Field
                        name='name'
                        type='text'
                        className={configClass?.form}
                        placeholder='Enter card number'
                      />
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <ErrorMessage name='name' />
                      </div>
                    </div>
                  </div>

                  <div className='row mb-5'>
                    <div className='col-sm-12 col-md-4 col-sm-2 mt-2'>
                      <label htmlFor='name' className={`${configClass?.label} required`}>
                        Description
                      </label>
                    </div>

                    <div className='col-sm-12 col-md-6 col-sm-6 mb-3'>
                      <Field
                        type='text'
                        name='description'
                        className={configClass?.form}
                        placeholder='Enter card number'
                      />
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <ErrorMessage name='description' />
                      </div>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-12 mb-2'>
                      <label htmlFor='name' className={`${configClass?.label} required`}>
                        SLA Targets
                      </label>
                      {errors?.hasOwnProperty('sla_target') && (
                        <div className='bg-light-danger rounded p-3 text-danger fs-7 mb-3'>
                          <i className='fa fa-info-circle text-danger me-2' />
                          {errors?.sla_target || ''}
                        </div>
                      )}
                    </div>

                    <div
                      className='col-12'
                      style={{
                        border: '1px solid #eaeaea',
                        borderRadius: '5px',
                      }}
                    >
                      <div className='search-table-outter'>
                        <table className='search-table table table-sm table-row-dashed table-row-middle gx-2 gy-3 mb-0'>
                          {/* <thead> */}
                          <tr className=''>
                            <th className='fw-bold fs-7' style={{width: '100px'}}>
                              Priority
                            </th>
                            <th className='fw-bold fs-7' style={{width: '185px'}}>
                              Respond Within
                            </th>
                            <th className='fw-bold fs-7' style={{width: '185px'}}>
                              Resolve Within
                            </th>
                            <th className='fw-bold fs-7' style={{width: '200px'}}>
                              Oprational Hrs
                            </th>
                            <th className='fw-bold fs-7' style={{width: '80px'}}>
                              Escalation
                            </th>
                          </tr>
                          {/* </thead>

                          <tbody> */}
                          {Array.isArray(prioritys) &&
                            prioritys?.length > 0 &&
                            prioritys?.map((item: any, index: any) => {
                              return (
                                <tr key={index || 0} className=''>
                                  <td className=''>
                                    <div className='d-flex align-items-center'>
                                      <div
                                        className='w-15px h-15px radius-50'
                                        style={{background: item?.color || ''}}
                                      />
                                      <div className='ms-2 fw-bold'>{item?.label || ''}</div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='row m-0 input-group input-group-sm input-group-solid p-0'>
                                      <div className='col-5 p-0'>
                                        <InputText
                                          type='text'
                                          placeholder='Enter'
                                          name={`${item?.id || ''}_respond_value`}
                                          className={`${configClass?.form} mb-0 border-0`}
                                        />
                                      </div>

                                      <div className='col-7 p-0'>
                                        <select
                                          className={configClass?.select}
                                          name={`${item?.id || ''}_respond_type`}
                                          onClick={({target: {value}}: any) =>
                                            setFieldValue(
                                              `${item?.id || ''}_respond_type`,
                                              value || ''
                                            )
                                          }
                                        >
                                          <option value='minutes'>minutes</option>
                                          <option value='hours'>hours</option>
                                          <option value='days'>days</option>
                                        </select>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='row m-0 input-group input-group-sm input-group-solid p-0'>
                                      <div className='col-5 p-0'>
                                        <InputText
                                          type='text'
                                          placeholder='Enter'
                                          className={`${configClass?.form} mb-0`}
                                          name={`${item?.id || ''}_resolve_value`}
                                        />
                                      </div>

                                      <div className='col-7 p-0'>
                                        <select
                                          className={configClass?.select}
                                          name={`${item?.id || ''}_resolve_type`}
                                          onClick={({target: {value}}: any) =>
                                            setFieldValue(
                                              `${item?.id || ''}_resolve_type`,
                                              value || ''
                                            )
                                          }
                                        >
                                          <option value='minutes'>minutes</option>
                                          <option value='hours'>hours</option>
                                          <option value='days'>days</option>
                                        </select>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className='row'>
                                      <div className='col'>
                                        {loadingWorking && (
                                          <Ajax
                                            sm={true}
                                            reload={false}
                                            className='col p-0'
                                            api={getWorkingHour}
                                            placeholder='Select Working Hours'
                                            params={{orderCol: 'name', orderDir: 'asc'}}
                                            defaultValue={
                                              values?.[`${item?.id || ''}_working_hour_guid`] || ''
                                            }
                                            onChange={(e: any) =>
                                              setFieldValue(
                                                `${item?.id || ''}_working_hour_guid`,
                                                e || ''
                                              )
                                            }
                                            parse={({guid, name}: any) => ({
                                              value: guid,
                                              label: name,
                                            })}
                                          />
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <label className='d-flex align-items-center'>
                                      <div className='form-check form-check-custom form-check-solid mx-5'>
                                        <Field
                                          type='checkbox'
                                          className='form-check-input mx-2'
                                          name={`${item?.id || ''}_is_escalation`}
                                          value={`${item?.id || ''}_is_escalation`}
                                          checked={
                                            values?.[`${item?.id || ''}_is_escalation`] || false
                                          }
                                          onChange={() => {
                                            setFieldValue(
                                              `${item?.id || ''}_is_escalation`,
                                              !values?.[`${item?.id || ''}_is_escalation`]
                                            )
                                          }}
                                        />
                                      </div>
                                    </label>
                                  </td>
                                </tr>
                              )
                            })}
                          {/* </tbody> */}
                        </table>
                      </div>
                    </div>
                  </div>

                  <style>{`
                      @media screen and (max-width: 420px) {
                        .search-table-outter { overflow-x: scroll; padding: 0px !important;}
                        th, td { min-width: 200px; }
                      }
                    `}</style>
                </Modal.Body>
              )}
              <Modal.Footer>
                <Button disabled={loading} className='btn-sm' type='submit' variant='primary'>
                  {!loading && <span className='indicator-label'>{detail ? 'Save' : 'Add'}</span>}

                  {loading && (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Please wait...
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}
                </Button>
                <Button className='btn-sm' variant='secondary' onClick={onClose}>
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

AddSLA = memo(AddSLA, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default AddSLA
