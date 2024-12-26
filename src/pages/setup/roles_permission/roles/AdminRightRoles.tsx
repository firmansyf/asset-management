import {roleImportConcat} from '@helpers'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import {FC, memo, useEffect} from 'react'

import RoleTable from '../sections/RoleTable'

type AdminRightRolesProps = {
  feature: any
  userManagementRoles: any
  setUserManagementRoles: any
  employeeRoles: any
  setEmployeeRoles: any
  teamRoles: any
  setTeamRoles: any
  alertRoles: any
  setAlertRoles: any
  preferenceRoles: any
  setPreferenceRoles: any
  loginRoles: any
  setLoginRoles: any
  profileRoles: any
  setProfileRoles: any
  billingRoles: any
  setBillingRoles: any
  dataImportExport: any
  dataEmployee: any
  roleHelpDesk: any
  contactRoles: any
  setContactRoles: any
}

let AdminRightRoles: FC<AdminRightRolesProps> = ({
  feature,
  userManagementRoles,
  setUserManagementRoles,
  employeeRoles,
  setEmployeeRoles,
  teamRoles,
  setTeamRoles,
  alertRoles,
  setAlertRoles,
  preferenceRoles,
  setPreferenceRoles,
  loginRoles,
  setLoginRoles,
  profileRoles,
  setProfileRoles,
  billingRoles,
  setBillingRoles,
  dataImportExport,
  dataEmployee,
  roleHelpDesk,
  contactRoles,
  setContactRoles,
}) => {
  useEffect(() => {
    dataImportExport?.map((data_role: any) => {
      if (feature?.bulk_import === 1) {
        setEmployeeRoles(
          roleImportConcat(['import-export.import_employee'], data_role, dataEmployee)
        )
      } else {
        setEmployeeRoles(dataEmployee)
      }
      return true
    })

    roleHelpDesk?.map((data_role: any) => {
      let data_contact = [
        'help-desk.contact.view',
        'help-desk.contact.add',
        'help-desk.contact.edit',
        'help-desk.contact.delete',
        'help-desk.contact.export',
        'help-desk.contact.setup-column',
      ]
      if (feature?.bulk_import === 1) {
        data_contact = [...data_contact, 'help-desk.contact.export']
      }
      const dataContact: any = filter(data_role?.items, (role: any) =>
        includes(data_contact, role?.name)
      )
      return setContactRoles(dataContact as never)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataImportExport, dataEmployee, setEmployeeRoles, roleHelpDesk, setContactRoles])

  return (
    <div className='container'>
      <div className='mb-0 mt-10'>
        <h3>Permission</h3>
      </div>
      <div className='mb-10'>{"Set user's permission for admin rights."}</div>

      <div className='row'>
        <div className='col-sm-12 col-md-6 col-lg-6'>
          <RoleTable
            dataRoles={userManagementRoles}
            setDataRoles={setUserManagementRoles}
            roleName={'user-management'}
            roleTitle={'Users'}
          />
          <RoleTable
            dataRoles={teamRoles}
            setDataRoles={setTeamRoles}
            roleName={'team'}
            roleTitle={'Team'}
          />
          <RoleTable
            dataRoles={preferenceRoles}
            setDataRoles={setPreferenceRoles}
            roleName={'preference'}
            roleTitle={'Preference'}
          />
          <RoleTable
            dataRoles={profileRoles}
            setDataRoles={setProfileRoles}
            roleName={'profile'}
            roleTitle={'Profile'}
          />
          <RoleTable
            dataRoles={billingRoles}
            setDataRoles={setBillingRoles}
            roleName={'billing'}
            roleTitle={'Billing'}
          />
        </div>
        <div className='col-sm-12 col-md-6 col-lg-6'>
          <RoleTable
            dataRoles={employeeRoles}
            setDataRoles={setEmployeeRoles}
            roleName={'employee'}
            roleTitle={'Employee'}
          />
          <RoleTable
            dataRoles={alertRoles}
            setDataRoles={setAlertRoles}
            roleName={'alert'}
            roleTitle={'Alert'}
          />
          <RoleTable
            dataRoles={contactRoles}
            setDataRoles={setContactRoles}
            roleName={'contact'}
            roleTitle={'Contact'}
          />
          <RoleTable
            dataRoles={loginRoles}
            setDataRoles={setLoginRoles}
            roleName={'login'}
            roleTitle={'Login'}
          />
        </div>
      </div>
    </div>
  )
}

AdminRightRoles = memo(
  AdminRightRoles,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default AdminRightRoles
