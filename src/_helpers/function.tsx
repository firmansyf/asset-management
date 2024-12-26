import {ToastMessage} from '@components/toast-message'
import {errorValidation} from '@helpers'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import {shallowEqual, useSelector} from 'react-redux'

export function mappingAsset(res: any) {
  return res?.map((res: any) => {
    const {
      asset_id,
      asset_name,
      category_name,
      assigned_user_name,
      location_name,
      asset_description,
    } = res || {}
    return {
      checkbox: res,
      view: 'View',
      asset_id: asset_id || '-',
      category_name: category_name || '-',
      name: asset_name || '-',
      description: asset_description || '-',
      assigned_user_name: assigned_user_name || '-',
      location_name: location_name || '-',
      edit: 'Edit',
      delete: 'Delete',
      original: res,
    }
  })
}

export function arrayConcat(...args: any) {
  return args?.reduce((acc: any, val: any) => [...acc, ...val])
}

export function checkLength(count: number, length: number) {
  if (count === length) {
    return true
  } else {
    return false
  }
}

export function updateRoles(checked: any, item: any) {
  if (checked?.target?.name === item?.name) {
    if (checked?.target?.checked) {
      return {...item, is_allow: 1}
    } else {
      return {...item, is_allow: 0}
    }
  } else {
    return item
  }
}

export function updateRolesAll(checked: any, item: any) {
  if (checked) {
    return {...item, is_allow: 1}
  } else {
    return {...item, is_allow: 0}
  }
}

export function customFieldErrorMessage(err: any, setOptionMessage: any) {
  Object.values(errorValidation(err))?.map((message: any) => {
    if (message?.includes('cannot duplicated')) {
      ToastMessage({message: 'The name has already been taken.', type: 'error'})
      return false
    } else if (message?.includes('options field is required')) {
      setOptionMessage(true)
      return false
    } else {
      ToastMessage({message, type: 'error'})
      return false
    }
  })
}

export function checkValidDataOptionCF(data_type: any, options: any) {
  if (
    (data_type === 'checkbox' || data_type === 'dropdown' || data_type === 'radio') &&
    options !== undefined &&
    options?.length === 0
  ) {
    return false
  } else {
    return true
  }
}

export function roleImportConcat(data_role_import: any, data_role: any, data_import: any) {
  const dataImporEmployee: any = filter(data_role?.items, (role: any) =>
    includes(data_role_import, role?.name)
  )
  const join = arrayConcat(data_import, dataImporEmployee)
  return join
}

const dateFormatter: any = (date: any) => {
  let result: any = 'DD-MM-YYYY'
  if (date) {
    switch (date) {
      case 'm-d-Y':
        result = 'MM-DD-YYYY'
        break
      case 'd-m-Y':
        result = 'DD-MM-YYYY'
        break
      case 'Y-m-d':
        result = 'YYYY-MM-DD'
        break
      default:
        break
    }
  }
  return result
}
const timeFormatter: any = (time: any) => {
  let result: any = 'HH:mm'
  if (time) {
    switch (time) {
      case 'H:i':
        result = 'HH:mm'
        break
      case 'H:i:s':
        result = 'HH:mm:ss'
        break
      case 'h:i a':
        result = 'hh:mm A'
        break
      case 'h:i:s a':
        result = 'hh:mm:ss A'
        break
      default:
        break
    }
  }
  return result
}

export function preferenceDate() {
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {preference}: any = preferenceStore || {}
  const {date_format} = preference || {}
  return dateFormatter(date_format)
}

export function preferenceTime() {
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {preference}: any = preferenceStore || {}
  const {time_format}: any = preference || {}
  return timeFormatter(time_format)
}

export function preferenceDateTime() {
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {preference}: any = preferenceStore || {}
  const {date_format, time_format}: any = preference || {}
  const date_time = `${dateFormatter(date_format || 'DD-MM-YYYY')} ${timeFormatter(
    time_format || 'HH:mm'
  )}`
  return date_time
}

export function preferencePhoneCode() {
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {preference}: any = preferenceStore || {}
  const {phone_code}: any = preference || {}

  return phone_code || '60'
}

export function removeObjectByAttr(arr: any, attr: string, value: any) {
  let i = arr?.length
  while (i--) {
    const hasBarProperty = Object.prototype.hasOwnProperty.call(arr?.[i], attr)
    if (arr[i] && hasBarProperty && arguments?.length > 2 && arr?.[i]?.[attr] === value) {
      arr?.splice(i, 1)
    }
  }
  return arr
}

export function addEditFormPermission(
  setShowModal: any,
  setShowForm: any,
  dataDetail: any,
  addPermission: string,
  editPermission: string,
  addMessage: string,
  editMessage: string
) {
  if (dataDetail) {
    if (!editPermission) {
      ToastMessage({
        message: `You are not allowed to perform this action. Necessary permission is ${editMessage}`,
        type: 'error',
      })
      setShowModal(false)
    } else {
      setShowForm(true)
    }
  } else {
    if (!addPermission) {
      ToastMessage({
        message: `You are not allowed to perform this action. Necessary permission is ${addMessage}`,
        type: 'error',
      })
      setShowModal(false)
    } else {
      setShowForm(true)
    }
  }
}

export function permissionValidator(actionPermission: boolean, errorMessage: string) {
  if (!actionPermission) {
    ToastMessage({
      message: `You are not allowed to perform this action. Necessary permission is ${errorMessage}`,
      type: 'error',
    })
  }
}

export function getJWTPayload(token: any) {
  if (token) {
    const base64Url: any = token?.split('.')[1] || token
    const base64: any = base64Url?.replace(/-/g, '+')?.replace(/_/g, '/')
    const jsonPayload: any = decodeURIComponent(
      window
        .atob(base64)
        ?.split('')
        ?.map((c: any) => '%' + ('00' + c?.charCodeAt(0)?.toString(16))?.slice(-2))
        ?.join('')
    )
    return JSON.parse(jsonPayload)
  } else {
    return undefined
  }
}

export const getSubdomain = () => {
  const fullUri = window.location.host
  const subdomain = fullUri?.split('.')?.[0]
  return subdomain
}

export const detectMobileScreen = () => {
  let isMobile: boolean = false
  if (window.innerWidth < 720) {
    isMobile = true
  } else {
    isMobile = false
  }
  return isMobile
}
