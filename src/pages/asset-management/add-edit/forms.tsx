import {getCompany} from '@api/company'
import {getDepartment} from '@api/department'
import {getLocationV1, getSubLocation} from '@api/Service'
import {getUserEmployee as getAssignee} from '@api/UserCRUD'
import AddLocation from '@pages/location/AddLocation'
import {ModalAddSubLocation as AddSubLocation} from '@pages/location/sub-location/AddSublocation'
import {AddAssetStatus} from '@pages/setup/settings/asset-status/AddAssetStatus'
import {getAssetStatus} from '@pages/setup/settings/asset-status/Service'
import {AddBrand} from '@pages/setup/settings/brand/AddBrand'
import {getBrand} from '@pages/setup/settings/brand/Service'
import {ModalAddCategory as AddCategory} from '@pages/setup/settings/categories/AddCategory'
import {getCategory} from '@pages/setup/settings/categories/redux/CategoryCRUD'
import {AddCompany} from '@pages/setup/settings/companies/AddCompany'
import AddDepartment from '@pages/setup/settings/departements/AddDepartment'
import {AddItemCode} from '@pages/setup/settings/item-code/AddItemCode'
import {getItemCode} from '@pages/setup/settings/item-code/Service'
import {AddManufacturer} from '@pages/setup/settings/manufacture/AddManufacturer'
import {getManufacturer} from '@pages/setup/settings/manufacture/Service'
import {AddModel} from '@pages/setup/settings/model/AddModel'
import {getModel} from '@pages/setup/settings/model/Service'
import {AddSupplier} from '@pages/setup/settings/supplier/AddSupplier'
import {getSupplier} from '@pages/setup/settings/supplier/Service'
import {AddType} from '@pages/setup/settings/type/AddType'
import {getType} from '@pages/setup/settings/type/Service'
import {AxiosPromise} from 'axios'
import {FC, FunctionComponent} from 'react'

export interface QueryParamsType {
  guid?: string
  name?: string
  full_name?: string
  type?: string
}
export interface SelectOptionType {
  [key: string]: object | string | number | boolean | undefined
}
export interface SelectFieldType {
  name: string
  label: string
  api?: (e: SelectOptionType) => AxiosPromise
  parent?: string | boolean
  param_parent?: string | boolean | undefined
  parser?: (e: QueryParamsType) => void
}

export interface FieldAddProps {
  name?: string
  modal?: FunctionComponent | FC | undefined | any
}

export const selectField: Array<SelectFieldType> = [
  {
    label: 'Manufacturer',
    name: 'manufacturer_guid',
    api: getManufacturer,
    parent: false,
    parser: ({guid, name}) => ({value: guid, label: name}),
  },
  {
    label: 'Model',
    name: 'manufacturer_model_guid',
    api: getModel,
    parent: 'manufacturer_guid',
    parser: ({guid, name}) => ({value: guid, label: name}),
  },
  {
    label: 'Brand',
    name: 'manufacturer_brand_guid',
    api: getBrand,
    parent: 'manufacturer_model_guid',
    parser: ({guid, name}) => ({value: guid, label: name}),
  },
  {
    label: 'Supplier',
    name: 'supplier_guid',
    api: getSupplier,
    parent: false,
    parser: ({guid, name}) => ({value: guid, label: name}),
  },
  {
    label: 'Asset Status',
    name: 'status_guid',
    api: getAssetStatus,
    parent: false,
    parser: ({guid, name}) => ({value: guid, label: name}),
  },
  {
    label: 'Location',
    name: 'location_guid',
    api: getLocationV1,
    parent: false,
    parser: ({guid, name}) => ({value: guid, label: name}),
  },
  {
    label: 'Sub Location',
    name: 'location_sub_guid',
    api: getSubLocation,
    parent: 'location_guid',
    parser: ({guid, name}) => ({value: guid, label: name}),
  },
  {
    label: 'Category',
    name: 'category_guid',
    api: getCategory,
    parent: false,
    parser: ({guid, name}) => ({value: guid, label: name}),
  },
  {
    label: 'Type',
    name: 'type_guid',
    api: getType,
    parent: 'category_guid',
    parser: ({guid, name}) => ({value: guid, label: name}),
  },
  {
    label: 'Company',
    name: 'owner_company_guid',
    api: getCompany,
    parent: false,
    parser: ({guid, name}) => ({value: guid, label: name}),
  },
  {
    label: 'Department',
    name: 'owner_company_department_guid',
    api: getDepartment,
    parent: 'owner_company_guid',
    param_parent: 'company_guid',
    parser: ({guid, name}) => ({value: guid, label: name}),
  },
  {
    label: 'Assignee',
    name: 'assign_to',
    api: getAssignee,
    parent: false,
    parser: ({guid, full_name, type}) => ({value: guid, label: full_name, type}),
  },
  {
    label: 'Item Code',
    name: 'item_code',
    api: getItemCode,
    parent: false,
    parser: ({guid, name}) => ({value: guid, label: name}),
  },
]

export const fieldhasAdd: Array<FieldAddProps> = [
  {name: 'manufacturer_guid', modal: AddManufacturer},
  {name: 'manufacturer_model_guid', modal: AddModel},
  {name: 'manufacturer_brand_guid', modal: AddBrand},
  {name: 'supplier_guid', modal: AddSupplier},
  {name: 'status_guid', modal: AddAssetStatus},
  {name: 'location_guid', modal: AddLocation},
  {name: 'location_sub_guid', modal: AddSubLocation},
  {name: 'category_guid', modal: AddCategory},
  {name: 'type_guid', modal: AddType},
  {name: 'owner_company_guid', modal: AddCompany},
  {name: 'owner_company_department_guid', modal: AddDepartment},
  {name: 'item_code', modal: AddItemCode},
]
