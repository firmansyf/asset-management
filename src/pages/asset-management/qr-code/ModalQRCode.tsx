import {
  ClearIndicator,
  customStyles,
  DropdownIndicator,
  MultiValueRemove,
} from '@components/select/config'
import {ToastMessage} from '@components/toast-message'
import {configClass, errorValidation} from '@helpers'
import {Field, Form, Formik} from 'formik'
import {FC, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import Select from 'react-select'

import {generateQRCode} from '../redux/AssetRedux'

type QRProps = {
  showModal?: any
  setShowModal?: any
}

const ModalQRCode: FC<QRProps> = ({showModal, setShowModal}) => {
  const [loadingCategory, setLoadingLocation] = useState<boolean>(false)

  const handleSubmit = (values: any) => {
    const params: any = {
      quantity: values?.QtyQrcode || 1,
      size: values?.size || '',
    }
    setLoadingLocation(true)
    generateQRCode(params)
      .then(({data: {message, url}}: any) => {
        setShowModal(false)
        setLoadingLocation(false)
        ToastMessage({type: 'success', message})
        setTimeout(() => {
          window.open(url, '_blank')
        }, 1000)
      })
      .catch((err: any) => {
        setLoadingLocation(false)
        Object.values(errorValidation(err)).forEach((message: any) =>
          ToastMessage({type: 'error', message})
        )
      })
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik
        initialValues={{
          QtyQrcode: false,
          size: '',
        }}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({values, setFieldValue}: any) => {
          return (
            <Form className='justify-content-center' noValidate>
              <Modal.Header>
                <Modal.Title>QR Code</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className=''>
                  <div className='form-group row align-items-center mb-4'>
                    <div className='col-lg-4'>
                      <label htmlFor='QtyQrcode' className={`${configClass.label}`}>
                        Quantity of QR Codes
                      </label>
                    </div>
                    <div className='col-lg-8'>
                      <Field
                        name='QtyQrcode'
                        type='number'
                        placeholder='Enter Quantity of QR Codes'
                        className={configClass?.form}
                        min='0'
                      />
                    </div>
                  </div>

                  <div className='form-group row align-items-center mb-4'>
                    <div className='col-lg-4'>
                      <label htmlFor='size' className={`${configClass.label}`}>
                        Size
                      </label>
                    </div>
                    <div className='col-lg-8'>
                      <Select
                        name='size'
                        placeholder='Select Size'
                        styles={customStyles(true, {})}
                        components={{ClearIndicator, DropdownIndicator, MultiValueRemove}}
                        options={[
                          {value: 'small', label: 'Small'},
                          {value: 'medium', label: 'Medium'},
                          {value: 'big', label: 'Large'},
                        ]}
                        defaultValue={values?.size}
                        onChange={({value}: any) => {
                          setFieldValue('size', value || '')
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                  {!loadingCategory && <span className='indicator-label'>Generate</span>}
                  {loadingCategory && (
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
          )
        }}
      </Formik>
    </Modal>
  )
}

export default ModalQRCode
