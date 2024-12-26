import {replaceHTMLEntity} from '@helpers'
import {FC, useMemo, useRef} from 'react'

export const CheckBox: FC<any> = ({
  name,
  className = '',
  labelClass = '',
  col = '',
  sm = '',
  md = '',
  lg = '',
  xl = '',
  multiple = true,
  controlled = false,
  checkAll,
  options = [],
  optionsAll = [],
  onChange = () => '',
  setColumns = () => '',
  defaultValue = undefined,
}) => {
  const inputRef = useRef<any>([])
  const options1 = useMemo(() => options || [], [options])
  const options2 = useMemo(() => optionsAll || [], [optionsAll])

  const onChange1 = () => {
    const check: any = inputRef?.current?.filter((f: any) => f && f?.checked)
    const checked: any = check?.length
      ? check?.map((m: any) => options1?.find((fn: any) => fn?.value?.toString() === m?.value))
      : []
    onChange(checked as never[])
  }

  const onChange2 = ({target: {value, checked: dataChecked}}: any) => {
    const check: any = inputRef?.current?.filter((f: any) => f && f?.checked)
    const checked: any = check?.length
      ? check?.map((m: any) => options2?.find((fn: any) => fn?.value?.toString() === m?.value))
      : []

    const new_arr_option: any =
      Array.isArray(options2) &&
      options2?.length > 0 &&
      options2?.map((item: any) => {
        if (item?.value === value) {
          return {...item, checked: dataChecked}
        } else {
          return item
        }
      })

    onChange(checked as never[])
    setColumns(new_arr_option as never[])
  }

  return (
    <div className={className || ''}>
      <div className={`row align-items-center ${className || ''}`}>
        {options1?.length > 0 && controlled
          ? options
              ?.sort((a: any, b: any) => (a?.label > b?.label ? 1 : -1)) // (a.label.toUpperCase() > b.label.toUpperCase() ? 1 : -1))
              ?.map((data: any, index: any) => (
                <div
                  className={`col${col && '-' + col} ${sm && 'col-sm-' + sm} ${
                    md && 'col-md-' + md
                  } ${lg && 'col-lg-' + lg} ${xl && 'col-xl-' + xl} ${labelClass || ''} py-0`}
                  key={index || 0}
                >
                  <div className='d-flex align-items-center form-check form-check-sm form-check-custom form-check-solid mb-1 mt-1'>
                    <input
                      name={name || ''}
                      autoComplete='off'
                      value={data?.value || ''}
                      onChange={onChange1}
                      id={`${name || ''}-${index || 0}`}
                      type={multiple ? 'checkbox' : 'radio'}
                      ref={(rf: any) => (inputRef.current[index] = rf)}
                      className='form-check-input border border-gray-300'
                      checked={
                        defaultValue?.['filter[role_name]']?.split(';')?.includes(data?.value) ||
                        data?.checked ||
                        false
                      }
                    />
                    <label
                      htmlFor={`${name || ''}-${index || 0}`}
                      className='ms-2 user-select-none cursor-pointer'
                    >
                      <strong>{replaceHTMLEntity(data?.custom_label || data?.label || '')}</strong>
                    </label>
                  </div>
                </div>
              ))
          : options1?.length > 0 && checkAll
          ? optionsAll
              ?.sort((a: any, b: any) => (a?.label > b?.label ? 1 : -1))
              ?.map((data: any, index: any) => {
                return (
                  <div
                    className={`col${col && '-' + col} ${sm && 'col-sm-' + sm} ${
                      md && 'col-md-' + md
                    } ${lg && 'col-lg-' + lg} ${xl && 'col-xl-' + xl} ${labelClass || ''} py-0`}
                    key={index || 0}
                  >
                    <div className='d-flex align-items-center form-check form-check-sm form-check-custom form-check-solid mb-1 mt-1'>
                      <input
                        name={name || ''}
                        autoComplete='off'
                        onChange={onChange2}
                        id={`${name || ''}-${index || 0}`}
                        type={multiple ? 'checkbox' : 'radio'}
                        ref={(rf: any) => (inputRef.current[index] = rf)}
                        className='form-check-input border border-gray-300'
                        checked={
                          defaultValue?.['filter[role_name]']?.split(';')?.includes(data?.value) ||
                          data?.checked ||
                          false
                        }
                      />
                      <label
                        htmlFor={`${name || ''}-${index || 0}`}
                        className='ms-2 user-select-none cursor-pointer'
                      >
                        <strong>{replaceHTMLEntity(data?.custom_label || data?.label)}</strong>
                      </label>
                    </div>
                  </div>
                )
              })
          : options1?.length > 0 &&
            options
              ?.sort((a: any, b: any) => (a?.label > b?.label ? 1 : -1))
              ?.map((data: any, index: any) => (
                <div
                  className={`col${col && '-' + col} ${sm && 'col-sm-' + sm} ${
                    md && 'col-md-' + md
                  } ${lg && 'col-lg-' + lg} ${xl && 'col-xl-' + xl} ${labelClass || ''} py-0`}
                  key={index || 0}
                >
                  <div className='d-flex align-items-center form-check form-check-sm form-check-custom form-check-solid mb-1 mt-1 width-230'>
                    <input
                      name={name || ''}
                      autoComplete='off'
                      onChange={onChange1}
                      id={`${name}-${index}`}
                      value={data?.value || ''}
                      type={multiple ? 'checkbox' : 'radio'}
                      ref={(rf: any) => (inputRef.current[index] = rf)}
                      className='form-check-input border border-gray-300'
                      defaultChecked={
                        defaultValue?.['filter[role_name]']?.split(';')?.includes(data?.value) ||
                        data?.checked ||
                        false
                      }
                    />
                    <label
                      htmlFor={`${name || ''}-${index || 0}`}
                      className='ms-2 user-select-none cursor-pointer'
                    >
                      <strong>{replaceHTMLEntity(data?.custom_label || data?.label)}</strong>
                    </label>
                  </div>
                </div>
              ))}
      </div>
    </div>
  )
}
