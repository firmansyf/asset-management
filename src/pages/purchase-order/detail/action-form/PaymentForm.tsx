/* eslint-disable react-hooks/exhaustive-deps */
import 'react-datetime/css/react-datetime.css'

import {Select} from '@components/select/select'
import {ToastMessage} from '@components/toast-message'
import {configClass, errorValidation, hasPermission} from '@helpers'
import {updatePurchaseOrderPayment} from '@pages/purchase-order/Services'
import {Field, Form, Formik} from 'formik'
import parse from 'html-react-parser'
import moment from 'moment'
import {FC, Fragment, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

import {PaymentFile} from './PaymentFile'

type PaymentFormProps = {
  showModal: any
  setShowModal: any
  setReloadPO: any
  reloadPO: any
  detailPO: any
}

const PaymentForm: FC<PaymentFormProps> = ({
  showModal,
  setShowModal,
  setReloadPO,
  reloadPO,
  detailPO,
}) => {
  const [validation, setValidation] = useState<any>()
  const [loadingButtonPO, setloadingButtonPO] = useState<boolean>(false)
  const [showForm, setShowForm] = useState<boolean>(false)
  const paymentPermission = hasPermission('purchase-order.payment') || false

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

  const handleOnSubmit = (values: any, actions: any) => {
    setloadingButtonPO(true)
    if (detailPO) {
      const {guid} = detailPO || {}
      const params: any = {
        files: values?.files || [],
      }

      updatePurchaseOrderPayment(guid, params)
        .then(({data: {message}}: any) => {
          setShowModal(false)
          setShowForm(false)
          setReloadPO(reloadPO + 1)
          setloadingButtonPO(false)
          ToastMessage({type: 'success', message})
        })
        .catch((err: any) => {
          setloadingButtonPO(false)
          setValidation(errorValidation(err))
          const {data, message} = err?.response?.data || {}
          const {fields} = data || {}
          if (fields !== undefined) {
            const error = fields || {}
            for (const key in error) {
              const value = error?.[key] || ''
              if (key === 'files') {
                actions.setFieldError('files', 'files is required')
              }
              ToastMessage({type: 'error', message: value?.[0] || ''})
            }
          } else {
            ToastMessage({type: 'error', message})
          }
        })
    }
  }

  const PaymentSchema: any = Yup.object().shape({
    quantity: Yup.string().required('Quantity is required'),
  })

  const initValues: any = {
    description: detailPO?.description || '-',
    due_date: detailPO?.due_date ? moment(detailPO?.due_date).format('YYYY-MM-DD') : '',
    quantity: detailPO?.quantity || '',
    final_price: detailPO?.price * detailPO?.quantity || 0,
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
        validationSchema={PaymentSchema}
        onSubmit={handleOnSubmit}
      >
        {({setFieldValue, errors}: any) => {
          return (
            <Form className='justify-content-center' noValidate>
              <Modal.Header>
                <Modal.Title>Payment</Modal.Title>
              </Modal.Header>
              <Modal.Body className='py-0'>
                <div className='mt-5 mb-5 h4'>
                  <strong>{detailPO?.po_id || '-'}</strong>
                </div>
                <div className='table-asset text-center w-100 mt-5 mb-5'>
                  <table className='table table-border'>
                    <tr className='bg-secondary'>
                      <th className='fw-bolder p-2 border'>Asset ID</th>
                      <th className='fw-bolder p-2 border'>Asset Name</th>
                      <th className='fw-bolder p-2 border'>Category</th>
                    </tr>
                    {detailPO?.asset?.map((item: any, i: number) => {
                      return (
                        <Fragment key={i}>
                          <tr key={i}>
                            <td className='border p-3'>{item?.unique_id || ''}</td>
                            <td className='border p-3'>{item?.name || ''}</td>
                            <td className='border p-3'>{item?.category || ''}</td>
                          </tr>
                        </Fragment>
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
                          isDisabled={true}
                          isClearable={false}
                          placeholder={`Select Location`}
                          defaultValue={detailPO?.location?.name || {}}
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
                          isDisabled={true}
                          isClearable={false}
                          placeholder={`Select Location`}
                          defaultValue={detailPO?.supplier?.guid || {}}
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
                            readOnly
                            type='text'
                            name='due_date'
                            placeholder='Select Due Date'
                            className={configClass?.form}
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
                          defaultValue={detailPO?.quantity || ''}
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
                                  value: detailPO?.currency || '',
                                  label: detailPO?.currency || '',
                                },
                                {
                                  value: detailPO?.currency_nego || '',
                                  label: detailPO?.currency_nego || '',
                                },
                              ]}
                              name='currency'
                              isDisabled={true}
                              isClearable={false}
                              placeholder={`Select Location`}
                              defaultValue={
                                detailPO?.currency_nego !== null
                                  ? detailPO?.currency_nego
                                  : detailPO?.currency
                              }
                            />
                          </div>
                          <div className='col-md-7'>
                            <Field
                              readOnly
                              type='number'
                              name='final_price'
                              placeholder='Enter Final Price'
                              className={configClass?.form}
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
                    </div>

                    <div className='col-md-12'>
                      <PaymentFile
                        validation={validation}
                        configClass={configClass}
                        setFieldValue={setFieldValue}
                        files={detailPO?.delivery_file || {}}
                      />
                      {errors?.files && (
                        <div className='fv-plugins-message-container mt-0 invalid-feedback'>
                          Upload Payment Files is required
                        </div>
                      )}
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

export default PaymentForm
