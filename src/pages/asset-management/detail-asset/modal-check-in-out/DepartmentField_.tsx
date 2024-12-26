import {getCompany} from '@api/company'
import {getDepartment} from '@api/department'
import {configClass} from '@helpers'
import {ErrorMessage, Field} from 'formik'
import {FC, memo, useEffect, useState} from 'react'

const CheckInOutDepartment: FC<any> = ({setFieldValue, checkout, destination}) => {
  const [optCompany, setOptCompany] = useState([])
  const [optDepartment, setOptDepartment] = useState([])
  const [companyGuid, setCompanyGuid] = useState<any>()
  useEffect(() => {
    getCompany({limit: 2000})
      .then(({data: {data}}: any) => {
        setOptCompany(data)
      })
      .catch(() => '')
  }, [])
  useEffect(() => {
    if (companyGuid) {
      getDepartment({filter: {company_guid: companyGuid}})
        .then(({data: {data}}: any) => {
          setOptDepartment(data)
        })
        .catch(() => '')
    } else {
      setOptDepartment([])
    }
  }, [companyGuid])
  useEffect(() => {
    if (destination === 'department') {
      if (checkout?.company?.guid !== undefined) {
        getCompany({filter: {guid: checkout?.company?.guid}})
          .then(({data: {data}}: any) => {
            if (data.length > 0) {
              setCompanyGuid(checkout?.company?.guid)
              setFieldValue('company_guid', checkout?.company?.guid)
              setFieldValue('company_department_guid', checkout?.department?.guid)
            } else {
              setCompanyGuid('')
            }
          })
          .catch(() => '')
      } else {
        setFieldValue('company_guid', checkout?.company?.guid || '')
        setFieldValue('company_department_guid', checkout?.department?.guid || '')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination])

  return (
    <div className='col-md-12 mt-4'>
      <div className='row'>
        <div className='col-lg-6 mt-3'>
          <label htmlFor='company_guid' className={`${configClass?.label} required`}>
            Company
          </label>
          <Field
            as='select'
            className={configClass?.select}
            name='company_guid'
            value={companyGuid}
            onInput={({target: {value}}: any) => setCompanyGuid(value)}
          >
            <option value=''>Select Company</option>
            {optCompany?.map(({guid, name}: any, index: number) => (
              <option key={index} value={guid}>
                {name}
              </option>
            ))}
          </Field>
          <div className='fv-plugins-message-container invalid-feedback'>
            <ErrorMessage name='company_guid' />
          </div>
        </div>
        <div className='col-lg-6 mt-3'>
          <label htmlFor='company_department_guid' className={`${configClass?.label} required`}>
            Department
          </label>
          <Field as='select' className={configClass?.select} name='company_department_guid'>
            <option value=''>Select Department</option>
            {optDepartment?.map(({guid, name}: any, index: number) => (
              <option key={index} value={guid}>
                {name}
              </option>
            ))}
          </Field>
          <div className='fv-plugins-message-container invalid-feedback'>
            <ErrorMessage name='company_department_guid' />
          </div>
        </div>
      </div>
    </div>
  )
}

const DepartmentField = memo(
  CheckInOutDepartment,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default DepartmentField
