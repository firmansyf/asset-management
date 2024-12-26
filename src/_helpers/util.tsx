// import {AES, enc} from 'crypto-js'
import {ToastMessage} from '@components/toast-message'
import map from 'lodash/map'
import moment from 'moment'
import {useEffect, useState} from 'react'
import ReactDom from 'react-dom/server'
import {shallowEqual, useSelector} from 'react-redux'

export const toAbsoluteUrl = (pathname: string) => process.env.PUBLIC_URL + pathname

export const truncate: any = (str: any, max: number) => {
  const string = str?.toString()?.replace(/  +/g, ' ')
  const arr = string?.toString()?.split(' ')
  if (arr?.length > max) {
    return arr?.slice(0, max)?.join(' ') + '...'
  } else {
    return string
  }
}

export const truncateChar: any = (str: any, max: number) => {
  const strLen = str?.toString()?.length
  return strLen > max ? str?.substring(0, max) + '...' : str
}

export const toCurrency = (number: number) =>
  number?.toString()?.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')

export const isValidMail = (text: any) =>
  text?.toString()?.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)

export const isValidURL = (str: any) => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ) // fragment locator
  return !!pattern.test(str)
}

export const latRegEx =
  /^(\+|-)?(?:90(?:(?:\.0{1,100})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,100})?))$/

export const longRegEx =
  /^(\+|-)?(?:180(?:(?:\.0{1,100})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,100})?))$/

export const isLatitude = (text: any) => text?.toString()?.match(latRegEx)

export const isLongitude = (text: any) => text?.toString()?.match(longRegEx)

export const toCapitalize = (text: string) =>
  text?.replace(/(?:^|\s)\S/g, (a: any) => a?.toUpperCase())
export const convertDate: any = (option: any) => {
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {preference}: any = preferenceStore || {}
  const {date_format, time_format}: any = preference || {}

  let format: any = ''
  if (date_format) {
    switch (date_format) {
      case 'm-d-Y':
        format = 'MM-DD-YYYY'
        break
      case 'd-m-Y':
        format = 'DD-MM-YYYY'
        break
      case 'Y-m-d':
        format = 'YYYY-MM-DD'
        break
      default:
        break
    }
  }

  if (time_format && option?.time) {
    switch (time_format) {
      case 'H:i':
        format += ' HH:mm'
        break
      case 'H:i:s':
        format += ' HH:mm:ss'
        break
      case 'h:i a':
        format += ' hh:mm A'
        break
      case 'h:i:s a':
        format += ' hh:mm:ss A'
        break
      default:
        break
    }
  }

  return format
}

export const roleName = () => {
  const user: any = useSelector(({currentUser}: any) => currentUser, shallowEqual)
  const {role_name}: any = user || {}
  return role_name
}

export const hasPermission = (role: string) => {
  const user: any = useSelector(({currentUser}: any) => currentUser, shallowEqual)
  const {permissions} = user || {}
  if (permissions) {
    return map(permissions, 'name')?.includes(role)
  } else {
    return false
  }
}

export const permission = () => {
  const user: any = useSelector(({currentUser}: any) => currentUser, shallowEqual)
  const {permissions} = user || {}
  return permissions
}

export const urlToBase64 = async (url: string) => {
  const data = await fetch(url)
  const blob = await data.blob()
  return new Promise((resolve: any) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onloadend = function () {
      const base64data = reader.result
      resolve(base64data)
    }
  })
}

export const urlToFile = async (url: string, name: string) => {
  const data = await fetch(url)
  const blob = await data.blob()
  const file = new File([blob], name, {type: blob.type})
  const buffer = await blob.arrayBuffer()
  const base64 = await new Promise((resolve: any) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onloadend = () => {
      const base64data = reader.result
      resolve(base64data)
    }
  })
  const result: any = {
    file,
    blob,
    buffer,
    base64,
  }
  return result
}

export const base64ToArrayBuffer = (dataURI: any) => {
  const BASE64_MARKER = ';base64,'
  const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER?.length
  const base64 = dataURI.substring(base64Index)
  const unit8 = Uint8Array.from(atob(base64), (c: any) => c.charCodeAt(0))
  return unit8.buffer
}

export const bufferToBase64 = (buffer: any) => {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

export const convertDateTimeCustom = (date: any, time: any) => {
  let format: any = ''
  if (date) {
    switch (date) {
      case 'm-d-Y':
        format = 'MM-DD-YYYY'
        break
      case 'd-m-Y':
        format = 'DD-MM-YYYY'
        break
      case 'Y-m-d':
        format = 'YYYY-MM-DD'
        break
      default:
        break
    }
  }

  if (time) {
    switch (time) {
      case 'H:i':
        format += ' HH:mm'
        break
      case 'H:i:s':
        format += ' HH:mm:ss'
        break
      default:
        break
    }
  }

  return format
}

export const checkReportMenu = () => {
  if (
    hasPermission('reports.automation_report.view') ||
    hasPermission('reports.custom-report.create') ||
    hasPermission('reports.asset_by_department') ||
    hasPermission('reports.asset_by_employee') ||
    hasPermission('reports.asset_by_history_report') ||
    hasPermission('reports.asset_by_category_manufacture') ||
    hasPermission('reports.asset_by_qr_codes') ||
    hasPermission('reports.asset_by_status') ||
    hasPermission('reports.asset_by_audit_status') ||
    hasPermission('reports.asset_by_maintenance')
  ) {
    return true
  } else {
    return false
  }
}

export const checkSettingMenu = () => {
  if (
    hasPermission('setting.category.view') ||
    hasPermission('setting.company.view') ||
    hasPermission('setting.department.view') ||
    hasPermission('setting.manufacturer.view') ||
    hasPermission('setting.model.view') ||
    hasPermission('setting.brand.view') ||
    hasPermission('setting.status.view') ||
    hasPermission('setting.supplier.view') ||
    hasPermission('setting.type.view') ||
    hasPermission('setting.feature.view')
  ) {
    return true
  } else {
    return false
  }
}

export const checkSetupMenu = () => {
  if (
    checkSettingMenu() ||
    roleName() === 'owner' ||
    roleName() === 'admin' ||
    hasPermission('setting.database.view') ||
    hasPermission('setting.custom-field.view') ||
    hasPermission('preference.view') ||
    hasPermission('team.view') ||
    hasPermission('alert.view')
  ) {
    return true
  } else {
    return false
  }
}

// export const encryptAES = (data: any, key: any) => {
//   const encrypt = AES.encrypt(data, key).toString()
//   return encrypt
// }

// export const decryptAES = (dataBase64: any, key: any) => {
//   const decrypted = AES.decrypt(dataBase64, key)
//   if (decrypted) {
//     try {
//       const str = decrypted.toString(enc.Utf8)
//       if (str?.length > 0) {
//         return str
//       } else {
//         return 'error 1'
//       }
//     } catch (e) {
//       return 'error 2'
//     }
//   }
//   return 'error 3'
// }

export const checkRequest = (request: any) => {
  const pattern = new RegExp('^(https?|ftp)://')
  if (pattern.test(atob(request))) {
    return true
  } else {
    return false
  }
}

export const randomString = () => {
  const rand: any =
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  return rand
}

export const sortByDayName = (days: any = [], key = 'day') => {
  const indexOfDays: any = {
    sunday: 1,
    monday: 2,
    tuesday: 3,
    wednesday: 4,
    thursday: 5,
    friday: 6,
    saturday: 7,
  }
  return days.sort((a: any, b: any) => indexOfDays[a[key]] - indexOfDays[b[key]])
}

export const PageSubTitle = ({title, reload}: any) => {
  const subTitle: any = document.querySelector('.pageSubTitle')
  useEffect(() => {
    subTitle && title && (subTitle.innerHTML = ReactDom.renderToString(title))
    return () => {
      subTitle && (subTitle.innerHTML = '')
    }
  }, [subTitle, title, reload])
  return null
}

export const reverseDate = (date: any) => {
  let result: any = undefined
  if (date) {
    const dateInArray: any = date?.split('-') || []
    result = dateInArray?.reverse()?.join('-')
  }
  return result
}

export const reverseDateTime = (dateTime: any) => {
  let result: any = undefined
  if (dateTime) {
    const date: any = dateTime?.split(' ')?.[0]
    const time: any = dateTime?.split(' ')[1]
    const dateInArray: any = date?.split('-') || []
    result = `${dateInArray?.reverse()?.join('-')} ${time}`
  }
  return result
}

export const validationViewDate = (dateTime: any = null, format: any) => {
  if (
    dateTime !== null &&
    moment(dateTime).isValid() &&
    moment(dateTime).format('YYYY-MM-DD') !== '1970-01-01'
  ) {
    return moment(dateTime).format(format)
  } else {
    return 'N/A'
  }
}

export const replaceHTMLEntity = (text: any) => {
  if (typeof text === 'string') {
    return text?.replace(/(<([^>]+)>|&[A-Za-z0-9#]+;)/gi, '')?.toString()
  } else {
    return text
  }
}

export const numberWithCommas = (number: any, last_two_digit = true) => {
  return number
    ? parseFloat(number)
        .toFixed(last_two_digit ? 2 : 0)
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    : undefined
}

export const encodeHTMLEntities = (text?: any) => {
  const textArea: any = document.createElement('textarea')
  textArea.innerText = text || ''
  let encodedOutput: any = textArea.innerHTML
  const arr: any = encodedOutput?.split('<br>')
  encodedOutput = arr?.join('\n')
  return encodedOutput
}

export const decodeHTMLEntities = (text?: any) => {
  const textArea: any = document.createElement('textarea')
  textArea.innerHTML = text || ''
  return textArea?.value
}

export const checkFeature = (featureName: any) => {
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {feature} = preferenceStore || {}
  const [permission, setPermission] = useState(false)
  useEffect(() => {
    if (Object.keys(feature)?.length > 0) {
      feature
        ?.filter((features: {unique_name: any}) => features?.unique_name === featureName)
        ?.forEach((feature: any) => {
          setPermission(feature?.value === 0 ? false : true)
        })
    }
  }, [feature, featureName])
  return permission
}

export const valueValidation = (value_1: any, value_2: any) => {
  if (value_1) {
    return value_1
  } else {
    return value_2
  }
}

export const useTimeOutMessage = (type: any, timeout: number = 0, message: any = '') => {
  if (type === 'clear') {
    setTimeout(() => ToastMessage({type: 'clear'}), timeout)
  } else {
    setTimeout(() => ToastMessage({type: type, message}), timeout)
  }
}

export const guidBulkChecked = (e: any) => {
  const ar_guid: any = []
  e?.forEach((ck: any) => {
    const {checked}: any = ck || {}
    if (checked) {
      const {original}: any = ck || {}
      const {guid}: any = original || {}
      ar_guid?.push(guid)
    }
  })
  return ar_guid
}

export const setColumn = (mapColumns: any) => {
  let column: any = []
  if (mapColumns?.length) {
    column = [
      {header: 'checkbox', width: '20px'},
      {header: 'View', width: '20px'},
      ...mapColumns,
      {header: 'Edit', width: '20px'},
      {header: 'Delete', width: '20px'},
    ]
  } else {
    column = []
  }
  return column
}

export const setUserStatus = (value: any) => {
  switch (value?.toLowerCase()) {
    case 'owner':
      return <span className='badge badge-light-primary'>{value || ''}</span>
    case 'unverified':
      return <span className='badge badge-light-info'>{value || ''}</span>
    case 'verified':
      return <span className='badge badge-light-success'>{value || ''}</span>
    case 'suspended':
      return <span className='badge badge-light-danger'>{value || ''}</span>
    default:
      return <span className='badge badge-light'>{value || ''}</span>
  }
}

export const FieldMessageError = (params: any, custom: any) => {
  const {response}: any = params || {}
  const {devMessage, data, message}: any = response?.data || {}
  const {fields}: any = data || {}

  if (response) {
    if (!devMessage) {
      if (fields === undefined) {
        ToastMessage({message, type: 'error'})
      } else {
        if (custom?.includes('alert-setting-edit')) {
          Object.keys(fields || {})?.map((item: any) => {
            if (item !== 'file.data' && item !== 'file.title') {
              ToastMessage({message: fields?.[item]?.[0] || '', type: 'error'})
            }
            return true
          })
        } else if (custom?.includes('type-setting')) {
          Object.keys(fields || {})?.map((item: any) => {
            if (item === 'postcode') {
              ToastMessage({
                message: fields?.[item]?.[0] || 'The postcode should not be more than 10 digits.',
                type: 'error',
              })
            }

            if (item !== 'postcode') {
              ToastMessage({message: fields?.[item]?.[0] || '', type: 'error'})
            }
            return true
          })
        } else {
          Object.keys(fields || {})?.map((item: any) => {
            if (custom.includes('alert-setting-add') && item === 'frequency_value.0') {
              ToastMessage({message: 'Invalid Date', type: 'error'})
            }

            if (custom.includes('alert-setting-add') && item === 'frequency_value.0') {
              ToastMessage({message: 'Invalid Date', type: 'error'})
            }
            ToastMessage({message: fields?.[item]?.[0] || '', type: 'error'})
            return true
          })
        }
      }
    }
  } else {
    return false
  }
}

export const setApprovalStatus = (value: string, original: any) => {
  switch (value.toLowerCase()) {
    case 'pending approval':
      return <span className='badge badge-light-blue'>{value || '-'}</span>
    case 'approved':
      return <span className='badge badge-success'>{value || '-'}</span>
    case 'rejected':
      return (
        <>
          <span className='badge badge-danger'>{value || '-'}</span>
          &nbsp;&nbsp;
          <a
            href={
              original?.original?.ticket_guid !== null
                ? `/help-desk/ticket/detail/${original?.original?.ticket_guid || ''}`
                : 'javascript:void(0)'
            }
            className='text-decoration-underline text-danger'
          >
            View Ticket
          </a>
        </>
      )
    default:
      return <span className='badge rounded-pill badge-light text-dark'>{value || '-'}</span>
  }
}

export const setConfirmStatus = (value: string) => {
  switch (value.toLowerCase()) {
    case 'pending confirmation':
      return <span className='badge badge-light-blue'>{value || '-'}</span>
    case 'confirmed':
      return <span className='badge badge-success'>{value || '-'}</span>
    case 'declined':
      return <span className='badge badge-danger'>{value || '-'}</span>
    default:
      return <span className='badge rounded-pill badge-light text-dark'>{value || '-'}</span>
  }
}
