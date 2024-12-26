import 'react-datetime/css/react-datetime.css'

import {getUserEmployee as getAssignee} from '@api/UserCRUD'
import DateRange from '@components/form/date-range'
import {PageLoader} from '@components/loader/cloud'
import {Select} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {configClass, errorExpiredToken, preferenceDate} from '@helpers'
import {sendAddReservation, sendUpdateReservation} from '@pages/asset-management/redux/AssetRedux'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

let AddReservation: FC<any> = ({
  showModal,
  setShowModal,
  reloadAddReservation,
  setReloadAddReservation,
  detailAsset,
  dataReservation,
}) => {
  const pref_date: any = preferenceDate()

  const [loading, setLoading] = useState<boolean>(false)
  const [loadingForm, setLoadingForm] = useState<boolean>(true)

  useEffect(() => {
    if (showModal) {
      setLoadingForm(true)
      setTimeout(() => {
        setLoadingForm(false)
      }, 500)
    }
  }, [showModal])

  let validationShape: any = {
    start_date: Yup.date().required('Start Date is required'),
    end_date: Yup.date().required('End Date is required'),
  }

  if (Object.keys(dataReservation || {})?.length === 0) {
    validationShape = {
      ...validationShape,
      reserve_for: Yup.string().required('Reserved for is not Selected'),
    }
  }
  const validationSchema: any = Yup.object().shape(validationShape)

  const handleSubmit = (value: any) => {
    setLoading(true)

    if (Object.keys(dataReservation || {})?.length > 0) {
      const {guid} = dataReservation
      const params = {
        date_from: moment(value?.start_date).format('YYYY-MM-DD'),
        date_to: moment(value?.end_date).format('YYYY-MM-DD'),
        description: value?.description || '',
        send_email: value?.send_email || '',
        reserve_for: value?.reserve_for || '',
        assignee_type: value?.assignee_type || dataReservation?.assignee?.type || '',
      }

      sendUpdateReservation(params, guid)
        .then((res: any) => {
          ToastMessage({message: res?.data?.message, type: 'success'})
          setLoading(false)
          setShowModal(false)
          setReloadAddReservation(reloadAddReservation + 1)
        })
        .catch((err: any) => {
          errorExpiredToken(err)
          setLoading(false)

          const {data, devMessage} = err?.response?.data || {}
          if (!devMessage) {
            const {fields} = data || {}
            if (fields !== undefined) {
              Object.keys(fields || {})?.map((key: any) => {
                ToastMessage({message: key + ' : ' + fields[key]?.[0], type: 'error'})
                return true
              })
            }
          }
        })
    } else {
      const params = {
        asset_guids: [detailAsset?.guid] || [],
        send_email: value?.send_email || '',
        date_from: value?.start_date || '',
        date_to: value?.end_date || '',
        reserve_for: value?.reserve_for || '',
        assignee_type: value?.assignee_type || '',
        description: value?.description || '',
      }

      sendAddReservation(params)
        .then((res: any) => {
          ToastMessage({message: res?.data?.message, type: 'success'})
          setLoading(false)
          setShowModal(false)
          setReloadAddReservation(reloadAddReservation + 1)
        })
        .catch((err: any) => {
          errorExpiredToken(err)
          setLoading(false)
          const {data, devMessage} = err?.response?.data || {}
          if (!devMessage) {
            const {fields} = data || {}
            if (fields !== undefined) {
              Object.keys(fields || {})?.map((key: any) => {
                ToastMessage({message: key + ' : ' + fields[key]?.[0], type: 'error'})
                return true
              })
            }
          }
        })
    }
  }

  const onClose = () => {
    setShowModal(false)
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={onClose}>
      <Formik
        initialValues={{
          reserve_for: dataReservation?.assignee?.guid || '',
          assignee_type: dataReservation?.assignee?.type || '',
          description: dataReservation?.description || '',
          send_email: false,
          start_date:
            moment(dataReservation?.date_from).format('Y-MM-DD') ||
            moment(new Date()).format('Y-MM-DD'),
          end_date:
            moment(dataReservation?.date_to).format('Y-MM-DD') ||
            moment(new Date()).format('Y-MM-DD'),
        }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({setFieldValue, values}) => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>
                {Object.keys(dataReservation || {})?.length > 0 && 'Edit'} Reserve Asset
              </Modal.Title>
            </Modal.Header>
            {loadingForm ? (
              <div className='row'>
                <div className='col-12 text-center'>
                  <PageLoader height={250} />
                </div>
              </div>
            ) : (
              <Modal.Body>
                <div className='mt-2 mb-4'>
                  <label htmlFor='start_date' className={`${configClass?.label} required`}>
                    Asset ID
                  </label>
                  <p>{detailAsset?.unique_id}</p>
                </div>
                <div className='mt-2 mb-4'>
                  <label className={`${configClass?.label} required`}>Reservation Date</label>
                  <DateRange
                    modal={false}
                    minDate={moment().subtract(5, 'y').toDate()}
                    value={{
                      startDate: values?.start_date || '',
                      endDate: values?.end_date || '',
                    }}
                    onChange={({startDate, endDate}: any) => {
                      const from_date: any = startDate ? moment(startDate).format('Y-MM-DD') : ''
                      const to_date: any = endDate ? moment(endDate).format('Y-MM-DD') : ''
                      setFieldValue('start_date', from_date)
                      setFieldValue('end_date', to_date)
                    }}
                  >
                    {!values?.start_date || !values?.end_date ? (
                      <span className='text-gray-500'>Select Date</span>
                    ) : values?.start_date === values?.end_date ? (
                      <span>{moment(values?.start_date).format(pref_date)}</span>
                    ) : (
                      <span>
                        {moment(values?.start_date).format(pref_date)}
                        <span className='mx-2'>-</span>
                        {moment(values?.end_date).format(pref_date)}
                      </span>
                    )}
                  </DateRange>
                </div>
                <div className='mt-2 mb-4'>
                  <label
                    htmlFor='reserve_for'
                    className={`${configClass?.label} ${
                      Object.keys(dataReservation || {})?.length === 0 ? 'required' : ''
                    }`}
                  >
                    Reserved for
                  </label>
                  <Select
                    sm={true}
                    id='select-reserve-for'
                    name='reserve_for'
                    className='col p-0'
                    api={getAssignee}
                    params={null}
                    reload={false}
                    isClearable={false}
                    placeholder='Choose Assignee'
                    defaultValue={{
                      value: dataReservation?.assignee?.guid,
                      label: `${dataReservation?.assignee?.first_name} ${dataReservation?.assignee?.last_name}`,
                    }}
                    isDisabled={false}
                    onChange={(e: any) => {
                      setFieldValue('assignee_type', e?.type || '')
                      setFieldValue('reserve_for', e?.value || '')
                    }}
                    parse={({guid, full_name, type}: any) => ({
                      value: guid,
                      label: full_name,
                      type,
                    })}
                  />
                  <div className='fv-plugins-message-container invalid-feedback'>
                    <ErrorMessage name='reserve_for' />
                  </div>
                </div>

                <div className='mt-2 mb-2'>
                  <label htmlFor='description' className={`${configClass?.label}`}>
                    Description
                  </label>
                  <Field
                    name='description'
                    as='textarea'
                    type='text'
                    placeholder='Enter Description'
                    className={configClass?.form}
                  />
                </div>

                <div className='mt-5 pt-2'>
                  <div className='d-flex align-items-center form-check form-check-sm form-check-custom form-check-solid mb-1 mt-1'>
                    <input
                      id='send_email'
                      name='send_email'
                      type='checkbox'
                      className='form-check-input border border-gray-300'
                      checked={values?.send_email}
                      onChange={({target}: any) => {
                        setFieldValue('send_email', target.checked ? true : false)
                      }}
                    />
                    <label
                      htmlFor='send_email'
                      className={`${configClass?.label} ps-2 cursor-pointer`}
                    >
                      Send Email
                    </label>
                  </div>
                </div>
              </Modal.Body>
            )}
            <Modal.Footer>
              <Button disabled={loading} className='btn-sm' type='submit' variant='primary'>
                {!loading && (
                  <span className='indicator-label'>
                    {Object.keys(dataReservation || {})?.length > 0 ? 'Save' : 'Reserve'}
                  </span>
                )}
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

AddReservation = memo(
  AddReservation,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default AddReservation
