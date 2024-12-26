import {checkLength, updateRoles, updateRolesAll} from '@helpers'
import {FC, memo, useEffect, useState} from 'react'
import {Table} from 'react-bootstrap'

type SectionProps = {
  dataRoles: any
  setDataRoles: any
  roleName: any
  roleTitle: any
}

let RoleTable: FC<SectionProps> = ({dataRoles, setDataRoles, roleName, roleTitle}) => {
  const [chackAllRole, setChackAllRole] = useState(false)

  const handleCheckChield = (checked: any, role_name: any) => {
    if (role_name === roleName) {
      const new_arr_roles: any = dataRoles?.map((item: any) => updateRoles(checked, item))
      setDataRoles(new_arr_roles as never)
      if (checked.target.checked === false) {
        setChackAllRole(false)
      }
    }
  }

  const handleAllChecked = (checked: any, role_name: any) => {
    if (role_name === roleName) {
      const new_arr_roles: any = dataRoles?.map((item: any) => updateRolesAll(checked, item))
      setDataRoles(new_arr_roles as never)
      setChackAllRole(checked)
    }
  }

  useEffect(() => {
    let role_count = 0
    dataRoles
      ?.filter((role: {is_allow: any}) => role.is_allow === 1)
      .map((data_role: any) => {
        if (data_role.is_allow === 1) {
          role_count++
        }
        return true
      })
    setChackAllRole(checkLength(role_count, dataRoles?.length))
  }, [dataRoles])

  return (
    <div className='row'>
      <div className='col-sm-11 mb-10'>
        <Table striped bordered hover>
          <thead>
            <tr className='border-bottom border-primary'>
              <th style={{width: 10}}>
                <div className='form-check form-check-custom form-check-solid mx-5'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    name='checkall'
                    value='true'
                    checked={chackAllRole}
                    onChange={(e: any) => handleAllChecked(e.target.checked, roleName)}
                  />
                </div>
              </th>
              <th className='fw-bold fs-5'>{roleTitle}</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(dataRoles) &&
              dataRoles &&
              dataRoles?.map(({name, label, is_allow}: any, index: any) => {
                return (
                  <tr key={index} className='border-bottom mt-15 mb-15'>
                    <td>
                      <div className='form-check form-check-custom form-check-solid mx-5'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          name={name}
                          checked={is_allow}
                          defaultChecked={is_allow}
                          onChange={(e: any) => handleCheckChield(e, roleName)}
                        />
                      </div>
                    </td>
                    <td>{label}</td>
                  </tr>
                )
              })}
          </tbody>
        </Table>
      </div>
    </div>
  )
}

RoleTable = memo(RoleTable, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default RoleTable
