import {configClass} from '@helpers'
import {ErrorMessage, Field, useFormikContext} from 'formik'
import {FC} from 'react'
import {shallowEqual, useSelector} from 'react-redux'

interface Props {
  vertical?: boolean
  label?: boolean
}
const SelectDateFormat: FC<Props> = ({vertical, label = true}) => {
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {date_format} = preferenceStore || {}
  const {values} = useFormikContext<any>()
  return (
    <>
      {label && (
        <div className={`${vertical ? 'col-12' : 'col-3'}`}>
          <label htmlFor='date_format' className={`${configClass?.label} required`}>
            Date format
          </label>
        </div>
      )}
      <div className={`${vertical ? 'col-12' : 'col-9'}`}>
        <Field name='date_format' as='select' className={configClass?.select}>
          {!values.date_format && (
            // (<option value={values.date_format}>{values.date_format}</option>) :
            <option value=''>Choose Date Format</option>
          )}
          {date_format?.map((item: any) => {
            return (
              <option key={item.key} selected={item.key === values.date_format} value={item.key}>
                {item?.value}
              </option>
            )
          })}
        </Field>
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='date_format' />
        </div>
      </div>
    </>
  )
}

export {SelectDateFormat}
