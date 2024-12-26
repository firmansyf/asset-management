import {Select} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {configClass, errorExpiredToken, errorValidation} from '@helpers'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {FC, memo, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import * as Yup from 'yup'

import {addSubLocation, editSubLocation, getLocation} from '../redux/WizardService'

type ModalAddSublocationProps = {
  showModal: any
  setShowModal: any
  setReloadSubLocation: any
  subLocationDetail: any
  reloadSubLocation: any
}

const AddSubLocationSchema = Yup.object().shape({
  location: Yup.string().required('Location is required'),
  names: Yup.string().required('Sub Location is required'),
})

let ModalAddSubLocation: FC<ModalAddSublocationProps> = ({
  showModal,
  setShowModal,
  setReloadSubLocation,
  reloadSubLocation,
  subLocationDetail,
}) => {
  const intl: any = useIntl()
  const require_filed_message: any = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})

  const [errForm, setErrForm] = useState<boolean>(true)
  const [errFormAlert, setErrFormAlert] = useState<any>([true, null])
  const [loadingSubLocation, setLoadingSubLocation] = useState<boolean>(false)

  const handleOnSubmit = (values: any, actions: any) => {
    setLoadingSubLocation(true)

    if (subLocationDetail) {
      const {guid}: any = subLocationDetail || {}
      const params = {
        location_guid: values?.location || '',
        name: values?.names || '',
      }

      editSubLocation(params, guid)
        .then(({data: {message}}: any) => {
          setLoadingSubLocation(false)
          setShowModal(false)
          setReloadSubLocation(reloadSubLocation + 1)
          ToastMessage({message, type: 'success'})
        })
        .catch((e: any) => {
          setErrForm(false)
          errorExpiredToken(e)
          setLoadingSubLocation(false)
          Object.values(errorValidation(e))?.forEach((message: any) => {
            if (message === 'Sub-location name is already taken.') {
              ToastMessage({message: 'The name has already been taken', type: 'error'})
            } else {
              ToastMessage({message, type: 'error'})
            }
          })
        })
    } else {
      const params: any = {
        location_guid: values?.location || '',
        names: [values?.names || ''],
      }

      addSubLocation(params)
        .then(({data: {message}}: any) => {
          setLoadingSubLocation(false)
          setShowModal(false)
          setReloadSubLocation(reloadSubLocation + 1)
          ToastMessage({message, type: 'success'})
        })
        .catch((e: any) => {
          setErrForm(false)
          errorExpiredToken(e, actions)
          setLoadingSubLocation(false)
          Object.values(errorValidation(e))?.forEach((message: any) => {
            setErrFormAlert([
              message === 'Sub-location name is already taken.' ? false : true,
              'alrady',
            ])

            if (message === 'Sub-location name is already taken.') {
              ToastMessage({message: 'The name has already been taken', type: 'error'})
            } else if (message === 'The names.0 may not be greater than 45 characters.') {
              ToastMessage({
                message: 'The name may not be greater than 45 characters',
                type: 'error',
              })
            } else {
              ToastMessage({message, type: 'error'})
            }
          })
        })
    }
  }

  const onClose = () => {
    setShowModal(false)
    setErrFormAlert([true, null])
    ToastMessage({type: 'clear'})
    // setErrForm(true)
  }

  const initValue: any = {
    location: subLocationDetail?.location?.guid || '',
    names: subLocationDetail?.name || '',
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={onClose}>
      <Formik
        initialValues={initValue}
        enableReinitialize
        validationSchema={AddSubLocationSchema}
        onSubmit={handleOnSubmit}
      >
        {({isSubmitting, setSubmitting, isValidating, errors, setFieldValue}) => {
          if (
            isSubmitting &&
            errForm &&
            errFormAlert[0] &&
            Object.keys(errors || {})?.length > 0 &&
            errors?.names?.length !== 1
          ) {
            ToastMessage({message: require_filed_message, type: 'error'})
            setErrForm(false)
            setSubmitting(false)
          }

          if (
            isSubmitting &&
            isValidating &&
            errFormAlert[0] &&
            !errForm &&
            Object.keys(errors || {})?.length > 0 &&
            errors?.names?.length !== 1
          ) {
            ToastMessage({message: require_filed_message, type: 'error'})
          }

          return (
            <Form className='justify-content-center' noValidate>
              <Modal.Header>
                <Modal.Title>{subLocationDetail ? 'Edit' : 'Add'} Sub Location</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className='mb-3'>
                  <span className='text-black-400 mb-3'>
                    {intl.formatMessage({
                      id: 'ENTER_THE_INFORMATION_ABOUT_YOUR_NEW_SUB_LOCATION_IN_THE_FIELDS_BELOW',
                    })}
                  </span>
                </div>
                <div className='mt-7'>
                  <div className='form-group row mb-4'>
                    <div className='col'>
                      <label className={`${configClass?.label} required text-end`}>Location</label>
                      <Select
                        sm={true}
                        name='location'
                        id='location'
                        className='col p-0'
                        isClearable={true}
                        api={getLocation}
                        params={{orderDir: 'asc', orderCol: 'name'}}
                        reload={false}
                        placeholder='Choose Location'
                        defaultValue={{
                          value: subLocationDetail?.location?.guid || '',
                          label: subLocationDetail?.location?.name || '',
                        }}
                        onChange={({value}: any) => {
                          setFieldValue('location', value || '')
                        }}
                        parse={(e: any) => {
                          return {
                            value: e?.guid,
                            label: e?.name,
                          }
                        }}
                      />
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <ErrorMessage name='location' />
                      </div>
                    </div>
                  </div>
                  <div className='form-group row mb-4'>
                    <div className='col'>
                      <label className={`${configClass?.label} required text-end`}>
                        Sub Location
                      </label>
                      <Field
                        type='text'
                        name='names'
                        className={configClass?.form}
                        placeholder='Enter Sub Location'
                      />
                      {errors?.names?.length !== 1 && (
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='names' />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  className='btn-sm'
                  type='submit'
                  disabled={loadingSubLocation}
                  onClick={() =>
                    !isSubmitting &&
                    setErrFormAlert([errFormAlert[1] === 'alrady' ? true : errFormAlert[0], null])
                  }
                  variant='primary'
                >
                  {!loadingSubLocation && (
                    <span className='indicator-label'>{subLocationDetail ? 'Save' : 'Add'}</span>
                  )}
                  {loadingSubLocation && (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Please wait...
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}
                </Button>
                <Button className='btn-sm' variant='secondary' onClick={onClose}>
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

ModalAddSubLocation = memo(
  ModalAddSubLocation,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {ModalAddSubLocation}
