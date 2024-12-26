/* eslint-disable sonar/for-in */
/* eslint-disable sonar/no-wildcard-import */
/* eslint-disable react-hooks/exhaustive-deps */
import 'react-datetime/css/react-datetime.css'

import {CheckBox} from '@components/form/checkbox'
import {Select} from '@components/select/select'
import {ToastMessage} from '@components/toast-message'
import {
  configClass,
  errorValidation,
  hasPermission,
  preferenceDate,
  valueValidation,
} from '@helpers'
import {updateDeliveryCheck} from '@pages/purchase-order/Services'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import parse from 'html-react-parser'
import moment from 'moment'
import {FC, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import Datetime from 'react-datetime'
import * as Yup from 'yup'

import {DeliveryCheckFile} from './DeliveryCheckFile'

type DeliveryCheckProps = {
  showModal: any
  setShowModal: any
  setReloadPO: any
  reloadPO: any
  detailPO: any
}

const DeliveryCheckForm: FC<DeliveryCheckProps> = ({
  showModal,
  setShowModal,
  setReloadPO,
  reloadPO,
  detailPO,
}) => {
  const pref_date: any = preferenceDate()

  const [validation, setValidation] = useState<any>()
  const [loadingButtonPO, setloadingButtonPO] = useState<boolean>(false)
  const [showForm, setShowForm] = useState<boolean>(false)
  const paymentPermission = hasPermission('purchase-order.delivery_check') || false
  const defaultDateFormat: string = 'YYYY-MM-DD'

  useEffect(() => {
    if (showModal) {
      if (!paymentPermission) {
        setShowModal(false)
        setShowForm(false)
        ToastMessage({type: 'error', message: 'You do not have Authorization to access this page'})
      } else {
        setShowForm(true)
      }
    }
  }, [showModal])

  const options: any = [
    {key: '1', value: 'The quantity of assets that arrived is correct'},
    {key: '2', value: 'Goods are suitable for use'},
    {key: '3', value: 'The price match with terms of purchase order'},
    {key: '4', value: 'All asset meet the ordered specifications'},
  ]

  const handleOnSubmit = (values: any) => {
    setloadingButtonPO(true)

    if (detailPO?.guid) {
      const {guid} = detailPO
      const params: any = {
        files: valueValidation(values?.files, []),
        item_check: valueValidation(values?.item_check, []),
        delivery_description: valueValidation(values?.notes, ''),
        is_match: values?.po_match === 1 ? true : false,
        delivery_date:
          values?.delivery_date !== ''
            ? moment(values?.delivery_date).format(defaultDateFormat)
            : '',
      }

      updateDeliveryCheck(guid, params)
        .then(({data: {message}}: any) => {
          setloadingButtonPO(false)
          setShowModal(false)
          setShowForm(false)
          setReloadPO(reloadPO + 1)
          ToastMessage({type: 'success', message})
        })
        .catch((err: any) => {
          setloadingButtonPO(false)
          setValidation(errorValidation(err))
          const {data, message} = err?.response?.data || {}
          if (data?.fields !== undefined) {
            const error = data?.fields || {}
            for (const key in error) {
              const value = valueValidation(error?.[key], '')
              ToastMessage({type: 'error', message: valueValidation(value?.[0], '')})
            }
          } else {
            ToastMessage({type: 'error', message})
          }
        })
    }
  }

  const DeliveryCheckSchema: any = Yup.object().shape({
    po_match: Yup.string().required('Purchase Order Match is required'),
    delivery_date: Yup.string().required('Delivery Date is required'),
  })

  const initValues: any = {
    description: detailPO?.description || '-',
    due_date: detailPO?.due_date ? moment(detailPO?.due_date).format(defaultDateFormat) : '',
    delivery_date: detailPO?.delivery?.delivery_date
      ? moment(detailPO?.delivery?.delivery_date).format(defaultDateFormat)
      : '',
    quantity: detailPO?.quantity || '',
    final_price: detailPO?.price * detailPO?.quantity || 0,
    po_match: '',
  }

  const onClose = () => {
    setShowModal(false)
    setShowForm(false)
  }

  return (
    <Modal dialogClassName='modal-lg' size='lg' show={showForm} onHide={onClose}>
      <Formik
        initialValues={initValues}
        enableReinitialize
        validationSchema={DeliveryCheckSchema}
        onSubmit={handleOnSubmit}
      >
        {({setFieldValue, values}: any) => {
          return (
            <Form className='justify-content-center' noValidate>
              <Modal.Header>
                <Modal.Title>Delivery Check</Modal.Title>
              </Modal.Header>
              <Modal.Body className='py-0'>
                <div className='mt-5 mb-5 h4'>
                  <strong>{valueValidation(detailPO?.po_id, '-')}</strong>
                </div>
                <div className='table-asset text-center w-100 mt-5 mb-5'>
                  <table className='table table-border'>
                    <tr className='bg-secondary'>
                      <th className='fw-bolder p-2 border'>Asset ID</th>
                      <th className='fw-bolder p-2 border'>Asset Name</th>
                      <th className='fw-bolder p-2 border'>Category</th>
                    </tr>
                    {detailPO?.asset?.map((item: any, i: number) => {
                      const keyIndex = i + 1
                      return (
                        <tr key={keyIndex}>
                          <td className='border p-3'>{valueValidation(item?.unique_id, '')}</td>
                          <td className='border p-3'>{valueValidation(item?.name, '')}</td>
                          <td className='border p-3'>{valueValidation(item?.category, '')}</td>
                        </tr>
                      )
                    })}
                  </table>
                </div>
                <div className='mt-0'>
                  <div className='row'>
                    <div className='col-md-6'>
                      <div className='my-3'>
                        <label htmlFor='location' className={`${configClass?.label}`}>
                          Location
                        </label>
                        <Select
                          sm={true}
                          className='col p-0'
                          data={[
                            {
                              value: detailPO?.location?.name || '',
                              label: detailPO?.location?.name || '',
                            },
                          ]}
                          name='location'
                          placeholder={`Select Location`}
                          defaultValue={detailPO?.location?.name || {}}
                          isClearable={false}
                          isDisabled={true}
                        />
                      </div>
                      <div className='my-3'>
                        <label htmlFor='supllier' className={`${configClass?.label}`}>
                          Supplier
                        </label>
                        <Select
                          sm={true}
                          className='col p-0'
                          data={[
                            {
                              value: detailPO?.supplier?.guid || '',
                              label: detailPO?.supplier?.name || '',
                            },
                          ]}
                          name='location'
                          placeholder={`Select Location`}
                          defaultValue={detailPO?.supplier?.guid || {}}
                          isClearable={false}
                          isDisabled={true}
                        />
                      </div>
                      <div className='my-3'>
                        <label htmlFor='due_date' className={`${configClass?.label}`}>
                          Due Date
                        </label>
                        <div className='input-group input-group-solid'>
                          <span className='input-group-text pe-0'>
                            <i className='fa fa-calendar-alt text-primary'></i>
                          </span>
                          <Field
                            type='text'
                            name='due_date'
                            placeholder='Select Due Date'
                            className={configClass?.form}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className='my-3'>
                        <label htmlFor='po_match' className={`${configClass?.label} required`}>
                          Does the asset Match the purchase order?
                        </label>
                        <div className='row'>
                          <div className='col-auto'>
                            <label className='form-check form-check-custom form-check-sm form-check-solid bg-f7 rounded px-2'>
                              <input
                                type='radio'
                                className='form-check-input border border-gray-400'
                                name='po_match'
                                onChange={({target: {checked}}: any) => {
                                  if (checked) {
                                    setFieldValue('po_match', 1)
                                  }
                                }}
                              />
                              <span className='m-2 cursor-pointer fw-bold text-dark fs-7'>Yes</span>
                            </label>
                          </div>
                          <div className='col-auto'>
                            <label className='form-check form-check-custom form-check-sm form-check-solid bg-f7 rounded px-2'>
                              <input
                                type='radio'
                                className='form-check-input border border-gray-400'
                                name='po_match'
                                onChange={({target: {checked}}: any) => {
                                  if (checked) {
                                    setFieldValue('po_match', 0)
                                  }
                                }}
                              />
                              <span className='m-2 cursor-pointer fw-bold text-dark fs-7'>No</span>
                            </label>
                          </div>
                        </div>
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='po_match' />
                        </div>

                        <div className='row mt-10'>
                          <CheckBox
                            name='item_check'
                            col='auto'
                            labelClass='ms-2 ps-2 small gray'
                            options={options?.map(({key, value}: any) => ({
                              value: key?.toString() || '',
                              label: value || '',
                              checked: '',
                            }))}
                            onChange={(e: any) => {
                              const arr: any = e?.map(({value}: any) => value)
                              setFieldValue('item_check', arr as never[])
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className='col-md-6'>
                      <div className='my-3'>
                        <label htmlFor='quantity' className={`${configClass?.label}`}>
                          Quantity
                        </label>
                        <Field
                          min='1'
                          readOnly
                          type='number'
                          name='quantity'
                          placeholder='Enter Quantity'
                          className={configClass?.form}
                          defaultValue={valueValidation(detailPO?.quantity, '')}
                        />
                      </div>
                      <div className='my-3'>
                        <label htmlFor='currency' className={`${configClass?.label}`}>
                          Final Price
                        </label>
                        <div className='row'>
                          <div className='col-md-3'>
                            <Select
                              sm={true}
                              className='col p-0'
                              data={[
                                {
                                  value: valueValidation(detailPO?.currency, ''),
                                  label: valueValidation(detailPO?.currency, ''),
                                },
                                {
                                  value: valueValidation(detailPO?.currency_nego, ''),
                                  label: valueValidation(detailPO?.currency_nego, ''),
                                },
                              ]}
                              name='currency'
                              placeholder={`Select Location`}
                              defaultValue={
                                detailPO?.currency_nego !== null
                                  ? detailPO?.currency_nego
                                  : detailPO?.currency
                              }
                              isClearable={false}
                              isDisabled={true}
                            />
                          </div>
                          <div className='col-md-7'>
                            <Field
                              type='number'
                              name='final_price'
                              placeholder='Enter Final Price'
                              className={configClass?.form}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                      <div className='my-3'>
                        <label htmlFor='description' className={`${configClass?.label}`}>
                          Description
                        </label>
                        <div className={`${configClass?.body}`}>
                          {detailPO?.description !== null ? parse(`${detailPO?.description}`) : '-'}
                        </div>
                      </div>
                      <div className='my-3'>
                        <label htmlFor='delivery_date' className={`${configClass?.label} required`}>
                          Delivery Date
                        </label>
                        <div className='input-group input-group-solid'>
                          <span className='input-group-text pe-0'>
                            <i className='fa fa-calendar-alt text-primary'></i>
                          </span>
                          <Datetime
                            closeOnSelect
                            inputProps={{
                              autoComplete: 'off',
                              className: configClass?.form,
                              name: 'delivery_date',
                              placeholder: 'Select Delivery Date',
                              readOnly: true,
                            }}
                            initialValue={valueValidation(values?.delivery_date, '')}
                            onChange={(e: any) => {
                              const m: any = moment(e).format(defaultDateFormat)
                              setFieldValue('delivery_date', valueValidation(m, ''))
                            }}
                            dateFormat={pref_date}
                            timeFormat={false}
                          />
                          <div className='fv-plugins-message-container invalid-feedback'>
                            <ErrorMessage name='delivery_date' />
                          </div>
                        </div>
                      </div>
                      <div className='my-3'>
                        <label htmlFor='notes' className={`${configClass?.label}`}>
                          Notes
                        </label>
                        <Field
                          as='textarea'
                          name='notes'
                          placeholder='Enter Notes'
                          className={configClass?.form}
                        />
                      </div>
                    </div>

                    <div className='col-md-12'>
                      <DeliveryCheckFile
                        validation={validation}
                        setFieldValue={setFieldValue}
                        files={valueValidation(detailPO?.delivery_file, {})}
                      />
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button className='btn-sm' variant='secondary' onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  disabled={loadingButtonPO}
                  className='btn-sm'
                  type='submit'
                  variant='primary'
                >
                  {!loadingButtonPO && <span className='indicator-label'>Save</span>}
                  {loadingButtonPO && (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Please wait...
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}
                </Button>
              </Modal.Footer>
            </Form>
          )
        }}
      </Formik>
    </Modal>
  )
}

export default DeliveryCheckForm
