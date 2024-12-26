import {getCompany} from '@api/company'
import {getDepartment} from '@api/department'
import {Select} from '@components/select/ajax'
import {configClass} from '@helpers'
import {ErrorMessage} from 'formik'
import {FC, memo, useEffect, useState} from 'react'

// values,
const CheckInOutDepartment: FC<any> = ({setFieldValue, checkout, destination}) => {
  const [companyGuid, setCompanyGuid] = useState<string>('')
  const [defaultCompany, setDefaultCompany] = useState<any>({})
  const [defaultDepartment, setDefaultDepartment] = useState<any>({})
  const [loadingDepartment, setLoadingDepartment] = useState<boolean>(true)

  useEffect(() => {
    if (destination === 'department') {
      const {company, department} = checkout || {}
      if (company?.guid !== undefined) {
        getCompany({filter: {guid: company?.guid}}).then(({data: {data}}: any) => {
          if (data?.length === 1) {
            setDefaultCompany({value: data?.[0]?.guid, label: data?.[0]?.name})
            setFieldValue('company_guid', data?.[0]?.guid)
          } else {
            setDefaultCompany({})
            setFieldValue('company_guid', '')
          }
        })
      } else {
        setDefaultCompany({})
        setFieldValue('company_guid', '')
      }

      if (department?.guid !== undefined) {
        getDepartment({filter: {guid: department?.guid}}).then(({data: {data}}: any) => {
          if (data?.length === 1) {
            setDefaultDepartment({value: data?.[0]?.guid || '', label: data?.[0]?.name || ''})
            setFieldValue('company_department_guid', data?.[0]?.guid || '')
          } else {
            setDefaultDepartment({})
            setFieldValue('company_department_guid', '')
          }
        })
      } else {
        setDefaultDepartment({})
        setFieldValue('company_department_guid', '')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination])

  useEffect(() => {
    setTimeout(() => setLoadingDepartment(false), 500)
    setTimeout(() => setLoadingDepartment(true), 1000)
  }, [defaultCompany])

  return (
    <div className='col-md-12 mt-4'>
      <div className='row'>
        <div className='col-lg-6 mt-3'>
          <label htmlFor='company_guid' className={`${configClass?.label} required`}>
            Company
          </label>
          <Select
            sm={true}
            api={getCompany}
            reload={false}
            id='select-company'
            name='company_guid'
            className='col p-0'
            placeholder='Choose Company'
            defaultValue={defaultCompany}
            params={{orderCol: 'name', orderDir: 'asc'}}
            parse={({guid, name}: any) => ({value: guid || '', label: name || ''})}
            onChange={(e: any) => {
              setFieldValue('company_guid', e?.value || '')
              setFieldValue('company_department_guid', '')
              setCompanyGuid(e?.value || '')
            }}
          />
          <div className='fv-plugins-message-container invalid-feedback'>
            <ErrorMessage name='company_guid' />
          </div>
        </div>

        <div className='col-lg-6 mt-3'>
          <label htmlFor='company_department_guid' className={`${configClass?.label}`}>
            Department
          </label>
          <Select
            sm={true}
            className='col p-0'
            api={getDepartment}
            id='select-department'
            reload={loadingDepartment}
            name='company_department_guid'
            placeholder='Choose Department'
            params={{filter: {company_guid: companyGuid || ''}}}
            parse={({guid, name}: any) => ({value: guid || '', label: name || ''})}
            onChange={(e: any) => setFieldValue('company_department_guid', e?.value || '')}
            defaultValue={
              {value: checkout?.department?.guid || '', label: checkout?.department?.name || ''} ||
              defaultDepartment
            }
          />
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
