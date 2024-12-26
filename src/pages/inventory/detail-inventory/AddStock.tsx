import 'react-datetime/css/react-datetime.css'

import {getLocationV1} from '@api/Service'
import {getUserV1} from '@api/UserCRUD'
import {Select as SelectAjax} from '@components/select/ajax'
import {Select} from '@components/select/select'
import {ToastMessage} from '@components/toast-message'
import {configClass, errorExpiredToken, preferenceDate} from '@helpers'
import {getSupplier} from '@pages/setup/settings/supplier/Service'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import Datetime from 'react-datetime'
import {shallowEqual, useSelector} from 'react-redux'
import * as Yup from 'yup'

import {sendAddStock} from '../redux/InventoryCRUD'

let AddStock: FC<any> = ({
  showModal,
  setShowModal,
  reloadAddStock,
  setReloadAddStock,
  detailInventory,
  reserved,
}) => {
  const pref_date = preferenceDate()
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {currency, preference} = preferenceStore || {}
  const [loading, setLoading] = useState<boolean>(false)
  const [optLocationDetail, setOptLocationDetail] = useState<any>([])
  const [optCurrency, setOptCurrency] = useState<any>([])
  const [purchaseDate, setPurchaseDate] = useState<any>()
  const [totalPrice, setTotalPrice] = useState<any>()
  const [quantityPrice, setQuantityPrice] = useState<any>()
  const [unitPrice, setUnitPrice] = useState<any>()
  const [locationTotal, setLocationTotal] = useState<number>(0)
  const [preferenceCurrency, setPreferenceCurrency] = useState<any>()

  const validationSchema = Yup.object().shape({
    location_guid: Yup.mixed()
      .test('location_guid', 'Location is required', (e: any) => e?.value || typeof e === 'string')
      .nullable(),
  })

  const handleSubmit = (value: any) => {
    setLoading(true)
    const params = {
      description: value?.description,
      quantity: value?.quantity,
      price_per_unit: value?.priceUnit,
      purchase_date: value?.purchase_date,
      location_guid: value?.location_guid,
      supplier_guid: value?.supplier_guid,
      user_guid: value?.user_guid,
    }

    sendAddStock(params, detailInventory?.guid)
      .then((res: any) => {
        ToastMessage({message: res?.data?.message, type: 'success'})
        setLoading(false)
        setShowModal(false)
        setReloadAddStock(reloadAddStock + 1)
        setQuantityPrice('')
        setUnitPrice('')
        setPurchaseDate('')
        setTotalPrice(0)
      })
      .catch((err: any) => {
        errorExpiredToken(err)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (detailInventory) {
      setOptLocationDetail(detailInventory?.quantity_by_location)
    }
  }, [detailInventory])

  useEffect(() => {
    if (currency) {
      const res = currency.map((e: any) => {
        return {
          ...e,
          value: e?.key + ' - ' + e?.value.split('-')?.[0],
        }
      })
      setOptCurrency(res.map(({key: value, value: label}: any) => ({value, label})))
    }
  }, [currency])

  useEffect(() => {
    if (Object.keys(preference || {})?.length > 0) {
      const cekCurrency: any = optCurrency?.filter(({value}: any) => value === preference?.currency)
      if (cekCurrency?.length > 0) {
        Array.isArray(cekCurrency) && setPreferenceCurrency(cekCurrency[0])
      } else {
        Array.isArray(optCurrency) && setPreferenceCurrency(optCurrency[0])
      }
    }
  }, [optCurrency, preference])

  useEffect(() => {
    setQuantityPrice('')
    setUnitPrice('')
    setPurchaseDate('')
    setTotalPrice(0)
  }, [showModal])

  return (
    <Modal
      dialogClassName='modal-md'
      show={showModal}
      onHide={() => {
        setLocationTotal(0)
        setShowModal(false)
      }}
    >
      <Formik
        initialValues={{
          quantity: quantityPrice,
          priceUnit: unitPrice,
          location_guid: '',
          supplier_guid: '',
          user_guid: '',
          purchase_date: purchaseDate,
          description: '',
          totalPrice: totalPrice,
        }}
        validationSchema={validationSchema}
        enableReinitialize={!showModal}
        onSubmit={handleSubmit}
      >
        {({setFieldValue}) => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>Add Stock Inventory</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='mt-2'>
                <label htmlFor='location_guid' className={`${configClass?.label} required`}>
                  Location
                </label>
                <SelectAjax
                  sm={true}
                  id='select-location'
                  className='col p-0'
                  api={getLocationV1}
                  params={{orderCol: 'name', orderDir: 'asc'}}
                  reload={false}
                  isClearable={false}
                  placeholder='Choose Location'
                  onChange={(e: any) => {
                    const {value}: any = e || {}
                    const quantityByLocation: any =
                      !!optLocationDetail &&
                      optLocationDetail.find((find: any) => find?.location_guid === value)
                    let qty: any = quantityByLocation?.quantity || 0
                    if (quantityByLocation) {
                      const availableQty: any = reserved
                        ?.filter(
                          ({location_guid}: any) =>
                            location_guid === quantityByLocation?.location_guid
                        )
                        ?.map(({quantity}: any) => quantity || 0)

                      const qtyAv =
                        availableQty?.length > 0
                          ? availableQty?.reduce((a: any, b: any) => a + b)
                          : 0
                      qty = qty - qtyAv
                    }
                    setFieldValue('location_guid', value)
                    setLocationTotal(qty || 0)
                  }}
                  parse={({guid, name}: any) => {
                    return {
                      value: guid,
                      label: name,
                    }
                  }}
                />
                <div className='fv-plugins-message-container invalid-feedback'>
                  <ErrorMessage name='location_guid' />
                </div>
              </div>

              <div className='mt-2'>
                <label htmlFor='quantity' className={`${configClass?.label} pt-6`}>
                  Intial Stock Quantity
                </label>
                <label htmlFor='' className={configClass?.label} style={{float: 'right'}}>
                  Location Total : {locationTotal}
                </label>
                <Field
                  name='quantity'
                  type='text'
                  placeholder='Enter Quantity'
                  className={configClass?.form}
                  onChange={({target: {value}}: any) => {
                    value = value?.replace(/\D/g, '')
                    const calculate: any = Number(value) * Number(unitPrice)
                    setFieldValue('quantity', value)
                    setQuantityPrice(value)
                    setTotalPrice(calculate)
                  }}
                />
              </div>

              <div className='mt-4'>
                <label htmlFor='priceUnit' className={`${configClass?.label} required`}>
                  Price per Unit
                </label>
                <div className='d-flex input-group input-group-solid'>
                  <Select
                    className={'w-auto h-auto ms-2'}
                    name='currency_price'
                    placeholder='Enter Currency'
                    data={optCurrency}
                    defaultValue={preferenceCurrency?.value}
                    isClearable={false}
                    onChange={({value}: any) => {
                      setFieldValue('currency_price', value)
                    }}
                  />
                  <Field
                    name='priceUnit'
                    type='text'
                    placeholder='Enter Price per Unit'
                    className={configClass?.form}
                    onChange={({target: {value}}: any) => {
                      value = value?.replace(/\D/g, '')
                      const calculate: any = Number(value) * Number(quantityPrice)

                      setFieldValue('priceUnit', value)
                      setUnitPrice(value)
                      setTotalPrice(calculate)
                    }}
                  />
                </div>
              </div>

              <div className='mt-4'>
                <label htmlFor='totalPrice' className={`${configClass?.label}`}>
                  Total Price
                </label>
                <Field
                  name='totalPrice'
                  type='text'
                  placeholder='Total Price'
                  className={configClass?.form}
                  value={totalPrice}
                  readOnly
                />
              </div>

              <div className='mt-4'>
                <label htmlFor='supplier_guid' className={`${configClass?.label}`}>
                  Supplier
                </label>
                <SelectAjax
                  sm={true}
                  id='select-supplier'
                  className='col p-0'
                  api={getSupplier}
                  params={{orderCol: 'name', orderDir: 'asc'}}
                  reload={false}
                  placeholder='Choose Supplier'
                  onChange={(e: any) => {
                    setFieldValue('supplier_guid', e?.value)
                  }}
                  parse={({guid, name}: any) => {
                    return {
                      value: guid,
                      label: name,
                    }
                  }}
                />
              </div>

              <div className='mt-4'>
                <label htmlFor='user_guid' className={`${configClass?.label}`}>
                  Ordered By
                </label>
                <SelectAjax
                  sm={true}
                  id='select-supplier'
                  className='col p-0'
                  api={getUserV1}
                  params={{orderCol: 'first_name', orderDir: 'asc'}}
                  reload={false}
                  placeholder='Select User'
                  onChange={(e: any) => {
                    setFieldValue('user_guid', e?.value || '')
                  }}
                  parse={(e: any) => {
                    return {
                      value: e?.guid,
                      label: e?.first_name + ' ' + e?.last_name,
                    }
                  }}
                />
              </div>

              <div className='mt-4'>
                <label htmlFor='purchase_date' className={`${configClass?.label}`}>
                  Purchase Date
                </label>
                <div className='input-group input-group-solid'>
                  <span className='input-group-text pe-0'>
                    <i className='fa fa-calendar-alt'></i>
                  </span>
                  <Datetime
                    closeOnSelect
                    inputProps={{
                      autoComplete: 'off',
                      className: configClass?.form,
                      name: 'purchase_date',
                      placeholder: 'Purchase Date',
                    }}
                    onChange={(e: any) => {
                      const m = moment(e).format('YYYY-MM-DD')
                      setFieldValue('purchase_date', m)
                      setPurchaseDate(m)
                    }}
                    value={purchaseDate}
                    dateFormat={pref_date}
                    timeFormat={false}
                  />
                </div>
              </div>

              <div className='mt-4'>
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
            </Modal.Body>
            <Modal.Footer>
              <Button disabled={loading} className='btn-sm' type='submit' variant='primary'>
                {!loading && <span className='indicator-label'>Save</span>}
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
                  setLocationTotal(0)
                  setShowModal(false)
                }}
              >
                Cancel
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

AddStock = memo(AddStock, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export {AddStock}
