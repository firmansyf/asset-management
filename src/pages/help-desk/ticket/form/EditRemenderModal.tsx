import 'react-datetime/css/react-datetime.css'

import {ToastMessage} from '@components/toast-message'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import moment from 'moment'
import {FC, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import Datetime from 'react-datetime'
import * as Yup from 'yup'

import {editTodo} from '../Service'

type EditRemenderModalProps = {
  setShowModalRemender: any
  showModaRemenderl: any
  reminderData: any
  setReloadToDo: any
  reloadToDo: any
}

const EditRemenderModal: FC<EditRemenderModalProps> = ({
  setShowModalRemender,
  showModaRemenderl,
  reminderData,
  setReloadToDo,
  reloadToDo,
}) => {
  const [loading, setLoading] = useState(false)
  const [remainderDate, setRemainderDate] = useState<any>('')

  const configClass: any = {
    label: 'space-3 text-uppercase fw-bolder fs-8 mb-1  mt-5 text-black-600',
    grid: 'col-md-6 col-xl-4 mb-5',
    size: 'sm',
  }

  const yesterday: any = moment().subtract(1, 'day')
  const disablePastDt: any = (current: any) => current?.isAfter(yesterday)

  const ApprovalConfirmSchema = Yup.object().shape({
    remender_name: Yup.string().required('To Do Name is required'),
  })

  const onClose = () => {
    setLoading(false)
    setShowModalRemender(false)
  }

  const onSubmit = (value: any) => {
    setLoading(true)
    if (reminderData) {
      const params = {
        ticket_guid: reminderData?.ticket_guid,
        name: value?.remender_name,
        type: reminderData?.type,
        date_notif: value?.reminder_date,
      }

      editTodo(reminderData?.guid, params)
        .then((res: any) => {
          ToastMessage({type: 'success', message: res?.data?.message})
          setReloadToDo(reloadToDo + 1)
          setRemainderDate(moment())
          setLoading(false)
          setShowModalRemender(false)
        })
        .catch((err: any) => {
          setLoading(false)
          const {data} = err?.response?.data
          if (data.fields !== undefined) {
            const error = data.fields
            for (const key in error) {
              const value = error[key]
              ToastMessage({type: 'error', message: value[0]})
            }
          } else {
            ToastMessage({type: 'error', message: err?.response?.data?.message})
          }
        })
    }
  }

  useEffect(() => {
    if (reminderData?.date_notif) {
      setRemainderDate(new Date(reminderData?.date_notif))
    } else {
      setRemainderDate('')
    }
  }, [reminderData])

  return (
    <Modal dialogClassName='modal-md' show={showModaRemenderl} onHide={onClose}>
      <Formik
        initialValues={{
          reminder_date: reminderData?.date_notif || '',
          remender_name: reminderData?.name || '',
        }}
        validationSchema={ApprovalConfirmSchema}
        enableReinitialize
        onSubmit={(value: any) => onSubmit(value)}
      >
        {({setFieldValue}) => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>Edit ToDo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='mb-1'>
                <label htmlFor='remender_name' className={`${configClass.label} required`}>
                  Todo Name :
                </label>
                <Field
                  type='text'
                  name='remender_name'
                  placeholder='Enter Reporter Channel'
                  className={configClass?.form}
                />
                <div className='fv-plugins-message-container invalid-feedback'>
                  <ErrorMessage name='remender_name' />
                </div>
              </div>
              <div className='mb-1'>
                <label htmlFor='reminder_date' className={`${configClass.label}`}>
                  Set Reminder
                </label>
                <div className='input-group input-group-solid mt-1'>
                  <span className='input-group-text pe-0'>
                    <i className='fa fa-calendar-alt text-primary'></i>
                  </span>
                  <Datetime
                    isValidDate={disablePastDt}
                    closeOnSelect
                    inputProps={{
                      autoComplete: 'off',
                      className: configClass?.form,
                      name: 'reminder_date',
                      placeholder: 'Enter Reminder Date',
                      readOnly: true,
                    }}
                    onChange={(e: any) => {
                      const m = moment(e).format('YYYY-MM-DD HH:mm:ss')
                      setRemainderDate(m)
                      setFieldValue('reminder_date', m)
                    }}
                    dateFormat='YYYY-MM-DD'
                    timeFormat='HH:mm'
                    timeConstraints={{
                      hours: {min: 0, max: 23, step: 1},
                      minutes: {min: 0, max: 59, step: 1},
                    }}
                    value={
                      reminderData?.date_notif
                        ? moment(remainderDate).format('YYYY-MM-DD HH:mm')
                        : ''
                    }
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                {!loading && <span className='indicator-label'>Save</span>}
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
        )}
      </Formik>
    </Modal>
  )
}

export default EditRemenderModal
