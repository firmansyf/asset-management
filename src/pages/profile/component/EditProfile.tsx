import {getCompany} from '@api/company'
import {getDepartment} from '@api/department'
import {getDateFormat, getTimeFormat, getTimezone} from '@api/timezone'
import {AddInputBtn} from '@components/button/Add'
import {Select} from '@components/select/ajax'
import {Select as ReactSelect} from '@components/select/select'
import {ToastMessage} from '@components/toast-message'
import {configClass} from '@helpers'
import {AddCompany} from '@pages/setup/settings/companies/AddCompany'
import AddDepartment from '@pages/setup/settings/departements/AddDepartment'
import {ErrorMessage, Field} from 'formik'
import {FC, memo, useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'

let EditProfile: FC<any> = ({
  values,
  user,
  setFormChange = () => '',
  formChange,
  setFieldValue,
  setFormChangeCompany = () => '',
  setFormChangeDepartment = () => '',
  setFormChangeTimeZone = () => '',
}) => {
  const {
    email,
    first_name,
    last_name,
    job_title,
    phone_number,
    employee_number,
    company,
    company_department,
    preference,
  }: any = user || {}

  const {key_timezone}: any = preference || {}
  const {guid: company_guid}: any = company || {}
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {preference: dataPreference, phone_code: dataPhoneCode} = preferenceStore || {}
  const {date_format, time_format, timezone} = dataPreference || {}

  const [dateFormat, setDateFormat] = useState([])
  const [timeFormat, setTimeFormat] = useState([])
  const [phoneCode, setPhoneCode] = useState<any>([])
  const [reloadCompany, setReloadCompany] = useState<number>(0)
  const [clearOption, setClearOption] = useState<boolean>(false)
  const [defaultTimezone, setDefaultTimezone] = useState<any>({})
  const [reloadDepartment, setReloadDepartment] = useState<number>(0)
  const [companyGuid, setCompanyGuid] = useState<any>(company_guid || '')
  const [showModalCompany, setShowModalCompany] = useState<boolean>(false)
  const [showModalDepartment, setShowModalDepartment] = useState<boolean>(false)

  useEffect(() => {
    getTimezone()
      .then(({data: {data: res}}: any) => {
        setDefaultTimezone(res?.find(({key}: any) => key === timezone))
      })
      .catch(() => setDefaultTimezone({}))
  }, [timezone])

  useEffect(() => {
    getTimeFormat()
      .then(({data: res}: any) => {
        const {data} = res
        setTimeFormat(data)
      })
      .catch(({response}: any) => {
        const {message} = response?.data || {}
        ToastMessage({type: 'error', message})
      })

    getDateFormat()
      .then(({data: res}: any) => {
        const {data} = res || {}
        data && setDateFormat(data)
      })
      .catch(({response}: any) => {
        const {message} = response?.data || {}
        ToastMessage({type: 'error', message})
      })
  }, [company_guid])

  useEffect(() => {
    if (dataPhoneCode && dataPhoneCode?.length > 0) {
      const data: any = dataPhoneCode?.map(({key, label}: any) => ({
        value: key || '',
        label: `${label || ''} (+${key || ''})`,
      }))
      setPhoneCode(data)
    }
  }, [dataPhoneCode])

  return (
    <>
      <div>
        <div className='row first-last-name'>
          <div className='col-6 first-name'>
            <label className={`${configClass?.label} required`}>First Name</label>
            <Field
              type='text'
              name='first_name'
              placeholder='Enter First Name'
              className={configClass?.form}
              onBlur={(e: any) => {
                if (first_name !== e?.target?.value) {
                  setFormChange({...formChange, first_name: true})
                } else {
                  setFormChange({...formChange, first_name: false})
                }
              }}
            />
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name='first_name' />
            </div>
          </div>
          <div className='col-6 last-name'>
            <label className={`${configClass?.label} required`}>Last Name</label>
            <Field
              type='text'
              name='last_name'
              placeholder='Enter Last Name'
              className={configClass?.form}
              onBlur={(e: any) => {
                if (last_name !== e?.target?.value) {
                  setFormChange({...formChange, last_name: true})
                } else {
                  setFormChange({...formChange, last_name: false})
                }
              }}
            />
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name='last_name' />
            </div>
          </div>
        </div>

        <div className='col-12 email'>
          <label className={`${configClass?.label} required`}>Email</label>
          <Field
            type='text'
            name='email'
            placeholder='Enter Email'
            className={configClass?.form}
            onBlur={(e: any) => {
              if (email !== e?.target?.value) {
                setFormChange({...formChange, email: true})
              } else {
                setFormChange({...formChange, email: false})
              }
            }}
          />
          <div className='fv-plugins-message-container invalid-feedback'>
            <ErrorMessage name='email' />
          </div>
        </div>

        <div className='row title-employee'>
          <div className='col-6 job-title'>
            <label className={`${configClass?.label}`}>Job Title</label>
            <Field
              type='text'
              name='job_title'
              placeholder='Enter Job Title'
              className={configClass?.form}
              onBlur={(e: any) => {
                if (job_title !== e?.target?.value) {
                  setFormChange({...formChange, job_title: true})
                } else {
                  setFormChange({...formChange, job_title: false})
                }
              }}
            />
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name='job_title' />
            </div>
          </div>
          <div className='col-6 employee-id'>
            <label className={`${configClass?.label}`}>Employee ID</label>
            <Field
              type='text'
              name='employee_number'
              placeholder='Enter Employee ID'
              className={configClass?.form}
              onBlur={(e: any) => {
                if (employee_number !== e?.target?.value) {
                  setFormChange({...formChange, employee_number: true})
                } else {
                  setFormChange({...formChange, employee_number: false})
                }
              }}
            />
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name='employee_number' />
            </div>
          </div>
        </div>

        <div className='row time-date-format'>
          <div className='col-6 time-format'>
            <label className={`${configClass?.label}`}>Time Format</label>
            <Field
              as='select'
              name='preference.time_format'
              placeholder='Enter Time Format'
              className={configClass?.form}
              type='text'
              onBlur={({target: {value}}: any) => {
                if (time_format !== value) {
                  setFormChange({...formChange, time_format: true})
                } else {
                  setFormChange({...formChange, time_format: false})
                }
              }}
            >
              {time_format &&
                timeFormat?.length > 0 &&
                timeFormat?.map((item: any, index: number) => {
                  return (
                    <option key={index} value={item?.key}>
                      {item?.value || ''}
                    </option>
                  )
                })}
            </Field>
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name='preference.time_format' />
            </div>
          </div>
          <div className='col-6 date-format'>
            <label className={`${configClass?.label}`}>Date Format</label>
            <Field
              as='select'
              data-cy='date_format'
              name='preference.date_format'
              placeholder='Enter Date Format'
              className={configClass?.form}
              onBlur={(e: any) => {
                if (date_format !== e?.target?.value) {
                  setFormChange({...formChange, date_format: true})
                } else {
                  setFormChange({...formChange, date_format: false})
                }
              }}
            >
              {date_format &&
                dateFormat?.length > 0 &&
                dateFormat?.map((item: any, index: number) => {
                  return (
                    <option key={index || 0} value={item?.key || ''}>
                      {item?.value || ''}
                    </option>
                  )
                })}
            </Field>
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name='preference.date_format' />
            </div>
          </div>
        </div>

        <div className='row company-department'>
          <div className='col-6 company'>
            <label className={`${configClass?.label}`}>Company</label>
            <Select
              sm={true}
              api={getCompany}
              params={false}
              isClearable={false}
              name='company_guid'
              id='company_guid_cy'
              placeholder='Choose Company'
              className='col p-0 company_guid_cypress'
              defaultValue={{
                value: company !== null ? company?.guid : '',
                label: company !== null ? company?.name : '',
              }}
              onChange={({value}: any) => {
                setCompanyGuid(value || '')
                setFieldValue('company_guid', value || '')
                setFieldValue('company_department_guid', '')
                if (company?.guid !== value) {
                  setFormChangeCompany(true)
                  setClearOption(true)
                } else {
                  setFormChangeCompany(false)
                }
              }}
              parse={({guid, name}: any) => ({value: guid, label: name})}
            />
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name='company_guid' />
            </div>
          </div>
          <div className='col-6 department'>
            <label className={`${configClass?.label}`}>Department</label>
            <div className='d-flex align-items-center input-group input-group-solid'>
              <Select
                sm={true}
                className='col p-0'
                api={getDepartment}
                name='company_department_guid'
                placeholder='Choose Department'
                params={{'filter[company_guid]': companyGuid || '-'}}
                defaultValue={{value: company_department?.guid, label: company_department?.name}}
                onChange={({value}: any) => {
                  setFieldValue('company_department_guid', value || '')
                  setFormChangeDepartment(company_department?.guid !== value ? true : false)
                }}
                parse={({guid, name}: any) => ({value: guid, label: name})}
                clearOption={clearOption}
              />
              <AddInputBtn size={'sm'} onClick={() => setShowModalDepartment(true)} />
            </div>
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name='company_department_guid' />
            </div>
          </div>
        </div>

        <div className='row timezone-phoneNumber'>
          <div className='col-6 timezone'>
            <label className={`${configClass?.label}`}>Timezone</label>
            <Select
              sm={true}
              id='timezone_cy'
              api={getTimezone}
              params={false}
              reload={false}
              isClearable={false}
              name='preference.timezone'
              placeholder='Choose Timezone'
              className='col p-0 timezone_cypress'
              defaultValue={{
                value: defaultTimezone?.key || '',
                label: defaultTimezone?.value || '',
              }}
              onChange={({value}: any) => {
                setFieldValue('preference.timezone', value || '')
                setFormChangeTimeZone(key_timezone !== value ? true : false)
              }}
              parse={({key, value}: any) => ({value: key, label: value})}
            />
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name='preference.timezone' />
            </div>
          </div>
          <div className='col-6 phone-number'>
            <label className={`${configClass?.label}`}>Phone Number</label>
            <div className='input-group input-group-solid'>
              <div className='col-5'>
                <ReactSelect
                  sm={true}
                  name='phone_code'
                  className='col p-0'
                  data={phoneCode}
                  isClearable={false}
                  placeholder='Enter Country Code'
                  defaultValue={values?.phone_code || ''}
                  onChange={(e: any) => {
                    setFieldValue('phone_code', e?.value || {})
                  }}
                />
              </div>
              <div className='col-7'>
                <Field
                  name='phone_number'
                  type='text'
                  maxLength='13'
                  onChange={({target: {value}}: any) => {
                    setFieldValue('phone_number', value?.replace(/\D/g, '') || '')
                  }}
                  placeholder='Enter Phone Number'
                  className={configClass?.form}
                  onBlur={(e: any) => {
                    if (phone_number !== e?.target?.value) {
                      setFormChange({...formChange, phone_number: true})
                    } else {
                      setFormChange({...formChange, phone_number: false})
                    }
                  }}
                />
              </div>
            </div>
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name='phone_number' />
            </div>
          </div>
        </div>
      </div>

      <AddCompany
        companyDetail={undefined}
        showModal={showModalCompany}
        reloadCompany={reloadCompany}
        setShowModal={setShowModalCompany}
        setReloadCompany={setReloadCompany}
      />

      <AddDepartment
        departementDetail={undefined}
        showModal={showModalDepartment}
        reloadDepartment={reloadDepartment}
        setShowModal={setShowModalDepartment}
        setReloadDepartment={setReloadDepartment}
      />
    </>
  )
}

EditProfile = memo(EditProfile)
export {EditProfile}
