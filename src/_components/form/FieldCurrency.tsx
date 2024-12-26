/* eslint-disable react-hooks/exhaustive-deps */
import {Select} from '@components/select/select'
import {configClass} from '@helpers'
import {FC, useEffect, useRef, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'

import {SelectOptionType} from './Fields'

export const FieldCurrency: FC<any> = ({
  required,
  defaultValue,
  label,
  onChange,
  readOnly = false,
}) => {
  const currAmountRef = useRef<any>()
  const currCodeRef = useRef<any>()

  const [val, setVal] = useState<any>('')
  const pref: any = useSelector(({preference}: any) => preference, shallowEqual)
  const options: any = pref?.currency?.map(({key, value}: any) => ({
    value: key || '',
    label: value?.toString()?.split(' - ')?.reverse()?.join(' - ') || '',
  }))

  useEffect(() => {
    if (defaultValue !== null) {
      if (['string', 'number'].includes(typeof defaultValue?.amount) && defaultValue?.amount > 0) {
        setVal(defaultValue)
      } else {
        setVal({code: pref?.preference?.currency, amount: ''})
      }
    } else {
      setVal({code: pref?.preference?.currency, amount: ''})
    }
  }, [defaultValue])

  const handleChange = (event: any) => {
    const result: any = event?.target?.value?.replace(/[^0-9.]/g, '')
    setVal({code: val?.code, amount: result})
    onChange({
      code: currCodeRef?.current?.getValue()?.[0]?.value,
      amount: result ? parseInt(result) : null,
    })
  }

  return (
    <div className='input-group input-group-solid d-flex align-items-center'>
      <div className='col-6'>
        <Select
          ref={currCodeRef}
          sm={true}
          className='col p-0'
          data={options}
          params={false}
          placeholder='Choose'
          isClearable={!required}
          defaultValue={val?.code}
          onChange={({value}: SelectOptionType) => {
            onChange({code: value, amount: currAmountRef?.current?.value})
          }}
          isDisabled={readOnly}
        />
      </div>

      <input
        placeholder={`Enter ${label || ''}`}
        type='text'
        ref={currAmountRef}
        // defaultValue={val?.amount}
        readOnly={readOnly}
        className={configClass?.form}
        value={val?.amount || ''}
        onChange={handleChange}
      />
    </div>
  )
}
