/* eslint-disable react-hooks/exhaustive-deps */
import {getLocationV1} from '@api/Service'
import {getUserV1} from '@api/UserCRUD'
import {AddInputBtn} from '@components/button/Add'
import {FormCF} from '@components/form/CustomField'
import {Title as FormTitle} from '@components/form/Title'
import {Select as AjaxSelect} from '@components/select/ajax'
import {ClearIndicator, customStyles, DropdownIndicator} from '@components/select/config'
import {configClass, preferenceDate, removeObjectByAttr} from '@helpers'
import {getAssetLite, getDetailWorkOrder, getMaintenanceCategory} from '@pages/maintenance/Service'
import {getCustomField} from '@pages/setup/custom-field/redux/ReduxCustomField'
import {ErrorMessage, Field, useFormikContext} from 'formik'
import differenceWith from 'lodash/differenceWith'
import isEqual from 'lodash/isEqual'
import moment from 'moment'
import {FC, useEffect, useState} from 'react'
import Datetime from 'react-datetime'
import {shallowEqual, useSelector} from 'react-redux'
import Select from 'react-select'
type Props = {
  data: any
  setFiles: any
  database: any
  setUserDetail: any
  setShowModalUser: any
  onClickForm?: any
  reloadUser: any
  setLocationDetail: any
  setShowModalLocation: any
  reloadMaintenanceCategory: any
  setMaintenanceCategoryDetail: any
  setShowModalMaintenanceCategory: any
}

const FormSecond: FC<Props> = ({
  data,
  database,
  reloadMaintenanceCategory,
  setFiles,
  setMaintenanceCategoryDetail,
  setShowModalMaintenanceCategory,
  reloadUser,
  setUserDetail,
  setShowModalUser,
  setLocationDetail,
  setShowModalLocation,
  onClickForm,
}) => {
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {preference}: any = preferenceStore || {}
  const pref_date = preferenceDate()
  const {setFieldValue, values, errors}: any = useFormikContext()
  const {
    duration: databaseDuration,
    maintenance_category_guid: databaseCategory,
    location_guid: databaseLocation,
    assigned_user_guid: databaseWorker,
    assigned_additional_user: databaseWorkerAdditional,
  }: any = database || {}

  const [dataUser, setDataUser] = useState<any>([])
  const [customField, setCustomField] = useState<any>([])
  const [loadingUser, setLoadingUser] = useState<any>(true)
  const [workerSelected, setWorkerSelected] = useState<any>([])
  const [resetOption, setResetOption] = useState<boolean>(false)
  const [clearOption, setClearOption] = useState<boolean>(false)
  const [loadingUserOps, setLoadingUserOps] = useState<any>(true)
  const [defaultCustomField, setDefaultCustomField] = useState<any>([])
  const [additionalWorkerSelected, setAdditionalWorkerSelected] = useState<any>([])
  const [loadingMaintenanceCategory, setLoadingMaintenanceCategory] = useState<any>(true)

  const endRecurringDate = (end_recurring_date: any) => {
    if (end_recurring_date !== null) {
      const dateFormat: any = moment(end_recurring_date).format('YYYY-MM-DD')
      if (dateFormat !== '1970-01-01' && end_recurring_date !== 'N/A') {
        return new Date(end_recurring_date)
      } else {
        return ''
      }
    } else {
      return undefined
    }
  }
  useEffect(() => {
    setLoadingMaintenanceCategory(false)
    setTimeout(() => setLoadingMaintenanceCategory(true), 500)
  }, [reloadMaintenanceCategory])

  useEffect(() => {
    setLoadingUser(false)
    setTimeout(() => setLoadingUser(true), 500)
  }, [reloadUser])

  useEffect(() => {
    setLoadingUserOps(false)
    setTimeout(() => setLoadingUserOps(true), 500)
  }, [loadingUser])

  useEffect(() => {
    getUserV1({orderCol: 'first_name', orderDir: 'asc', 'filter[role_name]': 'worker'}).then(
      ({data: {data: res}}: any) => {
        const data_user: any = res
          ?.sort((a: any, b: any) => (a?.first_name > b?.first_name ? 1 : -1))
          ?.map(({guid, first_name, last_name}: any) => {
            return {
              value: guid || '',
              label: `${first_name || ''} ${last_name || ''}`,
            }
          })
        setDataUser(data_user as never[])
      }
    )
  }, [setDataUser, reloadUser])

  useEffect(() => {
    if (values?.assigned_additional_user?.length > 0) {
      const assignedAdditionalUserVal: any = values?.assigned_additional_user?.map(
        ({label, value}: any) => {
          return {
            value: value || '',
            label: label || '',
          }
        }
      )
      setAdditionalWorkerSelected(assignedAdditionalUserVal as never[])
    }

    if (values?.assigned_user_guid !== '') {
      setWorkerSelected([data?.assigned_user_guid])
    }

    const planType = preference?.plan_type?.toLowerCase()
    if (!planType?.includes('standard')) {
      getCustomField({'filter[section_type]': 'maintenance'}).then(({data: {data: res}}: any) => {
        res && setDefaultCustomField(res)
      })
    }
  }, [])

  useEffect(() => {
    if (data) {
      const {maintenance_guid, guid}: any = data
      const id: any = maintenance_guid || guid || ''
      id !== ''
        ? getDetailWorkOrder(id).then(({data: {data: res}}: any) => {
            setCustomField(res?.custom_fields as never[])
          })
        : setCustomField([])
    }
  }, [data])

  return (
    <>
      <div className={configClass?.grid}>
        <label className={`${configClass?.label}`}>End Recurring Date</label>
        <Datetime
          closeOnSelect
          timeFormat={false}
          dateFormat={pref_date}
          inputProps={{
            autoComplete: 'off',
            name: 'end_recurring_date',
            className: configClass?.form,
            placeholder: 'Enter Due Date',
          }}
          initialValue={endRecurringDate(values?.end_recurring_date)}
          onChange={(e: any) => setFieldValue('end_recurring_date', e)}
        />
      </div>

      {databaseDuration?.is_selected && (
        <div className={configClass?.grid}>
          <label
            className={`${configClass?.label} ${databaseDuration?.is_required ? 'required' : ''}`}
          >
            {databaseDuration?.label}
          </label>
          <Field
            type='text'
            maxLength='8'
            name='duration'
            className={configClass?.form}
            placeholder={`Enter ${databaseDuration?.label}`}
            onChange={({target: {value}}: any) =>
              setFieldValue('duration', value?.replace(/\D+/g, ''))
            }
          />
          <div className='fv-plugins-message-container invalid-feedback'>
            <ErrorMessage name='duration' />
          </div>
        </div>
      )}

      {databaseCategory?.is_selected && (
        <div className={configClass?.grid}>
          <label
            className={`${configClass?.label} ${databaseCategory?.is_required ? 'required' : ''}`}
          >
            Work Orders Category
          </label>
          <div className='d-flex align-items-center input-group input-group-solid'>
            {loadingMaintenanceCategory && (
              <>
                <AjaxSelect
                  name='maintenance_category_guid'
                  sm={configClass?.size === 'sm'}
                  className='col p-0'
                  api={getMaintenanceCategory}
                  params={{orderCol: 'name', orderDir: 'asc'}}
                  reload={reloadMaintenanceCategory}
                  placeholder={`Choose Work Orders Category`}
                  defaultValue={data?.maintenance_category_guid || {}}
                  onChange={({value}: any) => {
                    setFieldValue('maintenance_category_guid', value)
                  }}
                  parse={({guid, name}: any) => {
                    return {
                      value: guid || '',
                      label: name || '',
                    }
                  }}
                />
                <AddInputBtn
                  size={configClass?.size}
                  onClick={() => {
                    setMaintenanceCategoryDetail(undefined)
                    setShowModalMaintenanceCategory(true)
                  }}
                />
              </>
            )}
          </div>
          <div className='fv-plugins-message-container invalid-feedback'>
            <ErrorMessage name='maintenance_category_guid' />
          </div>
        </div>
      )}

      {databaseWorker?.is_selected && (
        <div className={configClass?.grid}>
          <label
            className={`${configClass?.label} ${databaseWorker?.is_required ? 'required' : ''}`}
          >
            {databaseWorker?.label}
          </label>
          <div className='d-flex align-items-center input-group input-group-solid'>
            {loadingUser && (
              <>
                <Select
                  noOptionsMessage={(e: any) => (e.inputValue = 'No Data...')}
                  name='assigned_user_guid'
                  defaultValue={data?.assigned_user_guid || ''}
                  styles={customStyles(true, {option: {color: 'black'}})}
                  components={{ClearIndicator, DropdownIndicator}}
                  className={`${configClass?.form} select-custom p-0 additional-select`}
                  placeholder={`Choose ${databaseWorker?.label}`}
                  options={
                    additionalWorkerSelected?.length > 0
                      ? differenceWith(dataUser, additionalWorkerSelected, isEqual)
                      : dataUser
                  }
                  onChange={({value, label}: any) => {
                    const propsData = [{value: value || '', label: label || ''}]
                    setFieldValue('assigned_user_guid', value)
                    setWorkerSelected(propsData)
                  }}
                />
                <AddInputBtn
                  size={configClass?.size}
                  onClick={() => {
                    setFiles([])
                    setUserDetail(undefined)
                    setShowModalUser(true)
                  }}
                />
              </>
            )}
          </div>
          <div className='fv-plugins-message-container invalid-feedback'>
            <ErrorMessage name='assigned_user_guid' />
          </div>
        </div>
      )}

      {databaseWorkerAdditional?.is_selected && (
        <div className={configClass?.grid}>
          <label
            className={`${configClass?.label} ${
              databaseWorkerAdditional?.is_required ? 'required' : ''
            }`}
          >
            {databaseWorkerAdditional?.label}
          </label>
          <div className='d-flex align-items-center input-group input-group-solid'>
            {loadingUserOps && (
              <>
                <Select
                  noOptionsMessage={(e: any) => (e.inputValue = 'No Data...')}
                  name='assigned_additional_user'
                  isMulti={true}
                  isDisabled={
                    workerSelected?.length > 0 && workerSelected?.[0] !== undefined ? false : true
                  }
                  value={values?.assigned_additional_user || ''}
                  styles={customStyles(true, {option: {color: 'black'}})}
                  components={{ClearIndicator, DropdownIndicator}}
                  className={`${configClass?.form} select-custom p-0 additional-select`}
                  placeholder={`Choose ${databaseWorkerAdditional?.label}`}
                  options={
                    workerSelected?.length === 0
                      ? dataUser
                      : differenceWith(dataUser, workerSelected, isEqual)
                  }
                  onChange={(props: any, triggeredAction: any) => {
                    if (triggeredAction?.action === 'clear') {
                      setAdditionalWorkerSelected([])
                    }
                    if (triggeredAction?.action === 'remove-value') {
                      const removeAdditionalWorker = removeObjectByAttr(
                        additionalWorkerSelected,
                        'value',
                        triggeredAction?.removedValue?.value
                      )
                      setAdditionalWorkerSelected(removeAdditionalWorker)
                    }
                    setFieldValue('assigned_additional_user', props)
                    const thisWorker: any = props
                    if (thisWorker?.length >= 1) {
                      setAdditionalWorkerSelected(props as never[])
                    }
                  }}
                />
                <AddInputBtn
                  size={configClass?.size}
                  onClick={() => {
                    setFiles([])
                    setUserDetail(undefined)
                    setShowModalUser(true)
                  }}
                />
              </>
            )}
          </div>
          <div className='fv-plugins-message-container invalid-feedback'>
            <ErrorMessage name='assigned_additional_user' />
          </div>
        </div>
      )}

      {databaseLocation?.is_selected && (
        <div className={configClass?.grid}>
          <label htmlFor='location_guid' className={`${configClass?.label} required`}>
            {databaseLocation?.label}
          </label>
          <div className='d-flex align-items-center input-group input-group-solid'>
            <AjaxSelect
              name='location_guid'
              sm={configClass?.size === 'sm'}
              className='col p-0'
              api={getLocationV1}
              isClearable={false}
              params={{orderCol: 'name', orderDir: 'asc'}}
              placeholder={`Choose ${databaseLocation?.label}`}
              defaultValue={data?.location_guid || {}}
              onChange={({value}: any) => {
                setFieldValue('location_guid', value)
                if (value === '' || value !== data?.location_guid?.value) {
                  setFieldValue('asset_guid', '')
                  setResetOption(true)
                  setClearOption(true)
                }
              }}
              parse={({guid, name}: any) => {
                return {
                  value: guid || '',
                  label: name || '',
                }
              }}
            />
            <AddInputBtn
              size={configClass?.size}
              onClick={() => {
                setLocationDetail(undefined)
                setShowModalLocation(true)
              }}
            />
          </div>
          <div className='fv-plugins-message-container invalid-feedback'>
            <ErrorMessage name='location_guid' />
          </div>
        </div>
      )}

      <div className={configClass?.grid}>
        <label htmlFor='asset_guid' className={`${configClass?.label} required`}>
          Asset by Location
        </label>
        <AjaxSelect
          name='asset_guid'
          sm={configClass?.size === 'sm'}
          className='col p-0'
          api={getAssetLite}
          isClearable={false}
          reload={false}
          params={{orderCol: 'name', orderDir: 'asc', guid: values?.location_guid || '0'}}
          placeholder={`Choose Asset by Location`}
          defaultValue={{
            value: data?.asset_guid?.value || '',
            label: data?.asset_guid?.label || '',
          }}
          onChange={({value}: any) => {
            setFieldValue('asset_guid', value || '')
          }}
          clearOption={clearOption}
          resetOption={resetOption}
          setResetOption={setResetOption}
          parse={({guid, name}: any) => ({value: guid || '', label: name || ''})}
        />
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='asset_guid' />
        </div>
      </div>

      <div className={configClass?.grid}>
        <label className={`${configClass?.label}`}>Purchase Order</label>
        <Field
          type='text'
          name='po_number'
          placeholder='Enter Purchase Order'
          className={configClass?.form}
        />
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='po_number' />
        </div>
      </div>
      {defaultCustomField?.length > 0 && (
        <>
          <FormTitle title='Custom Fields' sticky={false} />
          <div className='row mb-8'>
            {defaultCustomField?.length === 0 &&
              defaultCustomField?.filter(({conditions}: any) => conditions === undefined) && (
                <label htmlFor='no_cf' style={{padding: '0px 0px 10px 30px'}}>
                  No custom fields added
                </label>
              )}
            <FormCF
              errors={errors}
              type='maintenance'
              labelClass='col-md-5'
              itemClass='col-md-4 mb-3'
              onClickForm={onClickForm}
              defaultValue={customField}
              defaultCustomField={defaultCustomField}
              onChange={(e: any) => setFieldValue('global_custom_fields', e)}
            />
          </div>
        </>
      )}
    </>
  )
}
export default FormSecond
