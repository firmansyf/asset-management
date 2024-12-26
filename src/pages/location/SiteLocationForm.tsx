import {configClass} from '@helpers'
import {ErrorMessage, Field} from 'formik'
import {FC} from 'react'

const SiteLocationForm: FC<any> = () => {
  return (
    <>
      <div className='col-6'>
        <label className={configClass?.label}>Region</label>
        <Field type='text' name='region' placeholder='Enter Region' className={configClass?.form} />
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='region' />
        </div>
      </div>
      <div className='col-6'>
        <label className={configClass?.label}>Site ID</label>
        <Field
          type='text'
          name='site_id'
          placeholder='Enter Site ID'
          className={configClass?.form}
        />
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='site_id' />
        </div>
      </div>
    </>
  )
}

export {SiteLocationForm}
