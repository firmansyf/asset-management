import {Select} from '@components/select/ajax'
import {configClass} from '@helpers'
import {getRole} from '@pages/setup/roles_permission/Service'
import {ErrorMessage} from 'formik'
import {FC, memo, useEffect, useState} from 'react'
import {Link} from 'react-router-dom'

interface Props {
  setFieldValue: any
  userDetail: any
  reloadRole?: any
  user?: any
  data: any
  defaultRole: any
}

let UserRole: FC<Props> = ({setFieldValue, userDetail, reloadRole, user, defaultRole}) => {
  const [defaultValue, setDefaultValue] = useState<any>({})

  useEffect(() => {
    userDetail && setFieldValue('role', userDetail?.roles?.[0]?.name)
  }, [userDetail, setFieldValue])

  useEffect(() => {
    let val: any = {}
    if (userDetail) {
      val = {
        value: userDetail?.roles?.[0]?.name,
        label: userDetail?.roles?.[0]?.label,
      }
    } else if (defaultRole === 'agent') {
      val = {
        value: 'agent',
        label: 'Agent',
      }
    } else if (defaultRole === 'worker') {
      val = {
        value: 'worker',
        label: 'Worker',
      }
    } else {
      val = {}
    }
    setDefaultValue(val)
  }, [defaultRole, userDetail])

  return (
    <>
      <label htmlFor='role' className={`${configClass?.label} required`}>
        Role
      </label>
      <div className='row'>
        <div className='col'>
          <Select
            sm={true}
            className='w-100'
            name='role'
            api={getRole}
            params={{
              orderCol: 'name',
              orderDir: 'asc',
            }}
            isClearable={false}
            reload={reloadRole}
            placeholder='Select Role'
            defaultValue={defaultValue}
            removeOption={[{value: 'owner', label: 'Account Owner'}]}
            onChange={(e: any) => {
              setFieldValue('role', e?.value || '')
            }}
            parse={({name, label}: any) => ({value: name, label: label})}
          />
          <span className='fv-plugins-message-container invalid-feedback'>
            <ErrorMessage name='role' />
          </span>
        </div>
        {(user?.role_name === 'admin' || user?.role_name === 'owner') && (
          <div className='col-auto ps-0'>
            <Link to={`/setup/role-permission`}>
              <div className='btn btn-sm btn-primary w-100'>Manage</div>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

UserRole = memo(UserRole, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export {UserRole}
