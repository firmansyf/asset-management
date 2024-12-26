import {getUserV1} from '@api/UserCRUD'
import {CalendarWidget} from '@components/calendar/Calendar'
import DateRange from '@components/form/date-range'
import {InputNumber} from '@components/form/InputNumber'
import {Select as SelectAjax} from '@components/select/ajax'
import {Select} from '@components/select/select'
import {ToastMessage} from '@components/toast-message'
import {configClass, errorValidation, preferenceDate} from '@helpers'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'
import {Modal} from 'react-bootstrap'
import {shallowEqual, useSelector} from 'react-redux'
import * as Yup from 'yup'

import {addReservation, editReservation, getReservation} from './Service'

const validationSchema: any = Yup.object().shape({
  location_guid: Yup.string().required('Location is required'),
  from_date: Yup.string().required('From date is required'),
  to_date: Yup.string().required('To date is required'),
  quantity: Yup.number().required('Quantity is required').min(1, `Quantity is required`),
})

const InventoryReserve: FC<any> = ({
  showModal,
  setShowModal,
  detail,
  inventory,
  reloadReservation,
  setReloadReservation,
}) => {
  const loading: any = false
  const pref_date: any = preferenceDate()
  const user: any = useSelector(({currentUser}: any) => currentUser, shallowEqual)

  const [toDate, setToDate] = useState<any>()
  const [valueUser, setValue] = useState<any>({})
  const [fromDate, setFromDate] = useState<any>()
  const [quantity, setQuantity] = useState<number>(0)
  const [reservation, setReservation] = useState<any>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [month, setMonth] = useState<any>({
    start: moment()?.startOf('month')?.format('YYYY-MM-DD'),
    end: moment()?.endOf('month')?.format('YYYY-MM-DD'),
  })
  const options: any = inventory?.quantity_by_location?.map(
    ({location_guid, location_name}: any) => ({
      value: location_guid,
      label: location_name,
    })
  )

  const initialValues: any = {
    quantity: detail?.quantity || 0,
    user_guid: detail?.user_guid || '',
    description: detail?.description || '',
    location_guid: detail?.location_guid || '',
    to_date: moment(detail?.to_date || '')?.format('YYYY-MM-DD') || moment()?.format('YYYY-MM-DD'),
    from_date:
      moment(detail?.from_date || '')?.format('YYYY-MM-DD') || moment()?.format('YYYY-MM-DD'),
  }

  const onSubmit = (values: any) => {
    setShowModal(true)
    values.user_guid = values?.user_guid || user?.guid || ''
    const {guid, from_date, to_date}: any = detail || {}
    const {guid: guidInv}: any = inventory || {}

    if (guid) {
      values.from_date = moment(values?.from_date || '', 'YYYY-MM-DD')?.isValid()
        ? moment(values?.from_date || '')?.format('YYYY-MM-DD')
        : moment(from_date || '')?.format('YYYY-MM-DD')
      values.to_date = moment(values?.to_date || '', 'YYYY-MM-DD')?.isValid()
        ? moment(values?.to_date || '')?.format('YYYY-MM-DD')
        : moment(to_date || '')?.format('YYYY-MM-DD')

      editReservation(values, guid)
        .then(({data: {message}}: any) => {
          setShowModal(false)
          ToastMessage({type: 'success', message})
          setReloadReservation(reloadReservation + 1)
        })
        .catch((err: any) => {
          Object.values(errorValidation(err))?.map((message: any) =>
            ToastMessage({type: 'error', message})
          )
        })
    } else {
      values.from_date = moment(values?.from_date || '', 'YYYY-MM-DD')?.isValid()
        ? moment(values?.from_date || '')?.format('YYYY-MM-DD')
        : moment()?.format('YYYY-MM-DD')
      values.to_date = moment(values?.to_date || '', 'YYYY-MM-DD')?.isValid()
        ? moment(values?.to_date || '').format('YYYY-MM-DD')
        : moment()?.format('YYYY-MM-DD')

      addReservation(values, guidInv)
        .then(({data: {message}}: any) => {
          setQuantity(0)
          setShowModal(false)
          setToDate(undefined)
          setFromDate(undefined)
          ToastMessage({type: 'success', message})
          setReloadReservation(reloadReservation + 1)
        })
        .catch((err: any) => {
          Object.values(errorValidation(err))?.map((message: any) =>
            ToastMessage({type: 'error', message})
          )
        })
    }
  }

  const onHide = () => {
    setQuantity(0)
    setShowModal(false)
  }

  useEffect(() => {
    const {user_guid} = detail || {}
    getUserV1({}).then(({data: {data}}: any) => {
      const res: any = data?.find(({guid}: any) => guid === user_guid)
      setValue(res)
    })
  }, [detail])

  useEffect(() => {
    const {guid} = inventory || {}
    guid &&
      getReservation(
        {from_date: month?.start || '', to_date: month?.end || ''},
        inventory?.guid
      ).then(({data: {data}}: any) => {
        setReservation(
          data?.map(
            ({user_name: title, from_date: start, to_date, caption: _caption, guid}: any) => ({
              title,
              start: moment(start || '')?.format('YYYY-MM-DD'),
              end: moment(to_date || '')
                ?.add(1, 'days')
                ?.format('YYYY-MM-DD'),
              backgroundColor: guid === detail?.guid ? 'red' : null,
              borderColor: guid === detail?.guid ? 'red' : null,
            })
          )
        )
      })
  }, [inventory, month?.start, month?.end, detail, reloadReservation])

  useEffect(() => {
    if (detail !== undefined) {
      const {from_date, to_date} = detail || {}

      from_date && setFromDate(from_date)
      to_date && setToDate(to_date)
      if (from_date || to_date) {
        const m: any = moment(from_date || to_date || '')
        setMonth({
          start: m?.startOf('month')?.format('YYYY-MM-DD'),
          end: m?.endOf('month')?.format('YYYY-MM-DD'),
        })
      }
    } else {
      setToDate(undefined)
      setFromDate(undefined)
    }
  }, [detail, showModal])

  useEffect(() => {
    const {location_guid: guid} = detail || {}
    if (guid && showModal) {
      const qtyLocation: any = inventory?.quantity_by_location?.find(
        ({location_guid}: any) => location_guid === guid
      )
      setQuantity(qtyLocation?.quantity || 0)
    }
  }, [inventory, detail, showModal, isLoading])

  useEffect(() => {
    showModal && setIsLoading(true)
    showModal && setTimeout(() => setIsLoading(false), 1500)
  }, [showModal])

  return (
    <Modal dialogClassName='modal-lg' show={showModal} onHide={onHide}>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({setFieldValue, values}) => (
          <Form className=''>
            <Modal.Header>
              <Modal.Title>Reservation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='row'>
                <div className='col-lg-4'>
                  <div className='mb-5'>
                    <label className={`${configClass?.label} required`}> Date </label>
                    {isLoading ? (
                      <div className='text-gray-500 ms-1'>Loading...</div>
                    ) : (
                      <DateRange
                        modal={false}
                        minDate={moment()?.subtract(5, 'y')?.toDate()}
                        value={{
                          startDate: fromDate || '',
                          endDate: toDate || '',
                        }}
                        onChange={({startDate, endDate}: any) => {
                          const from_date: any = startDate
                            ? moment(startDate)?.format('Y-MM-DD')
                            : ''
                          const to_date: any = endDate ? moment(endDate)?.format('Y-MM-DD') : ''

                          setFromDate(from_date)
                          setFieldValue('from_date', from_date)

                          setToDate(to_date)
                          setFieldValue('to_date', to_date)
                        }}
                      >
                        {!fromDate || !toDate ? (
                          <span className='text-gray-500'>Select Date</span>
                        ) : fromDate === toDate ? (
                          <span>{moment(fromDate || '')?.format(pref_date)}</span>
                        ) : (
                          <span>
                            {fromDate !== undefined
                              ? moment(fromDate || '')?.format(pref_date)
                              : fromDate}
                            <span className='mx-2'>-</span>
                            {toDate !== undefined
                              ? moment(toDate || '')?.format(pref_date)
                              : toDate}
                          </span>
                        )}
                      </DateRange>
                    )}
                    <div className='fv-plugins-message-container invalid-feedback'>
                      <ErrorMessage name='to_date' />
                    </div>
                  </div>

                  <div className='mb-3'>
                    <div className='d-flex align-items-center justify-content-between'>
                      <label className={`${configClass?.label} required`}> Location </label>
                      {isLoading ? (
                        <div className='text-gray-500 ms-1'>Loading...</div>
                      ) : (
                        <div className='fw-bolder'>Available Quantity: {quantity || 0}</div>
                      )}
                    </div>
                    <Select
                      sm={true}
                      className='col p-0'
                      data={options}
                      params={false}
                      placeholder='Choose'
                      defaultValue={values?.location_guid}
                      onChange={({value}: any) => {
                        setFieldValue('location_guid', value || '')
                        const quantityByLocation: any = inventory?.quantity_by_location?.find(
                          ({location_guid}: any) => location_guid === value
                        )
                        setQuantity(quantityByLocation?.quantity || 0)
                      }}
                    />
                    <div className='fv-plugins-message-container invalid-feedback'>
                      <ErrorMessage name='location_guid' />
                    </div>
                  </div>
                  <div className='mb-3'>
                    <label className={`${configClass?.label} required`}> Quantity </label>
                    <InputNumber
                      btn={true}
                      max={quantity || 0}
                      nullable={false}
                      defaultValue={initialValues?.quantity || 0}
                      onChange={(e: any) => setFieldValue('quantity', e)}
                      disabled={values?.location_guid === '' ? true : false}
                    />
                    <div className='fv-plugins-message-container invalid-feedback'>
                      <ErrorMessage name='quantity' />
                    </div>
                  </div>
                  <div className='mb-3'>
                    <label className={`${configClass?.label}`}> Reservation For </label>
                    <SelectAjax
                      sm={true}
                      api={getUserV1}
                      params={{}}
                      reload={false}
                      id='select-user'
                      name='user_guid'
                      className='col p-0'
                      placeholder='Choose User'
                      parse={({guid, fullname}: any) => ({value: guid, label: fullname})}
                      defaultValue={{value: valueUser?.guid, label: valueUser?.fullname}}
                      onChange={({value}: any) => setFieldValue('user_guid', value || '')}
                    />
                  </div>
                  <div className='mb-3'>
                    <label className={`${configClass?.label}`}> Description </label>
                    <Field
                      type='text'
                      as='textarea'
                      name='description'
                      placeholder='Enter Description'
                      className={configClass?.form}
                    />
                  </div>
                </div>
                <div className='col-lg-8'>
                  <label className={`${configClass?.label}`}> Other Reservation </label>
                  <CalendarWidget
                    events={reservation}
                    onSelectDate={(e: any) => e}
                    now={detail !== undefined ? moment(detail?.from_date) : moment()}
                    onChangeMonth={(e: any) => {
                      setMonth({
                        start: e?.startOf('month')?.format('YYYY-MM-DD'),
                        end: e?.endOf('month')?.format('YYYY-MM-DD'),
                      })
                    }}
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <div className='btn btn-sm btn-light' onClick={onHide}>
                Cancel
              </div>
              <button disabled={loading} className='btn btn-sm btn-primary' type='submit'>
                {loading ? (
                  <span className='indicator-progress d-block'>
                    Please wait...
                    <span className='spinner-border spinner-border-sm align-middle ms-2' />
                  </span>
                ) : (
                  <span className='indicator-label'>Save</span>
                )}
              </button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

const ModalReservation = memo(
  InventoryReserve,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {ModalReservation}
