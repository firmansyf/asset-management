/* eslint-disable react-hooks/exhaustive-deps */
import 'react-datetime/css/react-datetime.css'

import {Select} from '@components/select/select'
import {ToastMessage} from '@components/toast-message'
import {configClass, errorValidation, hasPermission} from '@helpers'
import {approvalPO, updatePurchaseOrder} from '@pages/purchase-order/Services'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import parse from 'html-react-parser'
import moment from 'moment'
import {FC, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

import RejectForm from './RejectForm'

type PurchaseOrderProps = {
  showModal: any
  setShowModal: any
  setReloadPO: any
  reloadPO: any
  detailPO: any
}

const PurchaseOrderForm: FC<PurchaseOrderProps> = ({
  showModal,
  setShowModal,
  setReloadPO,
  reloadPO,
  detailPO,
}) => {
  const [finalPrice, setFinalPrice] = useState<number>(0)
  const [quantityVal, setQuantityVal] = useState<number>(0)
  const [loadingButtonPO, setloadingButtonPO] = useState<boolean>(false)
  const [showModalReject, setShowModalReject] = useState<boolean>(false)
  const [showForm, setShowForm] = useState<boolean>(false)
  const paymentPermission = hasPermission('purchase-order.approval') || false

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

  const handleOnSubmit = (values: any) => {
    setloadingButtonPO(true)
    if (detailPO?.guid) {
      const {guid} = detailPO || {}
      const params: any = {
        quantity: Number(values?.quantity) || 0,
      }

      updatePurchaseOrder(guid, params)
        .then(({data: {message}}: any) => {
          setShowModal(false)
          setShowForm(false)
          setReloadPO(!reloadPO)
          setloadingButtonPO(false)
          ToastMessage({type: 'success', message})
        })
        .catch(({response}: any) => {
          setloadingButtonPO(false)
          const {data, message} = response?.data || {}
          const {fields} = data || {}
          if (fields !== undefined) {
            const error: any = fields || {}
            for (const key in error) {
              const value: any = error?.[key] || ''
              ToastMessage({type: 'error', message: value?.[0] || ''})
            }
          } else {
            ToastMessage({type: 'error', message})
          }
        })
    }
  }

  const onChangeQuantity = (quantity: any) => {
    setFinalPrice(
      detailPO?.price_nego !== null ? detailPO?.price_nego * quantity : detailPO?.price * quantity
    )
  }

  const PurchaseOrderSchema: any = Yup.object().shape({
    quantity: Yup.number().min(1).required('Quantity is required'),
  })

  const initValues: any = {
    description: detailPO?.description || '-',
    due_date: detailPO?.due_date ? moment(detailPO?.due_date).format('YYYY-MM-DD') : '',
    final_price: finalPrice || '',
    quantity: quantityVal || '',
  }

  const onClose = () => {
    setShowModal(false)
    setShowForm(false)
  }

  const onReject = () => {
    setShowModal(false)
    setShowForm(false)
    setTimeout(() => {
      setShowModalReject(true)
    }, 100)
  }

  const setModalReject = (e: any) => {
    setShowModalReject(e)
    setTimeout(() => {
      setShowModal(!e)
    }, 100)
  }

  const handleApproval = () => {
    setloadingButtonPO(true)
    if (detailPO) {
      const {guid} = detailPO || {}
      approvalPO(guid, {approved: 1})
        .then(({data: {message}}: any) => {
          setShowModal(false)
          setShowForm(false)
          setReloadPO(!reloadPO)
          ToastMessage({type: 'success', message})
        })
        .catch((err: any) => {
          Object.values(errorValidation(err))?.map((message: any) =>
            ToastMessage({type: 'error', message})
          )
        })
        .finally(() => setloadingButtonPO(false))
    }
  }

  return (
    <>
      <Modal dialogClassName='modal-lg' size='lg' show={showForm} onHide={onClose}>
        <Formik
          initialValues={initValues}
          enableReinitialize
          validationSchema={PurchaseOrderSchema}
          onSubmit={handleOnSubmit}
        >
          {({setFieldValue}: any) => {
            return (
              <Form className='justify-content-center' noValidate>
                <Modal.Header>
                  <Modal.Title>Purchase Order</Modal.Title>
                </Modal.Header>
                <Modal.Body className='py-0'>
                  <div className='mt-5 mb-5 h4'>
                    <strong>{detailPO?.po_id || '-'}</strong>
                  </div>

                  <div className='table-asset text-center w-100 mt-5 mb-10'>
                    <table className='table table-border'>
                      <tr className='bg-secondary'>
                        <th className='fw-bolder p-2 border'>Asset ID</th>
                        <th className='fw-bolder p-2 border'>Asset Name</th>
                        <th className='fw-bolder p-2 border'>Category</th>
                      </tr>
                      {detailPO?.asset?.map((item: any, i: number) => {
                        return (
                          <tr key={i}>
                            <td className='border p-3'>{item?.unique_id || ''}</td>
                            <td className='border p-3'>{item?.name || ''}</td>
                            <td className='border p-3'>{item?.category || ''}</td>
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
                        <div className='my-3'>
                          <label htmlFor='description' className={`${configClass?.label}`}>
                            Description
                          </label>
                          <div className={`${configClass?.body}`}>
                            {detailPO?.description !== null
                              ? parse(`${detailPO?.description}`)
                              : '-'}
                          </div>
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='my-3'>
                          <label htmlFor='quantity' className={`${configClass?.label} required`}>
                            Quantity
                          </label>
                          <Field
                            min='1'
                            type='number'
                            name='quantity'
                            defaultValue=''
                            placeholder='Enter Quantity'
                            className={configClass?.form}
                            onChange={({target: {value}}: any) => {
                              setQuantityVal(value || '')
                              onChangeQuantity(value || '')
                              setFieldValue('quantity', value || '')
                            }}
                          />
                          <div className='fv-plugins-message-container invalid-feedback'>
                            <ErrorMessage name='quantity' />
                          </div>
                        </div>
                        <div className='my-3'>
                          <label htmlFor='currency' className={`${configClass?.label}`}>
                            Final Price
                          </label>
                          <div className='row'>
                            <div className='col-md-4'>
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
                            <div className='col-md-6'>
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
                      </div>
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button className='btn-sm' variant='secondary' onClick={onClose}>
                    Cancel
                  </Button>
                  {detailPO?.approved_at !== null && detailPO?.quantity === null && (
                    <Button
                      type='submit'
                      variant='primary'
                      className='btn-sm'
                      disabled={loadingButtonPO}
                    >
                      {!loadingButtonPO && <span className='indicator-label'>Save</span>}
                      {loadingButtonPO && (
                        <span className='indicator-progress' style={{display: 'block'}}>
                          Please wait...
                          <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                        </span>
                      )}
                    </Button>
                  )}
                  {detailPO?.status?.alias === 'Pending Approval RO' &&
                    detailPO?.approved_at === null && (
                      <>
                        <Button
                          type='button'
                          variant='danger'
                          className='btn-sm'
                          onClick={onReject}
                        >
                          Reject
                        </Button>
                        <Button
                          type='button'
                          variant='primary'
                          className='btn-sm'
                          onClick={handleApproval}
                          disabled={loadingButtonPO}
                        >
                          {!loadingButtonPO && <span className='indicator-label'>Approve</span>}
                          {loadingButtonPO && (
                            <span className='indicator-progress' style={{display: 'block'}}>
                              Please wait...
                              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                            </span>
                          )}
                        </Button>
                      </>
                    )}
                  {detailPO?.status?.alias === 'Rejected' && (
                    <Button className='btn-sm' type='button' variant='primary'>
                      Revert
                    </Button>
                  )}
                </Modal.Footer>
              </Form>
            )
          }}
        </Formik>
      </Modal>

      <RejectForm
        detail={detailPO}
        reload={reloadPO}
        setReload={setReloadPO}
        showModal={showModalReject}
        setShowModal={setModalReject}
      />
    </>
  )
}

export default PurchaseOrderForm
