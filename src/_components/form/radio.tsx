import {Field} from 'formik'
import {FC, useEffect, useMemo, useState} from 'react'

export const RadioNumber: FC<any> = ({
  name = 'radio',
  options = [],
  variant = 'primary',
  className = '',
  radioClass = 'm-1',
  defaultChecked = undefined,
  onChange = () => undefined,
}) => {
  const option: any = useMemo(() => options || [], [options])
  const theme: any = useMemo(() => variant || 'primary', [variant])
  return (
    <div className={`d-flex align-items-center ${className}`}>
      {option?.length > 0 &&
        option.map((data: any, index: any) => (
          <div className={radioClass} key={index}>
            <input
              type='radio'
              value={data?.value}
              defaultChecked={defaultChecked ? defaultChecked === data?.value : undefined}
              className='btn-check'
              name={name}
              id={`${name}-${index}`}
              onChange={() => onChange(data)}
              autoComplete='off'
            />
            <label
              className={`btn d-flex align-items-center justify-content-center p-0 rounded-circle w-25px h-25px btn-outline-${theme} border border-${theme}`}
              htmlFor={`${name}-${index}`}
            >
              <strong>{data.label}</strong>
            </label>
          </div>
        ))}
    </div>
  )
}
export const Radio123: FC<any> = ({defaultValue, options, onChange, col, dataCY}) => {
  const [value, setValue] = useState()
  useEffect(() => {
    defaultValue && setValue(defaultValue)
  }, [defaultValue])
  return (
    <>
      {!!options && (
        <div className='row' data-cy={dataCY}>
          {options.map(({value: key, label}: any, index: any) => (
            <div className={`${col || 'col'} mb-3`} key={index}>
              <div
                className={`d-flex align-items-center cursor-pointer user-select-none`}
                onClick={() => {
                  onChange && onChange(key)
                  setValue(key)
                }}
              >
                <div
                  className={`h-15px w-15px d-flex align-items-center justify-content-center rounded-circle me-2 ${
                    key === value ? 'bg-primary' : 'bg-secondary'
                  }`}
                >
                  <i className={`fa fa-check ${key === value ? 'text-white' : 'text-gray-400'}`} />
                </div>
                <span className={`${key === value ? 'text-primary' : 'text-dark'} fw-bold`}>
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
export const Radio: FC<any> = ({name, defaultValue, options, onChange, col}) => {
  const [value, setValue] = useState()
  useEffect(() => {
    defaultValue && setValue(defaultValue)
  }, [defaultValue])
  return (
    <div className='row align-items-center'>
      {Array.isArray(options) &&
        options
          .sort((a: any, b: any) => (a?.value > b?.value ? 1 : -1))
          ?.map(({value: key, label}: any, index: any) => {
            return (
              <div
                role='group'
                aria-labelledby='my-radio-group'
                className={`${col || 'col'} mb-2`}
                key={index}
              >
                <label className='form-check form-check-custom form-check-sm form-check-solid bg-light radius-50 px-2'>
                  <Field
                    type='radio'
                    onClick={() => {
                      onChange && onChange(key)
                      setValue(key)
                    }}
                    className='form-check-input border border-gray-400'
                    name={name}
                    value={key}
                    checked={defaultValue === key ? true : false}
                  />
                  <span
                    className={`${
                      key === value ? 'text-primary' : 'text-dark'
                    } m-2 cursor-pointer fw-bold text-dark fs-7`}
                  >
                    {label}
                  </span>
                </label>
              </div>
            )
          })}
    </div>
  )
}

export const RadioFilter: FC<any> = ({
  name = 'radio',
  options = [],
  checkedRadio = {},
  className = '',
  setCheckedRadio = () => undefined,
  onChange = () => undefined,
}) => {
  const option: any = useMemo(() => options || [], [options])
  const {isChecked} = checkedRadio
  return (
    <div className={className}>
      <div className=''>
        {option?.length > 0 &&
          option?.map((data: any, index: any) => (
            <div className='mb-1' key={index} style={{width: '175px'}}>
              <label
                className='form-check form-check-custom form-check-sm form-check-solid bg-f7 rounded px-2'
                htmlFor={`${name}-${index}`}
              >
                <input
                  type='radio'
                  className='form-check-input border border-gray-400'
                  value={data?.value}
                  checked={isChecked === data?.value}
                  name={name}
                  id={`${name}-${index}`}
                  onClick={() => setCheckedRadio({isChecked: data?.value})}
                  onChange={() => onChange(data)}
                  autoComplete='off'
                />
                <span className='m-2 cursor-pointer fw-bold text-dark fs-7'>
                  <strong>{data?.label}</strong>
                </span>
              </label>
            </div>
          ))}
      </div>
    </div>
  )
}
