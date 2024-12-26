import 'react-datetime/css/react-datetime.css'

import {PageLoader} from '@components/loader/cloud'
import {configClass} from '@helpers'
import {ErrorMessage, Field} from 'formik'
import {FC} from 'react'

import {InputClone} from '../input-clone/InputClone'

type Props = {
  loadingForm?: any
  setFieldValue?: any
  arrOption?: any
  optionMessage?: any
  setOptionMessage?: any
}

const FormFirst: FC<Props> = ({
  loadingForm,
  setFieldValue,
  arrOption,
  optionMessage,
  setOptionMessage,
}) => {
  return (
    <>
      {loadingForm ? (
        <div className='row'>
          <PageLoader height={250} />
        </div>
      ) : (
        <>
          <div className='row align-items-end mb-4'>
            <div className='col-sm-12 col-md-6 col-lg-3'>
              <label htmlFor='name' className={`${configClass?.label} required`}>
                Name
              </label>
            </div>
            <div className='col-sm-12 col-md-6 col-lg-9'>
              <Field
                type='text'
                name='name'
                placeholder='Enter Name'
                className={configClass?.form}
              />
              <div className='fv-plugins-message-container invalid-feedback'>
                <ErrorMessage name='name' />
              </div>
            </div>
          </div>

          <div className='row align-items-end'>
            <div className='col-sm-12 col-md-6 col-lg-3'>
              <label htmlFor='description' className={`${configClass?.label}`}>
                Description
              </label>
            </div>
            <div className='col-sm-12 col-md-6 col-lg-9'>
              <Field
                type='text'
                as='textarea'
                name='description'
                placeholder='Enter Description'
                className={`${configClass?.form} required`}
              />
            </div>
          </div>

          <div className='row mt-5 btmCus' style={{paddingBottom: '60px'}}>
            <div className='col-md-12 mt-5'>
              <InputClone
                name='tasks'
                className='col-md-12'
                defaultValue={arrOption}
                optionMessage={optionMessage}
                setOptionMessage={setOptionMessage}
                onChange={(e: any) => setFieldValue('tasks', e)}
              />
            </div>
          </div>

          <style>
            {`@media screen and (max-width: 420px) {
              .btmCus {
                padding-bottom: 30px !important;
              }
            }`}
          </style>
        </>
      )}
    </>
  )
}

export default FormFirst
