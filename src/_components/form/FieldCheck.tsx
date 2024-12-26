import {ChangeEvent, FC, useEffect, useState} from 'react'

import {SelectOptionType} from './Fields'

export const FieldCheck: FC<any> = ({option, type, defaultValue, onChange}) => {
  const [val, setVal] = useState<any>(type === 'chcekbox' ? [] : '')
  useEffect(() => {
    setVal(defaultValue)
  }, [defaultValue])
  return (
    <div className='row'>
      {option?.map(({key, value}: SelectOptionType, index: number) => (
        <div className='col-auto mb-2' key={index}>
          <label
            className={`form-check form-check-custom form-check-sm form-check-solid bg-light px-2 ${
              type === 'radio' ? 'radius-50' : 'rounded'
            }`}
          >
            <input
              type={type}
              className='form-check-input border border-gray-400'
              name={type}
              value={key}
              checked={type === 'checkbox' ? (val || [])?.includes(key) : key === (val || '')}
              onChange={({target: {value, checked}}: ChangeEvent<any>) => {
                if (type === 'checkbox') {
                  const res: any = checked
                    ? (val || [])?.concat(value)
                    : (val || [])?.filter((f: any) => f !== value)
                  setVal(res)
                  onChange(res)
                } else {
                  setVal(value)
                  onChange(value)
                }
              }}
            />
            <span className='m-2 cursor-pointer fw-bold text-dark fs-7'>{value}</span>
          </label>
        </div>
      ))}
    </div>
  )
}
