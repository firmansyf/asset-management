import {configClass} from '@helpers'
import {ErrorMessage, Field} from 'formik'
import {FC} from 'react'

interface SelectProps {
  name: string
  label: string
  placeholder: string
  handleChange?: any
  options: any
  value?: any
}

const SelectField: FC<SelectProps> = ({label, name, placeholder, options, handleChange, value}) => {
  return (
    <div className='row my-2'>
      <div className='col-3'>
        <label htmlFor={name} className={`${configClass?.label} float-end`}>
          {label}
        </label>
      </div>
      <div className='col-9'>
        <Field
          value={value}
          onChange={handleChange}
          as='select'
          className={configClass?.select}
          name={name}
          type='text'
        >
          <option value=''>{placeholder}</option>
          {Array.isArray(options) &&
            options.map(({guid, name}) => {
              return (
                <option key={guid} value={guid}>
                  {name}
                </option>
              )
            })}
        </Field>
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name={name} />
        </div>
      </div>
    </div>
  )
}

export {SelectField}
