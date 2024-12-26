import {ClearIndicator, customStyles, DropdownIndicator} from '@components/select/config'
import {ErrorMessage} from 'formik'
import {FC} from 'react'
import Select from 'react-select'

interface SelectProps {
  name: string
  placeholder: string
  options: any
  defaultValue?: any
  onChange?: any
  inputId: any
  className: any
}

const SelectMultiple: FC<SelectProps> = ({
  name,
  placeholder,
  options,
  defaultValue,
  onChange,
  inputId,
  className,
}) => {
  return (
    <div className='row'>
      <Select
        options={options}
        className={className}
        styles={customStyles(true, {})}
        components={{DropdownIndicator, ClearIndicator}}
        inputId={inputId}
        name={name}
        isMulti
        placeholder={placeholder}
        value={defaultValue}
        onChange={(e: any) => {
          onChange && onChange(e || {value: ''})
        }}
      />
      <div className='fv-plugins-message-container invalid-feedback'>
        <ErrorMessage name={name} />
      </div>
    </div>
  )
}

export {SelectMultiple}
