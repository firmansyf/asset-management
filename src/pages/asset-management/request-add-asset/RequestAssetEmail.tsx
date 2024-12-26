import TextEditor from '@components/form/TextEditorSun'
import {PageLoader} from '@components/loader/cloud'
import {Field} from 'formik'
import {FC, useRef} from 'react'
interface Props {
  body: any
  setFieldValue: any
  loading?: any
}
const RequestAssetEmail: FC<Props> = ({body, setFieldValue, loading}) => {
  const today: any = new Date()
  const refFooter: any = useRef(null)
  const refSubject: any = useRef(null)
  const currentYear: any = today?.getFullYear()

  return (
    <>
      <h5 className='w-100 text-center'>
        <Field
          innerRef={refSubject}
          className='bg-transparent text-center fw-bolder col-sm-12 col-md-3 col-lg-3'
          type='text'
          name='subject'
          autoComplete='off'
          placeholder='Subject'
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
      <div className='card w-100 card-template-email pt-4'>
        <div className='row'>
          <div className='col-12'>
            <div className='card-body'>
              <div className=''>
                {!loading ? (
                  <TextEditor
                    id='editor'
                    options={{minHeight: '300px'}}
                    placeholder='Custom your body email...'
                    defaultData={body}
                    onChange={(e: any) => setFieldValue('body', e)}
                    loading={loading}
                  />
                ) : (
                  <PageLoader height={250} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <h5 className='w-100 text-center'>
        <Field
          innerRef={refFooter}
          className='bg-transparent text-center fw-bolder w-75'
          type='text'
          name='footer'
          placeholder='Footer'
          autoComplete='off'
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

      <span className='text-dark fw-bolder'>&copy; {currentYear} Asset Data Solutions Sdn Bhd</span>
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

export default RequestAssetEmail
