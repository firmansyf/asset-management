import {getUserV1} from '@api/UserCRUD'
import {Select} from '@components/select/ajax'
import {configClass} from '@helpers'
import {ErrorMessage, useFormikContext} from 'formik'
import {FC, memo} from 'react'

let FormInsurance: FC<any> = ({values = {}, detail = {}}) => {
  const {setFieldValue}: any = useFormikContext()
  const {
    tm,
    tm_super1,
    tm_super2,
    re,
    re_super1,
    re_super2,
    re_digital,
    digital_super1,
    digital_super2,
  } = detail || {}
  return (
    <div className='row'>
      <div className='col-6'>
        <label className={`${configClass.label} mt-4`}>{`Territory Manager`}</label>
        <Select
          sm={true}
          key='tm'
          name='tm'
          className='col p-0'
          api={getUserV1}
          params={{orderCol: 'first_name', orderDir: 'asc'}}
          placeholder='Select user'
          defaultValue={{
            value: values?.tm?.value || tm?.guid || '',
            label: values?.tm?.label || tm?.name || '',
          }}
          onChange={(e: any) => {
            setFieldValue('tm', e || '')
          }}
          parse={({guid, first_name, last_name}: any) => {
            return {value: guid, label: `${first_name} ${last_name}`}
          }}
        />
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='tm' />
        </div>
      </div>

      <div className='col-6'>
        <label className={`${configClass.label} mt-4`}>{`Regional Engineer`}</label>
        <Select
          sm={true}
          key='re'
          name='re'
          className='col p-0'
          api={getUserV1}
          params={{orderCol: 'first_name', orderDir: 'asc'}}
          placeholder='Select user'
          defaultValue={{
            value: values?.re?.value || re?.guid || '',
            label: values?.re?.label || re?.name || '',
          }}
          onChange={(e: any) => {
            setFieldValue('re', e || '')
          }}
          parse={({guid, first_name, last_name}: any) => {
            return {value: guid, label: `${first_name} ${last_name}`}
          }}
        />
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='re' />
        </div>
      </div>

      <div className='col-6'>
        <label className={`${configClass.label} mt-4`}>TM&apos;s Superior 1</label>
        <Select
          sm={true}
          key='tm_super1'
          name='tm_super1'
          className='col p-0'
          api={getUserV1}
          params={{orderCol: 'first_name', orderDir: 'asc'}}
          placeholder='Select user'
          defaultValue={{
            value: values?.tm_super1?.value || tm_super1?.guid || '',
            label: values?.tm_super1?.label || tm_super1?.name || '',
          }}
          onChange={(e: any) => {
            setFieldValue('tm_super1', e || '')
          }}
          parse={({guid, first_name, last_name}: any) => {
            return {value: guid, label: `${first_name} ${last_name}`}
          }}
        />
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='tm_super1' />
        </div>
      </div>

      <div className='col-6'>
        <label className={`${configClass.label} mt-4`}>{`RE's Superior 1`}</label>
        <Select
          sm={true}
          key='re_super1'
          name='re_super1'
          className='col p-0'
          api={getUserV1}
          params={{orderCol: 'first_name', orderDir: 'asc'}}
          placeholder='Select user'
          defaultValue={{
            value: values?.re_super1?.value || re_super1?.guid || '',
            label: values?.re_super1?.label || re_super1?.name || '',
          }}
          onChange={(e: any) => {
            setFieldValue('re_super1', e || '')
          }}
          parse={({guid, first_name, last_name}: any) => {
            return {value: guid, label: `${first_name} ${last_name}`}
          }}
        />
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='re_super1' />
        </div>
      </div>

      <div className='col-6'>
        <label className={`${configClass.label} mt-4`}>TM&apos;s Superior 2</label>
        <Select
          sm={true}
          key='tm_super2'
          name='tm_super2'
          className='col p-0'
          api={getUserV1}
          params={{orderCol: 'first_name', orderDir: 'asc'}}
          placeholder='Select user'
          defaultValue={{
            value: values?.tm_super2?.value || tm_super2?.guid || '',
            label: values?.tm_super2?.label || tm_super2?.name || '',
          }}
          onChange={(e: any) => {
            setFieldValue('tm_super2', e || '')
          }}
          parse={({guid, first_name, last_name}: any) => {
            return {value: guid, label: `${first_name} ${last_name}`}
          }}
        />
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='tm_super2' />
        </div>
      </div>

      <div className='col-6'>
        <label className={`${configClass.label} mt-4`}>RE&apos;s Superior 2</label>
        <Select
          sm={true}
          key='re_super2'
          name='re_super2'
          className='col p-0'
          api={getUserV1}
          params={{orderCol: 'first_name', orderDir: 'asc'}}
          placeholder='Select user'
          defaultValue={{
            value: values?.re_super2?.value || re_super2?.guid || '',
            label: values?.re_super2?.label || re_super2?.name || '',
          }}
          onChange={(e: any) => {
            setFieldValue('re_super2', e || '')
          }}
          parse={({guid, first_name, last_name}: any) => {
            return {value: guid, label: `${first_name} ${last_name}`}
          }}
        />
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='re_super2' />
        </div>
      </div>

      <div className='col-6'>
        <label className={`${configClass.label} mt-4`}>Digital RE</label>
        <Select
          sm={true}
          key='re_digital'
          name='re_digital'
          className='col p-0'
          api={getUserV1}
          params={{orderCol: 'first_name', orderDir: 'asc'}}
          placeholder='Select user'
          defaultValue={{
            value: values?.re_digital?.value || re_digital?.guid || '',
            label: values?.re_digital?.label || re_digital?.name || '',
          }}
          onChange={(e: any) => {
            setFieldValue('re_digital', e || '')
          }}
          parse={({guid, first_name, last_name}: any) => {
            return {value: guid, label: `${first_name} ${last_name}`}
          }}
        />
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='re_digital' />
        </div>
      </div>

      <div className='col-6'>
        <label className={`${configClass.label} mt-4`}>{`Digital Superior 1`}</label>
        <Select
          sm={true}
          key='digital_super1'
          name='digital_super1'
          className='col p-0'
          api={getUserV1}
          params={{orderCol: 'first_name', orderDir: 'asc'}}
          placeholder='Select user'
          defaultValue={{
            value: values?.digital_super1?.value || digital_super1?.guid || '',
            label: values?.digital_super1?.label || digital_super1?.name || '',
          }}
          onChange={(e: any) => {
            setFieldValue('digital_super1', e || '')
          }}
          parse={({guid, first_name, last_name}: any) => {
            return {value: guid, label: `${first_name} ${last_name}`}
          }}
        />
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='digital_super1' />
        </div>
      </div>

      <div className='col-6'>
        <label className={`${configClass.label} mt-4`}>{`Digital Superior 2`}</label>
        <Select
          sm={true}
          key='digital_super2'
          name='digital_super2'
          className='col p-0'
          api={getUserV1}
          params={{orderCol: 'first_name', orderDir: 'asc'}}
          placeholder='Select user'
          defaultValue={{
            value: values?.digital_super2?.value || digital_super2?.guid || '',
            label: values?.digital_super2?.label || digital_super2?.name || '',
          }}
          onChange={(e: any) => {
            setFieldValue('digital_super2', e || '')
          }}
          parse={({guid, first_name, last_name}: any) => {
            return {value: guid, label: `${first_name} ${last_name}`}
          }}
        />
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='digital_super2' />
        </div>
      </div>
    </div>
  )
}

FormInsurance = memo(
  FormInsurance,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {FormInsurance}
