/* eslint-disable react-hooks/exhaustive-deps */
import {getCompany} from '@api/company'
import {getDepartment} from '@api/department'
import {AddInputBtn} from '@components/button/Add'
import {Select} from '@components/select/ajax'
import {configClass} from '@helpers'
import {ErrorMessage, useFormikContext} from 'formik'
import {FC, memo, useEffect, useState} from 'react'

interface Props {
  setShowModalUserCompany?: any
  setShowModalUserDepartment?: any
  reloadCompany: any
  reloadDepartment: any
  userDetail?: any
}

let SelectCompany: FC<Props> = ({
  setShowModalUserCompany,
  setShowModalUserDepartment,
  userDetail,
}) => {
  const {values, setFieldValue} = useFormikContext<any>()
  const [companyGuid, setCompanyGuid] = useState<any>(userDetail?.company?.guid || '')
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
      <div className={configClass?.grid}>
        <label htmlFor='company' className={`${configClass?.label} required`}>
          Company
        </label>
        <div className='d-flex align-items-center input-group input-group-solid'>
          <Select
            sm={true}
            className='col p-0'
            api={getCompany}
            params={{orderCol: 'name', orderDir: 'asc'}}
            placeholder='Choose Company'
            isClearable={false}
            defaultValue={values?.company || values?.company_guid}
            onChange={(e: any) => {
              setCompanyGuid(e?.value || '')
              setFieldValue('company_guid', e?.value || '')
              setFieldValue('company', e || '')
              setFieldValue('company_department_guid', '')
              setClearOption(true)
            }}
            parse={({guid, name}: any) => ({value: guid, label: name})}
          />
          <AddInputBtn
            size={'sm'}
            onClick={() => {
              setShowModalUserCompany(true)
            }}
          />
        </div>
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='company_guid' />
        </div>
      </div>
      <div className={configClass?.modalForm}>
        <label htmlFor='Department' className={configClass?.label}>
          Department
        </label>
        <div className='d-flex align-items-center input-group input-group-solid'>
          <Select
            sm={true}
            className='col p-0'
            name='company_department_guid'
            api={getDepartment}
            params={{'filter[company_guid]': companyGuid || ''}}
            placeholder='Choose Department'
            defaultValue={{
              value: userDetail?.company_department?.guid,
              label: userDetail?.company_department?.name,
            }}
            onChange={({value}: any) => setFieldValue('company_department_guid', value || '')}
            parse={({guid, name}: any) => ({value: guid, label: name})}
            clearOption={clearOption}
          />
          <AddInputBtn
            title='Add Department'
            size={'sm'}
            onClick={() => {
              setShowModalUserDepartment(true)
            }}
          />
        </div>
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='company_department_guid' />
        </div>
      </div>
    </>
  )
}

SelectCompany = memo(
  SelectCompany,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {SelectCompany}
