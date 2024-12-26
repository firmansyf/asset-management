import 'react-datetime/css/react-datetime.css'

import {getCurrency} from '@api/preference'
import {InputText} from '@components/InputText'
import {Select} from '@components/select/select'
import {configClass, preferenceDate} from '@helpers'
import {ErrorMessage, Field} from 'formik'
import moment from 'moment'
import {FC, useEffect, useState} from 'react'
import Datetime from 'react-datetime'
import {shallowEqual, useSelector} from 'react-redux'

type Props = {
  item: any
  setFieldValue: any
  currency: any
  preference: any
  reloadCurrency?: any
  detail?: any
  values?: any
}

const CustomField: FC<Props> = ({item, setFieldValue, currency, preference, detail, values}) => {
  const pref_date = preferenceDate()
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {preference: dataPreference} = preferenceStore || {}

  const [, setOptPrefValue] = useState('') // optPrefValue
  const [, setOptPrefLabel] = useState('') // optPrefLabel
  const [defaultValueDate, setDefaultValueDate] = useState()
  const [, seOptiontTheCurrency] = useState<any>(false) // optTheCurrency

  const required: any =
    item?.is_required === 1 ? `${configClass?.label} required` : configClass?.label

  useEffect(() => {
    if (
      item.element_type === 'currency' &&
      item?.value === null &&
      (preference?.currency !== null || preference?.country !== null)
    ) {
      seOptiontTheCurrency(true)
      setOptPrefValue(preference?.currency)
      currency
        ?.filter((curr: {value: any}) => curr?.value === preference?.currency)
        ?.map((currency_selected: any) => setOptPrefLabel(currency_selected?.label))
    }
  }, [item, preference, currency])

  const [preferenceCurrency, setPreferenceCurrency] = useState<any>()
  const [dataCurrency, setOptionCurrency] = useState<any>([])

  useEffect(() => {
    if (dataPreference && dataPreference?.length > 0) {
      const cekCurrency: any = dataCurrency?.filter(
        ({value}: any) => value === dataPreference?.currency
      )
      if (cekCurrency?.length > 0) {
        setPreferenceCurrency(cekCurrency?.[0])
      } else {
        setPreferenceCurrency(dataCurrency?.[0])
      }
    }
  }, [dataCurrency, dataPreference])

  useEffect(() => {
    getCurrency()
      .then(({data: {data: res_currency}}) => {
        const res = res_currency?.map((e: any) => {
          return {
            ...e,
            key: e?.key,
            value: e?.key,
            label: e?.key,
          }
        })
        setOptionCurrency(
          res?.map(({key: value, value: label, label: cusLabel}: any) => ({value, label, cusLabel}))
        )
      })
      .catch(() => '')
  }, [])

  useEffect(() => {
    if (item?.element_type === 'currency') {
      if (detail !== undefined && Object.keys(detail || {}).length > 0) {
        const valueCurrency: any = detail[item.name]
          ? dataCurrency.find(({value}: any) => value === detail[item.name]['code'])
          : preferenceCurrency

        setFieldValue(`global_custom_field[${item?.guid}][value][code]`, valueCurrency?.value)
      } else {
        if (
          values?.global_custom_field[item?.guid] !== undefined &&
          values?.global_custom_field[item?.guid]?.value?.amount !== undefined
        ) {
          setFieldValue(
            `global_custom_field[${item?.guid}][value][code]`,

            preferenceCurrency?.value
          )
        }
      }
    }
  }, [preferenceCurrency, setFieldValue, item, detail, dataCurrency, values])

  if (
    item.element_type === 'radio' ||
    item.element_type === 'dropdown' ||
    item.element_type === 'checkbox' ||
    item.element_type === 'gps' ||
    item.element_type === 'currency' ||
    item.element_type === 'date'
  ) {
    return (
      <div className='col-md-6'>
        <label htmlFor={item.element_type} className={required}>
          {item.name}
        </label>

        {item.element_type === 'radio' && (
          <>
            {Array.isArray(item.options) &&
              item.options?.map(({key, value}: any, index: any) => {
                return (
                  <div role='group' aria-labelledby='my-radio-group' className='mb-2' key={index}>
                    <label className='ms-4'>
                      <Field
                        type='radio'
                        name={`global_custom_fields[${item.guid}][value]`}
                        value={key}
                      />
                      <span className='m-2'>{value}</span>
                    </label>
                  </div>
                )
              })}
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name={`global_custom_fields[${item.guid}][value]`} />
            </div>
          </>
        )}

        {item.element_type === 'checkbox' && (
          <>
            {Array.isArray(item.options) &&
              item.options?.map(({key, value}: any, index: any) => {
                return (
                  <div role='group' aria-labelledby='checkbox-group' className='mb-2' key={index}>
                    <label className='ms-4'>
                      <Field
                        type='checkbox'
                        name={`global_custom_fields[${item.guid}][value]`}
                        value={key}
                      />
                      <span className='m-2'>{value}</span>
                    </label>
                  </div>
                )
              })}
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name={`global_custom_fields[${item.guid}][value]`} />
            </div>
          </>
        )}

        {item.element_type === 'dropdown' && (
          <>
            <Field
              as='select'
              className={configClass?.select}
              name={`global_custom_fields[${item?.guid}][value]`}
            >
              {Array.isArray(item.options) &&
                item.options?.map(({key, value}: any, index: any) => {
                  return (
                    <option key={index} value={key}>
                      {value}
                    </option>
                  )
                })}
            </Field>
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name={`global_custom_fields[${item.guid}][value]`} />
            </div>
          </>
        )}

        {item.element_type === 'gps' && (
          <>
            <InputText
              name={`global_custom_fields[${item.guid}][value][lat]`}
              type='number'
              placeholder='Latitude'
            />
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name={`global_custom_fields[${item.guid}][value][lat]`} />
            </div>

            <InputText
              name={`global_custom_fields[${item.guid}][value][lng]`}
              type='number'
              placeholder='Longitude'
            />
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name={`global_custom_fields[${item.guid}][value][lng]`} />
            </div>
          </>
        )}

        {item.element_type === 'currency' && (
          <div className='input-group input-group-solid m-0'>
            <div className='col-5'>
              <Select
                name={`global_custom_fields[${item.guid}][value][code]`}
                placeholder='Enter '
                data={dataCurrency}
                defaultValue={preferenceCurrency?.value}
                isClearable={false}
                components={{
                  Option: ({innerProps, data}: any) => (
                    <div
                      {...innerProps}
                      style={{borderBottom: '1px solid #EBEBEB', padding: '8px 10px'}}
                    >
                      {data.label}
                    </div>
                  ),
                }}
                getOptionValue={(option: any) => option?.value}
                getOptionLabel={(option: any) => option?.value}
                onChange={({value}: any) => {
                  setFieldValue(`global_custom_field[${item.guid}][value][code]`, value || '')
                  // setFieldValue(`custom_field[${item.guid}][value][code]`, e)
                }}
              />
            </div>
            <div className='col-7'>
              <Field
                name={`global_custom_fields[${item.guid}][value][amount]`}
                type='number'
                placeholder={'Enter ' + item?.name}
                className={configClass?.form}
                min='0'
              />
            </div>
          </div>
        )}

        {item.element_type === 'date' && (
          <div className='input-group input-group-solid m-0'>
            <span className='input-group-text pe-0'>
              <i className='fa fa-calendar-alt'></i>
            </span>
            <Datetime
              closeOnSelect
              inputProps={{
                autoComplete: 'off',
                className: configClass?.form,
                name: `global_custom_fields[${item?.guid}][value]`,
                placeholder: 'Enter ' + item?.name,
              }}
              onChange={(e: any) => {
                const m = moment(e).format('YYYY-MM-DD')
                setFieldValue(`global_custom_fields[${item.guid}][value]`, m)
                setDefaultValueDate(m as any)
              }}
              value={defaultValueDate || item?.value}
              dateFormat={pref_date}
              timeFormat={false}
            />
          </div>
        )}
      </div>
    )
  } else {
    return (
      <div className='col-md-6'>
        <label htmlFor={item.element_type} className={required}>
          {item.name}
        </label>
        <Field
          name={`global_custom_fields[${item?.guid}][value]`}
          type={item?.element_type}
          placeholder={'Enter ' + item?.name}
          className={configClass?.form}
        />
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name={`global_custom_fields[${item.guid}][value]`} />
        </div>
      </div>
    )
  }
}

export {CustomField}
