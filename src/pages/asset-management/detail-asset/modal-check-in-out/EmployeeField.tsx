import {getUserEmployee, getUserV1} from '@api/UserCRUD'
import {Select} from '@components/select/ajax'
import {configClass} from '@helpers'
import {getEmployeeV1} from '@pages/user-management/redux/EmployeeCRUD'
import {ErrorMessage} from 'formik'
import {FC, memo, useEffect, useState} from 'react'

const CheckInOutAssignee: FC<any> = ({setFieldValue, checkout, destination}) => {
  const [defaultValue, setDefaultValue] = useState<any>({})

  useEffect(() => {
    if (destination === 'assignee') {
      if (checkout?.assignee?.type === 'employee') {
        getEmployeeV1({filter: {guid: checkout?.assignee?.guid}}).then(({data: {data}}: any) => {
          if (data?.length > 0) {
            setDefaultValue({
              value: data?.[0]?.guid || '',
              label: data?.[0]?.full_name || '',
              type: 'employee',
            })
          } else {
            setDefaultValue({})
          }
        })
      } else if (checkout?.assignee?.type === 'user') {
        getUserV1({filter: {guid: checkout?.assignee?.guid}}).then(({data: {data}}: any) => {
          if (data?.length > 0) {
            setDefaultValue({
              value: data?.[0]?.guid || '',
              label: `${data?.[0]?.first_name || ''} ${data?.[0]?.last_name || ''}`,
              type: 'user',
            })
          } else {
            setDefaultValue({})
          }
        })
      } else {
        setDefaultValue({})
      }
      setFieldValue('assignee_guid', '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination])

  return (
    <div className='col-md-12 mt-5'>
      <label htmlFor='assignee_guid' className={`${configClass?.label} required`}>
        Assigned User or Employee
      </label>

      <Select
        sm={true}
        api={getUserEmployee}
        params={{orderCol: 'full_name', orderDir: 'asc'}}
        reload={false}
        id='assignee_guid'
        className='col p-0'
        name='assignee_guid'
        defaultValue={defaultValue}
        placeholder='Choose Assigned User or Employee'
        onChange={({value, type}: any) => {
          setFieldValue('assignee_guid', value || '')
          setFieldValue('assignee_type', type || '')
        }}
        parse={({guid, full_name, type}: any) => ({
          type: type || '',
          value: guid || '',
          label: full_name || '',
        })}
      />

      <div className='fv-plugins-message-container invalid-feedback'>
        <ErrorMessage name='assignee_guid' />
      </div>
    </div>
  )
}

const EmployeeField = memo(
  CheckInOutAssignee,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default EmployeeField
