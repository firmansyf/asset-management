import DateInput from '@components/form/DateInput'
import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {errorValidation, preferenceDate} from '@helpers'
import {checkoutExtend} from '@pages/asset-management/redux/CheckInOutRedux'
import {ErrorMessage, Form, Formik} from 'formik'
import moment from 'moment'
import {FC, memo, useEffect, useMemo, useState} from 'react'
import {Modal} from 'react-bootstrap'
import * as Yup from 'yup'

import EmailField from './EmailField'

const extendCheckoutSchema = Yup.object().shape({
  new_checkout_due_date: Yup.string().required('New Checkout Due Date is required'),
})

let ExtendCheckoutModal: FC<any> = ({data, showModal, setShowModal, setReload}) => {
  const pref_date = preferenceDate()
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingForm, setLoadingForm] = useState<boolean>(true)

  useEffect(() => {
    if (showModal) {
      setLoadingForm(true)
      setTimeout(() => {
        setLoadingForm(false)
      }, 500)
    }
  }, [showModal])

  const currentDueDate = useMemo(
    () =>
      data?.asset_checkout?.due_date
        ? moment(data?.asset_checkout?.due_date).format(pref_date)
        : '-',
    [data?.asset_checkout?.due_date, pref_date]
  )

  const initialValues = {
    asset_guid: data.guid,
    new_checkout_due_date: moment(data?.asset_checkout?.due_date || undefined).format(pref_date),
    emails: [],
  }

  const onSubmit = (value: any) => {
    checkoutExtend(value)
      .then(({data: {message}}: any) => {
        setLoading(false)
        setShowModal(false)
        ToastMessage({type: 'success', message})
        setReload(true)
      })
      .catch((e: any) => {
        if (errorValidation(e)) {
          Object.values(errorValidation(e)).forEach((message: any) => {
            ToastMessage({type: 'error', message})
          })
        }
        setLoading(false)
        setShowModal(false)
      })
  }

  const onClose = () => {
    setShowModal(false)
  }
  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={onClose}>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={extendCheckoutSchema}
        onSubmit={onSubmit}
      >
        {({setFieldValue}) => (
          <Form className=''>
            <Modal.Header>
              <Modal.Title>Extend Checkout</Modal.Title>
            </Modal.Header>

            {loadingForm ? (
              <div className='row'>
                <div className='col-12 text-center'>
                  <PageLoader height={250} />
                </div>
              </div>
            ) : (
              <Modal.Body>
                <div className='row'>
                  <div className='col-4 mb-5'>Current Due Date</div>
                  <div className='col-8 mb-5'>
                    : <span className='fw-bolder'>{currentDueDate}</span>
                  </div>
                </div>
                <div className='row align-items-center'>
                  <div className='col-4 mb-5 required'>New Due Date</div>
                  <div className='col-8 mb-5'>
                    :{' '}
                    <DateInput
                      name='new_checkout_due_date'
                      defaultValue={moment(data?.asset_checkout?.due_date || undefined)}
                      className='d-inline-block'
                      setFieldValue={setFieldValue}
                      format={pref_date}
                    />
                  </div>
                </div>
                <EmailField setFieldValue={setFieldValue} />
                <div className='fv-plugins-message-container invalid-feedback'>
                  <ErrorMessage name='checkout' />
                </div>
              </Modal.Body>
            )}

            <Modal.Footer>
              <div className='btn btn-sm btn-light' onClick={onClose}>
                Cancel
              </div>
              <button disabled={loading} className='btn btn-sm btn-primary' type='submit'>
                {loading ? (
                  <span className='indicator-progress d-block'>
                    Please wait...
                    <span className='spinner-border spinner-border-sm align-middle ms-2' />
                  </span>
                ) : (
                  <span className='indicator-label'>Extend Checkout</span>
                )}
              </button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

ExtendCheckoutModal = memo(
  ExtendCheckoutModal,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default ExtendCheckoutModal
