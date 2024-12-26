import {Title} from '@components/form/Title'
import {Select} from '@components/select/select'
import cx from 'classnames'
import {ErrorMessage, Field, useFormikContext} from 'formik'
import {FC, memo} from 'react'
import {shallowEqual, useSelector} from 'react-redux'

interface Props {
  configClass: any
  country: any
  setCountry: any
}

let AddressDetail: FC<Props> = ({configClass}) => {
  // , country, setCountry
  const {values, setFieldValue}: any = useFormikContext()

  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {country}: any = preferenceStore || {}
  const dataCountry: any = country?.map(({iso_code, name}: any) => ({value: iso_code, label: name}))
  const countryValue: any = values?.country?.value || values?.country

  return (
    <div className='card shadow-sm mb-10'>
      <div className='card-header px-6'>
        <Title title='Address Details' sticky={false} className='my-2' />
      </div>

      <div className='card-body px-5 py-3'>
        <div className='row'>
          <div className={configClass?.grid}>
            <label htmlFor='line1' className={cx(configClass?.label, 'required')}>
              Address 1
            </label>
            <Field
              name='line1'
              placeholder='Enter Address'
              className={cx(`${configClass?.form}`, 'required')}
            />
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name='line1' />
            </div>
          </div>

          <div className={configClass?.grid}>
            <label htmlFor='line2' className={cx(configClass?.label, 'required')}>
              Address 2
            </label>
            <Field
              name='line2'
              placeholder='Enter Extended Address'
              className={cx(`${configClass?.form}`, 'required')}
            />
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name='line2' />
            </div>
          </div>

          <div className={configClass?.grid}>
            <label htmlFor='city' className={cx(configClass?.label, 'required')}>
              City
            </label>
            <Field
              name='city'
              placeholder='Enter City'
              className={cx(`${configClass?.form}`, 'required')}
            />
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name='city' />
            </div>
          </div>

          <div className={configClass?.grid}>
            <label htmlFor='state' className={cx(configClass?.label, 'required')}>
              State / Province
            </label>
            <Field
              name='state'
              placeholder='Enter State / Province'
              className={cx(`${configClass?.form}`, 'required')}
            />
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name='state' />
            </div>
          </div>

          <div className={configClass?.grid}>
            <label htmlFor='postcode' className={cx(configClass?.label, 'required')}>
              Zip / Postalcode
            </label>
            <Field
              type='text'
              maxLength='10'
              name='postcode'
              value={values?.postcode || ''}
              placeholder='Enter Zip / Postalcode'
              onChange={({target: {value}}: any) => setFieldValue('postcode', value || '')}
              className={cx(`${configClass?.form}`, 'required')}
            />
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name='postcode' />
            </div>
          </div>

          <div className={configClass?.grid}>
            <label htmlFor='country' className={cx(configClass?.label, 'required')}>
              Country
            </label>
            <Select
              sm={true}
              name='country'
              data={dataCountry}
              reload={false}
              params={false}
              isClearable={false}
              className='col p-0'
              placeholder='Choose Country'
              defaultValue={countryValue}
              onChange={({value}: any) => setFieldValue('country', value || '-')}
            />
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name='country' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

AddressDetail = memo(
  AddressDetail,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {AddressDetail}
