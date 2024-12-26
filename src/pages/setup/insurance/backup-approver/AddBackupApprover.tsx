import {Select} from '@components/select/ajax'
import {configClass, errorExpiredToken, FieldMessageError, useTimeOutMessage} from '@helpers'
import {useDeepEffect} from '@hooks'
import {Form, Formik} from 'formik'
import moment from 'moment'
import {FC, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import Datetime from 'react-datetime'
import * as Yup from 'yup'

import {addApprover, editApprover, getUserApprover} from './Service'

const BackupSchema: any = Yup.object().shape({
  approver_guid: Yup.string().required('Approver Name is required'),
  assigned_start_date: Yup.string().required('Assigned Start Date is required'),
  assigned_end_date: Yup.string().required('Assigned End Date is required'),
  notes: Yup.string().required('Notes is required'),
  send_email: Yup.bool().nullable(),
})

const AddBackupApprover: FC<any> = ({showModal, setShowModal, setReload, reload, detail}) => {
  const [end_date, setEndDate] = useState<any>()
  const [start_date, setStartDate] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)
  const [defaultValueApprover, setDefaultValueApprover] = useState<any>()

  useDeepEffect(() => {
    if (showModal && detail?.approver?.guid) {
      setDefaultValueApprover({value: detail?.approver?.guid, label: detail?.approver?.name})
    } else {
      setDefaultValueApprover(undefined)
    }
  }, [showModal, detail?.approver])

  const handleSubmit = (value: any) => {
    setLoading(true)
    const params: any = {
      approver_guid: value?.approver_guid || '',
      assigned_end_date: value?.assigned_end_date || '',
      assigned_start_date: value?.assigned_start_date || '',
      notes: value?.notes || '',
      send_email: value?.send_email || '',
    }

    if (detail) {
      editApprover(params, detail?.guid)
        .then(({data: {message}}: any) => {
          setLoading(false)
          setShowModal(false)
          setReload(reload + 1)
          useTimeOutMessage('clear', 200)
          useTimeOutMessage('success', 250, message)
        })
        .catch((e: any) => {
          FieldMessageError(e, [])
          errorExpiredToken(e)
          setLoading(false)
        })
    } else {
      addApprover(params)
        .then(({data: {message}}: any) => {
          setLoading(false)
          setShowModal(false)
          setReload(reload + 1)
          useTimeOutMessage('clear', 200)
          useTimeOutMessage('success', 250, message)
        })
        .catch((e: any) => {
          FieldMessageError(e, [])
          errorExpiredToken(e)
          setLoading(false)
        })
    }
  }

  const initValue: any = {
    approver_guid: detail?.approver?.guid || '',
    assigned_end_date: detail?.assigned_end_date || '',
    assigned_start_date: detail?.assigned_start_date || '',
    notes: detail?.notes || '',
    send_email: detail?.is_active || '',
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik
        initialValues={initValue}
        validationSchema={BackupSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({values, setFieldValue, errors, touched}: any) => {
          return (
            <Form className='justify-content-center' noValidate>
              <Modal.Header>
                <Modal.Title>{detail ? 'Edit' : 'Add'} Backup Approver</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className='row mb-5'>
                  <div className='col-4'>
                    <label htmlFor='approver_guid' className={`${configClass.label} mt-2 required`}>
                      Approver Name
                    </label>
                  </div>
                  <div className='col-8'>
                    <Select
                      sm={true}
                      // className='col p-0'
                      api={getUserApprover}
                      reload={false}
                      isClearable={false}
                      params={{orderCol: 'first_name', orderDir: 'asc'}}
                      placeholder='Select user'
                      defaultValue={defaultValueApprover}
                      onChange={({value}: any) => setFieldValue('approver_guid', value || '')}
                      parse={({guid, fullname}: any) => ({value: guid, label: fullname})}
                    />
                    {touched?.approver_guid && errors?.approver_guid && (
                      <div className='fv-plugins-message-container invalid-feedback'>
                        {errors?.approver_guid || ''}
                      </div>
                    )}
                  </div>
                </div>
                <div className='row mb-5'>
                  <div className='col-4'>
                    <label htmlFor='name' className={`${configClass?.label} mt-2 required`}>
                      Assigned Date
                    </label>
                  </div>
                  <div className='col-8'>
                    <div className='d-flex my-1'>
                      <div>
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
                            setFieldValue('assigned_start_date', m)
                          }}
                          isValidDate={(currentDate: any) =>
                            end_date ? currentDate?.isSameOrBefore(end_date) : true
                          }
                          dateFormat='DD/MM/YYYY'
                          value={values?.assigned_start_date}
                          timeFormat={false}
                        />
                      </div>
                      <div className='bg-secondary p-2 pt-3'>to</div>
                      <div>
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
                            setFieldValue('assigned_end_date', m)
                          }}
                          isValidDate={(currentDate: any) =>
                            start_date ? currentDate?.isSameOrAfter(start_date) : true
                          }
                          dateFormat='DD/MM/YYYY'
                          value={values?.assigned_end_date}
                          timeFormat={false}
                        />
                      </div>
                    </div>
                    <div className='col-8'>
                      <div className='d-flex align-items-center'>
                        <div>
                          <Datetime
                            closeOnSelect
                            inputProps={{
                              autoComplete: 'off',
                              className: configClass?.form,
                              name: 'start_date',
                              placeholder: 'Start Date',
                              readOnly: true,
                            }}
                            onChange={(e: any) => {
                              const m = moment(e).format('YYYY-MM-DD')
                              setStartDate(m)
                              setFieldValue('assigned_start_date', m)
                            }}
                            isValidDate={(currentDate: any) =>
                              end_date ? currentDate?.isSameOrBefore(end_date) : true
                            }
                            dateFormat='DD/MM/YYYY'
                            value={values?.assigned_start_date}
                            timeFormat={false}
                          />
                        </div>
                        <div className='bg-secondary py-1 px-2'>to</div>
                        <div>
                          <Datetime
                            closeOnSelect
                            inputProps={{
                              autoComplete: 'off',
                              className: configClass?.form,
                              name: 'end_date',
                              placeholder: 'End Date',
                              readOnly: true,
                            }}
                            onChange={(e: any) => {
                              const m = moment(e).format('YYYY-MM-DD')
                              setEndDate(m)
                              setFieldValue('assigned_end_date', m)
                            }}
                            isValidDate={(currentDate: any) =>
                              start_date ? currentDate?.isSameOrAfter(start_date) : true
                            }
                            dateFormat='DD/MM/YYYY'
                            value={values?.assigned_end_date}
                            timeFormat={false}
                          />
                        </div>
                      </div>
                      {touched?.approver_guid && errors?.assigned_start_date && (
                        <div className='fv-plugins-message-container invalid-feedback'>
                          {errors?.assigned_start_date}
                        </div>
                      )}
                      {touched?.approver_guid && errors?.assigned_end_date && (
                        <div className='fv-plugins-message-container invalid-feedback'>
                          {errors?.assigned_end_date}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className='row mb-5'>
                  <div className='col-4'>
                    <label className={`${configClass?.label} mt-2`} htmlFor='notes'>
                      Notes
                    </label>
                  </div>
                  <div className='col-8'>
                    <textarea
                      name='notes'
                      onChange={({target: {value}}: any) => {
                        setFieldValue('notes', value || '')
                      }}
                      value={values?.notes}
                      placeholder='Enter notes (if any)'
                      className={configClass?.form}
                    ></textarea>
                    {touched?.notes && errors?.notes && (
                      <div className='fv-plugins-message-container invalid-feedback'>
                        {errors?.notes}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor='notif-email' className='form-checkform-check-solid'>
                    <input
                      type='checkbox'
                      name='notif-email'
                      checked={values?.send_email}
                      onClick={() => {
                        setFieldValue('send_email', !values?.send_email)
                      }}
                      style={{position: 'relative', top: '2px'}}
                    />
                    <span className='form-check-label mx-2'>Send notification email</span>
                  </label>
                </div>
              </Modal.Body>
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
                <Button
                  className='btn-sm'
                  variant='secondary'
                  onClick={() => {
                    setShowModal(false)
                    useTimeOutMessage('clear', 200)
                  }}
                >
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

export {AddBackupApprover}
