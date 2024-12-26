import TextEditor from '@components/form/TextEditorSun'
import {Field, useFormikContext} from 'formik'
import {FC, useRef} from 'react'

import Watermak from '../watermak'

const EmailTemplates: FC<any> = ({body, loading}) => {
  const refFooter: any = useRef(null)
  const refSubject: any = useRef(null)
  const {setFieldValue, values}: any = useFormikContext()
  const {signature}: any = values

  return (
    <>
      <h5 className='w-100 text-center'>
        <Field
          innerRef={refSubject}
          type='text'
          name='subject'
          autoComplete='off'
          placeholder='Subject'
          className='bg-transparent text-center fw-bolder'
          style={{outline: 'none', border: 'none'}}
        />

        <button
          type='button'
          className='btn btn-primary btn-sm w-10'
          onClick={() => refSubject?.current?.focus()}
        >
          Change Subject
        </button>
      </h5>
      <div className='card card-template-email' style={{width: '100%'}}>
        <div className='row'>
          <div className='col-12'>
            <div className='card-body'>
              <div className=''>
                <TextEditor
                  id='editor'
                  loading={loading}
                  defaultData={body}
                  options={{minHeight: '300px'}}
                  placeholder='Custom your body email...'
                  onChange={(e: any) => setFieldValue('body', e)}
                />
              </div>

              <div className=''>
                <input
                  type='checkbox'
                  name='signature'
                  className='col mx-2 mt-4'
                  checked={signature}
                  onChange={({target: {checked}}: any) =>
                    setFieldValue('signature', checked || false)
                  }
                />
                <label>Signature</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h5 className='w-100 text-center'>
        <Field
          innerRef={refFooter}
          type='text'
          name='footer'
          autoComplete='off'
          placeholder='Footer'
          className='bg-transparent text-center fw-bolder w-75'
          style={{outline: 'none', border: 'none'}}
        />

        <button
          type='button'
          className='btn btn-primary btn-sm'
          onClick={() => refFooter?.current?.focus()}
        >
          Change Footer
        </button>
      </h5>

      <Watermak />

      <style>
        {`input::-webkit-input-placeholder { 
        color: #000;
        }
        @media screen and (max-width: 420px) {
          .card-template-email {
            width: 100% !important;
          }
        }`}
      </style>
    </>
  )
}

export default EmailTemplates
