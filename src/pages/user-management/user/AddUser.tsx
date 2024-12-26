import {getRole} from '@api/role-and-permision'
import {addUser, editUser} from '@api/UserCRUD'
import {SelectCompany} from '@components/form/SelectCompany'
import {PageLoader} from '@components/loader/cloud'
import SinglePhoto from '@components/single-photo/SinglePhoto'
import {ToastMessage} from '@components/toast-message'
import {addEditFormPermission, hasPermission} from '@helpers'
import {ScrollTopComponent} from '@metronic/assets/ts/components'
import {AddCompany} from '@pages/setup/settings/companies/AddCompany'
import AddDepartment from '@pages/setup/settings/departements/AddDepartment'
import {logout} from '@redux'
import {Form, Formik} from 'formik'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'

import {UserInfo} from './Form/UserInfo'
import {UserRole} from './Form/UserRole'
import {SuspendUser} from './SuspendUser'
import {validationSchema} from './validationSchema'

interface SubmitUser {
  guid?: string
  email: string
  first_name: string
  last_name: string
  job_title: string
  company_guid: any
  company_department_guid: string
  phone_number: number
  photo: any
  timezone: string | undefined
  date_format: string
  time_format: string
  role: string
  phone_code: number
  files: any
  setFiles: any
}

interface User {
  showModal: boolean
  userDetail: any
  setShowModalUser: any
  reloadUser: any
  setReloadUser: any
  handleDelete?: object
  phoneCodeSelected?: string
  setPhoneCodeSelected?: object
  preference?: any
  files: any
  setFiles: any
  defaultRole?: any
}

let AddUser: FC<User> = ({
  showModal,
  userDetail,
  reloadUser,
  setShowModalUser,
  setReloadUser,
  files,
  setFiles,
  defaultRole = undefined,
}) => {
  const intl = useIntl()
  const {
    currentUser: user,
    token,
    preference: preferenceStore,
  }: any = useSelector(
    ({currentUser, token, preference}: any) => ({currentUser, token, preference}),
    shallowEqual
  )
  const {preference}: any = preferenceStore || {}
  const userAuthEmial: any = user?.email || {}

  const reloadRole = useState<number>(0)
  const [userRole, setuserRole] = useState<any>({})
  const [errForm, setErrForm] = useState<boolean>(true)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [reloadCompany, setReloadCompany] = useState<number>(1)
  const [loadingUser, setLoadingUser] = useState<boolean>(false)
  const [onClickForm, setOnClickForm] = useState<boolean>(false)
  const [reloadDepartment, setReloadDepartment] = useState<number>(1)
  const [showModalUserCompany, setShowModalUserCompany] = useState<boolean>(false)
  const [showModalUserDepartment, setShowModalUserDepartment] = useState<boolean>(false)
  const [loadingForm, setLoadingForm] = useState<boolean>(true)

  const userRoles: any = Object.values(userRole || {})
  const isUser: any = userDetail?.role_name === 'owner' ? 'Owner' : 'User'
  const require_filed_message: any = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})
  const addUserPermission: any = hasPermission('user-management.add') || false
  const editUserPermission: any = hasPermission('user-management.edit') || false
  const suspendUserPermission: any = hasPermission('user-management.suspend') || false

  useEffect(() => {
    if (showModal) {
      setTimeout(() => ToastMessage({type: 'clear'}), 800)
    }
  }, [showModal])

  useEffect(() => {
    if (showModal) {
      addEditFormPermission(
        setShowModalUser,
        setShowForm,
        userDetail,
        addUserPermission,
        editUserPermission,
        'Add User',
        'Edit User'
      )
    }
  }, [addUserPermission, editUserPermission, setShowModalUser, showModal, userDetail])

  useEffect(() => {
    setLoadingForm(true)
    if (showModal) {
      setTimeout(() => {
        setLoadingForm(false)
      }, 1000)
    }
  }, [showModal])

  useEffect(() => {
    if (userDetail?.photos?.length > 0) {
      setFiles(
        userDetail?.photos?.map((photo: any) => ({
          title: photo?.title || '',
          preview: `${photo?.url}?token=${token}`,
        }))
      )
    } else {
      setFiles([])
    }
  }, [userDetail, setFiles, token])

  const handleCancel = () => {
    setShowModalUser(false)
    setFiles([])
    setErrForm(true)
    setOnClickForm(false)
    setShowForm(false)
    setTimeout(() => ToastMessage({type: 'clear'}), 800)
  }

  useEffect(() => {
    getRole({})
      .then(({data: {data}}: any) => {
        setuserRole(data)
      })
      .catch(() => '')
  }, [])

  const userDetailPhoto = Object.assign(
    {},
    {title: userDetail?.photos?.[0]?.title, data: `${userDetail?.photos?.[0]?.url}?token=${token}`}
  )

  const InitialValues: any = {
    email: userDetail?.email || '',
    first_name: userDetail?.first_name || '',
    last_name: userDetail?.last_name || '',
    job_title: userDetail?.job_title || '',
    employee_number: userDetail?.employee_number || '',
    company_guid:
      userDetail !== undefined &&
      userDetail?.company !== null &&
      userDetail?.company?.guid !== null &&
      userDetail?.company?.name !== undefined
        ? {value: userDetail?.company?.guid, label: userDetail?.company?.name}
        : {value: preference?.default_company_guid, label: preference?.default_company_name},

    company_department_guid: userDetail?.company_department?.guid || '',
    photo: userDetailPhoto || undefined || '',
    role: userDetail?.role_name || '',
  }

  const handleSubmit = (value: SubmitUser) => {
    setLoadingUser(true)

    let photoUrl: any = undefined
    if (Object.keys(files || {})?.length !== 0) {
      if (files?.title !== userDetail?.photos?.title) {
        photoUrl = Object.assign({}, {title: files?.title, data: files?.preview})
      } else {
        setFiles([])
      }
    }

    const data = Object.assign(
      InitialValues,
      {
        ...value,
        company_guid: value?.company_guid?.value || value?.company_guid || '',
      },
      {photo: photoUrl}
    )

    const {...payload_data} = data
    let {...payload} = payload_data

    const addUserPayload = {
      ...payload,
      send_email_activation: 1,
      company_guid: value?.company_guid?.value || value?.company_guid || '',
    }
    if (
      payload?.photo !== undefined &&
      payload?.photo?.title === undefined &&
      payload?.photo?.data === undefined
    ) {
      payload = {...payload, photo: userDetailPhoto}
    }

    Object.prototype.hasOwnProperty.call(payload, 'company') && delete payload['company']
    Object.prototype.hasOwnProperty.call(addUserPayload, 'company') &&
      delete addUserPayload['company']

    if (userDetail) {
      editUser(payload, userDetail?.guid)
        .then(({data: {message}}: any) => {
          setTimeout(() => ToastMessage({type: 'clear'}), 300)
          setLoadingUser(false)
          setShowModalUser(false)
          setShowForm(false)
          setTimeout(() => ToastMessage({type: 'success', message}), 400)
          if (userAuthEmial === userDetail?.email && userDetail?.email !== payload?.email) {
            setTimeout(() => {
              logout()
            }, 3000)
          } else {
            setReloadUser(reloadUser + 1)
          }
        })
        .catch(({response}: any) => {
          setLoadingUser(false)
          const error: any = response?.data?.data?.fields || {}
          for (const key in error) {
            const value = error?.[key]
            ToastMessage({type: 'error', message: Array.isArray(value) && value?.[0]})
          }
        })
    } else {
      addUser(addUserPayload)
        .then(({data: {message}}: any) => {
          setTimeout(() => ToastMessage({type: 'clear'}), 300)
          setShowModalUser(false)
          setLoadingUser(false)
          setReloadUser(reloadUser + 1)
          setShowForm(false)
          setTimeout(() => ToastMessage({type: 'success', message}), 400)
          setShowForm(false)
          setFiles([])
        })
        .catch(({response}: any) => {
          setLoadingUser(false)
          const error: any = response?.data?.data?.fields || {}
          if (error) {
            for (const key in error) {
              const value = error?.[key]
              ToastMessage({type: 'error', message: value?.[0]})
            }
          }
        })
    }
  }

  return (
    <>
      <Modal data-cy='modal' dialogClassName='modal-md' show={showForm} onHide={handleCancel}>
        <Formik
          enableReinitialize
          initialValues={InitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({setFieldValue, setSubmitting, isSubmitting, errors, isValidating}: any) => {
            if (isSubmitting && errForm && Object.keys(errors || {})?.length > 0) {
              ToastMessage({
                message: require_filed_message,
                type: 'error',
              })
              setErrForm(false)
              setSubmitting(false)
            }

            if (isSubmitting && isValidating && !errForm && Object.keys(errors || {})?.length > 0) {
              ToastMessage({
                message: require_filed_message,
                type: 'error',
              })
            }

            if (isSubmitting && Object.keys(errors || {})?.length > 0) {
              ScrollTopComponent.goTop()
              return false
            }

            return (
              <Form className='justify-content-center' noValidate>
                <Modal.Header closeButton>
                  <Modal.Title>
                    {userDetail ? 'Edit' : 'Add'} {isUser}
                  </Modal.Title>
                </Modal.Header>
                {loadingForm ? (
                  <div className='row'>
                    <div className='col-12 text-center'>
                      <PageLoader height={250} />
                    </div>
                  </div>
                ) : (
                  <Modal.Body>
                    {userDetail?.role_name !== 'owner' && (
                      <>
                        <UserRole
                          user={user}
                          data={userRoles}
                          setFieldValue={setFieldValue}
                          userDetail={userDetail}
                          reloadRole={reloadRole}
                          defaultRole={defaultRole}
                        />
                        <div className='separator my-6'></div>
                      </>
                    )}
                    <div className='row mb-5'>
                      <UserInfo errors={errors} onClickForm={onClickForm} />
                      <SelectCompany
                        setShowModalUserCompany={setShowModalUserCompany}
                        setShowModalUserDepartment={setShowModalUserDepartment}
                        reloadCompany={reloadCompany}
                        reloadDepartment={reloadDepartment}
                        userDetail={userDetail}
                      />
                    </div>

                    <SinglePhoto
                      photoDetail={userDetail?.photos?.[0] || {}}
                      setFieldValue={setFieldValue}
                      setFiles={setFiles}
                      photoTitle={'USER_PHOTO'}
                      photoDescription={
                        'UPLOAD_A_PHOTO_OF_YOURSELF_TO_SET_YOU_APART_FROM_THE_CROWD'
                      }
                    />

                    {!loadingForm && userDetail && userDetail?.user_status !== 'owner' && (
                      <>
                        <div className='separator my-6'></div>
                        {!loadingForm && suspendUserPermission && (
                          <SuspendUser
                            user={userDetail}
                            reloadUser={reloadUser}
                            setReloadUser={setReloadUser}
                            setShowForm={setShowForm}
                            setShowModalUser={setShowModalUser}
                          />
                        )}
                      </>
                    )}
                  </Modal.Body>
                )}
                <Modal.Footer>
                  <Button
                    disabled={loadingUser}
                    className='btn-sm'
                    id='isBtn-user'
                    type='submit'
                    variant='primary'
                  >
                    {!loadingUser && (
                      <span className='indicator-label' onClick={() => setOnClickForm(true)}>
                        {userDetail ? 'Save' : 'Add'}
                      </span>
                    )}
                    {loadingUser && (
                      <span className='indicator-progress' style={{display: 'block'}}>
                        Please wait...
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    )}
                  </Button>
                  <Button className='btn-sm' variant='secondary' onClick={handleCancel}>
                    Cancel
                  </Button>
                </Modal.Footer>
              </Form>
            )
          }}
        </Formik>
      </Modal>

      {/* Modal Company */}
      <AddCompany
        showModal={showModalUserCompany}
        setShowModal={setShowModalUserCompany}
        reloadCompany={reloadCompany}
        setReloadCompany={setReloadCompany}
      />

      {/* Modal Department */}
      <AddDepartment
        setShowModal={setShowModalUserDepartment}
        showModal={showModalUserDepartment}
        departementDetail={undefined}
        setReloadDepartment={setReloadDepartment}
        reloadDepartment={reloadDepartment}
      />
    </>
  )
}

AddUser = memo(AddUser, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default AddUser
