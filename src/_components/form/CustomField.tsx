import {customStyles, DropdownIndicator} from '@components/select/config'
import {configClass} from '@helpers'
import {getCustomField} from '@pages/setup/custom-field/redux/ReduxCustomField'
import {keyBy, mapValues} from 'lodash'
import {FC, Fragment, useEffect, useRef, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import Select from 'react-select'

import {CheckBox} from './checkbox'
import DateInput from './DateInput'
import DateTimeInput from './DateTimeInput'
import {Radio} from './radio'

export const FormCF: FC<any> = ({
  type,
  itemClass = 'row mb-3',
  labelClass = 'col-auto',
  inputClass = 'col',
  errors,
  defaultValue,
  onChange,
  onClickForm,
  allCustomField,
  showForm = undefined,
  setShowForm = undefined,
  defaultCustomField = undefined,
}) => {
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const hyperlinkUrlRef: any = useRef<any>()
  const hyperlinkTextRef: any = useRef<any>()
  const {currency, preference: dataPreference} = preferenceStore || {}
  const [fields, setFields] = useState<any>([])
  const [optCurrency, setOptCurrency] = useState<any>([])
  const [values, setValues] = useState<any>({})
  const [valueCurrency, setValueCurrency] = useState<any>({})
  const [preferenceCurrency, setPreferenceCurrency] = useState<any>([])

  useEffect(() => {
    if (defaultValue) {
      const mappedValues: any = mapValues(
        keyBy(defaultValue?.filter(({value}: any) => value), 'guid'),
        ({guid, value}: any) => ({guid, value})
      )
      setValues(mappedValues)
      setValueCurrency(mappedValues)
    }
  }, [defaultValue])

  useEffect(() => {
    if (type === 'assets') {
      setFields(
        allCustomField?.map((m: any) => {
          m?.rules && (m.rules = mapValues(keyBy(m?.rules, 'key'), 'value'))
          return m
        })
      )
    } else {
      getCustomField({page: 1, limit: 100, 'filter[section_type]': type})
        .then(({data: {data}}: any) => {
          // let required: any = data.filter(({rules}: any) => rules.find(({key}: any) => key === 'required')?.value === true)
          setFields(
            data?.map((m: any) => {
              m?.rules && (m.rules = mapValues(keyBy(m?.rules, 'key'), 'value'))
              return m
            })
          )
        })
        .catch(() => '')
    }
  }, [type, allCustomField, defaultValue])

  useEffect(() => {
    if (currency?.length > 0) {
      const res = currency?.map((e: any) => {
        return {
          ...e,
          value: e?.key + ' - ' + e?.value?.split('-')?.[0],
        }
      })
      setOptCurrency(res?.map(({key: value, value: label}: any) => ({value, label})))
    }
  }, [currency])

  useEffect(() => {
    if (dataPreference) {
      const cekCurrency: any = optCurrency?.filter(
        ({value}: any) => value === dataPreference?.currency
      )
      setPreferenceCurrency(cekCurrency)
    }
  }, [optCurrency, dataPreference])

  const urlValidation = (event: any) => {
    const link: string = event?.toLowerCase()
    const regex: any = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')
    const validation: string = regex.test(link)
    const pattern: any = link?.match(/http/g)
    if (validation) {
      if (pattern?.length > 0) {
        return link
      } else {
        const replace_link: any = `http://${link}`
        return replace_link
      }
    } else {
      return ''
    }
  }

  return (
    <>
      {defaultCustomField !== undefined && defaultCustomField?.length > 0 && (
        <div className='row mb-3'>
          {showForm && showForm !== undefined && (
            <div className='col-12 my-5 py-2 fs-4 fw-bolder border-top border-bottom'>
              Custom Fields
            </div>
          )}

          {defaultCustomField !== undefined &&
            defaultCustomField?.length === 0 &&
            defaultCustomField?.filter(({conditions}: any) => conditions === undefined) && (
              <label htmlFor='no_cf' style={{padding: '0px 0px 10px 30px'}}>
                No custom fields added
              </label>
            )}

          {fields?.map(
            ({guid, element_type, name, options, rules, is_required}: any, i: number) => {
              setShowForm !== undefined && setShowForm(true)
              return (
                <Fragment key={i}>
                  <div className={itemClass} data-cy='custom-field-item'>
                    <label
                      className={`${configClass?.label} ${
                        (rules?.required === true || is_required === 1) && 'required'
                      } ${labelClass}`}
                    >
                      {name}
                    </label>
                    <div className={inputClass}>
                      {['macaddress', 'url', 'email', 'ipaddress'].includes(element_type) && (
                        <input
                          name={name}
                          type='text'
                          placeholder={`Enter ${name}`}
                          className={configClass?.form}
                          value={values?.[guid]?.value || ''}
                          onChange={({target: {value}}: any) => {
                            const val: any = {...values, [guid]: {guid, value}}
                            setValues(val)
                            onChange && onChange(Object.values(val || {}))
                          }}
                        />
                      )}
                      {element_type === 'checkbox' && (
                        <CheckBox
                          name={name}
                          controlled
                          col='auto'
                          labelClass='bg-light radius-5 ms-2 pt-2 pb-2 ps-2 mb-2'
                          options={options?.map(({key, value}: any) => ({
                            value: key?.toString(),
                            label: value,
                            checked: values?.[guid]?.value?.includes(key?.toString()),
                          }))}
                          onChange={(e: any) => {
                            const val: any = {
                              ...values,
                              [guid]: {
                                guid,
                                value: e?.map(({value}: any) => value),
                              },
                            }
                            setValues(val)
                            onChange && onChange(Object.values(val || {}))
                          }}
                        />
                      )}
                      {element_type === 'radio' && (
                        <Radio
                          name={name}
                          col='col-auto'
                          options={options?.map(({key, value}: any) => ({
                            value: key?.toString(),
                            label: value,
                          }))}
                          value={values?.[guid]?.value}
                          onChange={(value: any) => {
                            const val: any = {...values, [guid]: {guid, value}}
                            setValues(val)
                            onChange && onChange(Object.values(val || {}))
                          }}
                        />
                      )}
                      {element_type === 'dropdown' && (
                        <>
                          <select
                            className={configClass?.select}
                            name={name}
                            value={values?.[guid]?.value}
                            onChange={(e: any) => {
                              const value = e?.target?.value
                              const val: any = {...values, [guid]: {guid, value}}
                              setValues(val)
                              onChange && onChange(Object.values(val || {}))
                            }}
                          >
                            <option value=''>{`Select ${name}`}</option>
                            {options?.map(({key, value}: any) => {
                              return (
                                <option key={key} value={key}>
                                  {value}
                                </option>
                              )
                            })}
                          </select>
                          {errors?.global_custom_fields !== undefined &&
                            errors?.global_custom_fields?.[guid] !== undefined && (
                              <div className='fv-plugins-message-container invalid-feedback'>
                                {errors?.global_custom_fields?.[guid] !== `${name} is required.`
                                  ? errors?.global_custom_fields?.[guid]
                                  : ''}
                              </div>
                            )}
                        </>
                      )}
                      {element_type === 'date' && (
                        <DateInput
                          name={name}
                          controlled
                          nullable
                          sm
                          defaultValue={
                            values?.[guid]?.value ||
                            defaultValue?.find((f: any) => f?.guid === guid)?.value ||
                            ''
                          }
                          onChange={(e: any) => {
                            const val: any = {
                              ...values,
                              [guid]: {
                                guid,
                                value: e.format('YYYY-MM-DD'),
                              },
                            }
                            setValues(val)
                            onChange && onChange(Object.values(val || {}))
                          }}
                        />
                      )}

                      {element_type === 'currency' && (
                        <div className='input-group input-group-solid'>
                          <div className='col-5'>
                            <Select
                              name='currency'
                              placeholder='Enter '
                              styles={customStyles(true, {input: {margin: 0}})}
                              options={optCurrency}
                              value={
                                valueCurrency?.[guid]?.value?.code !== undefined
                                  ? {
                                      value: valueCurrency?.[guid]?.value?.code,
                                      label: valueCurrency?.[guid]?.value?.code,
                                    }
                                  : preferenceCurrency
                                  ? preferenceCurrency?.[0]
                                  : optCurrency?.[0]
                              }
                              components={{
                                DropdownIndicator,
                                Option: ({innerProps, data}: any) => (
                                  <div
                                    {...innerProps}
                                    style={{
                                      borderBottom: '1px solid #EBEBEB',
                                      padding: '0.5rem',
                                      fontSize: '9pt',
                                    }}
                                  >
                                    {data?.label}
                                  </div>
                                ),
                              }}
                              getOptionValue={(option: any) => option?.value}
                              getOptionLabel={(option: any) => option?.value}
                              onChange={({value}: any) => {
                                const val: any = {
                                  ...values,
                                  [guid]: {
                                    guid,
                                    value: {
                                      code: value,
                                      amount: values?.[guid]?.value?.amount || '',
                                    },
                                  },
                                }
                                setValueCurrency(val)
                                onChange && onChange(Object.values(val || {}))
                              }}
                            />
                          </div>

                          <div className='col-7'>
                            <input
                              type='number'
                              name={name}
                              placeholder={`Enter ${name}`}
                              className={configClass?.form}
                              value={values?.[guid]?.value?.amount || ''}
                              onChange={({target: {value}}: any) => {
                                const currencyValue =
                                  valueCurrency?.[guid]?.value?.code !== undefined
                                    ? valueCurrency?.[guid]?.value?.code
                                    : preferenceCurrency
                                    ? preferenceCurrency?.[0]?.value
                                    : optCurrency?.[0]?.value

                                const val: any = {
                                  ...values,
                                  [guid]: {guid, value: {code: currencyValue, amount: value}},
                                }
                                setValues(val)
                                onChange && onChange(Object.values(val || {}))
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {element_type === 'gps' && (
                        <>
                          <div className='input-group input-group-solid'>
                            <input
                              type='number'
                              name={name}
                              placeholder='Lat'
                              className={configClass?.form}
                              value={values?.[guid]?.value?.lat || ''}
                              onChange={({target: {value}}: any) => {
                                const val: any = {
                                  ...values,
                                  [guid]: {
                                    guid,
                                    value: {lat: value, lng: values?.[guid]?.value?.lng || ''},
                                  },
                                }
                                setValues(val)
                                onChange && onChange(Object.values(val || {}))
                              }}
                            />
                            <input
                              type='number'
                              name={name}
                              placeholder='Long'
                              className={configClass?.form}
                              value={values?.[guid]?.value?.lng || ''}
                              onChange={({target: {value}}: any) => {
                                const val: any = {
                                  ...values,
                                  [guid]: {
                                    guid,
                                    value: {lat: values?.[guid]?.value?.lat || '', lng: value},
                                  },
                                }
                                setValues(val)
                                onChange && onChange(Object.values(val || {}))
                              }}
                            />
                          </div>
                          {errors?.global_custom_fields !== undefined &&
                            errors?.global_custom_fields?.[guid] !== undefined &&
                            errors?.global_custom_fields?.[guid]?.lat !== undefined && (
                              <div className='fv-plugins-message-container invalid-feedback'>
                                {errors?.global_custom_fields?.[guid]?.lat}
                              </div>
                            )}
                          {errors?.global_custom_fields !== undefined &&
                            errors?.global_custom_fields?.[guid] !== undefined &&
                            errors?.global_custom_fields?.[guid]?.lng !== undefined && (
                              <div className='fv-plugins-message-container invalid-feedback'>
                                {errors?.global_custom_fields?.[guid]?.lng}
                              </div>
                            )}
                        </>
                      )}
                      {element_type === 'numeric' && (
                        <input
                          type='number'
                          name={name}
                          placeholder={`Enter ${name}`}
                          className={configClass?.form}
                          value={values?.[guid]?.value || ''}
                          onChange={({target: {value}}: any) => {
                            const val: any = {...values, [guid]: {guid, value}}
                            setValues(val)
                            onChange && onChange(Object.values(val || {}))
                          }}
                        />
                      )}

                      {element_type === 'link' && (
                        <div className='input-group input-group-solid d-flex align-items-center'>
                          <input
                            ref={hyperlinkUrlRef}
                            placeholder='Enter URL'
                            type='text'
                            defaultValue={values?.[guid]?.value?.url}
                            className={`${configClass?.form} border-end border-right-3`}
                            onChange={({target: {value}}) => {
                              const val: any = {
                                ...values,
                                [guid]: {
                                  guid,
                                  value: {
                                    url: urlValidation(value),
                                    text: hyperlinkTextRef?.current?.value,
                                  },
                                },
                              }
                              setValues(val)
                              onChange && onChange(Object.values(val || {}))
                            }}
                          />
                          <input
                            ref={hyperlinkTextRef}
                            placeholder='Enter URL Title'
                            type='text'
                            value={values?.[guid]?.value?.text || ''}
                            className={`${configClass?.form} border-start border-left-3`}
                            onChange={({target: {value}}: any) => {
                              const val: any = {
                                ...values,
                                [guid]: {
                                  guid,
                                  value: {
                                    url: urlValidation(hyperlinkUrlRef?.current?.value),
                                    text: value,
                                  },
                                },
                              }
                              setValues(val)
                              onChange && onChange(Object.values(val || {}))
                            }}
                          />
                        </div>
                      )}

                      {element_type === 'text' && (
                        <textarea
                          name={name}
                          placeholder={`Enter ${name}`}
                          className={configClass?.form}
                          value={values?.[guid]?.value || ''}
                          onChange={({target: {value}}: any) => {
                            const val: any = {...values, [guid]: {guid, value}}
                            setValues(val)
                            onChange && onChange(Object.values(val || {}))
                          }}
                        />
                      )}
                      {element_type === 'datetime' && (
                        <DateTimeInput
                          name={name}
                          controlled
                          nullable
                          sm
                          defaultValue={
                            values?.[guid]?.value ||
                            defaultValue?.find((f: any) => f?.guid === guid)?.value ||
                            ''
                          }
                          onChange={(e: any) => {
                            const val: any = {
                              ...values,
                              [guid]: {
                                guid,
                                value: e?.format('YYYY-MM-DD HH:mm:ss'),
                              },
                            }
                            setValues(val)
                            onChange && onChange(Object.values(val || {}))
                          }}
                        />
                      )}
                    </div>

                    {/* ERROR FOR MANDATORY CUSTOM FIELD */}
                    {(rules?.required === true || is_required === 1) && onClickForm && (
                      <div className='fv-plugins-message-container mt-0 invalid-feedback'>
                        {typeof values?.[guid]?.value === 'object' &&
                          (Object.values(values?.[guid]?.value || {})?.filter((f: any) => !f)
                            ?.length > 0 ||
                            (Array.isArray(values?.[guid]?.value) &&
                              !values?.[guid]?.value?.length)) &&
                          `${name} is required`}
                        {typeof values?.[guid]?.value !== 'object' &&
                          !values?.[guid]?.value &&
                          (errors?.global_custom_fields !== undefined &&
                          errors?.global_custom_fields?.[guid] !== undefined
                            ? `${errors?.global_custom_fields?.[guid]}`
                            : Object.keys(errors || {})?.length > 0
                            ? `${name} is required`
                            : ``)}
                      </div>
                    )}
                  </div>
                </Fragment>
              )
            }
          )}
        </div>
      )}
    </>
  )
}
