/* eslint-disable react-hooks/exhaustive-deps */
import {arrayConcat} from '@helpers'
import {filter, includes, sortBy} from 'lodash'
import {FC, memo, useEffect, useState} from 'react'

import RoleTable from '../sections/RoleTable'

type InsuranceRolesProps = {
  feature?: any
  insuranceClaimRoles: any
  setInsuranceClaimRoles: any
  roleInsurance?: any
  dataImportExport?: any
  roleSetupColumns?: any
}

let InsuranceRoles: FC<InsuranceRolesProps> = ({
  feature,
  insuranceClaimRoles,
  setInsuranceClaimRoles,
  roleInsurance,
  dataImportExport,
  roleSetupColumns,
}) => {
  const [dataSetting, setDataSetting] = useState([])
  const [dataImport, setDataImport] = useState([])
  const [dataSetupColumns, setDataSetupColumns] = useState([])

  useEffect(() => {
    if (roleSetupColumns !== undefined) {
      roleSetupColumns?.map((data_role: any) => setDataSetupColumns(data_role?.items))
    }

    if (roleInsurance !== undefined) {
      roleInsurance?.map((data_role: any) => setDataSetting(data_role?.items))
      dataImportExport?.map((data_role: any) => setDataImport(data_role?.items))
      const data_setting = [
        {
          id: 'settings',
          items: arrayConcat(dataSetting, dataImport, dataSetupColumns),
        },
      ]
      data_setting.map((data_role: any) => {
        let data_insurance_claim = [
          // 'insurance_claim.add', Remove by PET-508
          'insurance_claim.approval_history',
          'insurance_claim.approval_list',
          'insurance_claim.delete',
          'insurance_claim.document_delete',
          'insurance_claim.document_edit',
          'insurance_claim.document_upload',
          'insurance_claim.download_form',
          'insurance_claim.edit',
          'insurance_claim.export',
          'insurance_claim.gr_done',
          'insurance_claim.insert_ro_number',
          'insurance_claim.invoice_delete',
          'insurance_claim.invoice_edit',
          'insurance_claim.invoice_upload',
          'insurance_claim.manage_link_case',
          'insurance_claim.resubmit',
          'insurance_claim.setup.add',
          'insurance_claim.setup.delete',
          'insurance_claim.setup.edit',
          'insurance_claim.setup.view',
          'insurance_claim.submit_first_review',
          'insurance_claim.submit_for_approval',
          'insurance_claim.update_post_approval',
          'insurance_claim.undo_gr',
          'insurance_claim.update_digital_field',
          'insurance_claim.update_post_approval',
          'insurance_claim.view',
          'setup-column.setup_column_insurance_claim',
          'insurance_claim.single_import_sap',
        ]
        if (feature?.bulk_import === 1) {
          data_insurance_claim = [...data_insurance_claim, 'import-export.import_insurance']
        }

        const dataInsuranceClaim: any = filter(data_role?.items, (role: any) =>
          includes(data_insurance_claim, role?.name)
        )
        return setInsuranceClaimRoles(sortBy(dataInsuranceClaim, 'label') as never)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleInsurance, dataImportExport, setInsuranceClaimRoles, dataSetting, dataImport])

  return (
    <div className='container'>
      <div className='mb-0 mt-10'>
        <h3>Insurance Claims</h3>
      </div>
      <div className='mb-10'>{`Set user's permission add/edit/delete/view.`}</div>
      <RoleTable
        dataRoles={insuranceClaimRoles}
        setDataRoles={setInsuranceClaimRoles}
        roleName={'insurance_claim'}
        roleTitle={'Insurance Claim'}
      />
    </div>
  )
}

InsuranceRoles = memo(
  InsuranceRoles,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default InsuranceRoles
