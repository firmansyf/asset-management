import {getCompany} from '@api/company'
import {editPreference, getCurrency} from '@api/preference'
import {getTimezone} from '@api/timezone'
import {PageLoader} from '@components/loader/cloud'
import {Select as SelectAjax} from '@components/select/ajax'
import {Select} from '@components/select/select'
import {ToastMessage} from '@components/toast-message'
import {configClass, hasPermission} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {getAssetStatus} from '@pages/setup/settings/asset-status/Service'
import {getFeature} from '@pages/setup/settings/feature/Service'
import {getPreference} from '@pages/wizards/redux/WizardService'
import {savePreference} from '@redux'
import {useQuery} from '@tanstack/react-query'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {filter, includes, keyBy, mapValues} from 'lodash'
import {FC, memo, useEffect, useState} from 'react'
import {Button} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'

import {SaveButton} from './SaveButton'
import {validationSchema} from './validationSchema'

let Preference: FC = () => {
  const intl: any = useIntl()
  const {preference: preferenceStore, currentUser: userStore}: any = useSelector(
    ({preference, currentUser}: any) => ({preference, currentUser}),
    shallowEqual
  )
  const {is_otp}: any = userStore || {}
  const {country}: any = preferenceStore || {}
  const dataCountry: any = country?.map(({iso_code, name}: any) => ({value: iso_code, label: name}))

  const [errForm, setErrForm] = useState<any>(true)
  const [reload, setReload] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [reloadPage, setReloadPage] = useState<number>(1)
  const [initialData, setInitialData] = useState<any>(preferenceStore?.preference)
  const [currency, setCurrency] = useState<any>(undefined)
  const [resetOption, setResetOption] = useState<boolean>(false)
  const [defaultTimeZone, setDefaultTimeZone] = useState<any>([])
  const [defaultCurrency, setDefaultCurrency] = useState<any>([])
  const [selectedCountry, setSelectedCountry] = useState<any>(undefined)
  const [secondErrSubmit, setSecondErrSubmit] = useState<boolean>(false)
  const [selectedTimeZone, setSelectedTimeZone] = useState<any>(undefined)

  const isPrefEdit: any = hasPermission('preference.edit') || false

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  const featuresQuery: any = useQuery({
    queryKey: ['getPreferenceFeature'],
    queryFn: async () => {
      const res: any = await getFeature({orderCol: 'name', orderDir: 'asc'})
      const dataResult: any = mapValues(
        keyBy(res?.data?.data || [], 'unique_name'),
        ({value}: any) => value
      )
      // const dataResult: any = res?.data?.data
      return dataResult
    },
  })

  const features: any = featuresQuery?.data || {}

  const passwordExpired: any = [
    {value: 0, label: 'None'},
    {value: 30, label: '30 Days'},
    {value: 60, label: '60 Days'},
    {value: 90, label: '90 Days'},
  ]

  const otpFrequency: any = [
    {value: 1, label: 'Every Login'},
    {value: 2, label: '1 day'},
    {value: 3, label: '7 days'},
    {value: 4, label: '30 days'},
    {value: 5, label: '90 days'},
  ]

  const initialValue: any = {
    timezone: initialData?.timezone,
    currency: initialData?.currency,
    date_format: initialData?.date_format,
    time_format: initialData?.time_format,
    country_code: initialData?.country_code,
    password_expiry: initialData?.password_expiry,
    default_company: initialData?.default_company_guid,
    asset_id_prefix: initialData?.asset_id_prefix || '',
    frequency_two_factor: initialData?.frequency_two_factor,
    default_asset_status: initialData?.default_asset_status_guid,
    inventory_id_prefix: initialData?.inventory_id_prefix || 'ABC',
  }

  const handleOnSubmit = (values: any) => {
    setLoading(true)

    const params: any = {
      timezone: values?.timezone || '',
      date_format: values?.date_format || '',
      time_format: values?.time_format || '',
      country_code: values?.country_code || '',
      currency: currency || values?.currency || '',
      asset_id_prefix: values?.asset_id_prefix || '',
      password_expiry: values?.password_expiry || '0',
      inventory_id_prefix: values?.inventory_id_prefix || 'ABC',
      frequency_two_factor: values?.frequency_two_factor || '1',
      default_asset_status_guid:
        values?.default_asset_status?.value || initialData?.default_asset_status_guid || '',
      default_company_guid:
        values?.default_company?.value || initialData?.default_company_guid || '',
    }

    editPreference(params)
      .then(({data: {message}}: any) => {
        // setLoading(false)
        setReloadPage(reloadPage + 1)
        getPreference().then(({data: {data}}: any) => {
          savePreference({preference: data})
          setInitialData(data)
        })
        setTimeout(() => ToastMessage({type: 'clear'}), 200)
        setTimeout(() => ToastMessage({type: 'success', message}), 220)
        setTimeout(() => window.location.reload(), 2500)
      })
      .catch(({response}: any) => {
        setLoading(false)
        const {message}: any = response?.data || {}
        ToastMessage({type: 'error', message})
      })
      .finally(() => setLoading(false))
  }

  const onReset = () => {
    setTimeout(() => ToastMessage({type: 'clear'}), 200)
    setResetOption(true)
    setReload(true)
  }

  useEffect(() => {
    if (preferenceStore?.timezone?.length > 0) {
      // set default timezone
      const initTimeZone: any = filter(preferenceStore?.timezone, (data: any) =>
        includes(initialData?.timezone, data?.key)
      )
      const initTimeZoneObj: any = initTimeZone?.reduce(
        (acc: any, val: any) => Object.assign(acc || {}, val || {}),
        {}
      )
      setDefaultTimeZone(initTimeZoneObj)
    }

    if (preferenceStore?.country?.length > 0) {
      const initCurrency: any = filter(preferenceStore?.country, (data: any) =>
        includes(initialData?.currency, data?.currencies?.[0])
      )
      const initCurrencyObj: any = initCurrency?.reduce(
        (acc: any, val: any) => Object.assign(acc || {}, val || {}),
        {}
      )
      setDefaultCurrency(initCurrencyObj)
    }
  }, [initialData?.currency, initialData?.timezone, preferenceStore, reloadPage])

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.SETUP.PREFERENCE'})}</PageTitle>
      {loading || !featuresQuery?.isFetched ? (
        <div className='row'>
          <div className='col-12 text-center'>
            <PageLoader />
          </div>
        </div>
      ) : (
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValue}
          enableReinitialize
          onSubmit={handleOnSubmit}
        >
          {({setFieldValue, isSubmitting, errors, isValidating}) => {
            if (isSubmitting && errForm && Object.keys(errors || {})?.length > 0) {
              ToastMessage({
                message: intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'}),
                type: 'error',
              })

              setErrForm(false)
              setTimeout(() => setSecondErrSubmit(true), 2000)
            }

            if (
              isSubmitting &&
              isValidating &&
              !errForm &&
              Object.keys(errors)?.length > 0 &&
              secondErrSubmit
            ) {
              ToastMessage({
                message: intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'}),
                type: 'error',
              })
            }

            return (
              <Form className='justify-content-center' noValidate>
                <div className='card border border-gray-300'>
                  <div className='card-body pb-3'>
                    <div className='w-100'>
                      <div className='row'>
                        <div className='col-md-6 mb-5'>
                          <label
                            htmlFor='asset_id_prefix'
                            className={`${configClass?.label} required`}
                          >
                            Asset ID Prefix
                          </label>
                          <Field type='text' name='asset_id_prefix' className={configClass?.form} />
                          <div className='fv-plugins-message-container invalid-feedback'>
                            <ErrorMessage name='asset_id_prefix' />
                          </div>
                        </div>
                        {features?.inventory === 1 && (
                          <div className='col-md-6 mb-5'>
                            <label
                              htmlFor='inventory_id_prefix'
                              className={`${configClass?.label} required`}
                            >
                              Inventory ID Prefix
                            </label>
                            <Field
                              type='text'
                              name='inventory_id_prefix'
                              className={configClass?.form}
                            />
                            <div className='fv-plugins-message-container invalid-feedback'>
                              <ErrorMessage name='inventory_id_prefix' />
                            </div>
                          </div>
                        )}

                        <div className='col-md-6 mb-5'>
                          <label className='text-uppercase fw-bold space-2 text-black-400 mb-1'>
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
                            defaultValue={initialData?.country_code || ''}
                            onChange={({value}: any) => {
                              setFieldValue('country', value || '-')
                              setSelectedCountry(value || '')
                            }}
                          />
                          {selectedCountry === '' && (
                            <div className='fv-plugins-message-container invalid-feedback'>
                              This Country is required
                            </div>
                          )}
                        </div>

                        <div className='col-md-6 mb-5 timezone'>
                          <label className='text-uppercase fw-bold space-2 text-black-400 mb-1'>
                            Timezone
                          </label>

                          <SelectAjax
                            sm={true}
                            api={getTimezone}
                            params={preferenceStore?.timezone || {}}
                            name='timezone'
                            id='timezoneCy'
                            reload={false}
                            isClearable={false}
                            placeholder='Choose Timezone'
                            className='col p-0 timezone_cypress'
                            defaultValue={{
                              value: defaultTimeZone?.key || '',
                              label: defaultTimeZone?.value || '',
                            }}
                            onChange={(e: any) => {
                              setFieldValue('timezone', e?.value || '')
                              setSelectedTimeZone(e?.value)
                            }}
                            parse={(e: any) => {
                              return {
                                value: e?.key,
                                label: e?.value,
                              }
                            }}
                            resetOption={resetOption}
                            setResetOption={setResetOption}
                          />
                          {selectedTimeZone === '' && (
                            <div className='fv-plugins-message-container invalid-feedback'>
                              This Timezone is required
                            </div>
                          )}
                        </div>

                        <div className='col-md-6 mb-5'>
                          <label className='text-uppercase fw-bold space-2 text-black-400 mb-1'>
                            Date Format
                          </label>
                          <Field
                            as='select'
                            className={configClass?.select}
                            name='date_format'
                            type='text'
                          >
                            <option value=''>Choose Date Format</option>
                            {preferenceStore?.date_format?.map(
                              ({key, value}: any, index: number) => {
                                return (
                                  <option key={index || 0} value={key || ''}>
                                    {value || '-'}
                                  </option>
                                )
                              }
                            )}
                          </Field>
                          <div className='fv-plugins-message-container invalid-feedback'>
                            <ErrorMessage name='date_format' />
                          </div>
                        </div>

                        <div className='col-md-6 mb-5'>
                          <label className='text-uppercase fw-bold space-2 text-black-400 mb-1 col-md-5'>
                            Time Format
                          </label>
                          <Field
                            as='select'
                            className={configClass?.select}
                            name='time_format'
                            type='text'
                          >
                            <option value=''>Choose Time Format</option>
                            {preferenceStore?.time_format?.map(({key, value}: any, index: any) => {
                              return (
                                <option key={index || 0} value={key || ''}>
                                  {value || '-'}
                                </option>
                              )
                            })}
                          </Field>
                          <div className='fv-plugins-message-container invalid-feedback'>
                            <ErrorMessage name='time_format' />
                          </div>
                        </div>

                        <div className='col-md-6 mb-5'>
                          <label className={configClass?.label}>Default Asset Status</label>
                          <SelectAjax
                            sm={true}
                            api={getAssetStatus}
                            params={{orderCol: 'name', orderDir: 'asc', limit: '250'}}
                            isClearable={false}
                            className='col p-0'
                            resetOption={resetOption}
                            name='default_asset_status'
                            setResetOption={setResetOption}
                            placeholder='Choose Asset Status'
                            reload={initialData?.default_asset_status_guid}
                            parse={({guid, name}: any) => ({value: guid, label: name})}
                            onChange={(e: any) => setFieldValue('default_asset_status', e || '')}
                            defaultValue={
                              initialData?.default_asset_status_guid
                                ? {
                                    value: initialData?.default_asset_status_guid,
                                    label: initialData?.default_asset_status_name,
                                  }
                                : undefined
                            }
                          />
                        </div>

                        <div className='col-md-6 mb-5'>
                          <label className='text-uppercase fw-bold space-2 text-black-400 mb-1 col-lg-5'>
                            Currency
                          </label>

                          <SelectAjax
                            sm={true}
                            api={getCurrency}
                            params={preferenceStore?.currency}
                            reload={reload}
                            name='currency'
                            className='col p-0'
                            isClearable={false}
                            resetOption={resetOption}
                            placeholder='Choose Currency'
                            setResetOption={setResetOption}
                            parse={({key, value}: any) => ({value: key, label: value})}
                            defaultValue={{
                              value: initialData?.currency,
                              label: `${defaultCurrency?.name} - ${initialData?.currency}`,
                            }}
                            onChange={({value}: any) => {
                              setFieldValue('currency', value || '')
                              setCurrency(value || '')
                            }}
                          />
                          {currency === '' && (
                            <div className='fv-plugins-message-container invalid-feedback'>
                              This Currency is required
                            </div>
                          )}
                        </div>

                        <div className='col-md-6 mb-5'>
                          <label className={configClass?.label}>Default Company</label>
                          <SelectAjax
                            sm={true}
                            api={getCompany}
                            params={{orderCol: 'name', orderDir: 'asc', limit: '250'}}
                            reload={false}
                            className='col p-0'
                            isClearable={false}
                            name='default_company'
                            resetOption={resetOption}
                            placeholder='Choose Company'
                            setResetOption={setResetOption}
                            parse={({guid, name}: any) => ({value: guid, label: name})}
                            onChange={(e: any) => setFieldValue('default_company', e || '')}
                            defaultValue={
                              initialData?.default_company_guid
                                ? {
                                    value: initialData?.default_company_guid,
                                    label: initialData?.default_company_name,
                                  }
                                : undefined
                            }
                          />
                        </div>

                        <div className='col-md-6 mb-5'>
                          <label className='text-uppercase fw-bold space-2 text-black-400 mb-1 col-md-5 text-nowrap'>
                            Password Expiry
                          </label>
                          <Field
                            as='select'
                            className={configClass?.select}
                            name='password_expiry'
                            type='text'
                          >
                            <option value=''>Choose Expired Password</option>
                            {passwordExpired?.map(({value, label}: any, index: number) => {
                              return (
                                <option key={index || 0} value={value || ''}>
                                  {label || '-'}
                                </option>
                              )
                            })}
                          </Field>
                          <div className='fv-plugins-message-container invalid-feedback'>
                            <ErrorMessage name='password_expiry' />
                          </div>
                        </div>

                        {is_otp && (
                          <div className='col-md-6 mb-5'>
                            <label className='text-uppercase fw-bold space-2 text-black-400 mb-1 col-md-5'>
                              OTP Frequency
                            </label>
                            <Field
                              as='select'
                              className={configClass?.select}
                              name='frequency_two_factor'
                              type='text'
                            >
                              <option value=''>Choose OTP Frequency</option>
                              {otpFrequency?.map(({value, label}: any, index: number) => {
                                return (
                                  <option key={index || 0} value={value || ''}>
                                    {label || '-'}
                                  </option>
                                )
                              })}
                            </Field>
                            <div className='fv-plugins-message-container invalid-feedback'>
                              <ErrorMessage name='otp_frequency' />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {isPrefEdit && (
                    <div className='card-footer d-flex justify-content-end'>
                      <div className='me-2'>
                        <Button
                          type='reset'
                          className='btn btn-sm btn-light-primary'
                          onClick={onReset}
                        >
                          Reset
                        </Button>
                      </div>
                      <SaveButton label='Save' loading={loading} isPrefEdit={isPrefEdit} />
                    </div>
                  )}
                </div>
              </Form>
            )
          }}
        </Formik>
      )}
    </>
  )
}

Preference = memo(
  Preference,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default Preference
