import {getCompany} from '@api/company'
import {Title} from '@components/form/Title'
import {Select} from '@components/select/ajax'
import {Select as ReactSelect} from '@components/select/select'
import cx from 'classnames'
import {ErrorMessage, Field} from 'formik'
import {FC, memo, useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'

let ContactDetail: FC<any> = ({
  configClass,
  values,
  setFieldValue,
  phoneCode,
  setPhoneCode,
}: any) => {
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {phone_code: dataPhoneCode, country: dataCountry}: any = preferenceStore || {}

  const [phoneCodeDefault, setPhoneCodeDefault] = useState<any>('')

  useEffect(() => {
    if (dataPhoneCode && dataPhoneCode?.length > 0) {
      const data: any = dataPhoneCode?.map(({key, label}: any) => ({
        value: key || '',
        label: `${label || ''} (+${key || ''})`,
      }))
      setPhoneCode(data as never[])
    }
  }, [dataPhoneCode, setPhoneCode])

  useEffect(() => {
    const resCountry: any = dataCountry?.find(
      ({iso_code}: any) => iso_code?.toLowerCase() === values?.country?.toLowerCase()
    )
    const resPhone: any = dataPhoneCode?.find(
      ({label}: any) => label?.toLowerCase() === resCountry?.name?.toLowerCase()
    )
    setPhoneCodeDefault(resPhone?.key || '')
  }, [dataCountry, dataPhoneCode, values?.country])

  return (
    <div className='card shadow-sm mb-10 contact-detail'>
      <div className='card-header px-6'>
        <Title title='Contact Details' sticky={false} className='my-2' />
      </div>
      <div className='card-body px-5 py-3'>
        <div className='row'>
          <div className={configClass?.grid}>
            <label htmlFor='first_name' className={cx(configClass?.label, 'required')}>
              First Name
            </label>
            <Field
              name='first_name'
              placeholder='Enter First Name'
              className={cx(`${configClass?.form}`, 'required')}
            />
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name='first_name' />
            </div>
          </div>

          <div className={configClass?.grid}>
            <label htmlFor='last_name' className={cx(configClass?.label, 'required')}>
              Last Name
            </label>
            <Field
              name='last_name'
              placeholder='Enter Last Name'
              className={cx(`${configClass?.form}`, 'required')}
            />
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name='last_name' />
            </div>
          </div>

          <div className={configClass?.grid}>
            <label htmlFor='company' className={cx(configClass?.label, 'required')}>
              Company Name
            </label>
            <Select
              sm={true}
              name='company'
              className='col p-0'
              api={getCompany}
              params={false}
              reload={false}
              isClearable={false}
              placeholder='Choose Company'
              defaultValue={values?.company || {}}
              onChange={(e: any) => setFieldValue('company', e || {})}
              parse={({guid, name}: any) => ({value: guid || '', label: name || ''})}
            />
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name='company' />
            </div>
          </div>

          <div className={configClass?.grid}>
            <label htmlFor='email' className={cx(configClass?.label, 'required')}>
              Email
            </label>
            <Field
              name='email'
              placeholder='Enter Email'
              className={cx(`${configClass?.form}`, 'required')}
            />
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name='email' />
            </div>
          </div>

          <div className={configClass?.grid}>
            <label htmlFor='phone_number' className={cx(configClass?.label, 'required')}>
              Phone Number
            </label>
            <div className='input-group input-group-solid'>
              <ReactSelect
                sm={true}
                name='phone_code'
                className='col p-0'
                data={phoneCode}
                isClearable={false}
                placeholder='Enter Country Code'
                defaultValue={values?.phone_code || phoneCodeDefault}
                onChange={(e: any) => {
                  setFieldValue('phone_code', e?.value || {})
                }}
              />
              <Field
                name='phone_number'
                type='number'
                maxLength='16'
                placeholder='Enter Phone Number'
                className={cx(`${configClass?.form}`, 'required')}
                onChange={({target: {value}}: any) =>
                  setFieldValue('phone_number', value?.replace(/[^0-9]+/g, ''))
                }
              />
            </div>
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name='phone_number' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

ContactDetail = memo(
  ContactDetail,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {ContactDetail}
