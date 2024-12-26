import DateInput from '@components/form/DateInput'
import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {configClass, preferenceDate} from '@helpers'
import {
  checkinCreate,
  checkoutCreate,
  checkoutDetail,
} from '@pages/asset-management/redux/CheckInOutRedux'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {omit} from 'lodash'
import moment from 'moment'
import {FC, memo, useCallback, useEffect, useState} from 'react'
import {Modal} from 'react-bootstrap'

import {checkInOutSchema} from './checkInOutSchema'
import DateField from './DateField'
import DepartmentField from './DepartmentField'
import EmailField from './EmailField'
import EmployeeField from './EmployeeField'
import LocationField from './LocationField'

let CheckInOutModal: FC<any> = ({data, type, showModal, setShowModal, setReload}) => {
  const pref_date = preferenceDate()
  const [loading, setLoading] = useState<boolean>(false)
  const [checkout, setCheckout] = useState<any>({})
  const [destination, setDestination] = useState<any>('')
  const [loadingForm, setLoadingForm] = useState<boolean>(true)

  useEffect(() => {
    if (showModal) {
      setLoadingForm(true)
      setTimeout(() => {
        setLoadingForm(false)
      }, 500)
    }
  }, [showModal])

  const checkoutDestination = [
    {value: 'assignee', label: 'Assignee'},
    {value: 'location', label: 'Location'},
    {value: 'department', label: 'Department'},
  ]
  useEffect(() => {
    if (showModal && data.asset_checkout) {
      setCheckout(data.asset_checkout)
      const {guid} = data.asset_checkout || {}
      checkoutDetail(guid)
        .then(({data: {data}}: any) => {
          setCheckout(data)
          setDestination(data.type)
        })
        .catch(() => '')
    } else {
      setCheckout({})
      setDestination('')
    }
  }, [data.asset_checkout, showModal])
  const initialValues = {
    asset_guids: [data.guid],
    asset_checkout_guids: checkout.guid ? [checkout.guid] : '',
    type: checkout?.type || '',
    assignee_guid: checkout?.type === 'assignee' ? checkout?.assignee?.guid : '',
    location_guid: checkout?.type === 'location' ? checkout?.location?.guid : '',
    location_sub_guid:
      checkout?.type === 'location' && checkout?.location_sub?.guid
        ? checkout?.location_sub?.guid
        : '',
    company_guid: '',
    company_department_guid: '',
    checkout_date: moment().format('YYYY-MM-DD'),
    return_date: moment().format('YYYY-MM-DD'),
    notes: '',
    emails: [],
  }
  const onSubmit = (value: any) => {
    setLoading(true)
    let params: any = value
    params = omit(
      params,
      type === 'in'
        ? ['asset_guids', 'checkout_date', 'due_date']
        : ['asset_checkout_guids', 'return_date']
    )
    const {type: checkInOutType} = value
    params = {
      ...params,
      checkout_date: moment(params?.checkout_date, pref_date).format('YYYY-MM-DD'),
    }
    switch (checkInOutType) {
      case 'employee':
      case 'assignee':
        params['type'] = 'assignee'
        params['assignee_type'] = params?.assignee_type || value?.assignee_type
        params['assignee_guid'] = params?.assignee_guid || params?.employee_guid
        params = omit(params, [
          'location_guid',
          'location_sub_guid',
          'company_guid',
          'company_department_guid',
          'employee_guid',
        ])
        break
      case 'location':
        params = omit(params, [
          'employee_guid',
          'assignee_guid',
          'company_guid',
          'company_department_guid',
        ])
        break
      case 'department':
        params = omit(params, [
          'employee_guid',
          'assignee_guid',
          'location_guid',
          'location_sub_guid',
        ])
        break
      default:
        params = omit(params, [
          'employee_guid',
          'assignee_guid',
          'location_guid',
          'location_sub_guid',
          'company_guid',
          'company_department_guid',
        ])
    }

    params['checkout_date'] = moment(value?.checkout_date).format('YYYY-MM-DD')
    if (value?.due_date !== '') {
      params['due_date'] = moment(value?.due_date).format('YYYY-MM-DD')
    }

    if (type === 'in') {
      checkinCreate(params)
        .then(({data: {message}}: any) => {
          setLoading(false)
          setShowModal(false)
          ToastMessage({type: 'success', message})
          setReload(true)
        })
        .catch((err: any) => {
          setLoading(false)
          const {message, devMessage, data} = err?.response?.data || {}
          if (!devMessage) {
            const {fields} = data || {}
            if (fields === undefined) {
              ToastMessage({message: message, type: 'error'})
            } else {
              Object.keys(fields || {}).forEach((item: any) => {
                ToastMessage({message: fields[item]?.[0], type: 'error'})
              })
            }
          }
        })
    } else {
      checkoutCreate(params)
        .then(({data: {message}}: any) => {
          setLoading(false)
          setShowModal(false)
          ToastMessage({type: 'success', message})
          setReload(true)
        })
        .catch((err: any) => {
          setLoading(false)
          const {devMessage, data, message} = err?.response?.data || {}
          if (!devMessage) {
            const {fields} = data || {}
            if (fields === undefined) {
              ToastMessage({message: message, type: 'error'})
            } else {
              Object.keys(fields || {}).forEach((item: any) => {
                ToastMessage({message: fields[item]?.[0], type: 'error'})
              })
            }
          }
        })
    }
  }
  const DestinationField = useCallback(
    ({setFieldValue, disabled, values, errors}) => {
      switch (destination) {
        case 'employee':
        case 'assignee':
          return (
            <EmployeeField
              setFieldValue={setFieldValue}
              checkout={checkout}
              destination={destination}
            />
          )
        case 'location':
          return (
            <LocationField
              setFieldValue={setFieldValue}
              checkout={checkout}
              disabled={disabled}
              values={values}
              errors={errors}
              destination={destination}
            />
          )
        case 'department':
          return (
            <DepartmentField
              setFieldValue={setFieldValue}
              checkout={checkout}
              destination={destination}
            />
          )
        default:
          return (
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name='type' />
            </div>
          )
      }
    },
    [destination, checkout]
  )
  const onClose = () => {
    setShowModal(false)
  }
  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={onClose}>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={checkInOutSchema}
        onSubmit={onSubmit}
      >
        {({setFieldValue, values, errors}) => (
          <Form className=''>
            <Modal.Header>
              <Modal.Title>Check {type} Asset</Modal.Title>
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
                  <div className='col-md-12'>
                    <div className='form-group'>
                      <label htmlFor='type' className={`${configClass?.label} required`}>
                        Check-{type}-to
                      </label>
                      <Field
                        as='select'
                        className={configClass?.form}
                        disabled={type === 'in'}
                        name='type'
                        value={destination}
                        onInput={({target: {value}}: any) => setDestination(value)}
                      >
                        <option value=''>Select Check-out-to</option>
                        {checkoutDestination?.map(({value, label}: any, index: number) => (
                          <option key={index} value={value}>
                            {label}
                          </option>
                        ))}
                      </Field>
                    </div>
                  </div>
                  <DestinationField
                    setFieldValue={setFieldValue}
                    disabled={type === 'in'}
                    values={values}
                    errors={errors}
                  />
                  {type === 'out' ? (
                    <DateField setFieldValue={setFieldValue} />
                  ) : (
                    <DateInput
                      name='return_date'
                      label='Return Date'
                      required
                      setFieldValue={setFieldValue}
                      format={pref_date}
                      sm='md'
                      className='col-lg-6 mb-3 mt-4'
                    />
                  )}
                  <EmailField setFieldValue={setFieldValue} />
                  <div className='mt-2'>
                    <label htmlFor='notes' className={`${configClass?.label}`}>
                      Notes
                    </label>
                    <Field
                      name='notes'
                      as='textarea'
                      type='text'
                      placeholder='Enter Notes'
                      className={configClass?.form}
                    />
                  </div>
                </div>
              </Modal.Body>
            )}
            <Modal.Footer>
              <div className='btn btn-sm btn-light' onClick={onClose}>
                Cancel
              </div>
              <button disabled={loading} className='btn btn-sm btn-primary' type='submit'>
                {loading ? (
                  <span className='indicator-progress d-block'>
                    Please wait...
                    <span className='spinner-border spinner-border-sm align-middle ms-2' />
                  </span>
                ) : (
                  <span className='indicator-label'>Check {type}</span>
                )}
              </button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

CheckInOutModal = memo(
  CheckInOutModal,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default CheckInOutModal
