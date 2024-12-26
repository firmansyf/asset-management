/* eslint-disable sonarjs/no-collapsible-if */
/* eslint-disable react-hooks/exhaustive-deps */
import {getUserByToken, updateUserProfile} from '@api/AuthCRUD'
import {editPreference} from '@api/preference'
import Prompt from '@components/alert/prompt'
import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {errorExpiredToken, hasPermission, useTimeOutMessage} from '@helpers'
import {changePassword} from '@pages/profile/redux/Services'
import {logout, saveCurrentUser, savePreference} from '@redux'
import {Form, Formik} from 'formik'
import {FC, memo, useEffect, useState} from 'react'
import {Button} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import Swal from 'sweetalert2'

import {ChangePassword} from './component/ChangePassword'
import {DeleteAccount} from './component/DeleteAccount'
import {EditProfile} from './component/EditProfile'
import {formChangeConstant} from './component/formChangeConstant'
import {ImageProfile} from './component/ImageProfile'
import ProfileValidationSchema from './component/ProfileValidationSchema'
import {editProfile} from './component/Service'

let ProfilePage: FC<any> = () => {
  const intl = useIntl()
  const {currentUser: user, preference: preferenceStore}: any = useSelector(
    ({currentUser, preference}: any) => ({currentUser, preference}),
    shallowEqual
  )
  const {
    email,
    role_name,
    first_name,
    employee_number,
    job_title,
    last_name,
    phone_number,
    company,
    company_department,
  }: any = user || {}
  const {guid: company_guid}: any = company || {}
  const {guid: departement_guid}: any = company_department || {}

  const require_filed_message = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})
  const {preference: dataPreference}: any = preferenceStore || {}
  const {date_format, time_format, timezone}: any = dataPreference || {}

  const [loadingProfile, setLoadingProfile] = useState<boolean>(false)
  const [loadingForm, setLoadingForm] = useState<boolean>(true)
  const [data, setInitialData] = useState<any>({})
  const [images, setImages] = useState<any>([])
  const [imageProfile, setImageProfile] = useState<any>()
  const [showModal, setShowModalConfirm] = useState<boolean>(false)
  const [state, setState] = useState<number>(0)
  const [formChange, setFormChange] = useState<any>(formChangeConstant)
  const [formChangeAvatar, setFormChangeAvatar] = useState<boolean>(false)
  const [reload, setReload] = useState<number>(0)
  const [updatePassword, setUpdatePassword] = useState<boolean>(false)
  const [ProfileSchema, setProfileSchema] = useState<boolean>(false)
  const [errForm, setErrForm] = useState<boolean>(true)

  const handleClick = () => {
    setShowModalConfirm(true)
  }

  const handleEditImgProfile = (params: any) => {
    editProfile(params)
      .then(() => {
        setLoadingProfile(false)
        setTimeout(() => {
          setReload(reload + 1)
          getUserByToken().then(({data: {data: res_user}}: any) => {
            saveCurrentUser(res_user)
            setFormChange(formChangeConstant)
          })
        }, 1500)
      })
      .catch(({response}) => {
        const {data} = response?.data || {}
        if (data?.fields !== undefined) {
          const error = data?.fields || {}
          for (const key in error) {
            const value = error?.[key]
            ToastMessage({
              type: 'error',
              message: value?.[0],
            })
          }
        } else {
          ToastMessage({type: 'error', message: response?.data?.message})
        }
      })
  }

  const onSubmit = (values: any, actions: any) => {
    setLoadingProfile(true)
    const {password}: any = values

    const params: any = {
      company_department_guid: values?.company_department_guid,
      company_guid: values?.company_guid,
      email: values?.email,
      employee_number: values?.employee_number,
      first_name: values?.first_name,
      last_name: values?.last_name,
      job_title: values?.job_title,
      phone_number:
        values?.phone_code && values?.phone_number
          ? `${values?.phone_code || ''} ${values?.phone_number || ''}`
          : '',
      preference: values?.preference,
    }

    if (values?.phone_code !== null || values?.phone_code !== undefined) {
      Object.prototype.hasOwnProperty.call(params, 'phone_code') && delete params['phone_code']
    }

    let errorOnSubmit: boolean = true
    if (values?.phone_number !== undefined && values?.phone_number?.length > 15) {
      if (values?.phone_number?.length > 15) {
        actions.setFieldError('phone_number', 'Maximum phone number length is 15 digits')
        actions.setSubmitting(false)
        setLoadingProfile(false)
      }
    } else {
      errorOnSubmit = false
    }

    if (params?.preference) {
      editPreference(params?.preference)
    }

    if (password?.old_password && password?.new_password && password?.new_password_confirm) {
      if (password?.new_password === password?.new_password_confirm) {
        const password_params = {
          old_password: password?.old_password,
          new_password: password?.new_password,
          new_password_confirm: password?.new_password_confirm,
          email: email,
        }
        changePassword(password_params)
          .then((res: any) => {
            MessageEditProfile(updatePassword, res, false)
          })
          .catch(({response}: any) => {
            const {data, message}: any = response?.data || {}
            const {fields}: any = data || {}
            if (fields) {
              Object.values(fields)?.forEach((msg: any) => {
                ToastMessage({type: 'error', message: msg?.[0] || ''})
                return null
              })
            } else {
              ToastMessage({type: 'error', message})
            }
          })
      }
    }

    if (!errorOnSubmit) {
      updateUserProfile(params)
        .then(({data: res}: any) => {
          savePreference({preference: params?.preference})
          setState(state + 1)
          let uploadImage: any = {}
          if (imageProfile !== null) {
            uploadImage = imageProfile
          } else {
            uploadImage = {title: '', data: null}
          }
          MessageEditProfile(updatePassword, res, true)
          handleEditImgProfile(uploadImage)
          setLoadingProfile(false)
        })
        .catch((err: any) => {
          setLoadingProfile(false)
          errorExpiredToken(err, actions)
        })
    }
  }

  const MessageEditProfile = (
    isChangePassword: boolean,
    res: any,
    isChangePasswordError: boolean
  ) => {
    if (isChangePassword && !isChangePasswordError) {
      Swal.fire({
        imageUrl: '/images/approved.png',
        imageWidth: 65,
        imageHeight: 65,
        html: '<p>Password has been successfully changed<p><br>',
        showConfirmButton: false,
      }).then(() => {
        if (res) {
          logout()
        }
      })
      useTimeOutMessage('clear', 200)
    }

    if (!isChangePassword) {
      Swal.fire({
        imageUrl: '/images/approved.png',
        imageWidth: 65,
        imageHeight: 65,
        html: `<p>${res?.message}<p><br>`,
        showConfirmButton: false,
      })
      useTimeOutMessage('clear', 200)
    }
  }

  useEffect(() => {
    setInitialData(dataPreference || {})
    setLoadingForm(false)
  }, [company_guid, dataPreference])

  useEffect(() => {
    setTimeout(() => setLoadingForm(false), 800)
  }, [])

  const valueInit: any = {
    first_name: first_name || '',
    last_name: last_name || '',
    email: email || '',
    job_title: job_title || '',
    employee_number: employee_number || '',
    phone_number: phone_number ? phone_number?.split(' ')?.[1] : '',
    phone_code: phone_number ? phone_number?.split(' ')?.[0] : dataPreference?.phone_code,
    company_guid: company_guid || '',
    company_department_guid: departement_guid || '',
    preference: {
      date_format: date_format || data?.date_format,
      time_format: time_format || data?.time_format,
      timezone: timezone || data?.timezone,
    },
    password: {
      old_password: '',
      new_password: '',
      new_password_confirm: '',
    },
  }

  return (
    <>
      {loadingForm ? (
        <div className='row'>
          <div className='col-12 text-center'>
            <PageLoader height={'50vh'} />
          </div>
        </div>
      ) : (
        <>
          <ProfileValidationSchema
            updatePassword={updatePassword}
            setProfileSchema={setProfileSchema}
          />

          <div className='card mb-5 mb-xl-10'>
            <div className='card-body p-10 border border-2 border-f5 rounded'>
              <Formik
                initialValues={valueInit}
                enableReinitialize
                validationSchema={ProfileSchema}
                onSubmit={(values: any, actions: any) => onSubmit(values, actions)}
              >
                {(formik: any) => {
                  const {
                    setFieldValue,
                    touched,
                    errors,
                    isSubmitting,
                    setSubmitting,
                    dirty,
                    values,
                  } = formik
                  if (isSubmitting && errForm && Object.keys(errors || {})?.length > 0) {
                    ToastMessage({
                      message: require_filed_message,
                      type: 'error',
                    })
                    setErrForm(false)
                    setSubmitting(false)
                  }
                  return (
                    <Form id='form-auth' className='justify-content-center' noValidate>
                      <Prompt
                        when={dirty || formChangeAvatar}
                        message='This page contains unsaved changes. Do you still wish to leave the page ?'
                        onLocationChange={() => ''}
                      />
                      <div className='row'>
                        <div className='col-sm-12 col-md-6 col-lg-8 pe-10 mb-2'>
                          <ImageProfile
                            imageProfile={imageProfile}
                            setImageProfile={setImageProfile}
                            setFormChangeAvatar={setFormChangeAvatar}
                            images={images}
                            setImages={setImages}
                          />
                          <h1 style={{fontWeight: '200', marginBottom: '30px'}}>Edit Profile</h1>
                          <EditProfile
                            user={user}
                            setFormChange={setFormChange}
                            formChange={formChange}
                            setFieldValue={setFieldValue}
                            values={values}
                          />
                        </div>
                        <div className='col-sm-12 col-md-6 col-lg-4 border-start ps-10 py-30 mb-2'>
                          {!updatePassword && (
                            <div style={{marginTop: '155px'}}>
                              <Button
                                style={{marginTop: '45px'}}
                                onClick={() => setUpdatePassword(true)}
                              >
                                <span>Click here if you want to change your password</span>
                              </Button>
                            </div>
                          )}
                          {updatePassword && (
                            <div style={{marginTop: '155px'}}>
                              <h1 style={{fontWeight: '200', marginBottom: '30px'}}>
                                Change Password
                              </h1>
                              <ChangePassword errors={errors} touched={touched} />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-6 delete-account'>
                          {role_name === 'owner' && (
                            <div className='del-account' style={{marginTop: '45px'}}>
                              Delete account?
                              <span
                                className='font-weight-bold p-2 link-primary cursor-pointer'
                                onClick={handleClick}
                              >
                                Click here
                              </span>
                            </div>
                          )}
                        </div>
                        <div className='col-6'>
                          <div className='pt-8 d-flex justify-content-end button-save'>
                            {hasPermission('profile.edit') && (
                              <Button
                                disabled={loadingProfile}
                                className='btn-sm'
                                type='submit'
                                variant='primary'
                              >
                                {!loadingProfile && <span className='indicator-label'>Save</span>}
                                {loadingProfile && (
                                  <span className='indicator-progress' style={{display: 'block'}}>
                                    Please wait...
                                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                  </span>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Form>
                  )
                }}
              </Formik>
              <style>{`
                @media screen and (max-width: 420px) {
                  .card-body {
                    padding: 15px !important;
                  }
                }
              `}</style>
              <DeleteAccount setShowModal={setShowModalConfirm} showModal={showModal} />
            </div>
          </div>
        </>
      )}
    </>
  )
}

ProfilePage = memo(ProfilePage)
export default ProfilePage
