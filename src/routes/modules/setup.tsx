import {lazy} from 'react'

const HelpdeskCannedForms: any = lazy(() => import('@pages/help-desk/canned-forms'))
const HelpdeskCannedFormAddEdit: any = lazy(() => import('@pages/help-desk/canned-forms/add'))
const HelpdeskCannedResponse: any = lazy(() => import('@pages/help-desk/canned-response'))
const HelpdeskCannedResponseAddEdit: any = lazy(
  () => import('@pages/help-desk/canned-response/add')
)
const HelpdeskScenario: any = lazy(() => import('@pages/help-desk/scenario'))
const HelpdeskScenarioAddEdit: any = lazy(() => import('@pages/help-desk/scenario/AddEdit'))
const HelpdeskShift: any = lazy(() => import('@pages/help-desk/shift'))
const HelpdeskSLAPolicy: any = lazy(() => import('@pages/help-desk/sla-policy/Index'))
const HelpdeskTags: any = lazy(() => import('@pages/help-desk/tags'))
const HelpdeskTicketType: any = lazy(() => import('@pages/help-desk/ticket-type'))
const HelpdeskWorkingHour: any = lazy(() => import('@pages/help-desk/working-hour'))
const AlertSetting: any = lazy(() => import('@pages/setup/alert/setting/AlertSetting'))
const AlertColumn: any = lazy(() => import('@pages/setup/alert/setting/SetupColumn'))
const CustomEmail: any = lazy(() => import('@pages/setup/custom-email-template'))
const CustomFieldAsset: any = lazy(
  () => import('@pages/setup/custom-field/assets/CustomFieldAsset')
)
const CustomFieldEmployee: any = lazy(
  () => import('@pages/setup/custom-field/employee/CustomFieldEmployee')
)
const CustomFieldInsurance: any = lazy(
  () => import('@pages/setup/custom-field/insurance/CustomFieldInsurance')
)
const CustomFieldInventory: any = lazy(
  () => import('@pages/setup/custom-field/inventory/CustomFieldInventory')
)
const CustomFieldLocation: any = lazy(
  () => import('@pages/setup/custom-field/locations/CustomFieldLocation')
)
const CustomFieldWarranty: any = lazy(
  () => import('@pages/setup/custom-field/warranty/CustomFieldWarranty')
)
const CustomFieldWorkOrder: any = lazy(
  () => import('@pages/setup/custom-field/work-order/CustomFieldWorkOrder')
)
const Databases: any = lazy(() => import('@pages/setup/databases/Databases'))
const InsuranceBackupApprover: any = lazy(() => import('@pages/setup/insurance/backup-approver'))
const InsuranceClaimDocument: any = lazy(() => import('@pages/setup/insurance/claim-document'))
const InsuranceTypeOfPerils: any = lazy(() => import('@pages/setup/insurance/type-of-perils'))
const MaintenanceChecklistAdd: any = lazy(
  () => import('@pages/setup/maintenance/checklist/add-checklist')
)
const MaintenanceChecklist: any = lazy(
  () => import('@pages/setup/maintenance/checklist/MaintenanceChecklist')
)
const MaintenanceCustomer: any = lazy(() => import('@pages/setup/maintenance/customer/Customer'))
const MaintenanceCategory: any = lazy(
  () => import('@pages/setup/maintenance/maintenance-category/MaintenanceCategory')
)
const Preference: any = lazy(() => import('@pages/setup/preference'))
const RolesPermissionAddEdit: any = lazy(
  () => import('@pages/setup/roles_permission/AddEditPermission')
)
const RolesPermission: any = lazy(() => import('@pages/setup/roles_permission/RolesPermission'))
const SettingAssetStatus: any = lazy(() => import('@pages/setup/settings/asset-status/AssetStatus'))
const SettingsBrand: any = lazy(() => import('@pages/setup/settings/brand/Brand'))
const SettingsCategory: any = lazy(() => import('@pages/setup/settings/categories/Category'))
const SettingsCompany: any = lazy(() => import('@pages/setup/settings/companies/Company'))
const SettingsCompanyColumn: any = lazy(
  () => import('@pages/setup/settings/companies/SetupCompanyColumn')
)
const SettingsDataCleanUp: any = lazy(
  () => import('@pages/setup/settings/data-clean-up/DataCleanUp')
)
const SettingsDepartment: any = lazy(() => import('@pages/setup/settings/departements/Department'))
const SettingsFeature: any = lazy(() => import('@pages/setup/settings/feature/Feature'))
const SettingsItemCode: any = lazy(() => import('@pages/setup/settings/item-code/ItemCode'))
const SettingsItemCodeColumn: any = lazy(
  () => import('@pages/setup/settings/item-code/SetupColumn')
)
const SettingsManufacurer: any = lazy(() => import('@pages/setup/settings/manufacture/Manufacurer'))
const SettingsModel: any = lazy(() => import('@pages/setup/settings/model/Model'))
const SettingsSupplierColumn: any = lazy(
  () => import('@pages/setup/settings/supplier/SetupSupplierColumn')
)
const SettingsSupplier: any = lazy(() => import('@pages/setup/settings/supplier/Supplier'))
const SettingsType: any = lazy(() => import('@pages/setup/settings/type/Type'))
const Wiizard: any = lazy(() => import('@pages/wizards/components/Horizontal'))

const routes: any = [
  {
    path: 'setup/*',
    children: [
      // ALERT
      {
        path: 'alert/*',
        children: [
          {path: 'setting', permission: 'alert.view', element: AlertSetting},
          {path: 'settings/columns', permission: 'alert.view', element: AlertColumn},
          {path: 'custom-email-template', superUser: true, element: CustomEmail},
        ],
      },
      // CUSTOM FIELD
      {
        path: 'custom-field/*',
        children: [
          {
            path: 'custom-field-assets',
            permission: 'setting.custom-field.view',
            element: CustomFieldAsset,
          },
          {
            path: 'custom-field-locations',
            permission: 'setting.custom-field.view',
            element: CustomFieldLocation,
          },
          {
            path: 'custom-field-employee',
            permission: 'setting.custom-field.view',
            element: CustomFieldEmployee,
          },
          {
            path: 'custom-field-warranty',
            permission: 'setting.custom-field.view',
            element: CustomFieldWarranty,
          },
          {
            path: 'custom-field-insurance',
            permission: 'setting.custom-field.view',
            element: CustomFieldInsurance,
          },
          {
            path: 'custom-field-inventory',
            permission: 'setting.custom-field.view',
            element: CustomFieldInventory,
          },
          {
            path: 'custom-field-work-order',
            permission: 'setting.custom-field.view',
            element: CustomFieldWorkOrder,
          },
        ],
      },
      // DATABASE
      {path: 'databases', permission: 'setting.database.view', element: Databases},
      // HELPDESK
      {
        path: 'help-desk/*',
        children: [
          {
            path: 'working-hour',
            permission: 'help-desk.working-hour.view',
            element: HelpdeskWorkingHour,
          },
          {path: 'shifts', permission: 'help-desk.shift.view', element: HelpdeskShift},
          {path: 'tags', permission: 'help-desk.tag.view', element: HelpdeskTags},

          {path: 'canned-forms', allUser: true, element: HelpdeskCannedForms},
          {path: 'canned-forms/add', allUser: true, element: HelpdeskCannedFormAddEdit},

          {path: 'canned-response', allUser: true, element: HelpdeskCannedResponse},
          {path: 'canned-response/add', allUser: true, element: HelpdeskCannedResponseAddEdit},

          {path: 'sla-policy', allUser: true, element: HelpdeskSLAPolicy},
          {path: 'scenario', allUser: true, element: HelpdeskScenario},
          {path: 'scenario/add', allUser: true, element: HelpdeskScenarioAddEdit},
          {path: 'scenario/edit/:guid', allUser: true, element: HelpdeskScenarioAddEdit},
          {path: 'ticket-type', allUser: true, element: HelpdeskTicketType},
        ],
      },
      // INSURANCE
      {
        path: 'insurances/*',
        children: [
          {
            path: 'backup-approver',
            permission: 'insurance_claim.setup.view',
            element: InsuranceBackupApprover,
          },
          {
            path: 'claim-document',
            permission: 'insurance_claim.setup.view',
            element: InsuranceClaimDocument,
          },
          {
            path: 'type-perils',
            permission: 'insurance_claim.setup.view',
            element: InsuranceTypeOfPerils,
          },
        ],
      },
      // MAINTENANCE
      {
        path: 'maintenance/*',
        children: [
          {path: 'checklist', allUser: true, element: MaintenanceChecklist},
          {path: 'checklistes/add', allUser: true, element: MaintenanceChecklistAdd},
          // {path: 'checklistes/detail/:guid', allUser: true, element: MaintenanceChecklistDetail},
          {
            path: 'customers',
            permission: 'maintenance.customer.view',
            element: MaintenanceCustomer,
          },
          {path: 'maintenance-category', allUser: true, element: MaintenanceCategory},
        ],
      },
      // PREFERENCE
      {path: 'preference', permission: 'preference.view', element: Preference},
      // ROLE & PERMISSIONS
      {
        path: 'role-permission/*',
        children: [
          {index: true, superUser: true, element: RolesPermission},
          {path: 'add-role', superUser: true, element: RolesPermissionAddEdit},
          {path: 'edit-role', superUser: true, element: RolesPermissionAddEdit},
        ],
      },
      // SETTINGS
      {
        path: 'settings/*',
        children: [
          {path: 'asset-status', permission: 'setting.status.view', element: SettingAssetStatus},
          {path: 'brand', permission: 'setting.brand.view', element: SettingsBrand},
          {path: 'companies', permission: 'setting.company.view', element: SettingsCompany},
          {
            path: 'company/columns',
            permission: 'setup-column.setup_column_company',
            element: SettingsCompanyColumn,
          },
          {path: 'categories', permission: 'setting.category.view', element: SettingsCategory},
          {path: 'department', permission: 'setting.department.view', element: SettingsDepartment},
          {path: 'feature', superUser: true, element: SettingsFeature},
          {
            path: 'manufacturer',
            permission: 'setting.manufacturer.view',
            element: SettingsManufacurer,
          },
          {path: 'model', permission: 'setting.model.view', element: SettingsModel},
          {path: 'supplier', permission: 'setting.supplier.view', element: SettingsSupplier},
          {
            path: 'suppliers/columns',
            permission: 'setup-column.setup_column_supplier',
            element: SettingsSupplierColumn,
          },
          {path: 'type', permission: 'setting.type.view', element: SettingsType},
          {path: 'item-codes', allUser: true, element: SettingsItemCode},
          {
            path: 'item-codes/columns',
            allUser: true,
            element: SettingsItemCodeColumn,
          },
          {path: 'data-clean-up', allUser: true, element: SettingsDataCleanUp},
        ],
      },
      // WIZARD
      {path: 'wizard', allUser: true, element: Wiizard},
    ],
  },
]

export default routes
