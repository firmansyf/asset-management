/* eslint-disable react-hooks/exhaustive-deps */
import {getCompany} from '@api/company'
import {getDepartment} from '@api/department'
import {AddInputBtn} from '@components/button/Add'
import {Select} from '@components/select/ajax'
import {configClass} from '@helpers'
import {ErrorMessage, useFormikContext} from 'formik'
import {FC, useEffect, useState} from 'react'

type Props = {
  database: any
  reloadCompany: any
  reloadDepartment: any
  employeeDetail: any
  setShowModalDepartment: any
  setDepartmentDetail: any
  setCompanyDetail: any
  setShowModalCompany: any
}
const SelectCompany: FC<Props> = ({
  database,
  employeeDetail,
  setShowModalDepartment,
  setDepartmentDetail,
  setCompanyDetail,
  setShowModalCompany,
}) => {
  const {values, setFieldValue} = useFormikContext<any>()
  const [companyGuid, setCompanyGuid] = useState<any>(employeeDetail?.company_guid || '')
  const [clearOption, setClearOption] = useState<boolean>(false)

  useEffect(() => {
    if (companyGuid === null) {
      setClearOption(true)
    } else {
      setClearOption(false)
    }
  }, [])

  return (
    <>
      {database?.company_guid?.is_selected && (
        <div className={configClass?.grid}>
          <label
            htmlFor='company_guid'
            className={`${configClass?.label} ${
              database?.company_guid?.is_required ? 'required' : ''
            }`}
          >
            Company
          </label>
          <div className='d-flex align-items-center input-group input-group-solid'>
            <Select
              sm={true}
              className='col p-0'
              name='company_guid'
              api={getCompany}
              isClearable={false}
              params={{orderCol: 'name', orderDir: 'asc'}}
              placeholder='Choose Company'
              defaultValue={values?.company || values?.company_guid}
              onChange={(e: any) => {
                setCompanyGuid(e?.value)
                setFieldValue('company_guid', e?.value || '')
                setFieldValue('company', e || '')
                setFieldValue('company_department_guid', '')
                setClearOption(true)
              }}
              parse={({guid, name}: any) => ({value: guid, label: name})}
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
          {database?.company_guid?.is_required && (
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name='company_guid' />
            </div>
          )}
        </div>
      )}
      {database?.company_department_guid?.is_selected && (
        <div className={configClass?.grid}>
          <label
            htmlFor='company_department_guid'
            className={`${configClass?.label} ${
              database?.company_department_guid?.is_required ? 'required' : ''
            }`}
          >
            Department
          </label>
          <div className='d-flex align-items-center input-group input-group-solid'>
            <Select
              sm={true}
              name='company_department_guid'
              className='col p-0'
              api={getDepartment}
              params={{'filter[company_guid]': companyGuid || '-'}}
              placeholder='Choose Department'
              defaultValue={{
                value: employeeDetail?.company_department?.guid,
                label: employeeDetail?.company_department?.name,
              }}
              onChange={({value}: any) => setFieldValue('company_department_guid', value || '')}
              parse={({guid, name}: any) => ({value: guid, label: name})}
              clearOption={clearOption}
            />
            <AddInputBtn
              dataCy='addDepartment'
              size={'sm'}
              onClick={() => {
                setDepartmentDetail(undefined)
                setShowModalDepartment(true)
              }}
            />
          </div>
          {database?.company_department_guid?.is_required && (
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name='company_department_guid' />
            </div>
          )}
        </div>
      )}
    </>
  )
}
export default SelectCompany
