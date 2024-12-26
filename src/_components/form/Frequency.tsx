import {Select as ReactSelect} from '@components/select/select'
import {configClass, staticDate, staticDatePeriod, staticMonth} from '@helpers'
import moment from 'moment'
import {FC, useEffect, useState} from 'react'

import {CheckBox} from './checkbox'
import {CustomRadio} from './CustomRadio'
import {SelectDate} from './SelectDate'

type Props = {
  setFieldValue: any
  onChange: any
  detail?: any
  touched?: any
}

const FrequencyForm: FC<Props> = ({setFieldValue, detail, onChange, touched}) => {
  let days: any = moment.weekdays().map((m: any) => ({value: m.toLowerCase(), label: m}))
  const months: any = moment.months().map((m: any) => ({value: m.toLowerCase(), label: m}))
  const mounth: any = staticMonth() || {}
  const optionType: any = staticDatePeriod() || {}
  const dates: any = staticDate() || {}

  const [type, setType] = useState<string>('daily')
  const [year, setYear] = useState<any>({date: '01', month: 'January'})
  const [value, setValue] = useState<any>({frequency: 'daily', frequency_value: []})

  detail?.frequency === 'daily' &&
    detail?.frequency_value &&
    (days = days?.map(({value, label}: any) => ({
      value,
      label,
      checked: detail?.frequency_value?.includes(value),
    })))

  useEffect(() => {
    setType(detail?.frequency || 'daily')
    setValue({
      frequency: detail?.frequency || 'daily',
      frequency_value: detail?.frequency_value || [],
    })
    if (detail?.frequency === 'yearly') {
      setYear({
        date: detail?.frequency_value?.[0]?.split(' ')?.[0] || '01',
        month: detail?.frequency_value?.[0]?.split(' ')?.[1] || 'January',
      })
    }
  }, [detail])

  return (
    <div className='row'>
      <CustomRadio
        col='col-auto small'
        options={optionType}
        defaultValue={type}
        onChange={(e: any) => {
          setType(e)
          setValue({
            frequency: e,
            frequency_value:
              detail?.frequency === e
                ? detail?.frequency_value
                : e === 'yearly'
                ? [`01 ${months?.[0].label || ''}`]
                : [],
          })
          setFieldValue('frequency', e)
          e === 'yearly' &&
            !detail?.frequency_value &&
            setFieldValue('frequency_value', [`01 ${months?.[0].label || ''}`])
          onChange && onChange({...value, frequency: e})
        }}
      />

      <div className='col-12'>
        {type === 'daily' && (
          <div className='bg-light px-3 py-2 my-3'>
            <CheckBox
              name='frequency_value'
              col='4'
              options={days}
              onChange={(e: any) => {
                const arr: any = e?.map(({value}: any) => value) as never[]
                setValue({...value, frequency_value: arr})
                setFieldValue('frequency_value', arr)
                onChange && onChange({...value, frequency_value: arr})
              }}
            />
          </div>
        )}

        {type === 'weekly' && (
          <div className='row align-items-center my-3'>
            <div className='col-auto fw-bold'>Every</div>
            <div className='col'>
              <select
                name='frequency_value'
                defaultValue={detail?.frequency === 'weekly' ? detail?.frequency_value?.[0] : ''}
                className={configClass?.select}
                onInput={({target: {value: val}}: any) => {
                  if (val) {
                    setValue({...value, frequency_value: [val || '']})
                    setFieldValue('frequency_value', [val || ''])
                    onChange && onChange({...value, frequency_value: [val || '']})
                  } else {
                    setValue({...value, frequency_value: []})
                    setFieldValue('frequency_value', [])
                    onChange && onChange({...value, frequency_value: []})
                  }
                }}
              >
                <option value=''>Choose Day</option>
                {!!days &&
                  days?.length > 0 &&
                  days?.map(({value, label}: any, index: number) => (
                    <option key={index} value={value || ''}>
                      {label || '-'}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        )}

        {type === 'monthly' && (
          <div className='border border-primary px-3 py-2 rounded my-3'>
            <div className='border-bottom border-primary text-center fw-bolder pb-1 mb-2'>
              EVERY
            </div>
            <SelectDate
              name='frequency_value'
              defaultValue={detail?.frequency === 'monthly' ? detail?.frequency_value : []}
              onChange={(e: any) => {
                setValue({...value, frequency_value: e})
                setFieldValue('frequency_value', e)
                onChange && onChange({...value, frequency_value: e})
              }}
            />
          </div>
        )}

        {type === 'yearly' && (
          <div className='row align-items-center my-3'>
            <div className='col-auto fw-bold'>Every</div>
            <div className='col d-flex'>
              <div className='input-group input-group-solid'>
                <ReactSelect
                  sm={true}
                  data={dates}
                  isClearable={false}
                  className='w-50 p-0'
                  name='frequency_value'
                  placeholder='Choose Date'
                  defaultValue={
                    detail?.frequency === 'yearly'
                      ? detail?.frequency_value?.[0]?.split(' ')?.[0]
                      : ''
                  }
                  onChange={({value: val}) => {
                    const result: any = {...year, date: val || ''}
                    const formattedResult: any = [`${result?.date || ''} ${result?.month || ''}`]
                    setValue({...value, frequency_value: formattedResult as never[]})
                    setFieldValue('frequency_value', formattedResult as never[])
                    onChange && onChange({...value, frequency_value: formattedResult as never[]})
                    setYear(result || {})
                  }}
                />

                <ReactSelect
                  sm={true}
                  data={mounth}
                  isClearable={false}
                  className='w-50 p-0'
                  name='frequency_value'
                  placeholder={'Choose Month'}
                  defaultValue={
                    detail?.frequency === 'yearly'
                      ? detail?.frequency_value?.[0]?.split(' ')?.[1]
                      : ''
                  }
                  onChange={({value: val}: any) => {
                    const result: any = {...year, month: val || ''}
                    const formattedResult: any = [`${result?.date || ''} ${result?.month || ''}`]
                    setValue({...value, frequency_value: formattedResult as never[]})
                    setFieldValue('frequency_value', formattedResult as never[])
                    onChange && onChange({...value, frequency_value: formattedResult as never[]})
                    setYear(result || {})
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {!value?.frequency_value?.length && touched && (
        <div className='fv-plugins-message-container invalid-feedback mt-0'>
          Frequency Value can not be empty
        </div>
      )}
    </div>
  )
}

export {FrequencyForm}
