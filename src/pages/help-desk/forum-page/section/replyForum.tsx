import TextEditor from '@components/form/TextEditorSun'
import {ToastMessage} from '@components/toast-message'
import {Form, Formik} from 'formik'
import {FC, useState} from 'react'
import {Button} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import * as Yup from 'yup'

import {replyDisscussionForum} from '../service'

interface Props {
  guid: any
  message?: any
  setMessage?: any
  loading: any
  setLoading: any
  setShowReply?: any
  showReply?: any
  setReload: any
  reload: any
}

const forumSchema = Yup.object().shape({
  description: Yup.string()
    .required('Reply Message is required.')
    .nullable()
    .min(9, 'Reply Message is required.'),
})

const ReplyForum: FC<Props> = ({
  guid,
  setLoading,
  loading,
  setShowReply,
  showReply,
  setReload,
  reload,
}) => {
  const intl = useIntl()
  const require_filed_message = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})
  const [errForm, setErrForm] = useState<any>(true)
  const [_isFocus, setIsFocus] = useState<boolean>(false)

  const onSubmit = (value: any, {resetForm}: any) => {
    setLoading(true)
    const params = {
      body: value?.description,
    }
    replyDisscussionForum(guid, params)
      .then((res: any) => {
        setReload(reload + 1)
        ToastMessage({type: 'success', message: res?.data?.message})
        setTimeout(() => setShowReply(!showReply), 1200)
        resetForm()
        setTimeout(() => {
          setLoading(false)
        }, 800)
      })
      .catch(() => {
        setTimeout(() => {
          setLoading(false)
        }, 800)
      })
  }

  return (
    <Formik
      enableReinitialize
      onSubmit={onSubmit}
      initialValues={{description: ''}}
      validationSchema={forumSchema}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({values, setFieldValue, isSubmitting, setSubmitting, errors, isValidating}: any) => {
        if (isSubmitting && errForm && Object.keys(errors || {})?.length > 0) {
          ToastMessage({
            message: require_filed_message,
            type: 'error',
          })
          setErrForm(false)
          setSubmitting(false)
        }
        if (isSubmitting && isValidating && !errForm && Object.keys(errors || {})?.length > 0) {
          ToastMessage({
            message: require_filed_message,
            type: 'error',
          })
          setErrForm(false)
        }
        return (
          <Form noValidate>
            <div className='position-relative'>
              {errors?.description && (
                <div className='text-danger fs-7 px-2 mb-1 d-flex align-items-center'>
                  <i className='las la-info-circle text-danger me-1 fs-5' />
                  <div>{errors?.description}</div>
                </div>
              )}

              {!loading && (
                <div className='px-3'>
                  <TextEditor
                    id='editor'
                    className=''
                    placeholder='Reply'
                    defaultData={values?.description}
                    onChange={(e: any) => {
                      e = e?.replace('<p></p>\n', '')
                      setFieldValue('description', e)
                    }}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    options={{
                      mode: 'balloon-always',
                      className: `border border-gray-300 radius-5`,
                      maxHeight: '50px',
                    }}
                  />
                </div>
              )}
            </div>
            <div
              className='position-relative d-flex justify-content-end px-2'
              style={{zIndex: 1, backgroundColor: '#FFF'}}
            >
              <Button
                disabled={!values?.description}
                className='mx-1 btn btn-sm'
                type='submit'
                form-id=''
                variant='primary'
              >
                {!loading && <span className='indicator-label'>Save</span>}
                {loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </Button>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}

export {ReplyForum}
