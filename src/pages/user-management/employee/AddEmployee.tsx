/* eslint-disable react-hooks/exhaustive-deps */
import {getLocationV1} from '@api/Service'
import {AddInputBtn} from '@components/button/Add'
import {FormCF} from '@components/form/CustomField'
import {InputText} from '@components/InputText'
import {PageLoader} from '@components/loader/cloud'
import {Select} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {configClass} from '@helpers'
import {getCustomField} from '@pages/setup/custom-field/redux/ReduxCustomField'
import {getDatabaseEmployee} from '@pages/setup/databases/Serivce'
import {ErrorMessage, Form, Formik} from 'formik'
import {keyBy} from 'lodash'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import * as Yup from 'yup'

import {addEmployee, editEmployee, getEmployeeDetail} from '../redux/EmployeeCRUD'
import SelectCompany from './SelectCompany'

let AddEmployee: FC<any> = ({
  showModal,
  setShowModalEmployee,
  employeeDetail,
  setReloadEmployee,
  reloadEmployee,
  reloadLocation,
  setLocationDetail,
  setShowModalLocation,
  reloadCompany,
  setCompanyDetail,
  setShowModalCompany,
  reloadDepartment,
  setDepartmentDetail,
  setShowModalDepartment,
  onClickForm,
  setOnClickForm,
}) => {
  const intl: any = useIntl()
  const {preference}: any = useSelector(({preference}: any) => preference, shallowEqual)

  // const {guid}: any = employeeDetail || {}
  const [database, setDatabase] = useState<any>({})
  const [customField, setCustomField] = useState([])
  const [errForm, setErrForm] = useState<boolean>(true)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [visibility, setVisibility] = useState<string>('invisible')
  const [loadingEmployee, setLoadingEmployee] = useState<boolean>(false)

  const require_filed_message: any = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})

  const validationSchema: any = Yup.object().shape({
    // TEXT
    full_name: Yup.string().when({
      is: () => database?.full_name?.is_required,
      then: () => Yup.string().required(database?.full_name?.label + ' is required'),
    } as any),
    employee_id: Yup.string().when({
      is: () => database?.employee_id?.is_required,
      then: () => Yup.string().required(database?.employee_id?.label + ' is required'),
    } as any),
    job_title: Yup.string().when({
      is: () => database?.job_title?.is_required,
      then: () => Yup.string().required(database?.job_title?.label + ' is required'),
    } as any),
    email: Yup.string().when({
      is: () => database?.email?.is_required,
      then: () => Yup.string().required(database?.email?.label + ' is required'),
    } as any),
    // SELECT
    location: Yup.mixed()
      .test('location', database?.location_guid?.label + ' is required', (e: any) =>
        database?.location_guid?.is_required ? e?.value || typeof e === 'string' : true
      )
      .nullable(),
    company_guid: Yup.mixed()
      .test('company_guid', database?.company_guid?.label + ' is required', (e: any) =>
        database?.company_guid?.is_required ? e?.value || typeof e === 'string' : true
      )
      .nullable(),
    company_department_guid: Yup.mixed()
      .test(
        'company_department_guid',
        database?.company_department_guid?.label + ' is required',
        (e: any) => {
          return database?.company_department_guid?.is_required
            ? e?.value || typeof e === 'string'
            : true
        }
      )
      .nullable(),
  })

  const initValues: any = {
    phone: employeeDetail?.phone || '',
    email: employeeDetail?.email || '',
    full_name: employeeDetail?.full_name || '',
    job_title: employeeDetail?.job_title || '',
    employee_id: employeeDetail?.employee_id || '',
    company_department_guid: employeeDetail?.company_department?.guid || '',
    location:
      employeeDetail?.location?.guid !== undefined
        ? {value: employeeDetail?.location?.guid || '', label: employeeDetail?.location?.name || ''}
        : {},
    global_custom_fields:
      customField?.filter(({value}: any) => value)?.map(({guid, value}: any) => ({guid, value})) ||
      [],
    company_guid:
      employeeDetail !== undefined &&
      employeeDetail?.company?.guid !== null &&
      employeeDetail?.company_name !== null
        ? {value: employeeDetail?.company?.guid, label: employeeDetail?.company?.name}
        : preference?.default_company_guid !== undefined
        ? {value: preference?.default_company_guid, label: preference?.default_company_name}
        : {},
  }

  const resultCustomField = (values: any, custom_fields_value: any) => {
    return values?.global_custom_fields
      ? Object.entries(values?.global_custom_fields || {})?.forEach((key: any, item: any) => {
          const guid: any = Number(key?.[0]) === item ? key?.[1]?.guid : key?.[0]
          const value: any = key?.[1]?.value || ''
          custom_fields_value[guid] = value || ''
        })
      : {}
  }

  const handleSubmit = (value: any, actions: any) => {
    setLoadingEmployee(true)
    const {guid}: any = employeeDetail || {}
    const custom_fields_value: any = {}
    resultCustomField(value, custom_fields_value)

    const params: any = {
      location_sub_guid: '',
      email: value?.email || '',
      phone: value?.phone || '',
      full_name: value?.full_name || '',
      job_title: value?.job_title || '',
      employee_id: value?.employee_id || '',
      global_custom_fields: custom_fields_value || {},
      company_department_guid: value?.company_department_guid || '',
      location_guid: value?.location?.value || value?.location || '',
      company_guid: value?.company_guid?.value || value?.company_guid || '',
      // company_guid: guid ? value?.company_guid || value?.company_guid?.value : value?.company_guid,
    }

    if (guid) {
      editEmployee(params, guid)
        .then(({data: {message}}: any) => {
          setTimeout(() => ToastMessage({type: 'clear'}), 300)
          setShowForm(false)
          setLoadingEmployee(false)
          setVisibility('invisible')
          setShowModalEmployee(false)
          setReloadEmployee(reloadEmployee + 1)
          setTimeout(() => ToastMessage({message, type: 'success'}), 400)
        })
        .catch(({response}: any) => {
          setLoadingEmployee(false)
          const {devMessage, data, message}: any = response?.data || {}
          const {fields}: any = data || {}

          if (!devMessage) {
            if (fields === undefined) {
              ToastMessage({message, type: 'error'})
            } else {
              Object.keys(fields || {})?.forEach((item: any) => {
                if (item?.includes('global_custom_fields')) {
                  if (fields?.[item] !== 'The global custom fields field is required.') {
                    const messages: any = fields?.[item]?.[0]?.replace('Custom field', '') || ''
                    actions.setFieldError(item, messages)
                  }
                } else {
                  ToastMessage({message: fields?.[item]?.[0] || '', type: 'error'})
                }
                return true
              })
            }
          }
        })
    } else {
      addEmployee(params)
        .then(({data: {message}}: any) => {
          setTimeout(() => ToastMessage({type: 'clear'}), 300)
          setShowForm(false)
          setLoadingEmployee(false)
          setVisibility('invisible')
          setShowModalEmployee(false)
          setReloadEmployee(reloadEmployee + 1)
          setTimeout(() => ToastMessage({message, type: 'success'}), 400)
        })
        .catch(({response}: any) => {
          setLoadingEmployee(false)
          const {devMessage, data, message}: any = response?.data || {}
          const {fields}: any = data || {}

          if (!devMessage) {
            if (fields === undefined) {
              ToastMessage({message, type: 'error'})
            } else {
              Object.keys(fields || {})?.forEach((item: any) => {
                if (item?.includes('global_custom_fields')) {
                  if (fields?.[item] !== 'The global custom fields field is required.') {
                    const messages: any = fields?.[item]?.[0]?.replace('Custom field', '') || ''
                    actions.setFieldError(item, messages)
                  }
                } else {
                  ToastMessage({message: fields?.[item]?.[0] || '', type: 'error'})
                }
                return true
              })
            }
          }
        })
    }
  }

  const onClose = () => {
    setErrForm(true)
    setShowForm(false)
    setOnClickForm(false)
    setLoadingEmployee(false)
    setVisibility('invisible')
    setShowModalEmployee(false)
    setTimeout(() => ToastMessage({type: 'clear'}), 800)
  }

  useEffect(() => {
    if (showModal) {
      ToastMessage({type: 'clear'})

      getDatabaseEmployee({}).then(({data: {data}}: any) => {
        setDatabase(keyBy(data, 'field'))
      })
    }
  }, [showModal])

  useEffect(() => {
    const {guid}: any = employeeDetail || {}
    if (showModal && guid) {
      getEmployeeDetail(guid).then(({data: {data: res_loc}}: any) => {
        res_loc && setTimeout(() => setCustomField(res_loc?.custom_fields as never[]), 500)
      })
    }

    if (showModal) {
      getCustomField({'filter[section_type]': 'employee'}).then(({data: {data: res_loc}}: any) => {
        res_loc && setTimeout(() => setCustomField(res_loc as never[]), 500)
      })
    }
  }, [employeeDetail, showModal])

  useEffect(() => {
    showModal && customField?.length === 0 && setTimeout(() => setShowForm(true), 500)
  }, [showModal, customField])

  useEffect(() => {
    showModal && showForm && setTimeout(() => setVisibility('visible'), 2000)
  }, [showModal, showForm])

  return (
    <Modal dialogClassName='modal-lg' show={showModal} onHide={onClose}>
      <Formik
        initialValues={initValues}
        validationSchema={validationSchema}
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
            <Form className='justify-content-center add-employee' data-cy='formAdd' noValidate>
              <Modal.Header>
                <Modal.Title>{employeeDetail ? 'Edit' : 'Add'} Employee</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                {visibility === 'invisible' && (
                  <div className='row' style={{height: '300px'}}>
                    <div className='col-12 text-center'>
                      <PageLoader height={250} />
                    </div>
                  </div>
                )}

                <div
                  className={`row ${visibility}`}
                  style={visibility === 'invisible' ? {height: '10px'} : {minHeight: '270px'}}
                >
                  {showForm && (
                    <div className='row'>
                      {database?.full_name?.is_selected && (
                        <div className={configClass?.grid}>
                          <label
                            htmlFor='full_name'
                            className={`${configClass?.label} ${
                              database?.full_name?.is_required ? 'required' : ''
                            }`}
                          >
                            Full Name
                          </label>
                          <InputText
                            type='text'
                            name='full_name'
                            onClickForm={onClickForm}
                            placeholder='Enter Full Name'
                            className={configClass?.form}
                          />
                          <div className='fv-plugins-message-container invalid-feedback'>
                            <ErrorMessage name='full_name' />
                          </div>
                        </div>
                      )}

                      {database?.employee_id?.is_selected && (
                        <div className={configClass?.grid}>
                          <label
                            htmlFor='employee_id'
                            className={`${configClass?.label} ${
                              database?.employee_id?.is_required ? 'required' : ''
                            }`}
                          >
                            Employee ID
                          </label>
                          <InputText
                            type='text'
                            name='employee_id'
                            onClickForm={onClickForm}
                            className={configClass?.form}
                            placeholder='Enter Employee ID'
                          />
                          <div className='fv-plugins-message-container invalid-feedback'>
                            <ErrorMessage name='employee_id' />
                          </div>
                        </div>
                      )}

                      {database?.job_title?.is_selected && (
                        <div className={configClass?.grid}>
                          <label
                            htmlFor='job_title'
                            className={`${configClass?.label} ${
                              database?.job_title?.is_required ? 'required' : ''
                            }`}
                          >
                            Job Title
                          </label>
                          <InputText
                            type='text'
                            name='job_title'
                            onClickForm={onClickForm}
                            placeholder='Enter Job Title'
                            className={configClass?.form}
                          />
                          <div className='fv-plugins-message-container invalid-feedback'>
                            <ErrorMessage name='job_title' />
                          </div>
                        </div>
                      )}

                      {database?.email?.is_selected && (
                        <div className={configClass?.grid}>
                          <label
                            htmlFor='email'
                            className={`${configClass?.label} ${
                              database?.email?.is_required ? 'required' : ''
                            }`}
                          >
                            Email
                          </label>
                          <InputText
                            name='email'
                            type='text'
                            onClickForm={onClickForm}
                            placeholder='Enter Email'
                            className={configClass?.form}
                          />
                          <div className='fv-plugins-message-container invalid-feedback'>
                            <ErrorMessage name='email' />
                          </div>
                        </div>
                      )}

                      {database?.location_guid?.is_selected && (
                        <div className={configClass?.grid}>
                          <label
                            htmlFor='location_guid'
                            className={`${configClass?.label} ${
                              database?.location_guid?.is_required ? 'required' : ''
                            }`}
                          >
                            Location
                          </label>
                          <div className='d-flex align-items-center input-group input-group-solid'>
                            <Select
                              sm={true}
                              api={getLocationV1}
                              params={false}
                              name='location'
                              className='col p-0'
                              reload={reloadLocation}
                              placeholder='Select Location'
                              defaultValue={values?.location}
                              onChange={(e: any) => setFieldValue('location', e || {})}
                              parse={({guid, name}: any) => ({value: guid, label: name})}
                            />

                            <AddInputBtn
                              size={'sm'}
                              dataCy='addLocation'
                              onClick={() => {
                                setShowModalLocation(true)
                                setLocationDetail(undefined)
                              }}
                            />
                          </div>

                          {database?.location_guid?.is_required && (
                            <div className='fv-plugins-message-container invalid-feedback'>
                              <ErrorMessage name='location' />
                            </div>
                          )}
                        </div>
                      )}

                      <SelectCompany
                        database={database}
                        reloadCompany={reloadCompany}
                        employeeDetail={employeeDetail}
                        reloadDepartment={reloadDepartment}
                        setCompanyDetail={setCompanyDetail}
                        setShowModalCompany={setShowModalCompany}
                        setDepartmentDetail={setDepartmentDetail}
                        setShowModalDepartment={setShowModalDepartment}
                      />
                    </div>
                  )}

                  <FormCF
                    type='employee'
                    errors={errors}
                    showForm={showForm}
                    labelClass='col-md-5'
                    itemClass='col-md-6 mb-3'
                    onClickForm={onClickForm}
                    setShowForm={setShowForm}
                    defaultValue={customField}
                    defaultCustomField={customField}
                    onChange={(e: any) => setFieldValue('global_custom_fields', e)}
                  />
                </div>
              </Modal.Body>

              <Modal.Footer>
                <Button
                  disabled={loadingEmployee}
                  className='btn-sm'
                  type='submit'
                  variant='primary'
                >
                  {!loadingEmployee && (
                    <span className='indicator-label' onClick={() => setOnClickForm(true)}>
                      {employeeDetail ? 'Save' : 'Add'}
                    </span>
                  )}
                  {loadingEmployee && (
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

AddEmployee = memo(
  AddEmployee,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)

export default AddEmployee
