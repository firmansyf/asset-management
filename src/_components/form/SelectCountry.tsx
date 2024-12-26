import {Select} from '@components/select/select'
import {configClass} from '@helpers'
import {ErrorMessage} from 'formik'
import {FC, useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'

interface Props {
  vertical?: boolean
  setFieldValue?: any
  defaultValue?: any
  label?: boolean
  isClearable?: boolean
  setCompanyCountry?: any
}

const SelectCountry: FC<Props> = ({
  vertical,
  setFieldValue,
  defaultValue,
  label = true,
  isClearable = true,
  setCompanyCountry,
}) => {
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {country}: any = preferenceStore || {}
  const dataCountry: any = country?.map(({iso_code, name}: any) => ({value: iso_code, label: name}))

  const [defaultCountry, setDefaultCountry] = useState<any>('')

  useEffect(() => {
    if (defaultValue) {
      setDefaultCountry(defaultValue)
    }
  }, [country, defaultValue])

  return (
    <>
      {label && (
        <div className={`${vertical ? 'col-12' : 'col-3'}`}>
          <label htmlFor='country' className={`${configClass?.label} required`}>
            Country
          </label>
        </div>
      )}
      <div className={`${vertical ? 'col-12' : 'col-9'}`}>
        <Select
          sm={true}
          data={dataCountry}
          reload={false}
          name='country'
          data-cy='country'
          className='col p-0'
          isClearable={isClearable}
          placeholder='Choose Country'
          defaultValue={defaultCountry}
          onChange={(e: any) => {
            setFieldValue('country', e?.value || '')
            setCompanyCountry(e || {})
          }}
        />
        <div data-cy='error_country' className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='country' />
        </div>
      </div>
    </>
  )
}

export {SelectCountry}
