import {getLocationV1} from '@api/Service'
import AddLocation from '@pages/location/AddLocation'
import {ModalAddCategory as AddCategory} from '@pages/setup/settings/categories/AddCategory'
import {getCategory} from '@pages/setup/settings/categories/redux/CategoryCRUD'
import {AddSupplier} from '@pages/setup/settings/supplier/AddSupplier'
import {getSupplier} from '@pages/setup/settings/supplier/Service'
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
  params?: object | undefined
  parser?: (e: QueryParamsType) => void
}

export interface FieldAddProps {
  name?: string
  modal?: FunctionComponent | FC | any //undefined |
}

export const selectField: Array<SelectFieldType> = [
  {
    label: 'Supplier',
    name: 'supplier_guid',
    api: getSupplier,
    parent: false,
    params: {orderCol: 'name', orderDir: 'asc'},
    parser: ({guid, name}) => ({value: guid, label: name}),
  },
  {
    label: 'Location',
    name: 'location_guid',
    api: getLocationV1,
    parent: false,
    params: {orderCol: 'name', orderDir: 'asc'},
    parser: ({guid, name}) => ({value: guid, label: name}),
  },
  {
    label: 'Inventory Category',
    name: 'category_guid',
    api: getCategory,
    parent: false,
    params: {orderCol: 'name', orderDir: 'asc'},
    parser: ({guid, name}) => ({value: guid, label: name}),
  },
]

export const fieldhasAdd: Array<FieldAddProps> = [
  {name: 'supplier_guid', modal: AddSupplier},
  {name: 'location_guid', modal: AddLocation},
  {name: 'category_guid', modal: AddCategory},
]
