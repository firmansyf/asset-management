import {roleImportConcat} from '@helpers'
import {filter, includes} from 'lodash'
import {FC, memo, useEffect} from 'react'

import RoleTable from '../sections/RoleTable'

type AssetRolesProps = {
  feature: any
  assetManagementRoles: any
  setAssetManagementRoles: any
  insurancePolicyRoles: any
  setInsurancePolicyRoles: any
  warrantyRoles: any
  setWarrantyRoles: any
  myAssetRoles: any
  setMyAssetRoles: any
  auditRoles: any
  setAuditRoles: any
  dataImportExport: any
  dataAssetManagement: any
  dataInsurancePolicy: any
  dataWarranty: any
  roleAssetReservation: any
  assetReservRoles: any
  setAssetReservRoles: any
}

const AssetRole: FC<AssetRolesProps> = ({
  feature,
  assetManagementRoles,
  setAssetManagementRoles,
  insurancePolicyRoles,
  setInsurancePolicyRoles,
  warrantyRoles,
  setWarrantyRoles,
  myAssetRoles,
  setMyAssetRoles,
  auditRoles,
  setAuditRoles,
  dataImportExport,
  dataAssetManagement,
  dataInsurancePolicy,
  dataWarranty,
  roleAssetReservation,
  assetReservRoles,
  setAssetReservRoles,
}) => {
  const removeByIndex: any = (array: any, index: any) =>
    array?.filter((_a: any, i: any) => index !== i)

  useEffect(() => {
    dataImportExport?.map((data_role: any) => {
      if (feature?.bulk_import === 1) {
        setAssetManagementRoles(
          roleImportConcat(
            ['import-export.import_assets'],
            data_role,
            removeByIndex(dataAssetManagement, 1)
          )
        )
        setInsurancePolicyRoles(
          roleImportConcat(
            ['import-export.import_insurance_policies'],
            data_role,
            dataInsurancePolicy
          )
        )
        setWarrantyRoles(
          roleImportConcat(['import-export.import_warranty'], data_role, dataWarranty)
        )
      } else {
        setAssetManagementRoles(removeByIndex(dataAssetManagement, 1))
        setInsurancePolicyRoles(dataInsurancePolicy)
        setWarrantyRoles(dataWarranty)
      }
      return true
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dataImportExport,
    dataAssetManagement,
    setAssetManagementRoles,
    dataInsurancePolicy,
    setInsurancePolicyRoles,
    dataWarranty,
    setWarrantyRoles,
  ])

  useEffect(() => {
    roleAssetReservation?.map((data_role: any) => {
      const data_asset_reserve: any = [
        'asset-reservation.add',
        'asset-reservation.edit',
        'asset-reservation.view',
      ]
      const dataAssetReserve: any = filter(data_role?.items, (role: any) =>
        includes(data_asset_reserve, role?.name)
      )
      return setAssetReservRoles(dataAssetReserve)
    })
  }, [roleAssetReservation, setAssetReservRoles])

  return (
    <div className='container'>
      <div className='mb-0 mt-10'>
        <h3>Permission</h3>
      </div>
      <div className='mb-10'>Set user&apos;s permission add/edit/delete/view.</div>
      <div className='row'>
        <div className='col-sm-12 col-md-6 col-lg-6'>
          <RoleTable
            dataRoles={assetManagementRoles}
            setDataRoles={setAssetManagementRoles}
            roleName={'asset-management'}
            roleTitle={'Assets'}
          />
          {feature?.my_asset === 1 && (
            <RoleTable
              dataRoles={myAssetRoles}
              setDataRoles={setMyAssetRoles}
              roleName={'my-assets'}
              roleTitle={'My Assets'}
            />
          )}
          {feature?.warranty === 1 && (
            <RoleTable
              dataRoles={warrantyRoles}
              setDataRoles={setWarrantyRoles}
              roleName={'warranty'}
              roleTitle={'Warranty'}
            />
          )}
        </div>
        <div className='col-sm-12 col-md-6 col-lg-6'>
          <RoleTable
            dataRoles={assetReservRoles}
            setDataRoles={setAssetReservRoles}
            roleName={'asset-reservation'}
            roleTitle={'Asset Reservation'}
          />
          {feature?.insurance === 1 && (
            <RoleTable
              dataRoles={insurancePolicyRoles}
              setDataRoles={setInsurancePolicyRoles}
              roleName={'insurance_policy'}
              roleTitle={'Insurance Policies'}
            />
          )}
          <RoleTable
            dataRoles={auditRoles}
            setDataRoles={setAuditRoles}
            roleName={'audit'}
            roleTitle={'Audit'}
          />
        </div>
      </div>
    </div>
  )
}

const AssetRoles = memo(
  AssetRole,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)

export default AssetRoles
