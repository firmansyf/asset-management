/* eslint-disable react/prop-types */
import '../custom.css'

import {getUserV1} from '@api/UserCRUD'
import {AddInputBtn} from '@components/button/Add'
import {Title as FormTitle} from '@components/form/Title'
import {InputText} from '@components/InputText'
import {ClearIndicator, customStyles, DropdownIndicator} from '@components/select/config'
import {configClass, preferenceDate, removeObjectByAttr} from '@helpers'
import {ErrorMessage, Field} from 'formik'
import differenceWith from 'lodash/differenceWith'
import isEqual from 'lodash/isEqual'
import moment from 'moment'
import {FC, useEffect, useState} from 'react'
import Datetime from 'react-datetime'
import Select from 'react-select'

type Props = {
  values: any
  dayList: any
  setFieldValue: any
  detail: any
  frequencyList: any
  setFrequencyList: any
  dueDate: any
  setDueDate: any
  database: any
  setShowModalUser: any
  reloadUser: any
}

const FormFirst: FC<Props> = ({
  values,
  setFieldValue,
  detail,
  dueDate,
  setDueDate,
  database,
  setShowModalUser,
  reloadUser,
}) => {
  const pref_date: any = preferenceDate()

  const [dataUser, setDataUser] = useState<any>([])
  const [workerSelected, setWorkerSelected] = useState<any>([])
  const [additionalWorkerSelected, setAdditionalWorkerSelected] = useState<any>([])

  const {
    worker_guid: databaseWorker,
    due_date: databaseDueDate,
    description: databaseDescription,
    title: databaseTitle,
    additional_worker: databaseAdditionalWorker,
    duration: databaseDuration,
  }: any = database || {}

  useEffect(() => {
    if (values?.assigned_user_guid !== '') {
      setWorkerSelected([{value: detail?.worker_guid, label: detail?.worker_name}])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (values?.assigned_additional_user?.length > 0) {
      const assignedAdditionalUserVal: any = values?.assigned_additional_user?.map(
        ({label, value}: any) => {
          return {
            value: value,
            label: label,
          }
        }
      )
      setAdditionalWorkerSelected(assignedAdditionalUserVal as never[])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    getUserV1({orderCol: 'first_name', orderDir: 'asc', 'filter[role_name]': 'worker'}).then(
      ({data: {data: res}}) => {
        const data_user = res?.map(({guid, first_name, last_name}: any) => {
          return {
            value: guid,
            label: `${first_name} ${last_name}`,
          }
        })
        setDataUser(data_user ?? [])
      }
    )
  }, [setDataUser, reloadUser])

  return (
    <>
      <div className='col-lg-12'>
        <FormTitle title='Request Detail' sticky={false} />
      </div>

      {databaseDescription?.is_selected && (
        <div className='col-md-12 mb-5'>
          <label
            htmlFor='description'
            className={`${configClass?.label} ${
              databaseDescription?.is_required ? 'required' : ''
            }`}
          >
            {databaseDescription?.label || 'Request Description'}
          </label>
          <Field
            type='text'
            name='description'
            placeholder={`Enter ${databaseDescription?.label || 'Request Description'}`}
            className={configClass?.form}
          />
          {databaseDescription?.is_required && (
            <div className='fv-plugins-message-container mt-0 invalid-feedback'>
              <ErrorMessage name='description' />
            </div>
          )}
        </div>
      )}

      {databaseTitle?.is_selected && (
        <div className={`${configClass?.grid} mt-4`}>
          <label
            htmlFor='title'
            className={`${configClass?.label} ${databaseTitle?.is_required ? 'required' : ''}`}
          >
            {databaseTitle?.label || 'Request Title'}
          </label>
          <Field
            type='text'
            name='title'
            placeholder={`Enter ${databaseTitle?.label || 'Request Title'}`}
            className={configClass?.form}
          />
          {databaseTitle?.is_required && (
            <div className='fv-plugins-message-container mt-0 invalid-feedback'>
              <ErrorMessage name='title' />
            </div>
          )}
        </div>
      )}

      {databaseWorker?.is_selected && (
        <div className={`${configClass?.grid} mt-4`}>
          <label
            className={`${configClass?.label} ${databaseWorker?.is_required ? 'required' : ''}`}
          >
            {databaseWorker?.label}
          </label>
          <div className='d-flex align-items-center input-group input-group-solid'>
            <Select
              noOptionsMessage={(e: any) => (e.inputValue = 'No Data...')}
              name='assigned_user_guid'
              defaultValue={
                detail !== undefined && detail?.worker_guid !== null
                  ? {value: detail?.worker_guid, label: detail?.worker_name}
                  : ''
              }
              styles={customStyles(true, {option: {color: 'black'}})}
              components={{ClearIndicator, DropdownIndicator}}
              className={`${configClass?.select} select-custom p-0 additional-select`}
              placeholder={`Choose ${databaseWorker?.label}`}
              options={
                additionalWorkerSelected?.length > 0
                  ? differenceWith(dataUser, additionalWorkerSelected, isEqual)
                  : dataUser
              }
              onChange={({value, label}: any) => {
                const propsData = {value: value || '', label: label || ''}
                setFieldValue('assigned_user_guid', propsData)
                setWorkerSelected([propsData])
              }}
            />
            <AddInputBtn
              size={'sm'}
              onClick={() => {
                setShowModalUser(true)
              }}
            />
          </div>
          {databaseWorker?.is_required && (
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name='assigned_user_guid' />
            </div>
          )}
        </div>
      )}

      {databaseAdditionalWorker?.is_selected && (
        <div className={configClass?.grid}>
          <label
            htmlFor='assigned_additional_user'
            className={`${configClass?.label} ${
              databaseAdditionalWorker?.is_required ? 'required' : ''
            }`}
          >
            {databaseAdditionalWorker?.label || 'Additional Workers'}
          </label>
          <div className='d-flex align-items-center input-group input-group-solid'>
            <Select
              isMulti={true}
              name='assigned_additional_user'
              styles={customStyles('sm', '')}
              value={values?.assigned_additional_user || ''}
              isDisabled={workerSelected?.length > 0 ? false : true}
              noOptionsMessage={(e: any) => (e.inputValue = 'No Data...')}
              className={`${configClass?.select} select-custom p-0 additional-select`}
              placeholder={`Choose ${databaseAdditionalWorker?.label || 'Additional Workers'}`}
              components={{DropdownIndicator: DropdownIndicator, ClearIndicator: ClearIndicator}}
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
                if (props?.length >= 1) {
                  setAdditionalWorkerSelected(props as never[])
                }
              }}
            />
            <AddInputBtn
              size={'sm'}
              onClick={() => {
                setShowModalUser(true)
              }}
            />
          </div>
          {databaseTitle?.is_required && (
            <div className='fv-plugins-message-container mt-0 invalid-feedback'>
              <ErrorMessage name='assigned_additional_user' />
            </div>
          )}
        </div>
      )}

      {databaseDueDate?.is_selected && (
        <div className={configClass?.grid}>
          <label
            htmlFor='due_date'
            className={`${configClass?.label} ${databaseDueDate?.is_required ? 'required' : ''}`}
          >
            {databaseDueDate?.label || 'Due Date'}
          </label>
          <div className='input-group input-group-solid'>
            <span className='input-group-text pe-0'>
              <i className='fa fa-calendar-alt text-primary'></i>
            </span>
            <Datetime
              closeOnSelect
              value={dueDate}
              timeFormat={false}
              dateFormat={pref_date}
              inputProps={{
                readOnly: true,
                name: 'due_date',
                autoComplete: 'off',
                className: configClass?.form,
                placeholder: `Input ${databaseDueDate?.label || 'Due Date'}`,
              }}
              onChange={(e: any) => {
                const m: any = moment(e || '')?.format('YYYY-MM-DD')
                setDueDate(m)
                setFieldValue('due_date', m)
              }}
            />
          </div>
          {databaseDueDate?.is_required && (
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name='due_date' />
            </div>
          )}
        </div>
      )}

      {databaseDuration?.is_selected && (
        <div className={configClass?.grid}>
          <label
            htmlFor='duration'
            className={`${configClass?.label} ${databaseDuration?.is_required ? 'required' : ''}`}
          >
            {databaseDuration?.label || 'Estimate Duration (Minutes)'}
          </label>
          <InputText
            type='number'
            name='duration'
            className={configClass?.form}
            placeholder={`Enter ${databaseDuration?.label || 'Estimate Duration (Minutes)'}`}
          />
          {databaseDuration?.is_required && (
            <div className='fv-plugins-message-container mt-0 invalid-feedback'>
              <ErrorMessage name='duration' />
            </div>
          )}
        </div>
      )}
    </>
  )
}

export {FormFirst}
