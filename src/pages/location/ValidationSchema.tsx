/* eslint-disable sonar/no-wildcard-import */
import {latRegEx, longRegEx} from '@helpers'
import {FC, memo, useEffect} from 'react'
import * as Yup from 'yup'

type Props = {
  setLocationSchema: any
  checkCountry?: any
  checkState?: any
  checkCity?: any
  checkAddress?: any
  checkStreet?: any
  checkPostcode?: any
  checkDescription?: any
  checkLatitude?: any
  checkLongitude?: any
}

const Validation: FC<Props> = ({
  setLocationSchema,
  checkCountry,
  checkState,
  checkCity,
  checkAddress,
  checkStreet,
  checkPostcode,
  checkDescription,
  checkLatitude,
  checkLongitude,
}) => {
  useEffect(() => {
    let validationShape: any = {
      location: Yup.string().required('Location is required'),
      location_status: Yup.string().required('Location Status is required'),
      latitude: Yup.string().matches(latRegEx, 'Latitude must be valid latitude value').nullable(),
      longitude: Yup.string()
        .matches(longRegEx, 'Longitude must be valid longitude value')
        .nullable(),
      street: Yup.string().test(
        'len',
        'Street/Building Must be at least 30 characters',
        (val: any) => (val || '').toString()?.length <= 30
      ),
    }
    if (checkAddress?.is_required) {
      validationShape = {
        ...validationShape,
        address: Yup.string().required('Address 1 is required'),
      }
    }
    if (checkDescription?.is_required) {
      validationShape = {
        ...validationShape,
        description: Yup.string().required('Description is required'),
      }
    }
    if (checkStreet?.is_required) {
      validationShape = {
        ...validationShape,
        street: Yup.string().required('Address 2 is required'),
      }
    }
    if (checkCity?.is_required) {
      validationShape = {
        ...validationShape,
        city: Yup.string().required('City is required'),
      }
    }
    if (checkState?.is_required) {
      validationShape = {
        ...validationShape,
        state: Yup.string().required('State/Province is required'),
      }
    }
    if (checkPostcode?.is_required) {
      validationShape = {
        ...validationShape,
        postal_code: Yup.string()
          .max(10, ({max}) => `Maximum length is ${max} characters`)
          .required('Zip/Postal Code is required'),
      }
    }
    if (checkCountry?.is_required) {
      validationShape = {
        ...validationShape,
        country: Yup.string().required('Country is required'),
      }
    }
    if (checkLatitude?.is_required && checkLongitude?.is_required) {
      validationShape = {
        ...validationShape,
        latitude: Yup.string()
          .required('Latitude is required')
          .matches(latRegEx, 'Latitude must be valid latitude value'),
        longitude: Yup.string()
          .required('Longitude is required')
          .matches(longRegEx, 'Longitude must be valid longitude value'),
      }
    }
    const LocationSchema = Yup.object().shape(validationShape)
    setLocationSchema(LocationSchema)
  }, [
    setLocationSchema,
    checkAddress?.is_required,
    checkCity?.is_required,
    checkCountry?.is_required,
    checkDescription?.is_required,
    checkLatitude?.is_required,
    checkLongitude?.is_required,
    checkPostcode?.is_required,
    checkState?.is_required,
    checkStreet?.is_required,
  ])
  return null
}

const ValidationSchema = memo(
  Validation,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default ValidationSchema
