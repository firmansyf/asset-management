import TextEditor from '@components/form/TextEditorSun'
import {ToastMessage} from '@components/toast-message'
import {configClass, KTSVG} from '@helpers'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {FC, memo, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'

import {revertInsurance} from '../Service'

let ModalRevert: FC<any> = ({assignRevert, setReload, reload, showModal, setShowModal, id}) => {
  const intl: any = useIntl()

  const [loading, setLoading] = useState<boolean>(false)
  const [arrField, setArrayField] = useState<any>([1])

  const handleSubmit = (value: any) => {
    setLoading(true)
    const users: any = assignRevert?.find(({value: guid}: any) => guid === value?.revert_to)
    const params: any = {
      reject_reason: value?.reject_reason || '',
      revert_email: users?.email || '',
      revert_name: users?.name || '',
      revert_to: users?.revert_to,
    }
    revertInsurance(params, id)
      .then(({data: {message}}: any) => {
        setLoading(false)
        setShowModal(false)
        setReload(reload + 1)
        ToastMessage({message, type: 'success'})
      })
      .catch(() => setLoading(false))
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik
        initialValues={{
          reject_reason: '',
          revert_email: '',
          revert_name: '',
          revert_to: '',
        }}
        // validationSchema={ManufacturerSchema}
        enableReinitialize
        onSubmit={(value: any) => handleSubmit(value)}
      >
        {({setFieldValue}: any) => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header closeButton>
              <Modal.Title>Revert</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {arrField &&
                arrField?.length > 0 &&
                arrField?.map((_e: any, index: any) => {
                  return (
                    <div key={index}>
                      <div className='mb-3 mt-2'>
                        <label className={`${configClass?.label} required`}>Revert To</label>
                        <div className='d-flex my-1'>
                          <div className='me-2' style={{width: 'calc(100% - 40px)'}}>
                            <Field
                              type='text'
                              as='select'
                              name='revert_to'
                              className={configClass?.form}
                            >
                              <option value='test'>Select person to revert this claim to</option>
                              {assignRevert &&
                                assignRevert?.length > 0 &&
                                assignRevert?.map(({label, value}: any, index: number) => (
                                  <option key={index} value={value || ''}>
                                    {label || ''}
                                  </option>
                                ))}
                            </Field>
                            <div className='fv-plugins-message-container invalid-feedback'>
                              <ErrorMessage name='name' />
                            </div>
                          </div>
                          <div style={{width: '40px'}} className='ms-2'>
                            {index === 0 && (
                              <a
                                href='#'
                                onClick={(e: any) => {
                                  e?.preventDefault()
                                  if (arrField?.length < assignRevert?.length) {
                                    setArrayField((e: any) => {
                                      const new_arr: any = [...e]
                                      new_arr?.push(1)
                                      return new_arr as never[]
                                    })
                                  }
                                }}
                                className='btn btn-sm btn-icon btn-bg-light btn-active-color-primary'
                              >
                                <KTSVG
                                  path='/media/icons/duotone/Files/File-Plus.svg'
                                  className='svg-icon-2'
                                />
                              </a>
                            )}
                            {index > 0 && (
                              <a
                                href='#'
                                onClick={(e: any) => {
                                  e?.preventDefault()
                                  setArrayField((e: any) => {
                                    const new_arr: any = [...e]
                                    new_arr?.splice(index, 1)
                                    return new_arr as never[]
                                  })
                                }}
                                className='btn btn-sm btn-icon btn-bg-light btn-active-color-primary'
                              >
                                <KTSVG
                                  path='/media/icons/duotone/Files/File-Minus.svg'
                                  className='svg-icon-2'
                                />
                              </a>
                            )}
                          </div>
                        </div>

                        <div className='mt-2 mb-5'>
                          {intl.formatMessage({
                            id: 'AN_EMAIL_WILL_BE_SENT_TO_THIS_PERSON_REGARDING_THIS_REJECTION',
                          })}
                        </div>
                      </div>
                      <div className='mt-3 mb-5'>
                        <label className={`${configClass?.label} required`}>Reject Reason</label>
                        <TextEditor
                          id='reject_reason'
                          placeholder='Enter Reason'
                          onChange={(e: any) => setFieldValue('reject_reason', e)}
                          setContent={false}
                        />
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='name' />
                        </div>
                      </div>
                      <br />
                    </div>
                  )
                })}
            </Modal.Body>
            <Modal.Footer>
              <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                {!loading && <span className='indicator-label'>Revert</span>}
                {loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </Button>
              <button
                type='button'
                className='btn btn-sm btn-secondary'
                onClick={(e: any) => {
                  e?.preventDefault()
                  setShowModal(false)
                }}
              >
                Cancel
              </button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

ModalRevert = memo(
  ModalRevert,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default ModalRevert
