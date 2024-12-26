import {filter, includes} from 'lodash'
import {FC, memo, useEffect} from 'react'

import RoleTable from '../sections/RoleTable'

type SetupColumnsRolesProps = {
  feature: any
  roleSetupColumns: any
  setupColumnsRoles: any
  setSetupColumnsRoles: any
}
let SetupColumnsRoles: FC<SetupColumnsRolesProps> = ({
  feature,
  roleSetupColumns,
  setupColumnsRoles,
  setSetupColumnsRoles,
}) => {
  useEffect(() => {
    if (roleSetupColumns !== undefined) {
      roleSetupColumns.map((data_role: any) => {
        let data_setup_column = [
          'setup-column.setup_column_asset',
          'setup-column.setup_column_company',
          'setup-column.setup_column_custom_report',
          'setup-column.setup_column_employee',
          'setup-column.setup_column_location',
          'setup-column.setup_column_maintenance_request',
          'setup-column.setup_column_myasset',
          'setup-column.setup_column_supplier',
          'setup-column.setup_column_vendor',
          'setup-column.setup_column_user',
        ]
        if (feature?.insurance === 1) {
          data_setup_column = [...data_setup_column, 'setup-column.setup_column_insurance_policies']
        }
        if (feature?.warranty === 1) {
          data_setup_column = [...data_setup_column, 'setup-column.setup_column_warranty']
        }
        const dataColumns: any = filter(data_role.items, (role: any) =>
          includes(data_setup_column, role?.name)
        )
        return setSetupColumnsRoles(dataColumns as never)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleSetupColumns, setSetupColumnsRoles])

  return (
    <div className='container'>
      <div className='mb-0 mt-10'>
        <h3>Setup Columns</h3>
      </div>
      <div className='mb-10'>{"Set user's permission add/edit/delete/view."}</div>
      <RoleTable
        dataRoles={setupColumnsRoles}
        setDataRoles={setSetupColumnsRoles}
        roleName={'setupColumnsRoles'}
        roleTitle={'Setup Columns'}
      />
    </div>
  )
}

SetupColumnsRoles = memo(
  SetupColumnsRoles,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default SetupColumnsRoles
