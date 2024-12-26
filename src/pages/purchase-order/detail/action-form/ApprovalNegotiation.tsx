/* eslint-disable react-hooks/exhaustive-deps */
import {getCurrency} from '@api/preference'
import {Select as SelectAjax} from '@components/select/ajax'
import {Select} from '@components/select/select'
import {ToastMessage} from '@components/toast-message'
import {configClass, errorValidation, hasPermission} from '@helpers'
import {approvalPO} from '@pages/purchase-order/Services'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import moment from 'moment'
import {FC, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {shallowEqual, useSelector} from 'react-redux'

import RejectForm from './RejectForm'

type Props = {
  showModal: any
  setShowModal: any
  detailPO: any
  setReloadPO: any
  reloadPO: any
}

const ApprovalNegotiation: FC<Props> = ({
  showModal,
  setShowModal,
  detailPO,
  setReloadPO,
  reloadPO,
}) => {
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {preference: dataPreference}: any = preferenceStore || {}

  const [loading, setLoading] = useState<boolean>(false)
  const [finalPrice, setFinalPrice] = useState<number>(0)
  const [quantityVal, setQuantityVal] = useState<number>(0)
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

  const onSubmit = () => {
    setLoading(true)
    if (detailPO?.guid) {
      approvalPO(detailPO?.guid, {approved: 1})
        .then(({data: {message}}: any) => {
          ToastMessage({type: 'success', message})
          setShowModal(false)
          setShowForm(false)
          setReloadPO(reloadPO + 1)
        })
        .catch((err: any) => {
          Object.values(errorValidation(err))?.map((message: any) =>
            ToastMessage({type: 'error', message})
          )
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  const onChangeQuantity = (quantity: any) => {
    setFinalPrice(
      detailPO?.price_nego !== null ? detailPO?.price_nego * quantity : detailPO?.price * quantity
    )
  }

  const onClose = () => {
    setShowModal(false)
    setShowForm(false)
  }

  const onReject = () => {
    setShowModal(false)
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
  const initValues: any = {
    description: detailPO?.description || '-',
    due_date: detailPO?.due_date ? moment(detailPO?.due_date).format('YYYY-MM-DD') : '',
    final_price: finalPrice || '',
    quantity: quantityVal || '',
  }

  return (
    <>
      <Modal dialogClassName='modal-lg' show={showForm} onHide={onClose}>
        <Formik initialValues={initValues} enableReinitialize onSubmit={onSubmit}>
          {({setFieldValue}: any) => {
            return (
              <Form className='justify-content-center' noValidate>
                <Modal.Header>
                  <Modal.Title>Negotiation</Modal.Title>
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
                          <label htmlFor='description' className={`${configClass?.label}`}>
                            Description
                          </label>
                          <div className={`${configClass?.body}`}>
                            {detailPO?.description || '-'}
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
                            defaultValue={''}
                            placeholder='Enter Quantity'
                            className={configClass?.form}
                            onChange={({target: {value}}: any) => {
                              onChangeQuantity(value || '')
                              setQuantityVal(value || '')
                              setFieldValue('quantity', value || '')
                            }}
                          />
                          <div className='fv-plugins-message-container invalid-feedback'>
                            <ErrorMessage name='quantity' />
                          </div>
                        </div>

                        <div className='my-3'>
                          <label htmlFor='currency' className={`${configClass?.label}`}>
                            Price
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
                            <div className='col-md-6'>
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

                        <div className='my-2 mx-2'>
                          <label htmlFor='currency' className={`${configClass?.label}`}>
                            Negotiation Price
                          </label>
                          <div className='row'>
                            <div className='d-flex input-group input-group-solid'>
                              <SelectAjax
                                sm={true}
                                className='col-3'
                                id='currency_nego'
                                name='currency_nego'
                                api={getCurrency}
                                params={false}
                                reload={false}
                                placeholder='Currency'
                                defaultValue={{
                                  value: detailPO?.currency_nego || dataPreference?.currency || '',
                                  label: detailPO?.currency_nego || dataPreference?.currency || '',
                                }}
                                onChange={({value}: any) => {
                                  setFieldValue('currency_nego', value || '')
                                }}
                                parse={({key: value, key: label}: any) => ({value, label})}
                              />
                              <Field
                                type='number'
                                name='price_nego'
                                className={configClass?.form}
                                placeholder='Price'
                                autoComplete='off'
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
                  <Button className='btn-sm' type='button' variant='danger' onClick={onReject}>
                    Reject
                  </Button>
                  <Button className='btn-sm' type='submit' variant='primary'>
                    {!loading && <span className='indicator-label'>Approve</span>}
                    {loading && (
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

      <RejectForm
        showModal={showModalReject}
        setShowModal={setModalReject}
        detail={detailPO}
        reload={reloadPO}
        setReload={setReloadPO}
      />
    </>
  )
}

export default ApprovalNegotiation
