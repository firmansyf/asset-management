/* eslint-disable react-hooks/exhaustive-deps */
import {AddInputBtn} from '@components/button/Add'
import {InputText} from '@components/InputText'
import {PageLoader} from '@components/loader/cloud'
import {Select} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {
  addEditFormPermission,
  configClass,
  errorExpiredToken,
  FieldMessageError,
  hasPermission,
  useTimeOutMessage,
} from '@helpers'
import {ErrorMessage, Form, Formik} from 'formik'
import {FC, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import * as Yup from 'yup'

import {ModalAddCategory} from '../categories/AddCategory'
import {getCategory} from '../categories/redux/CategoryCRUD'
import {addType, editType} from './Service'

const TypeSchema: any = Yup.object().shape({
  name: Yup.string().required('Type Name is required').nullable(),
  category: Yup.string().required('Asset Category is required').nullable(),
})

type ModalAddTypeProps = {
  showModal: any
  setShowModal: any
  setReloadType: any
  reloadType: any
  typeDetail?: any
  SetAddDataModal?: any
  modalType?: any
}

const AddType: FC<ModalAddTypeProps> = ({
  showModal,
  setShowModal,
  setReloadType,
  reloadType,
  typeDetail,
  SetAddDataModal,
  modalType,
}) => {
  const intl: any = useIntl()

  const [loading, setLoading] = useState<boolean>(false)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [categoryDetail, setDetailCategory] = useState<any>()
  const [loadingForm, setLoadingForm] = useState<boolean>(true)
  const [reloadCategory, setReloadCategory] = useState<number>(0)
  const [errSubmitForm, setErrSubmitForm] = useState<boolean>(true)
  const [showModalCategory, setShowModalCategory] = useState<boolean>(false)

  const addTypePermission: any = hasPermission('setting.type.add') || false
  const editTypePermission: any = hasPermission('setting.type.edit') || false

  useEffect(() => {
    showModal &&
      addEditFormPermission(
        setShowModal,
        setShowForm,
        typeDetail,
        addTypePermission,
        editTypePermission,
        'Add Type',
        'Edit Type'
      )
  }, [showModal, setShowModal, setShowForm, typeDetail, addTypePermission, editTypePermission])

  useEffect(() => {
    showModal && setLoadingForm(true)
    showModal && setTimeout(() => setLoadingForm(false), 400)
  }, [showModal])

  const handleSubmit = (value: any) => {
    setLoading(true)
    const {guid} = typeDetail || {}
    const params: any = {
      category_guid: value?.category || '',
      name: value?.name || '',
      status: 1,
    }

    if (guid) {
      editType(params, guid)
        .then(({data: {message}}: any) => {
          setLoading(false)
          setShowForm(false)
          setShowModal(false)
          setReloadType(reloadType + 1)
          useTimeOutMessage('clear', 200)
          useTimeOutMessage('success', 250, message)
        })
        .catch((e: any) => {
          setLoading(false)
          errorExpiredToken(e)
          FieldMessageError(e, ['type-setting'])
        })
    } else {
      addType(params)
        .then(({data: {message, data: res}}: any) => {
          setLoading(false)
          setShowForm(false)
          setShowModal(false)
          setReloadType(reloadType + 1)
          useTimeOutMessage('clear', 200)
          useTimeOutMessage('success', 250, message)

          if (modalType === 'asset') {
            SetAddDataModal({
              value: res?.guid || '',
              label: value?.name || '',
              guid: value?.category || '',
              modules: 'asset.type',
            })
          }
        })
        .catch((e: any) => {
          setLoading(false)
          errorExpiredToken(e)
          FieldMessageError(e, ['type-setting'])
        })
    }
  }

  const initValues: any = {
    category: typeDetail?.category?.guid || '',
    name: typeDetail?.name || '',
  }

  const onClose = () => {
    setShowModal(false)
    setShowForm(false)
    useTimeOutMessage('clear', 200)
  }

  return (
    <>
      <Modal dialogClassName='modal-md' show={showForm} onHide={onClose}>
        <Formik
          initialValues={initValues}
          validationSchema={TypeSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({setFieldValue, isSubmitting, errors, isValidating, setSubmitting}: any) => {
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
                <Modal.Header closeButton>
                  <Modal.Title>{typeDetail ? 'Edit' : 'Add'} Type</Modal.Title>
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
                      <div className='col-md-12 mb-5'>
                        <label htmlFor='category' className={`${configClass?.label} required`}>
                          Asset Category
                        </label>
                        <div className='d-flex align-items-center input-group input-group-solid'>
                          <Select
                            sm={true}
                            api={getCategory}
                            params={false}
                            name='category'
                            isClearable={false}
                            className='col p-0'
                            id='select-category'
                            reload={reloadCategory}
                            placeholder='Choose Asset Category'
                            parse={({guid, name}: any) => ({value: guid, label: name})}
                            onChange={({value}: any) => setFieldValue('category', value || '')}
                            defaultValue={{
                              value: typeDetail?.category?.guid || '',
                              label: typeDetail?.category?.name || '',
                            }}
                          />
                          <AddInputBtn
                            size={'sm'}
                            dataCy='addCategory'
                            onClick={() => {
                              setShowModalCategory(true)
                              setDetailCategory(undefined)
                            }}
                          />
                        </div>

                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='category' />
                        </div>

                        {/* {errors?.category && (
                          <div className='fv-plugins-message-container invalid-feedback'>
                            <ErrorMessage name='category' />
                            {errors?.category}
                          </div>
                        )} */}
                      </div>

                      <div className='col-md-12'>
                        <label htmlFor='country' className={`${configClass?.label} required`}>
                          Type Name
                        </label>
                        <InputText
                          type='text'
                          name='name'
                          placeholder='Enter Type Name'
                          className={configClass?.form}
                        />

                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='name' />
                        </div>

                        {/* {errors?.name && (
                          <div className='fv-plugins-message-container invalid-feedback'>
                            <ErrorMessage name='name' />
                            {errors?.name}
                          </div>
                        )} */}
                      </div>
                    </div>
                  </Modal.Body>
                )}
                <Modal.Footer>
                  <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                    {!loading && (
                      <span className='indicator-label'>{typeDetail ? 'Save' : 'Add'}</span>
                    )}
                    {loading && (
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

      <ModalAddCategory
        setReloadCategory={setReloadCategory}
        reloadCategory={reloadCategory}
        showModal={showModalCategory}
        setShowModal={setShowModalCategory}
        categoryDetail={categoryDetail}
      />
    </>
  )
}

export {AddType}
