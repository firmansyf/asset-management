import {addCustomer, editCustomer} from '@api/customer'
import {ToastMessage} from '@components/toast-message'
import {configClass, errorExpiredToken} from '@helpers'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal, Tab, Tabs} from 'react-bootstrap'
import {shallowEqual, useSelector} from 'react-redux'
import * as Yup from 'yup'

const CustomerSchema = Yup.object().shape({
  name: Yup.string().required('Customer name is required.'),
  phone_number: Yup.string()
    .min(10, ({min}) => `Minimum length is ${min} characters of number format`)
    .max(16, ({max}) => `Maximum length is ${max} characters of number format`)
    .matches(/^(\+)?([ 0-9]){10,16}$/g, 'Phone number is not valid'),
})

interface CustomerTypes {
  name: string
  address: string
  phone_number: string
  phone_code: string
  website: string
  email: string
  type: string
  description: string
  billing_name: string
  billing_address_line_1: string
  billing_address_line_2: string
  billing_address_line_3: string
  currency: string
}

type ModalAddCustomerProps = {
  showModal: any
  setShowModal: any
  setReloadCustomer: any
  reloadCustomer: any
  detailCustomer: any
  currency: any
  preference: any
}

let ModalAddCustomer: FC<ModalAddCustomerProps> = ({
  showModal,
  setShowModal,
  setReloadCustomer,
  reloadCustomer,
  detailCustomer,
  currency,
  preference,
}) => {
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {phone_code: dataPhoneCode}: any = preferenceStore || {}

  const [loadingCustomer, setLoadingCustomer] = useState(false)
  const [phoneCode, setPhoneCode] = useState<any>([])

  const handleOnSubmit = (values: CustomerTypes, actions: any) => {
    setLoadingCustomer(true)
    const params = {
      name: values.name,
      address: values.address,
      phone_number:
        values.phone_code && values.phone_number
          ? `${values.phone_code} ${values.phone_number}`
          : '',
      website: values.website,
      email: values.email,
      type: values.type,
      description: values.description,
      billing_name: values.billing_name,
      billing_address_line_1: values.billing_address_line_1,
      billing_address_line_2: values.billing_address_line_2,
      billing_address_line_3: values.billing_address_line_3,
      currency: values.currency,
    }
    if (detailCustomer) {
      editCustomer(params, detailCustomer?.guid)
        .then((res: any) => {
          setLoadingCustomer(false)
          setShowModal(false)
          setReloadCustomer(reloadCustomer + 1)
          ToastMessage({type: 'success', message: res?.data?.message})
        })
        .catch((err: any) => {
          errorExpiredToken(err)
          setLoadingCustomer(false)
          const {data} = err?.response?.data
          ToastMessage({type: 'error', message: err?.response?.data?.data?.message})
          actions.setFieldError('phone_number', data.fields.phone_number)
          actions.setFieldError('website', data.fields.website)
          actions.setFieldError('email', data.fields.email)
        })
    } else {
      addCustomer(params)
        .then((res: any) => {
          setLoadingCustomer(false)
          setShowModal(false)
          setReloadCustomer(reloadCustomer + 1)
          ToastMessage({type: 'success', message: res?.data?.message})
        })
        .catch((err: any) => {
          setLoadingCustomer(false)
          const {data} = err?.response?.data
          ToastMessage({type: 'error', message: err?.response?.data?.data?.message})
          actions.setFieldError('phone_number', data.fields.phone_number)
          actions.setFieldError('website', data.fields.website)
          actions.setFieldError('email', data.fields.email)
        })
    }
  }

  useEffect(() => {
    if (showModal && dataPhoneCode) {
      setPhoneCode(dataPhoneCode as never[])
    }
  }, [showModal, setPhoneCode, dataPhoneCode])

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik
        initialValues={{
          name: detailCustomer?.name || '',
          address: detailCustomer?.address || '',
          phone_number:
            detailCustomer !== undefined && detailCustomer?.phone_number !== null
              ? detailCustomer?.phone_number.split(' ')[1]
              : '',
          phone_code:
            detailCustomer !== undefined && detailCustomer?.phone_number !== null
              ? detailCustomer?.phone_number?.split(' ')?.[0]
              : preference?.phone_code,
          website: detailCustomer?.website || '',
          email: detailCustomer?.email || '',
          type: detailCustomer?.type || '',
          description: detailCustomer?.description || '',
          billing_name: detailCustomer?.billing_name || '',
          billing_address_line_1: detailCustomer?.billing_address_line_1 || '',
          billing_address_line_2: detailCustomer?.billing_address_line_2 || '',
          billing_address_line_3: detailCustomer?.billing_address_line_3 || '',
          currency: detailCustomer?.currency || '',
        }}
        validationSchema={CustomerSchema}
        enableReinitialize
        onSubmit={handleOnSubmit}
      >
        {() => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>{detailCustomer ? 'Edit' : 'Add New'} Customer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Tabs defaultActiveKey='first'>
                <Tab eventKey='first' title='Customer Information'>
                  <div className='mt-10'>
                    <div className='col-md-12 mb-8'>
                      <label htmlFor='name' className='mb-2 required'>
                        Customer Name
                      </label>
                      <Field
                        type='text'
                        name='name'
                        placeholder='Enter Customer Name'
                        className={configClass?.form}
                      />
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <ErrorMessage name='name' />
                      </div>
                    </div>
                    <div className='col-md-12 mb-8'>
                      <label htmlFor='address' className='mb-2'>
                        Customer Address
                      </label>
                      <Field
                        name='address'
                        as='textarea'
                        type='text'
                        placeholder='Enter Customer Address'
                        className={configClass?.form}
                      />
                    </div>
                    <div className='col-md-12 mb-8'>
                      <label htmlFor='phone_code' className='mb-2'>
                        Phone Number
                      </label>
                      <div className='input-group input-group-solid'>
                        {phoneCode?.length > 0 && (
                          <Field
                            as='select'
                            name='phone_code'
                            placeholder='Enter Country Code'
                            className={configClass?.select}
                          >
                            {phoneCode?.map(({key, label}: any, index: number) => {
                              return (
                                <option key={index} value={key}>
                                  {label}(+{key})
                                </option>
                              )
                            })}
                          </Field>
                        )}
                        <Field
                          name='phone_number'
                          type='number'
                          placeholder='Enter Customer Phone Number'
                          className={`${configClass?.form} w-auto`}
                        />
                      </div>
                    </div>
                    <div className='col-md-12 mb-8'>
                      <label htmlFor='website' className='mb-2'>
                        Customer Website
                      </label>
                      <Field
                        type='text'
                        name='website'
                        placeholder='Enter Customer Website'
                        className={configClass?.form}
                      />
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <ErrorMessage name='website' />
                      </div>
                    </div>
                    <div className='col-md-12 mb-8'>
                      <label htmlFor='email' className='mb-2'>
                        Customer Email
                      </label>
                      <Field
                        type='text'
                        name='email'
                        placeholder='Enter Customer Email'
                        className={configClass?.form}
                      />
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <ErrorMessage name='email' />
                      </div>
                    </div>
                    <div className='col-md-12 mb-8'>
                      <label htmlFor='email' className='mb-2'>
                        Customer Type
                        <span style={{fontSize: 10}}>e.g. (plumbing, electrical)</span>
                      </label>
                      <Field
                        type='text'
                        name='type'
                        placeholder='Enter Customer Type'
                        className={configClass?.form}
                      />
                    </div>
                    <div className='col-md-12 mb-8'>
                      <label htmlFor='description' className='mb-2'>
                        Customer Description
                      </label>
                      <Field
                        type='text'
                        name='description'
                        placeholder='Enter Customer Description'
                        className={configClass?.form}
                      />
                    </div>
                  </div>
                </Tab>
                <Tab eventKey='second' title='Billing Information'>
                  <div className='mt-10'>
                    <div className='col-md-12 mb-8'>
                      <label htmlFor='billing_name' className='mb-2'>
                        Name
                      </label>
                      <Field
                        type='text'
                        name='billing_name'
                        placeholder='Enter Business Name'
                        className={configClass?.form}
                      />
                    </div>
                    <div className='col-md-12 mb-8'>
                      <label htmlFor='billing_address_line_1' className='mb-2'>
                        Address Line 1
                      </label>
                      <Field
                        name='billing_address_line_1'
                        as='textarea'
                        type='text'
                        placeholder='Enter Address'
                        className={configClass?.form}
                      />
                    </div>
                    <div className='col-md-12 mb-8'>
                      <label htmlFor='billing_address_line_2' className='mb-2'>
                        Address Line 2
                      </label>
                      <Field
                        name='billing_address_line_2'
                        as='textarea'
                        type='text'
                        placeholder='Enter Address'
                        className={configClass?.form}
                      />
                    </div>
                    <div className='col-md-12 mb-8'>
                      <label htmlFor='billing_address_line_3' className='mb-2'>
                        Address Line 3
                      </label>
                      <Field
                        name='billing_address_line_3'
                        as='textarea'
                        type='text'
                        placeholder='Enter Address'
                        className={configClass?.form}
                      />
                    </div>
                    <div className='col-md-12 mb-5'>
                      <label className={`${configClass?.label} col-lg-5`}>Currency</label>
                      <Field
                        as='select'
                        className={configClass?.select}
                        name='currency'
                        type='text'
                      >
                        <option value=''>Select Currency</option>
                        {currency?.map((item: any, index: number) => {
                          return (
                            <option key={index} value={item?.value}>
                              {item.label}
                            </option>
                          )
                        })}
                      </Field>
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <ErrorMessage name='country' />
                      </div>
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </Modal.Body>
            <Modal.Footer>
              <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                {!loadingCustomer && (
                  <span className='indicator-label'>{loadingCustomer ? 'Save' : 'Add'}</span>
                )}
                {loadingCustomer && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </Button>
              <Button className='btn-sm' variant='secondary' onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

ModalAddCustomer = memo(
  ModalAddCustomer,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)

export default ModalAddCustomer
