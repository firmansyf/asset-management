import {configClass} from '@helpers'
import {Field} from 'formik'
import {FC, useState} from 'react'

type Props = {
  name: string
  type: string
  placeholder: string
  defaultValue?: any
  className?: any
  as?: any
  errors?: any
  onClickForm?: any
}

const InputText: FC<Props> = ({
  name,
  type,
  placeholder,
  as,
  className,
  defaultValue = '',
  errors = undefined,
  onClickForm = undefined,
}) => {
  const [onChange, setOnChange] = useState<boolean>(false)

  return (
    <>
      <Field
        name={name}
        type={type}
        as={as}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={className + ' ' + configClass?.form}
        onBlur={() => {
          setOnChange(true)
        }}
      />
      {errors !== undefined &&
        Object.keys(errors || {})?.length > 0 &&
        Object.keys(errors || {})?.map((item: any, index: number) => {
          if (item === name && (onChange || onClickForm)) {
            return (
              <div key={index} className='fv-plugins-message-container invalid-feedback mb-2 mt-2'>
                {errors[item]}
              </div>
            )
          } else {
            return false
          }
        })}
    </>
  )
}

export {InputText}
