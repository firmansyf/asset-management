import 'react-datetime/css/react-datetime.css'

import {Select as Ajax} from '@components/select/ajax'
import {Select} from '@components/select/select'
import {configClass, preferenceDate} from '@helpers'
import {Field, Form, Formik} from 'formik'
import moment from 'moment'
import {FC, memo, useEffect, useMemo, useState} from 'react'
import {Button, Modal, OverlayTrigger, Tooltip} from 'react-bootstrap'
import Datetime from 'react-datetime'
import {shallowEqual, useSelector} from 'react-redux'
import * as Yup from 'yup'

import {checkRONumber, getROStatusOption} from '../Service'

let AddRONumber: FC<any> = ({
  showModal,
  setShowModal,
  id,
  setShowData,
  data,
  incidentTimestamp,
}) => {
  const pref_date = preferenceDate()
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {currency} = preferenceStore || {}

  const validationSchema = Yup.object().shape({
    ro_number: Yup.string().required('This RO Number is required'),
    invoice_date: Yup.string().test({
      name: 'invoice_date',
      test: function () {
        const {invoice_date} = this.parent || {}

        if (incidentTimestamp !== '1970-01-01 07:00:00') {
          const currentDate = moment(invoice_date).format('YYYY-MM-DD')
          const IncidentDate = moment(incidentTimestamp).format('YYYY-MM-DD')

          if (
            invoice_date !== undefined &&
            currentDate !== '1970-01-01' &&
            moment(currentDate).isBefore(IncidentDate)
          ) {
            return this.createError({
              message: `Invoice Date should be after Incident Date and Time`,
            })
          }
        }
        return true
      },
    }),
  })

  const [messageRONumber, setMessageRONumber] = useState<any>([])
  const [invoiceDate, setInvoiceDate] = useState<any>()
  const [optCurrency, setOptCurrency] = useState([])
  const [, setCurrency] = useState<any>('')

  const initialValues = useMemo(() => {
    if (
      moment(data?.invoice_date)
        .format('YYYY-MM-DD')
        .toString()
        .toLowerCase() !== '1970-01-01' &&
      moment(data?.invoice_date)
        .toString()
        .toLowerCase() !== 'invalid date' &&
      data?.invoice_date !== 'N/A' &&
      data?.invoice_date !== '' &&
      data?.invoice_date !== null &&
      data?.invoice_date !== undefined
    ) {
      setInvoiceDate(new Date(data?.invoice_date))
    } else {
      setInvoiceDate('')
    }

    if (data) {
      return {
        ...data,
        currency: 'MYR',
        invoice_amount:
          data?.invoice_amount?.toString()?.split(' ')?.length > 1
            ? data?.invoice_amount?.toString()?.split(' ')[1]
            : data?.invoice_amount || 0,
        invoice_date: data?.invoice_date ? new Date(data?.invoice_date) : '',
      }
    } else {
      return {}
    }
  }, [data])

  useEffect(() => {
    if (currency?.length > 0) {
      const res = currency?.map((e: any) => {
        return {
          ...e,
          value: e?.key + ' - ' + e?.value?.split('-')?.[0],
        }
      })
      setOptCurrency(res?.map(({key: value, value: label}: any) => ({value, label})))
    }
  }, [currency])

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(values: any) => {
          const payload: any = {
            ...values,
            invoice_amount: values?.invoice_amount || null,
            invoice_number: values?.invoice_number || null,
            ro_number: values?.ro_number || null,
            ro_status: values?.ro_status || null,
            vendor_name: values?.vendor_name || null,
            invoice_date:
              moment(invoiceDate)?.toString()?.toLowerCase() !== 'invalid date'
                ? moment(invoiceDate).format('YYYY-MM-DD')
                : '',
          }
          setShowData(payload)
          setShowModal(false)
        }}
      >
        {({setFieldValue, errors}: any) => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header closeButton>
              <Modal.Title>Add RO Number</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='mt-2'>
                <label className={`${configClass.label} required`}>RO Number</label>
                <Field
                  type='text'
                  name='ro_number'
                  onInput={({target}: any) => {
                    const {value} = target
                    setFieldValue('ro_number', value)

                    if (value !== '') {
                      checkRONumber(id, value)
                        .then(() => {
                          setMessageRONumber([])
                        })
                        .catch((err: any) => {
                          setMessageRONumber(err)
                        })
                    } else {
                      setMessageRONumber([])
                    }
                  }}
                  placeholder='Enter RO Number'
                  className={configClass?.form}
                  style={{width: !Array.isArray(messageRONumber) ? '92%' : '100%'}}
                />
                {!Array.isArray(messageRONumber) && (
                  <OverlayTrigger
                    placement='top'
                    delay={{show: 250, hide: 400}}
                    overlay={(props: any) => (
                      <Tooltip
                        id='tooltip'
                        className={{position: 'relative', zIndex: '1151 !important'}}
                        {...props}
                      >
                        {messageRONumber?.response?.data?.message} in following case :{' '}
                        {messageRONumber?.response?.data?.data?.case_ids}
                      </Tooltip>
                    )}
                  >
                    <i
                      className='fas fa-exclamation-circle ms-2 fs-1'
                      style={{float: 'right', marginTop: '-31px'}}
                    ></i>
                  </OverlayTrigger>
                )}

                {errors.ro_number && (
                  <div className='fv-plugins-message-container invalid-feedback'>
                    {errors.ro_number}
                  </div>
                )}
              </div>
              <div className='mt-2'>
                <label className={`${configClass.label} mt-2`}>RO Status</label>
                <Ajax
                  sm={true}
                  className='col p-0'
                  id='seletROStatus'
                  name='ro_status'
                  api={getROStatusOption}
                  params={false}
                  reload={false}
                  isClearable={true}
                  placeholder='Select RO Status'
                  defaultValue={{
                    value: data?.ro_status?.guid,
                    label: data?.ro_status?.name,
                  }}
                  onChange={(e: any) => {
                    setFieldValue('ro_status', e || {value: '', label: ''})
                  }}
                  parse={(e: any) => {
                    return {
                      value: e.guid,
                      label: e.name,
                    }
                  }}
                />
              </div>
              <div className='mt-2'>
                <label className={`${configClass.label} mt-2`}>Invoice Amount</label>
                <div className='input-group input-group-solid'>
                  <Select
                    name='currency'
                    placeholder='Currency'
                    defaultValue={
                      data?.invoice_amount?.toString()?.split(' ')?.length > 1
                        ? data?.invoice_amount?.toString()?.split(' ')?.[0]
                        : 'MYR'
                    }
                    onChange={({value}: any) => {
                      setCurrency(value)
                    }}
                    data={optCurrency}
                  />
                  <Field
                    type='number'
                    name='invoice_amount'
                    placeholder='Enter Amount'
                    className={configClass?.form}
                  />
                </div>
              </div>
              <div className='mt-2'>
                <label className={`${configClass.label} mt-2`}>Invoice Number</label>
                <Field
                  type='text'
                  name='invoice_number'
                  placeholder='Enter Number'
                  className={configClass?.form}
                />
              </div>
              <div className='mt-2'>
                <label className={`${configClass.label} mt-2`}>Invoice Date</label>
                <Datetime
                  closeOnSelect
                  inputProps={{
                    autoComplete: 'off',
                    className: configClass?.form,
                    name: 'invoice_date',
                    placeholder: 'Enter Invoice Date',
                  }}
                  onChange={(e: any) => {
                    setInvoiceDate(e)
                    setFieldValue('invoice_date', e)
                  }}
                  value={invoiceDate}
                  dateFormat={pref_date}
                  timeFormat={false}
                />
              </div>
              <div className='fv-plugins-message-container invalid-feedback'>
                {errors.invoice_date && (
                  <div className='fv-plugins-message-container invalid-feedback'>
                    {errors.invoice_date}
                  </div>
                )}
              </div>
              <div className='mt-2'>
                <label className={`${configClass.label} mt-2`}>Vendor</label>
                <Field
                  type='text'
                  name='vendor_name'
                  placeholder='Enter Vendor Name'
                  className={configClass?.form}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className='btn-sm' variant='secondary' onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                Done
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

AddRONumber = memo(
  AddRONumber,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default AddRONumber
