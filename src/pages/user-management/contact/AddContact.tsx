import {getCompany} from '@api/company'
import {AddInputBtn} from '@components/button/Add'
import {InputText} from '@components/InputText'
import {PageLoader} from '@components/loader/cloud'
import {Select as AjaxSelect} from '@components/select/ajax'
import {Select as AjaxMultiple} from '@components/select/ajaxMultiple'
import {Select as ReactSelect} from '@components/select/select'
import {ToastMessage} from '@components/toast-message'
import {addEditFormPermission, configClass, hasPermission} from '@helpers'
import {AddEditTags} from '@pages/help-desk/tags/AddEditTags'
import {getTags} from '@pages/help-desk/tags/core/service'
import {AddCompany} from '@pages/setup/settings/companies/AddCompany'
import {getFeature} from '@pages/setup/settings/feature/Service'
import {addContact, editContact} from '@pages/user-management/redux/ContactCRUD'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {keyBy, mapValues} from 'lodash'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import * as Yup from 'yup'

const ContactSchema: any = Yup.object().shape({
  name: Yup.string().required('Contact Name is required'),
  email: Yup.string().required('Email is required'),
})

type Props = {
  showModal: any
  reloadTags: any
  setShowModal: any
  reloadContact: any
  contactDetail: any
  setReloadTags?: any
  setReloadContact: any
}

let AddContact: FC<Props> = ({
  showModal,
  reloadTags,
  setShowModal,
  contactDetail,
  setReloadTags,
  reloadContact,
  setReloadContact,
}) => {
  const intl: any = useIntl()

  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {preference: dataPreference, phone_code: dataPhoneCode}: any = preferenceStore || {}

  const [listTags, setListTags] = useState<any>([])
  const [features, setFeatures] = useState<any>({})
  const [phoneCode, setPhoneCode] = useState<any>([])
  const [errForm, setErrForm] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [reloadComp, setReloadComp] = useState<number>(0)
  const [onClickForm, setOnClickForm] = useState<boolean>(true)
  const [showModalTags, setShowModalTags] = useState<boolean>(false)
  const [showModalCompany, setShowModalCompany] = useState<boolean>(false)
  const [loadingForm, setLoadingForm] = useState<boolean>(true)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [phoneCodeMatchPref, setPhodeCodeMatchPref] = useState<any>()
  const [preference, setPreference] = useState<any>({})

  const require_filed_message: any = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})
  const addContactPermission: any = hasPermission('help-desk.contact.add') || false
  const editContactPermission: any = hasPermission('help-desk.contact.edit') || false

  useEffect(() => {
    showModal &&
      addEditFormPermission(
        setShowModal,
        setShowForm,
        contactDetail,
        addContactPermission,
        editContactPermission,
        'Add Contact',
        'Edit Contact'
      )
  }, [addContactPermission, contactDetail, editContactPermission, setShowModal, showModal])

  useEffect(() => {
    showModal && setLoadingForm(true)
    showModal && setTimeout(() => setLoadingForm(false), 500)
    showModal && setTimeout(() => ToastMessage({type: 'clear'}), 800)
  }, [showModal])

  useEffect(() => {
    if (showModal && dataPreference && dataPreference?.length > 0) {
      setPhodeCodeMatchPref(dataPreference)
      setPreference(dataPreference)
    }
  }, [dataPreference, showModal])

  useEffect(() => {
    if (dataPhoneCode && dataPhoneCode && showModal) {
      const data: any = dataPhoneCode?.map(({key, label}) => ({
        value: key || '',
        label: `${label || ''} (+${key || ''})`,
      }))
      setPhoneCode(data as never[])
    }
  }, [showModal, dataPhoneCode])

  useEffect(() => {
    if (contactDetail !== undefined) {
      const {tags} = contactDetail || {}
      if (tags && showModal === true) {
        setListTags(
          tags?.map(({guid, name}: any) => {
            return {
              label: name || '',
              value: guid || '',
            }
          }) as never[]
        )
      } else {
        setListTags([])
      }
    }
  }, [contactDetail, showModal])

  useEffect(() => {
    getFeature({orderCol: 'name', orderDir: 'asc'}).then(({data: {data: result}}) => {
      if (result) {
        const resObj: any = keyBy(result, 'unique_name')
        setFeatures(mapValues(resObj, 'value'))
        setLoading(false)
      }
    })
  }, [])

  const handleSubmit = (value: any, actions: any) => {
    setLoading(true)
    let tags: any = []
    const {guid} = contactDetail || {}
    if (value?.tag_guid !== '') {
      tags = value?.tag_guid?.map((tag: any) => {
        return {tag_guid: tag?.value || ''}
      })
    }

    let errorOnSubmit: boolean = true
    let phone_code: any = ''
    if (contactDetail?.phonenumber !== undefined && contactDetail?.phonenumber !== null) {
      const phoneCode: any = [contactDetail?.phonenumber?.split(' ')?.[0]]
      if (phoneCode?.[0] === value?.phone_code?.value) {
        phone_code = phoneCode || ''
      } else {
        phone_code = value?.phone_code || ''
      }
    } else {
      phone_code = value?.phone_code || ''
    }

    if (value?.phone_number !== undefined && value?.phone_number?.length > 15) {
      if (value?.phone_number?.length > 15) {
        actions.setFieldError('phone_number', 'Maximum phone number length is 15 digits')
        actions.setSubmitting(false)
        setLoading(false)
      }
    } else {
      errorOnSubmit = false
    }

    const params = {
      tags: tags as never[],
      name: value?.name || '',
      title: value?.title || '',
      email: value?.email || '',
      twitter: value?.twitter || '',
      facebook: value?.facebook || '',
      company_guid: value?.company_guid?.value || '',
      phonenumber:
        phone_code && value?.phone_number ? `${phone_code} ${value?.phone_number || ''}` : '',
    }

    if (!errorOnSubmit) {
      if (guid) {
        editContact(params, guid)
          .then(({data: {message}}: any) => {
            setTimeout(() => ToastMessage({type: 'clear'}), 300)
            setLoading(false)
            setShowForm(false)
            setShowModal(false)
            setReloadContact(reloadContact + 1)
            setTimeout(() => ToastMessage({message, type: 'success'}), 400)
          })
          .catch(({response}: any) => {
            setLoading(false)
            const {data, message} = response?.data || {}
            const {fields} = data || {}

            if (fields !== undefined) {
              const error: any = fields || {}
              for (const key in error) {
                const value: any = error?.[key] || ''
                ToastMessage({type: 'error', message: value?.[0] || ''})
              }
            } else {
              if (message) {
                for (const msg in message) {
                  const isMessage = message?.[msg]
                  ToastMessage({type: 'error', message: isMessage?.[0]})
                }
              }
            }
          })
      } else {
        addContact(params)
          .then(({data: {message}}: any) => {
            setTimeout(() => ToastMessage({type: 'clear'}), 300)
            setLoading(false)
            setShowModal(false)
            setShowForm(false)
            setReloadContact(reloadContact + 1)
            setTimeout(() => ToastMessage({message, type: 'success'}), 400)
          })
          .catch(({response}: any) => {
            setLoading(false)
            const {data, message} = response?.data || {}
            const {fields} = data || {}

            if (fields !== undefined) {
              const error: any = fields || {}
              for (const key in error) {
                const value: any = error?.[key] || ''
                ToastMessage({type: 'error', message: value?.[0] || ''})
              }
            } else {
              ToastMessage({type: 'error', message})
            }
          })
      }
    }
  }

  const initValues: any = {
    tag_guid: listTags as never[],
    name: contactDetail?.name || '',
    title: contactDetail?.title || '',
    email: contactDetail?.email || '',
    twitter: contactDetail?.twitter || '',
    facebook: contactDetail?.facebook || '',
    phone_number: contactDetail?.phonenumber?.split(' ')?.[1] || '',
    phone_code: contactDetail?.phonenumber?.split(' ')?.[0] || phoneCodeMatchPref?.phone_code,
    company_guid:
      contactDetail !== undefined &&
      contactDetail?.company_guid !== null &&
      contactDetail?.company_name !== null
        ? {value: contactDetail?.company_guid || '', label: contactDetail?.company_name || ''}
        : preference?.default_company_guid !== undefined
        ? {
            value: preference?.default_company_guid || '',
            label: preference?.default_company_name || '',
          }
        : {},
  }

  const onClose = () => {
    setErrForm(true)
    setLoading(false)
    setShowForm(false)
    setShowModal(false)
    setOnClickForm(false)
    setTimeout(() => ToastMessage({type: 'clear'}), 800)
  }

  return (
    <>
      <Modal dialogClassName='modal-lg' show={showForm} onHide={onClose}>
        <Formik
          initialValues={initValues}
          validationSchema={ContactSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({values, setFieldValue, setSubmitting, isSubmitting, errors, isValidating}: any) => {
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

            return (
              <Form className='justify-content-center' noValidate>
                <Modal.Header>
                  <Modal.Title>{contactDetail ? 'Edit' : 'Add'} Contact</Modal.Title>
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
                      <div className={configClass?.grid}>
                        <label htmlFor='name' className={`${configClass?.label} required`}>
                          Contact Name
                        </label>
                        <InputText
                          name='name'
                          type='text'
                          onClickForm={onClickForm}
                          className={configClass?.form}
                          placeholder='Enter Contact Name'
                        />
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='name' />
                        </div>
                      </div>

                      <div className={configClass?.grid}>
                        <label htmlFor='title' className={configClass?.label}>
                          Title
                        </label>
                        <InputText
                          type='text'
                          name='title'
                          errors={errors}
                          placeholder='Enter Title'
                          className={configClass?.form}
                        />
                      </div>

                      <div className={configClass?.grid}>
                        <label htmlFor='email' className={`${configClass?.label} required`}>
                          Email
                        </label>
                        <InputText
                          name='email'
                          type='text'
                          placeholder='Enter Email'
                          onClickForm={onClickForm}
                          className={configClass?.form}
                        />
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='email' />
                        </div>
                      </div>

                      <div className={configClass?.grid}>
                        <label className={configClass?.label}>Phone Number</label>
                        <div className='input-group-sm d-flex input-group input-group-solid'>
                          <div className='col-6'>
                            <ReactSelect
                              sm={true}
                              data={phoneCode}
                              name='phone_code'
                              isClearable={false}
                              className='col p-0'
                              placeholder='Enter Country Code'
                              defaultValue={values?.phone_code || ''}
                              onChange={({value}: any) => setFieldValue('phone_code', value || {})}
                            />
                          </div>
                          <div className='col-6'>
                            <Field
                              type='text'
                              minLength='8'
                              maxLength='12'
                              name='phone_number'
                              className={configClass?.form}
                              placeholder='Enter Phone Number'
                              value={values?.phone_number || ''}
                              onChange={({target: {value}}: any) => {
                                setFieldValue('phone_number', value?.replace(/\D/g, '') || '')
                              }}
                            />
                          </div>
                        </div>
                        <div className='fv-plugins-message-container mt-0 invalid-feedback'>
                          <ErrorMessage name='phone_number' />
                        </div>
                      </div>

                      <div className={configClass?.grid}>
                        <label htmlFor='company_guid' className={configClass?.label}>
                          Company
                        </label>
                        <div className='d-flex align-items-center input-group input-group-solid'>
                          <AjaxSelect
                            sm={true}
                            id='companyCy'
                            api={getCompany}
                            name='company_guid'
                            reload={reloadComp}
                            placeholder='Choose Company'
                            className='col p-0 company-cy'
                            defaultValue={values?.company_guid || ''}
                            params={{orderCol: 'name', orderDir: 'asc'}}
                            onChange={(e: any) => setFieldValue('company_guid', e)}
                            parse={({guid, name}: any) => ({value: guid, label: name})}
                          />

                          <AddInputBtn size={'sm'} onClick={() => setShowModalCompany(true)} />
                        </div>
                      </div>

                      <div className={configClass?.grid}>
                        <label htmlFor='facebook' className={configClass?.label}>
                          Facebook
                        </label>
                        <InputText
                          type='text'
                          name='facebook'
                          errors={errors}
                          placeholder='Enter Facebook'
                          className={configClass?.form}
                        />
                      </div>

                      <div className={configClass?.grid}>
                        <label htmlFor='twitter' className={configClass?.label}>
                          Twitter
                        </label>
                        <InputText
                          type='text'
                          name='twitter'
                          errors={errors}
                          placeholder='Enter Twitter'
                          className={configClass?.form}
                        />
                      </div>

                      {features?.help_desk > 0 && (
                        <div className={configClass?.grid}>
                          <label htmlFor='tag_guid' className={configClass?.label}>
                            Tags
                          </label>
                          <div className='d-flex w-100 input-group input-group-solid'>
                            <div className='col-md-11'>
                              <AjaxMultiple
                                sm={true}
                                api={getTags}
                                params={{orderCol: 'name', orderDir: 'asc'}}
                                isMulti={true}
                                className='col p-0'
                                reload={reloadTags}
                                placeholder='Choose Tags'
                                defaultValue={values?.tag_guid || ''}
                                onChange={(e: any) => setFieldValue('tag_guid', e || '')}
                                parse={({guid, name}: any) => ({value: guid, label: name})}
                              />
                            </div>
                            <div
                              className='col-md-1 m-0'
                              ref={(el: any) => {
                                if (el) {
                                  el?.style?.setProperty('padding-top', '5px')
                                  el?.style?.setProperty('margin-left', '-5px', 'important')
                                }
                              }}
                            >
                              <AddInputBtn size={'sm'} onClick={() => setShowModalTags(true)} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Modal.Body>
                )}
                <Modal.Footer>
                  <Button disabled={loading} className='btn-sm' type='submit' variant='primary'>
                    {!loading && (
                      <span className='indicator-label' onClick={() => setOnClickForm(true)}>
                        {contactDetail ? 'Save' : 'Add'}
                      </span>
                    )}
                    {loading && (
                      <span className='indicator-progress' style={{display: 'block'}}>
                        Please wait...
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    )}
                  </Button>
                  <Button className='btn-sm' variant='secondary' onClick={() => onClose()}>
                    Cancel
                  </Button>
                </Modal.Footer>
              </Form>
            )
          }}
        </Formik>
      </Modal>

      <AddEditTags
        reload={reloadTags}
        tagsDetail={undefined}
        setReload={setReloadTags}
        showModal={showModalTags}
        setShowModal={setShowModalTags}
      />

      <AddCompany
        reloadCompany={reloadComp}
        showModal={showModalCompany}
        setReloadCompany={setReloadComp}
        setShowModal={setShowModalCompany}
      />
    </>
  )
}

AddContact = memo(
  AddContact,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default AddContact
