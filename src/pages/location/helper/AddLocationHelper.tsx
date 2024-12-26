/* eslint-disable sonar/for-in */
import {ToastMessage} from '@components/toast-message'

const setErrorObject: any = (fields: any, item: any, actions: any) => {
  if (item === 'name') {
    actions.setFieldError('location', fields?.[item] || '')
  } else {
    if (item?.includes('global_custom_fields')) {
      if (fields?.[item] !== 'The global custom fields field is required.') {
        const messages = fields?.[item]?.[0].replace('Custom field', '')
        actions.setFieldError(item, messages)
      }
    } else {
      ToastMessage({message: fields?.[item]?.[0] || '', type: 'error'})
    }
  }
}

export const getErrorMessage: any = (response: any, actions: any) => {
  const {devMessage, data}: any = response?.data || {}
  const {fields}: any = data || {}

  if (!devMessage) {
    for (const key in fields) {
      const value: any = fields[key] || {}
      ToastMessage({type: 'error', message: value?.[0] || ''})
    }

    fields &&
      Object.keys(fields)?.map((item: any) => {
        setErrorObject(fields, item, actions)
        return true
      })
  }
}

export const setParmsValue: any = (value: any) => {
  if (value) {
    return value
  } else {
    return ''
  }
}

export const setParmsLatitudeValue: any = (dataLatitude: any, defaultLatitude: any) => {
  if (dataLatitude === '0' || dataLatitude === '' || dataLatitude === null) {
    return null
  } else {
    return dataLatitude || defaultLatitude
  }
}

export const setParmsLongitudeValue: any = (dataLongitude: any, defaultLongitude: any) => {
  if (dataLongitude === '0' || dataLongitude === '' || dataLongitude === null) {
    return null
  } else {
    return dataLongitude || defaultLongitude
  }
}

export const setLatitudeInitVal: any = (
  locationDetail: any,
  dataLatitude: any,
  defaultLatitude: any
) => {
  if (locationDetail?.lat !== undefined) {
    return locationDetail?.lat
  } else {
    if (dataLatitude !== '') {
      return dataLatitude
    } else {
      return defaultLatitude
    }
  }
}

export const setLongitudeInitValue: any = (
  locationDetail: any,
  dataLongitude: any,
  defaultLongitude: any
) => {
  if (locationDetail?.long !== undefined) {
    return locationDetail?.long
  } else {
    if (dataLongitude !== '') {
      return dataLongitude
    } else {
      return defaultLongitude
    }
  }
}

export const initValueOption: any = (init_value_1: any, init_value_2: any) => {
  if (init_value_1) {
    return init_value_1
  } else {
    return init_value_2
  }
}
