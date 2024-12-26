import {configClass} from '@helpers'
import {ErrorMessage, Field, useFormikContext} from 'formik'
import {FC} from 'react'
import {shallowEqual, useSelector} from 'react-redux'

interface Props {
  vertical?: boolean
  label?: boolean
}

const SelectTimeFormat: FC<Props> = ({vertical, label}) => {
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {time_format} = preferenceStore || {}
  const {values}: any = useFormikContext()

  return (
    <>
      {label && (
        <div className={`${vertical ? 'col-12' : 'col-3'}`}>
          <label htmlFor='time_format' className={`${configClass?.label} required`}>
            Time format
          </label>
        </div>
      )}
      <div className={`${vertical ? 'col-12' : 'col-9'}`}>
        <Field name='time_format' as='select' className={configClass?.select}>
          {!values.time_format && (
            // (<option value={values.time_format}>{values.time_format}</option>) :
            <option value=''>Choose Time Format</option>
          )}
          {time_format?.map((item: any) => {
            return (
              <option key={item.key} value={item.key}>
                {item?.value}
              </option>
            )
          })}
        </Field>
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='time_format' />
        </div>
      </div>
    </>
  )
}

export {SelectTimeFormat}
