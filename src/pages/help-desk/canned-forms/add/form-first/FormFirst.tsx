import TextEditor from '@components/form/TextEditorSun'
import {InputText} from '@components/InputText'
import {configClass} from '@helpers'
import {ErrorMessage} from 'formik'
import {FC, memo, useEffect, useState} from 'react'

import Placeholder from '../placeholder/Placeholder'

type Props = {
  setFieldValue?: any
  detail?: any
  isMessage?: any
  setMessage?: any
  setTitleValue?: any
  errors?: any
  values?: any
  description?: any
  onClickForm: any
}

let FormFirst: FC<Props> = ({
  setFieldValue,
  detail,
  isMessage,
  setMessage,
  errors,
  onClickForm,
}) => {
  const [loading, setLoading] = useState<any>(true)

  useEffect(() => {
    if (detail?.guid !== undefined) {
      setLoading(false)
      setTimeout(() => {
        setLoading(true)
      }, 300)
    }
  }, [detail?.guid])

  return (
    <div className='row mb-3'>
      <div className='col-md-12 row pe-0 mb-5'>
        <div className='col-sm-12 col-md-4 col-lg-2'>
          <label htmlFor='title' className={`${configClass?.label} required`}>
            Forms Title
          </label>
        </div>
        <div className='col-sm-12 col-md-6 col-lg-8 pe-0'>
          <InputText
            name='title'
            type='text'
            placeholder='Enter Forms Title'
            errors={errors}
            onClickForm={onClickForm}
            className={configClass?.form}
          />
        </div>
      </div>
      <div className='col-md-12 mt-3'>
        <div className='row'>
          <label htmlFor='message' className={`${configClass?.label} required`}>
            Message
          </label>
          <div className='col-auto ms-auto' style={{marginTop: '-22px'}}>
            <Placeholder
              values={isMessage?.bodyText}
              setValue={(bodyText: any) => {
                setLoading(false)
                setMessage({...isMessage, bodyText})
                setFieldValue('message', bodyText)
                setTimeout(() => {
                  setLoading(true)
                }, 300)
              }}
            />
          </div>
        </div>
        <div className='col-12'>
          <TextEditor
            id='editor'
            options={{minHeight: '200px'}}
            placeholder='Enter Message Here'
            defaultData={isMessage?.bodyText}
            onChange={(e: any) => {
              setMessage({...isMessage, bodyText: e})
              setFieldValue('message', e)
            }}
            loading={!loading}
          />
        </div>
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='message' />
        </div>
      </div>
    </div>
  )
}

FormFirst = memo(FormFirst, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default FormFirst
