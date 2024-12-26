import {InputText} from '@components/InputText'
import {configClass} from '@helpers'
import {ErrorMessage} from 'formik'
import {FC} from 'react'

interface Props {
  children?: any
  errors: any
  onClickForm: any
}

export const UserInfo: FC<Props> = ({children, onClickForm}) => {
  return (
    <>
      <div className={configClass?.grid + ' mb-5'}>
        <label htmlFor='first_name' className={`${configClass?.label} required`}>
          First Name
        </label>
        <InputText
          name='first_name'
          type='text'
          placeholder='Enter First Name'
          className={configClass?.form}
          onClickForm={onClickForm}
        />
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='first_name' />
        </div>
      </div>

      <div className={configClass?.modalForm + ' mb-5'}>
        <label htmlFor='first_name' className={`${configClass?.label} required`}>
          Last Name
        </label>
        <InputText
          name='last_name'
          type='text'
          placeholder='Enter Last Name'
          className={configClass?.form}
          onClickForm={onClickForm}
        />
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='last_name' />
        </div>
      </div>

      <div className={configClass?.modalForm + ' mb-5'}>
        <label htmlFor='first_name' className={`${configClass?.label}`}>
          Job Title
        </label>
        <InputText
          name='job_title'
          type='text'
          placeholder='Enter Job Title'
          className={configClass?.form}
          // errors={errors}
          onClickForm={onClickForm}
        />
      </div>

      <div className={configClass?.modalForm + ' mb-5'}>
        <label htmlFor='first_name' className={`${configClass?.label}`}>
          Employee ID
        </label>
        <InputText
          name='employee_number'
          type='text'
          placeholder='Enter Employee ID'
          className={configClass?.form}
        />
      </div>

      {children}
      <div className={configClass?.modalForm + ' mb-5'}>
        <label htmlFor='email' className={`${configClass?.label} required`}>
          Email
        </label>
        <InputText
          name='email'
          type='text'
          className={configClass?.form}
          placeholder='Enter Email'
          onClickForm={onClickForm}
        />
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='email' />
        </div>
      </div>
    </>
  )
}
