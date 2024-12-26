import {FC, useEffect, useState} from 'react'

const CustomRadio: FC<any> = ({defaultValue, options, onChange, col, rowClass}) => {
  const [value, setValue] = useState(0)
  useEffect(() => {
    defaultValue && setValue(defaultValue)
  }, [defaultValue])
  return (
    <>
      {!!options && (
        <div className={`row mx-n1 ${rowClass || ''}`}>
          {options.map(({value: key, label}: any, index: any) => (
            <div className={`${col || 'col'} px-1 mb-3`} key={index}>
              <div
                className={`d-flex align-items-center cursor-pointer user-select-none border radius-20 py-1 px-2 ${
                  key === value ? 'border-primary bg-light-primary' : 'border-gray-300'
                }`}
                onClick={() => {
                  onChange && onChange(key)
                  setValue(key)
                }}
              >
                <div
                  className={`h-15px w-15px d-flex align-items-center justify-content-center rounded-circle me-2 ${
                    key === value ? 'bg-primary' : 'bg-light'
                  }`}
                >
                  <i
                    className={`fa fa-check fs-9 ${
                      key === value ? 'text-white' : 'text-secondary'
                    }`}
                  />
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

export {CustomRadio}
