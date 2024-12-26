import {arrayConcat} from '@helpers'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import {FC, memo, useEffect, useState} from 'react'

import RoleTable from '../sections/RoleTable'

type SettingRolesProps = {
  feature: any
  roleSettings: any
  categoryRoles: any
  setCategoryRoles: any
  departmentRoles: any
  setDepartmentRoles: any
  companyRoles: any
  setCompanyRoles: any
  modelRoles: any
  setModelRoles: any
  assetStatusRoles: any
  setAssetStatusRoles: any
  typeRoles: any
  setTypeRoles: any
  featureRoles: any
  setFeatureRoles: any
  manufacturerRoles: any
  setManufacturerRoles: any
  brandRoles: any
  setBrandRoles: any
  supplierRoles: any
  setSupplierRoles: any
  customFieldRoles: any
  setCustomFieldRoles: any
  databaseRoles: any
  setDatabaseRoles: any
  dataImportExport: any
}
let SettingRoles: FC<SettingRolesProps> = ({
  feature,
  roleSettings,
  categoryRoles,
  setCategoryRoles,
  departmentRoles,
  setDepartmentRoles,
  companyRoles,
  setCompanyRoles,
  modelRoles,
  setModelRoles,
  assetStatusRoles,
  setAssetStatusRoles,
  typeRoles,
  setTypeRoles,
  featureRoles,
  setFeatureRoles,
  manufacturerRoles,
  setManufacturerRoles,
  brandRoles,
  setBrandRoles,
  supplierRoles,
  setSupplierRoles,
  customFieldRoles,
  setCustomFieldRoles,
  databaseRoles,
  setDatabaseRoles,
  dataImportExport,
}) => {
  const [dataSetting, setDataSetting] = useState([])
  const [dataImport, setDataImport] = useState([])

  useEffect(() => {
    roleSettings?.map((data_role: any) => setDataSetting(data_role?.items))
    dataImportExport?.map((data_role: any) => setDataImport(data_role?.items))
    const data_setting = [
      {
        id: 'settings',
        items: arrayConcat(dataSetting, dataImport),
      },
    ]

    data_setting?.map((data_role: any) => {
      let data_category = [
        'setting.category.view',
        'setting.category.add',
        'setting.category.edit',
        'setting.category.delete',
        'setting.category.export',
      ]
      if (feature?.bulk_import === 1) {
        data_category = [...data_category, 'import-export.import_categories']
      }
      const dataCategory: any = filter(data_role?.items, (role: any) =>
        includes(data_category, role?.name)
      )
      return setCategoryRoles(dataCategory as never)
    })

    data_setting?.map((data_role: any) => {
      let data_department = [
        'setting.department.view',
        'setting.department.add',
        'setting.department.edit',
        'setting.department.delete',
        'setting.department.export',
      ]
      if (feature?.bulk_import === 1) {
        data_department = [...data_department, 'import-export.import_department']
      }
      const dataDepartment: any = filter(data_role?.items, (role: any) =>
        includes(data_department, role?.name)
      )
      return setDepartmentRoles(dataDepartment as never)
    })

    data_setting?.map((data_role: any) => {
      let data_model = [
        'setting.model.view',
        'setting.model.add',
        'setting.model.edit',
        'setting.model.delete',
        'setting.model.export',
      ]
      if (feature?.bulk_import === 1) {
        data_model = [...data_model, 'import-export.import_model']
      }
      const dataModel: any = filter(data_role?.items, (role: any) =>
        includes(data_model, role?.name)
      )
      return setModelRoles(dataModel as never)
    })

    data_setting?.map((data_role: any) => {
      let data_asset_status = [
        'setting.status.view',
        'setting.status.add',
        'setting.status.edit',
        'setting.status.delete',
        'setting.status.export',
      ]
      if (feature?.bulk_import === 1) {
        data_asset_status = [...data_asset_status, 'import-export.import_asset_status']
      }
      const dataAssetStatus: any = filter(data_role?.items, (role: any) =>
        includes(data_asset_status, role?.name)
      )
      return setAssetStatusRoles(dataAssetStatus as never)
    })

    data_setting?.map((data_role: any) => {
      let data_type = [
        'setting.type.view',
        'setting.type.add',
        'setting.type.edit',
        'setting.type.delete',
        'setting.type.export',
      ]
      if (feature?.bulk_import === 1) {
        data_type = [...data_type, 'import-export.import_type']
      }
      const dataType: any = filter(data_role?.items, (role: any) => includes(data_type, role?.name))
      return setTypeRoles(dataType as never)
    })
    data_setting?.map((data_role: any) => {
      const data_feature = ['setting.feature.view', 'setting.feature.edit']
      const dataFeature: any = filter(data_role?.items, (role: any) =>
        includes(data_feature, role?.name)
      )
      return setFeatureRoles(dataFeature as never)
    })

    data_setting?.map((data_role: any) => {
      let data_company = [
        'setting.company.view',
        'setting.company.add',
        'setting.company.edit',
        'setting.company.delete',
        'setting.company.export',
      ]
      if (feature?.bulk_import === 1) {
        data_company = [...data_company, 'import-export.import_company']
      }
      const dataCompany: any = filter(data_role?.items, (role: any) =>
        includes(data_company, role?.name)
      )
      return setCompanyRoles(dataCompany as never)
    })
    data_setting?.map((data_role: any) => {
      let data_manufacturer = [
        'setting.manufacturer.view',
        'setting.manufacturer.add',
        'setting.manufacturer.edit',
        'setting.manufacturer.delete',
        'setting.manufacturer.export',
      ]
      if (feature?.bulk_import === 1) {
        data_manufacturer = [...data_manufacturer, 'import-export.import_manufacturer']
      }
      const dataManufacturer: any = filter(data_role?.items, (role: any) =>
        includes(data_manufacturer, role?.name)
      )
      return setManufacturerRoles(dataManufacturer as never)
    })

    data_setting?.map((data_role: any) => {
      let data_brand = [
        'setting.brand.view',
        'setting.brand.add',
        'setting.brand.edit',
        'setting.brand.delete',
        'setting.brand.export',
      ]
      if (feature?.bulk_import === 1) {
        data_brand = [...data_brand, 'import-export.import_brand']
      }
      const dataBrand: any = filter(data_role?.items, (role: any) =>
        includes(data_brand, role?.name)
      )
      return setBrandRoles(dataBrand as never)
    })
    data_setting?.map((data_role: any) => {
      let data_supplier = [
        'setting.supplier.view',
        'setting.supplier.add',
        'setting.supplier.edit',
        'setting.supplier.delete',
        'setting.supplier.export',
      ]
      if (feature?.bulk_import === 1) {
        data_supplier = [...data_supplier, 'import-export.import_supplier']
      }
      const dataSupplier: any = filter(data_role?.items, (role: any) =>
        includes(data_supplier, role?.name)
      )
      return setSupplierRoles(dataSupplier as never)
    })

    data_setting?.map((data_role: any) => {
      const data_custom = [
        'setting.custom-field.view',
        'setting.custom-field.add',
        'setting.custom-field.edit',
        'setting.custom-field.delete',
      ]
      const dataCustomField: any = filter(data_role?.items, (role: any) =>
        includes(data_custom, role?.name)
      )
      return setCustomFieldRoles(dataCustomField as never)
    })

    data_setting?.map((data_role: any) => {
      const data_database = ['setting.database.view', 'setting.database.edit']
      const dataDatabase: any = filter(data_role?.items, (role: any) =>
        includes(data_database, role?.name)
      )
      return setDatabaseRoles(dataDatabase as never)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    roleSettings,
    setCategoryRoles,
    setDepartmentRoles,
    setCompanyRoles,
    setManufacturerRoles,
    setModelRoles,
    setAssetStatusRoles,
    setTypeRoles,
    setFeatureRoles,
    setBrandRoles,
    setSupplierRoles,
    setCustomFieldRoles,
    setDatabaseRoles,
    dataImportExport,
    dataSetting,
    dataImport,
  ])

  return (
    <div className='container'>
      <div className='mb-0 mt-10'>
        <h3>Permission</h3>
      </div>
      <div className='mb-10'>Set user&apos;s permission add/edit/delete/view.</div>
      <div className='row'>
        <div className='col-sm-12 col-md-6 col-lg-6'>
          <RoleTable
            dataRoles={categoryRoles}
            setDataRoles={setCategoryRoles}
            roleName={'category'}
            roleTitle={'Category'}
          />
          <RoleTable
            dataRoles={departmentRoles}
            setDataRoles={setDepartmentRoles}
            roleName={'depatment'}
            roleTitle={'Department'}
          />
          <RoleTable
            dataRoles={modelRoles}
            setDataRoles={setModelRoles}
            roleName={'model'}
            roleTitle={'Model'}
          />
          <RoleTable
            dataRoles={assetStatusRoles}
            setDataRoles={setAssetStatusRoles}
            roleName={'asset-status'}
            roleTitle={'Asset Status'}
          />
          <RoleTable
            dataRoles={typeRoles}
            setDataRoles={setTypeRoles}
            roleName={'type'}
            roleTitle={'Type'}
          />
          <RoleTable
            dataRoles={featureRoles}
            setDataRoles={setFeatureRoles}
            roleName={'feature'}
            roleTitle={'Feature'}
          />
        </div>
        <div className='col-sm-12 col-md-6 col-lg-6'>
          <RoleTable
            dataRoles={companyRoles}
            setDataRoles={setCompanyRoles}
            roleName={'company'}
            roleTitle={'Company'}
          />
          <RoleTable
            dataRoles={manufacturerRoles}
            setDataRoles={setManufacturerRoles}
            roleName={'manufacturer'}
            roleTitle={'Manufacturer'}
          />
          <RoleTable
            dataRoles={brandRoles}
            setDataRoles={setBrandRoles}
            roleName={'brand'}
            roleTitle={'Brand'}
          />
          <RoleTable
            dataRoles={supplierRoles}
            setDataRoles={setSupplierRoles}
            roleName={'suplier'}
            roleTitle={'Supplier'}
          />
          {feature?.custom_field === 1 && (
            <RoleTable
              dataRoles={customFieldRoles}
              setDataRoles={setCustomFieldRoles}
              roleName={'custom-field'}
              roleTitle={'Custom Field'}
            />
          )}
          <RoleTable
            dataRoles={databaseRoles}
            setDataRoles={setDatabaseRoles}
            roleName={'database'}
            roleTitle={'Database'}
          />
        </div>
      </div>
    </div>
  )
}

SettingRoles = memo(
  SettingRoles,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default SettingRoles
