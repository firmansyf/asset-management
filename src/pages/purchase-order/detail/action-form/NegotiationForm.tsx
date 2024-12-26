import {getCurrency} from '@api/preference'
import {Select} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {configClass} from '@helpers'
import {updatePONegotiation} from '@pages/purchase-order/Services'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {FC, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {shallowEqual, useSelector} from 'react-redux'

type Props = {
  showModal: any
  setShowModal: any
  detail: any
  reloadPO: any
  setReloadPO: any
}
const NegotiationForm: FC<Props> = ({showModal, setShowModal, detail, reloadPO, setReloadPO}) => {
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {preference: dataPreference}: any = preferenceStore || {}

  const [reload] = useState<number>(0)
  const [loading, setloading] = useState<boolean>(false)

  const onSubmit = (value: any) => {
    setloading(true)

    const {guid} = detail || {}
    const params = {
      price_nego: value?.price_nego || '',
      currency_nego: value?.currency_nego || '',
    }

    updatePONegotiation(guid, params)
      .then(({data: {message}}: any) => {
        setloading(false)
        setShowModal(false)
        setReloadPO(reloadPO + 1)
        ToastMessage({type: 'success', message})
      })
      .catch(({response}: any) => {
        setloading(false)
        const {data, message} = response?.data || {}
        const {fields} = data || {}
        if (fields !== undefined) {
          const error: any = fields || []
          for (const key in error) {
            const value: any = error?.[key] || ''
            ToastMessage({type: 'error', message: value?.[0] || ''})
          }
        } else {
          ToastMessage({type: 'error', message})
        }
      })
  }

  const initValues: any = {
    price_nego: '',
    currency_nego: {
      value: dataPreference?.currency || '',
      label: dataPreference?.currency || '',
    },
  }

  const onClose = () => {
    setShowModal(false)
    ToastMessage({type: 'clear'})
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={onClose}>
      <Formik initialValues={initValues} enableReinitialize onSubmit={onSubmit}>
        {({setFieldValue}: any) => {
          return (
            <Form className='justify-content-center' noValidate>
              <Modal.Header>
                <Modal.Title>Negotiation</Modal.Title>
              </Modal.Header>
              <Modal.Body className='py-0'>
                <div className='row'>
                  <div className='mt-3 fw-bolder'>{detail?.po_id || '-'}</div>
                  <div className='col'>
                    <label className='required col mt-3'>Negotiation Price</label>
                    <div className='d-flex input-group input-group-solid mt-2'>
                      <Select
                        sm={true}
                        className='col-3'
                        id='currency_nego'
                        name='currency_nego'
                        api={getCurrency}
                        params={false}
                        reload={reload}
                        isClearable={false}
                        placeholder='Currency'
                        defaultValue={{
                          value: dataPreference?.currency,
                          label: dataPreference?.currency,
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
                    <div className='fv-plugins-message-container invalid-feedback mb-2 mt-0'>
                      <ErrorMessage name='price_nego' />
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button className='btn-sm' variant='secondary' onClick={onClose}>
                  Cancel
                </Button>
                <Button className='btn-sm' type='submit' variant='primary'>
                  {!loading && <span className='indicator-label'>Save</span>}
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
  )
}

export default NegotiationForm
