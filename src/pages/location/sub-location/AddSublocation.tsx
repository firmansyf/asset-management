import {getLocationV1} from '@api/Service'
import {AddInputBtn} from '@components/button/Add'
import {PageLoader} from '@components/loader/cloud'
import {Select} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {addEditFormPermission, configClass, hasPermission} from '@helpers'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import * as Yup from 'yup'

import AddLocation from '../AddLocation'
import {addSubLocation, editSubLocation} from './redux/SubLocationCRUD'

type ModalAddSublocationProps = {
  location?: any
  showModal: any
  setShowModal: any
  setReloadSubLocation: any
  subLocationDetail: any
  reloadSubLocation: any
  SetAddDataModal?: any
  modalType?: any
}

const AddSubLocationSchema = Yup.object().shape({
  location: Yup.string().required('Location is required'),
  sublocation: Yup.string().required('Sub Location is required'),
})

let ModalAddSubLocation: FC<ModalAddSublocationProps> = ({
  // location,
  showModal,
  setShowModal,
  setReloadSubLocation,
  reloadSubLocation,
  subLocationDetail,
  SetAddDataModal,
  modalType,
}) => {
  const intl: any = useIntl()

  const [showForm, setShowForm] = useState<boolean>(false)
  const [locationDetail, setLocationDetail] = useState<any>()
  const [loadingForm, setLoadingForm] = useState<boolean>(true)
  const [reloadLocation, setReloadLocation] = useState<number>(1)
  const [errSubmitForm, setErrSubmitForm] = useState<boolean>(true)
  const [showModalLocation, setShowModalLocation] = useState<boolean>(false)
  const [loadingSubLocation, setLoadingSubLocation] = useState<boolean>(false)

  const addSubLocationPermission: any = hasPermission('sub-location.add') || false
  const editSubLocationPermission: any = hasPermission('sub-location.edit') || false

  useEffect(() => {
    if (showModal) {
      addEditFormPermission(
        setShowModal,
        setShowForm,
        subLocationDetail,
        addSubLocationPermission,
        editSubLocationPermission,
        'Add Sub Location',
        'Edit Sub Location'
      )
    }
  }, [
    showModal,
    setShowModal,
    subLocationDetail,
    addSubLocationPermission,
    editSubLocationPermission,
  ])

  useEffect(() => {
    if (showModal) {
      ToastMessage({type: 'clear'})
    }
  }, [showModal])

  useEffect(() => {
    if (showModal) {
      setLoadingForm(true)
      setTimeout(() => {
        setLoadingForm(false)
      }, 500)
    }
  }, [showModal])

  const onSubmitSubLocation = (values: any) => {
    setLoadingSubLocation(true)
    setTimeout(() => ToastMessage({type: 'clear'}), 300)
    const {guid}: any = subLocationDetail || {}
    if (subLocationDetail) {
      const params: any = {
        location_guid: values?.location || '',
        name: values?.sublocation || '',
        description: values?.description || '',
      }

      editSubLocation(params, guid)
        .then(({data: {message}}: any) => {
          setShowForm(false)
          setShowModal(false)
          setLoadingSubLocation(false)
          setReloadSubLocation(reloadSubLocation + 1)
          setTimeout(() => ToastMessage({message, type: 'success'}), 400)
        })
        .catch(({response}: any) => {
          setLoadingSubLocation(false)
          const {data, message}: any = response?.data || {}
          const {fields}: any = data || {}
          if (fields !== undefined) {
            const error: any = fields || []
            for (const key in error) {
              const value: any = error?.[key] || []
              ToastMessage({
                type: 'error',
                message: value?.[0]?.replace('names.0', 'name'),
              })
            }
          } else {
            ToastMessage({type: 'error', message})
          }
        })
    } else {
      const params: any = {
        location_guid: values?.location || '',
        names: [values?.sublocation || ''],
        descriptions: [values?.description || ''],
      }

      addSubLocation(params)
        .then((data: any) => {
          setShowModal(false)
          setShowForm(false)
          setLoadingSubLocation(false)
          setReloadSubLocation(reloadSubLocation + 1)

          const {data: response}: any = data || {}
          setTimeout(() => ToastMessage({message: response?.message, type: 'success'}), 400)
          if (modalType === 'asset') {
            SetAddDataModal({
              value: response?.data?.guid?.[0] || '',
              label: values?.sublocation || '',
              guid: values?.location || '',
              modules: 'asset.location_sub',
            })
          }
        })
        .catch(({response}: any) => {
          setLoadingSubLocation(false)
          const {data, message}: any = response?.data || {}
          const {fields}: any = data || {}
          if (fields !== undefined) {
            const error: any = fields || []
            for (const key in error) {
              const value: any = error?.[key] || []
              ToastMessage({
                type: 'error',
                message: value?.[0]?.replace('names.0', 'name'),
              })
            }
          } else {
            ToastMessage({type: 'error', message})
          }
        })
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setShowForm(false)
    setTimeout(() => ToastMessage({type: 'clear'}), 800)
  }

  return (
    <>
      <Modal dialogClassName='modal-md' show={showForm} onHide={closeModal}>
        <Formik
          initialValues={{
            location: subLocationDetail?.location?.guid || '',
            sublocation: subLocationDetail?.name || '',
            description: subLocationDetail?.description || '',
          }}
          validationSchema={AddSubLocationSchema}
          enableReinitialize
          onSubmit={onSubmitSubLocation}
        >
          {({setFieldValue, isSubmitting, errors, values, isValidating, setSubmitting}: any) => {
            if (isSubmitting && errSubmitForm && Object.keys(errors || {})?.length > 0) {
              ToastMessage({
                message: intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'}),
                type: 'error',
              })
              setErrSubmitForm(false)
              setSubmitting(false)
            }

            if (
              isSubmitting &&
              isValidating &&
              !errSubmitForm &&
              Object.keys(errors || {})?.length > 0
            ) {
              ToastMessage({
                message: intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'}),
                type: 'error',
              })
            }
            return (
              <Form className='justify-content-center' noValidate>
                <Modal.Header>
                  <Modal.Title>{subLocationDetail ? 'Edit' : 'Add'} Sub Location</Modal.Title>
                </Modal.Header>
                {loadingForm ? (
                  <div className='row'>
                    <div className='col-12 text-center'>
                      <PageLoader height={250} />
                    </div>
                  </div>
                ) : (
                  <Modal.Body>
                    <span className='text-black-800 mb-3'>
                      {intl.formatMessage({id: 'ADD_SUB_LOCATION_DESCRIPTION'})}
                    </span>
                    <div className='mt-7'>
                      <div className='form-group row mb-4'>
                        <div className='col'>
                          <label className={`${configClass?.label} required text-end`}>
                            Location
                          </label>
                          <div className='d-flex align-items-center input-group input-group-solid'>
                            <Select
                              sm={true}
                              id='select-location'
                              name='location'
                              className='col p-0'
                              api={getLocationV1}
                              isClearable={false}
                              params={{orderCol: 'name', orderDir: 'asc'}}
                              reload={reloadLocation}
                              placeholder='Choose Location'
                              defaultValue={{
                                value: subLocationDetail?.location?.guid,
                                label: subLocationDetail?.location?.name,
                              }}
                              onChange={(e: any) => {
                                setFieldValue('location', e?.value || '')
                              }}
                              parse={(e: any) => {
                                return {
                                  value: e.guid,
                                  label: e.name,
                                }
                              }}
                            />
                            <AddInputBtn
                              size={configClass?.size}
                              onClick={() => {
                                setLocationDetail(undefined)
                                setShowModalLocation(true)
                              }}
                            />
                          </div>

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
                            name='sublocation'
                            className={configClass?.form}
                            placeholder='Enter Sub Location'
                          />
                          {errors?.sublocation && (
                            <div className='fv-plugins-message-container invalid-feedback'>
                              {/* <ErrorMessage name='sublocation' /> */}
                              Sub Location is required
                            </div>
                          )}
                        </div>
                      </div>

                      <div className='form-group row mb-4'>
                        <div className='col'>
                          <label className={`${configClass?.label} text-end`}>
                            Sub Location Description
                          </label>
                          <textarea
                            id='description'
                            name='description'
                            className={configClass?.form}
                            defaultValue={values?.description || ''}
                            style={{resize: 'none', height: '150px'}}
                            onChange={({target: {value}}: any) => {
                              setFieldValue('description', value || '')
                            }}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                )}

                <Modal.Footer>
                  <Button
                    className='btn-sm'
                    type='submit'
                    disabled={loadingSubLocation}
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
                  <Button className='btn-sm' variant='secondary' onClick={closeModal}>
                    Cancel
                  </Button>
                </Modal.Footer>
              </Form>
            )
          }}
        </Formik>
      </Modal>

      <AddLocation
        showModal={showModalLocation}
        setShowModalLocation={setShowModalLocation}
        setReloadLocation={setReloadLocation}
        reloadLocation={reloadLocation}
        locationDetail={locationDetail}
      />
    </>
  )
}

ModalAddSubLocation = memo(
  ModalAddSubLocation,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {ModalAddSubLocation}
