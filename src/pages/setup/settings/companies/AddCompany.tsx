import {addCompany, editCompany} from '@api/company'
import {InputText} from '@components/InputText'
import {PageLoader} from '@components/loader/cloud'
import {customStyles} from '@components/select/config'
import {Select as ReactSelect} from '@components/select/select'
import SinglePhoto from '@components/single-photo/SinglePhoto'
import {ToastMessage} from '@components/toast-message'
import {
  addEditFormPermission,
  configClass,
  errorExpiredToken,
  FieldMessageError,
  hasPermission,
  staticMonth,
  useTimeOutMessage,
} from '@helpers'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {FC, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import Select from 'react-select'
import * as Yup from 'yup'

const CompaniesSchema: any = Yup.object().shape({
  name: Yup.string().required('Company Name is required'),
  address_1: Yup.string().required('Address 1 is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State/Province is required'),
  postcode: Yup.string().required('ZIP/Postal Code is required'),
  address_2: Yup.string().required('Address 2 is required'),
  // country_code: Yup.object().required('Country is required'),
})

type Props = {
  showModal: any
  setShowModal: any
  companyDetail?: any
  reloadCompany: any
  setReloadCompany: any
  SetAddDataModal?: any
  modalType?: any
}
const AddCompany: FC<Props> = ({
  companyDetail,
  showModal,
  setShowModal,
  reloadCompany,
  setReloadCompany,
  SetAddDataModal,
  modalType,
}) => {
  const intl: any = useIntl()
  const month = staticMonth()
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {preference: dataPreference, country: dataCountry}: any = preferenceStore || {}

  const [files, setFiles] = useState<any>()
  const [country, setCountry] = useState<any>([])
  const [isNumber, setIsNumber] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [loadingForm, setLoadingForm] = useState<boolean>(true)
  const [errSubmitForm, setErrSubmitForm] = useState<boolean>(true)

  const addCompanyPermission: any = hasPermission('setting.company.add') || false
  const editCompanyPermission: any = hasPermission('setting.company.edit') || false
  const require_filed_message: any = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})

  useEffect(() => {
    showModal &&
      addEditFormPermission(
        setShowModal,
        setShowForm,
        companyDetail,
        addCompanyPermission,
        editCompanyPermission,
        'Add Company',
        'Edit Company'
      )
  }, [addCompanyPermission, companyDetail, editCompanyPermission, setShowModal, showModal])

  useEffect(() => {
    showModal && setLoadingForm(true)
    showModal && setTimeout(() => setLoadingForm(false), 400)
  }, [showModal])

  const onSubmit = (value: any) => {
    setLoading(true)
    const {guid} = companyDetail || {}
    let isPhoto: any = undefined
    if (files && Object.keys(files || {})?.length !== 0) {
      const {title, preview} = files || {}
      if (title !== companyDetail?.photo?.title) {
        isPhoto = Object.assign({}, {title: title || '', data: preview || ''})
      } else {
        setFiles([])
      }
    }

    const params: any = {
      status: 1,
      photo: isPhoto || null,
      name: value?.name || '',
      city: value?.city || '',
      state: value?.state || '',
      street: value?.street || '',
      address_1: value?.address_1 || '',
      address_2: value?.address_2 || '',
      tax_number: value?.tax_number || '',
      country_code: value?.country_code || '',
      postcode: value?.postcode?.toString() || '',
      remove_photo: isPhoto === undefined ? true : false,
      registration_number: value?.registration_number || '',
      financial_year_begin:
        (value?.financial_month || 1)?.toString()?.padStart(2, '0') +
        '-' +
        (value?.financial_day || 1)?.toString()?.padStart(2, '0'),
    }

    if (guid) {
      editCompany(params, guid)
        .then(({data: {message}}: any) => {
          setFiles([])
          setLoading(false)
          setShowModal(false)
          setShowForm(false)
          setReloadCompany(reloadCompany + 1)
          useTimeOutMessage('clear', 200)
          useTimeOutMessage('success', 250, message)
        })
        .catch((e: any) => {
          errorExpiredToken(e)
          setLoading(false)
          FieldMessageError(e, [])
        })
    } else {
      addCompany(params)
        .then(({data: {data: res, message}}: any) => {
          setFiles([])
          setLoading(false)
          setShowModal(false)
          setShowForm(false)
          setReloadCompany(reloadCompany + 1)
          useTimeOutMessage('clear', 200)
          useTimeOutMessage('success', 250, message)

          if (modalType === 'asset') {
            SetAddDataModal({
              value: res?.guid || '',
              label: value?.name || '',
              modules: 'asset.owner_company',
            })
          }
        })
        .catch((e: any) => {
          errorExpiredToken(e)
          setLoading(false)
          FieldMessageError(e, [])
        })
    }
  }

  const onClose = () => {
    setFiles([])
    setShowModal(false)
    setShowForm(false)
    useTimeOutMessage('clear', 200)
  }

  const getValueOrDefault = (value: any) => (value === null ? '-' : value)
  const initValue: any = {
    name: getValueOrDefault(companyDetail?.name),
    city: getValueOrDefault(companyDetail?.city),
    state: getValueOrDefault(companyDetail?.state),
    street: getValueOrDefault(companyDetail?.street),
    postcode: getValueOrDefault(companyDetail?.postcode),
    tax_number: getValueOrDefault(companyDetail?.tax_number),
    address_1: getValueOrDefault(companyDetail?.address_one),
    address_2: getValueOrDefault(companyDetail?.address_two),
    registration_number: getValueOrDefault(companyDetail?.registration_number),
    country_code: companyDetail?.country
      ? companyDetail?.original?.country?.code
      : dataPreference?.country_code,
    financial_month: companyDetail?.original?.financial_year_begin?.date
      ? parseInt(companyDetail?.original?.financial_year_begin?.date.split('-')?.[0])
      : 1,
    financial_day: companyDetail?.original?.financial_year_begin?.date
      ? parseInt(companyDetail?.original?.financial_year_begin?.date.split('-')[1])
      : 1,
  }

  useEffect(() => {
    const obj: any = []
    Array(31)
      ?.fill('')
      ?.forEach((_arr: any, i: any) => {
        obj?.push({value: i + 1, label: i + 1})
      })
    setIsNumber(obj as never[])
  }, [])

  useEffect(() => {
    if (showModal && dataCountry) {
      setCountry(dataCountry?.map(({iso_code: value, name: label}: any) => ({value, label})))
    }
  }, [dataCountry, showModal])

  return (
    <Modal dialogClassName='modal-md' show={showForm} onHide={onClose}>
      <Formik
        enableReinitialize
        initialValues={initValue}
        validationSchema={CompaniesSchema}
        onSubmit={onSubmit}
      >
        {({errors, isSubmitting, setSubmitting, values, setFieldValue, isValidating}: any) => {
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
                <Modal.Title>
                  {companyDetail
                    ? Object.keys(companyDetail || {})?.length > 0
                      ? 'Edit '
                      : 'Add'
                    : 'Add '}
                  Company
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
                  <div>
                    <h5 className='text-dark'>
                      <b>Company Info</b>
                    </h5>
                    <hr />
                  </div>
                  <div className='row mb-5'>
                    <div className='col-md-12'>
                      <label htmlFor='name' className={`${configClass?.label} required`}>
                        Company Name
                      </label>
                      <InputText
                        name='name'
                        type='text'
                        className={configClass?.form}
                        placeholder='Enter Company Name'
                      />
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <ErrorMessage name='name' />
                      </div>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='row mb-5'></div>
                    <div className='row'>
                      <div className='col-md-12 mb-4'>
                        <h5 className='text-dark'>
                          <b>Address</b>
                        </h5>
                        <hr />
                        <label htmlFor='address_1' className={`${configClass?.label} required`}>
                          Address 1
                        </label>
                        <InputText
                          name='address_1'
                          type='text'
                          className={configClass?.form}
                          placeholder='Enter Address 1'
                        />
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='address_1' />
                        </div>
                      </div>
                      <div className='col-md-12 mb-4'>
                        <label htmlFor='address_2' className={`${configClass?.label} required`}>
                          Address 2
                        </label>
                        <InputText
                          name='address_2'
                          type='text'
                          className={configClass?.form}
                          placeholder='Enter Address 2'
                        />
                      </div>
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <ErrorMessage name='address_2' />
                      </div>
                    </div>
                    <div className='row'>
                      <div className={configClass?.grid}>
                        <label htmlFor='city' className={`${configClass?.label} required`}>
                          City
                        </label>
                        <InputText
                          name='city'
                          type='text'
                          className={configClass?.form}
                          placeholder='Enter City'
                        />
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='city' />
                        </div>
                      </div>
                      <div className={configClass?.grid}>
                        <label htmlFor='state' className={`${configClass?.label} required`}>
                          State/Province
                        </label>
                        <InputText
                          name='state'
                          type='text'
                          className={configClass?.form}
                          placeholder='Enter State/Province'
                        />
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='state' />
                        </div>
                      </div>

                      <div className={configClass?.grid}>
                        <label htmlFor='postcode' className={`${configClass?.label} required`}>
                          ZIP/ Postal Code
                        </label>
                        <Field
                          name='postcode'
                          maxLength='10'
                          className={configClass?.form}
                          placeholder='Enter ZIP/ Postal Code'
                          onChange={({target: {value}}: any) =>
                            setFieldValue('postcode', value || '')
                          }
                        />
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='postcode' />
                        </div>
                      </div>

                      <div className={configClass?.grid}>
                        <label htmlFor='country_code' className={`${configClass?.label} required`}>
                          Country
                        </label>
                        <ReactSelect
                          sm={true}
                          data={country}
                          isClearable={false}
                          name='country_code'
                          placeholder='Choose Country'
                          defaultValue={values?.country_code || ''}
                          onChange={({value}: any) => setFieldValue('country_code', value || '')}
                        />
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='country_code' />
                        </div>
                      </div>
                    </div>
                    <div className='row mb-5'>
                      <div className='col-12'>
                        <label htmlFor='name' className={`${configClass?.label} required`}>
                          Financial Year begins on
                        </label>
                      </div>
                      <div className='col-6 mb-5'>
                        <Select
                          options={month}
                          className='col-auto p-0'
                          placeholder='Choose Date'
                          styles={customStyles(true, {})}
                          onChange={(e: any) => {
                            setFieldValue('financial_month', e?.id || '')
                          }}
                          value={month?.find((item: any) => item?.id === values?.financial_month)}
                        />
                      </div>
                      <div className='col-6 mb-5'>
                        <Select
                          options={isNumber}
                          className='col-auto p-0'
                          placeholder='Choose Date'
                          styles={customStyles(true, {})}
                          onChange={({value}: any) => setFieldValue('financial_day', value || '')}
                          value={isNumber?.find(
                            (item: any) => item?.value === values?.financial_day
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <SinglePhoto
                    setFiles={setFiles}
                    photoTitle={'COMPANY_LOGO'}
                    setFieldValue={setFieldValue}
                    photoDetail={companyDetail?.photo || {}}
                    photoDescription={'UPLOAD_A_LOGO_OF_COMPANY_TO_SET_YOU_APART_FROM_THE_CROWD'}
                  />
                </Modal.Body>
              )}
              <Modal.Footer>
                <Button className='btn-sm' type='submit' variant='primary'>
                  {!loading && (
                    <span className='indicator-label'>
                      {companyDetail
                        ? Object.keys(companyDetail || {})?.length > 0
                          ? 'Save'
                          : 'Add'
                        : 'Add '}
                    </span>
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
  )
}

export {AddCompany}
