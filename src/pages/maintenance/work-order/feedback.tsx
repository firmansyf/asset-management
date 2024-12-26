import 'react-datetime/css/react-datetime.css'
import './styles.css'

import {ToastMessage} from '@components/toast-message'
import {configClass} from '@helpers'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {FC, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {shallowEqual, useSelector} from 'react-redux'
import * as Yup from 'yup'

import {getFeedback, saveFeedback} from '../Service'

type AddEditFeedbackProps = {
  setShowModal: any
  showModal: any
  detail: any
  reload: any
  setReload: any
}

const Star = ({selected = false, onClick = (f: any) => f}: any) => (
  <div style={{cursor: 'pointer'}} onClick={onClick}>
    <span className={`span-feedback ${selected ? 'selected-feedback' : 'star-feedback'}`}>
      &#9733;
    </span>
  </div>
)

const validSchema = Yup.object().shape({
  rating: Yup.number().required('Rating is required.').min(1, 'Rating is required.'),
})

const ModalFeedback: FC<AddEditFeedbackProps> = ({
  setShowModal,
  showModal,
  detail,
  reload,
  setReload,
}) => {
  const [loadingFeedback, setLoadingFeedback] = useState<boolean>(false)
  const [dataRating, setDataRating] = useState<any>({})
  const [rating, setRating] = useState<number>(0)
  const [roleUser, setRoleUser] = useState<string>('')

  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)

  const handleOnSubmit = (values: any) => {
    setLoadingFeedback(true)

    const {guid}: any = detail || {}
    const params: any = {
      rating: rating || 0,
      comment: values?.comment || '',
    }

    saveFeedback(guid, params)
      .then(({data: {message}}: any) => {
        setShowModal(false)
        setReload(reload + 1)
        setLoadingFeedback(false)
        ToastMessage({type: 'success', message})
      })
      .catch(({response}: any) => {
        setLoadingFeedback(false)
        const {message, data: dataRes} = response?.data || {}
        if (response) {
          const {fields} = dataRes || {}
          if (fields !== undefined) {
            const error: any = fields || {}
            for (const key in error) {
              const value: any = error[key] || ''
              ToastMessage({type: 'error', message: value[0]})
            }
          } else {
            ToastMessage({type: 'error', message})
          }
        }
      })
  }

  const change = (starsSelected: any) => {
    setRating(starsSelected)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const initialValues: any = {
    rating: rating || 0,
    comment: dataRating?.comment || '',
  }

  useEffect(() => {
    if (detail?.guid !== undefined && showModal) {
      getFeedback(detail?.guid)
        .then(({data: {data: res}}: any) => {
          if (res?.length > 0) {
            const arr: any = res?.[0] || {}
            setDataRating(arr)
            setRating(arr?.rating || 0)
          }
        })
        .catch(() => {
          const arr: any = {}
          setDataRating(arr)
          setRating(0)
        })
    }
  }, [detail, reload, showModal])

  useEffect(() => {
    const {auth}: any = preferenceStore || {}
    const {user}: any = auth || {}
    const {role_name}: any = user || {}

    setRoleUser(role_name)
  }, [preferenceStore])

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => closeModal()}>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validSchema}
        onSubmit={handleOnSubmit}
      >
        {() => {
          return (
            <Form className='justify-content-center' noValidate>
              <Modal.Header>
                <Modal.Title>Feedback Work Order</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className=''>
                  <div className='row'>
                    <div className='col-md-12'>
                      <label htmlFor='rating' className={`${configClass?.label} d-block required`}>
                        Rating
                      </label>
                      <div className='mt-2 mb-5 d-flex flex-center'>
                        {[...Array(5)].map((_n: any, i: number) => (
                          <Star
                            key={i}
                            selected={i < rating}
                            onClick={() => {
                              if (roleUser !== 'worker') {
                                change(i + 1)
                              }
                            }}
                          />
                        ))}
                      </div>
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <ErrorMessage name='rating' />
                      </div>
                    </div>
                    <div className='col-md-12'>
                      {roleUser === 'worker' ? (
                        <div className='mb-1'>
                          <label htmlFor='comment' className={`${configClass?.label}`}>
                            Comment
                          </label>
                          <p>{dataRating?.comment || ''}</p>
                        </div>
                      ) : (
                        <div className='mb-1'>
                          <label htmlFor='comment' className={`${configClass?.label}`}>
                            Comment
                          </label>
                          <Field
                            type='text'
                            name='comment'
                            placeholder='Enter Feedback Comment'
                            className={configClass?.form}
                          />
                          <div className='fv-plugins-message-container invalid-feedback'>
                            <ErrorMessage name='comment' />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                {roleUser !== 'worker' && (
                  <Button
                    disabled={loadingFeedback}
                    className='btn-sm'
                    type='submit'
                    variant='primary'
                  >
                    {!loadingFeedback && <span className='indicator-label'>{'Add'}</span>}
                    {loadingFeedback && (
                      <span className='indicator-progress' style={{display: 'block'}}>
                        Please wait...
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    )}
                  </Button>
                )}
                <Button className='btn-sm' variant='secondary' onClick={() => closeModal()}>
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

export {ModalFeedback}
