import {getCurrency} from '@api/preference'
import {Select} from '@components/select/ajax'
import {configClass} from '@helpers'
import {ErrorMessage} from 'formik'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import {FC, useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'

interface Props {
  vertical?: boolean
  setFieldValue?: any
  initialValues?: any
  label?: boolean
  isClearable?: boolean
}

const SelectCurrency: FC<Props> = ({
  vertical,
  setFieldValue,
  initialValues,
  label = true,
  isClearable = true,
}) => {
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {country} = preferenceStore || {}
  const [defaultCurrency, setDefaultCurrency] = useState<any>([])

  useEffect(() => {
    if (initialValues?.currency !== '') {
      const initCurrency: any = filter(country, (data: any) =>
        includes(initialValues?.currency, data?.currencies?.[0])
      )
      const initCurrencyObj = initCurrency.reduce(
        (acc: any, val: any) => Object.assign(acc || {}, val || {}),
        {}
      )
      setDefaultCurrency(initCurrencyObj)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues?.currency])

  return (
    <>
      {label && (
        <div className={`${vertical ? 'col-12' : 'col-3'}`}>
          <label htmlFor='currency' className={`${configClass?.label} required`}>
            Currency
          </label>
        </div>
      )}
      <div className={`${vertical ? 'col-12' : 'col-9'}`}>
        <Select
          sm={true}
          name='currency'
          className='col p-0'
          isClearable={isClearable}
          api={getCurrency}
          params={false}
          reload={false}
          placeholder='Choose Currency'
          defaultValue={{
            value: initialValues.currency,
            label: defaultCurrency
              ? `${defaultCurrency?.name || ''} - ${initialValues.currency}`
              : '',
          }}
          onChange={(e: any) => {
            setFieldValue('currency', e?.value || '')
          }}
          parse={(e: any) => {
            return {
              value: e.key,
              label: e?.value,
            }
          }}
        />
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='currency' />
        </div>
      </div>
    </>
  )
}

export {SelectCurrency}
