import {getTimezone} from '@api/timezone'
import {Select} from '@components/select/ajax'
import {configClass} from '@helpers'
import {ErrorMessage} from 'formik' //useFormikContext
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import {FC, useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'

interface Props {
  vertical?: boolean
  setFieldValue?: any
  initialValues?: any
  label?: boolean
  isClearable?: boolean
}

const SelectTimezone: FC<Props> = ({
  vertical,
  setFieldValue,
  initialValues,
  label = true,
  isClearable = false,
}) => {
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {timezone} = preferenceStore || {}
  const [defaultTimeZone, setDefaultTimeZone] = useState<any>([])

  useEffect(() => {
    if (initialValues) {
      const initTimeZone: any = filter(timezone, (data: any) =>
        includes(initialValues?.timezone, data?.key)
      )
      const initTimeZoneObj = initTimeZone.reduce(
        (acc: any, val: any) => Object.assign(acc || {}, val || {}),
        {}
      )
      setDefaultTimeZone(initTimeZoneObj)
    }
  }, [timezone, initialValues])

  return (
    <>
      {label && (
        <div className={`${vertical ? 'col-12' : 'col-3'}`}>
          <label htmlFor='timezone' className={`${configClass?.label} required`}>
            Timezone
          </label>
        </div>
      )}
      <div className={`${vertical ? 'col-12' : 'col-9'}`}>
        <Select
          sm={true}
          name='timezone'
          data-cy='timezone'
          className='col p-0'
          isClearable={isClearable}
          api={getTimezone}
          params={false}
          reload={false}
          placeholder='Choose Timezone'
          defaultValue={{value: defaultTimeZone?.key, label: defaultTimeZone?.value}}
          onChange={(e: any) => {
            setFieldValue('timezone', e?.value)
          }}
          parse={(e: any) => {
            return {
              value: e?.key,
              label: e?.value,
            }
          }}
        />
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='timezone' />
        </div>
      </div>
    </>
  )
}

export {SelectTimezone}
