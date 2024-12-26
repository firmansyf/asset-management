import {arrayConcat} from '@helpers'
import {filter, includes, sortBy} from 'lodash'
import {FC, useEffect, useState} from 'react'

import RoleTable from '../sections/RoleTable'

type ApprovalRolesProps = {
  roleApproval?: any
  approvalRoles: any
  setApprovalRoles: any
  dataImportExport?: any
  roleSetupColumns?: any
}

const ApprovalRoles: FC<ApprovalRolesProps> = ({
  roleApproval,
  approvalRoles,
  setApprovalRoles,
  dataImportExport,
  roleSetupColumns,
}) => {
  const [dataImport, setDataImport] = useState<any>([])
  const [dataSetting, setDataSetting] = useState<any>([])
  const [dataSetupColumns, setDataSetupColumns] = useState<any>([])

  useEffect(() => {
    if (roleApproval !== undefined) {
      roleApproval?.map((data_role: any) => setDataSetting(data_role?.items))

      dataImportExport?.map((data_role: any) => setDataImport(data_role?.items))

      roleSetupColumns?.map((data_role: any) => setDataSetupColumns(data_role?.items))

      const data_setting: any = [
        {
          id: 'settings',
          items: arrayConcat(dataSetting, dataImport, dataSetupColumns),
        },
      ]
      data_setting?.map((data_role: any) => {
        const data_approval: any = [
          'approval.list.history',
          'approval.list.insurance_claim',
          'approval.list.maintenance',
          'approval.setting.add',
          'approval.setting.delete',
          'approval.setting.edit',
          'approval.setting.toggle',
          'approval.setting.view',
        ]

        const dataApproval: any = filter(data_role?.items, (role: any) =>
          includes(data_approval, role?.name)
        )
        return setApprovalRoles(sortBy(dataApproval, 'label') as never)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleApproval, dataImportExport, setApprovalRoles, dataSetting, dataImport])

  return (
    <div className='container'>
      <div className='mb-0 mt-10'>
        <h3>Approval</h3>
      </div>
      <div className='mb-10'>Set user&apos;s permission add/edit/delete/view.</div>
      <RoleTable
        dataRoles={approvalRoles}
        setDataRoles={setApprovalRoles}
        roleName={'approval'}
        roleTitle={'Approval'}
      />
    </div>
  )
}

export default ApprovalRoles
