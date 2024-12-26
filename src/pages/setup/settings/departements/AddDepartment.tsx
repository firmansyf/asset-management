import {getCompany} from '@api/company'
import {addDepartment, editDepartment} from '@api/department'
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

import {AddCompany} from '../companies/AddCompany'

const DepartmentSchema = Yup.object().shape({
  name: Yup.string().required('Department Name is required'),
  company_guid: Yup.string().required('Company Name is required'),
})

type AddDepartementProps = {
  company?: any
  showModal: any
  setShowModal: any
  departementDetail?: any
  setReloadDepartment: any
  reloadDepartment: any
  SetAddDataModal?: any
  modalType?: any
}

const AddDepartment: FC<AddDepartementProps> = ({
  setShowModal,
  showModal,
  departementDetail,
  setReloadDepartment,
  reloadDepartment,
  SetAddDataModal,
  modalType,
}) => {
  const intl: any = useIntl()

  const [showForm, setShowForm] = useState<boolean>(false)
  const [companyDetail, setCompanyDetail] = useState<any>()
  const [loadingForm, setLoadingForm] = useState<boolean>(true)
  const [reloadCompany, setReloadCompany] = useState<number>(0)
  const [loadingCategory, setLoading] = useState<boolean>(false)
  const [errSubmitForm, setErrSubmitForm] = useState<boolean>(true)
  const [showModalCompany, setShowModalCompany] = useState<boolean>(false)

  const require_filed_message: any = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})
  const addDepartmentPermission: any = hasPermission('setting.department.add') || false
  const editDepartmentPermission: any = hasPermission('setting.department.edit') || false

  useEffect(() => {
    if (showModal) {
      addEditFormPermission(
        setShowModal,
        setShowForm,
        departementDetail,
        addDepartmentPermission,
        editDepartmentPermission,
        'Add Department',
        'Edit Department'
      )
    }
  }, [
    addDepartmentPermission,
    departementDetail,
    editDepartmentPermission,
    setShowModal,
    showModal,
  ])

  useEffect(() => {
    if (showModal) {
      setLoadingForm(true)
      setTimeout(() => setLoadingForm(false), 400)
    }
  }, [showModal])

  const onSubmit = (value: any) => {
    setLoading(true)
    const {guid}: any = departementDetail || {}
    const params: any = {
      name: value?.name || '',
      company_guid: value?.company_guid || '',
      contact_number: '',
      contact_number_alternate: '',
      contact_person: '',
      email: '',
      status: 1,
    }

    if (guid) {
      editDepartment(params, guid)
        .then(({data: {message}}: any) => {
          setLoading(false)
          setShowForm(false)
          setShowModal(false)
          useTimeOutMessage('clear', 200)
          useTimeOutMessage('success', 250, message)
          setReloadDepartment(reloadDepartment + 1)
        })
        .catch((e: any) => {
          setLoading(false)
          errorExpiredToken(e)
          FieldMessageError(e, [])
        })
    } else {
      addDepartment(params)
        .then(({data: {message, data}}: any) => {
          setLoading(false)
          setShowForm(false)
          setShowModal(false)
          useTimeOutMessage('clear', 200)
          useTimeOutMessage('success', 250, message)
          setReloadDepartment(reloadDepartment + 1)

          if (modalType === 'asset') {
            SetAddDataModal({
              value: data?.guid || '',
              label: value?.name || '',
              guid: value?.company_guid || '',
              modules: 'asset.owner_company_department',
            })
          }
        })
        .catch((e: any) => {
          setLoading(false)
          errorExpiredToken(e)
          FieldMessageError(e, [])
        })
    }
  }

  const initValues: any = {
    name: departementDetail?.name || '',
    company_guid: departementDetail?.company?.guid || '',
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
          enableReinitialize
          onSubmit={onSubmit}
          initialValues={initValues}
          validationSchema={DepartmentSchema}
        >
          {({isSubmitting, errors, setSubmitting, isValidating, setFieldValue}: any) => {
            if (isSubmitting && errSubmitForm && Object.keys(errors || {})?.length > 0) {
              ToastMessage({
                message: require_filed_message,
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
                message: require_filed_message,
                type: 'error',
              })
            }

            return (
              <Form className='justify-content-center' noValidate>
                <Modal.Header>
                  <Modal.Title>{departementDetail ? 'Edit' : 'Add'} Department</Modal.Title>
                </Modal.Header>
                {loadingForm ? (
                  <div className='row'>
                    <div className='col-12 text-center'>
                      <PageLoader height={250} />
                    </div>
                  </div>
                ) : (
                  <Modal.Body>
                    <div className='row mb-5'>
                      <div className='col-md-12'>
                        <label htmlFor='name' className={`${configClass?.label} required`}>
                          Department Name
                        </label>
                        <InputText
                          type='text'
                          name='name'
                          placeholder='Enter Department Name'
                          className={configClass?.form}
                        />
                        {errors?.name && (
                          <div className='fv-plugins-message-container invalid-feedback'>
                            <ErrorMessage name='name' />
                            {/* Department Name is required */}
                          </div>
                        )}
                      </div>
                      <div className='col-md-12 mt-3'>
                        <label htmlFor='company_guid' className={`${configClass?.label} required`}>
                          Company Name
                        </label>
                        <div className='d-flex align-items-center input-group input-group-solid'>
                          <Select
                            sm={true}
                            api={getCompany}
                            params={{orderCol: 'name', orderDir: 'asc'}}
                            id='select-company'
                            name='company_guid'
                            className='col p-0'
                            isClearable={false}
                            reload={reloadCompany}
                            placeholder='Choose Company'
                            parse={({guid, name}: any) => ({value: guid, label: name})}
                            onChange={({value}: any) => setFieldValue('company_guid', value || '')}
                            defaultValue={{
                              value: departementDetail?.company?.guid,
                              label: departementDetail?.company?.name,
                            }} //values?.company_guid || {}
                          />
                          <AddInputBtn
                            dataCy='addCompany'
                            size={'sm'}
                            onClick={() => {
                              setCompanyDetail(undefined)
                              setShowModalCompany(true)
                            }}
                          />
                        </div>
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='company_guid' />
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                )}
                <Modal.Footer>
                  <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                    {!loadingCategory && (
                      <span className='indicator-label'>{departementDetail ? 'Save' : 'Add'}</span>
                    )}
                    {loadingCategory && (
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

      <AddCompany
        showModal={showModalCompany}
        setShowModal={setShowModalCompany}
        companyDetail={companyDetail}
        reloadCompany={reloadCompany}
        setReloadCompany={setReloadCompany}
      />
    </>
  )
}

export default AddDepartment
