import TextEditor from '@components/form/TextEditorSun'
import {Select} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {configClass} from '@helpers'
import {convertToForum, getForumCategory} from '@pages/help-desk/forum-page/service'
import {Field, Form, Formik} from 'formik'
import {FC, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
interface Props {
  showModal: any
  setShowModal: any
  detailTicket: any
}
const ConvertToForum: FC<Props> = ({showModal, setShowModal, detailTicket}) => {
  const intl = useIntl()
  const [loading, setLoading] = useState(false)
  const [errTitle, setErrTitle] = useState<any>([])
  const [errMessage, setErrMessage] = useState<any>([])
  const {submitter_guid, description, name} = detailTicket
  const [detail] = useState<any>()
  const require_filed_message = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})

  const onSubmit = (value: any) => {
    setLoading(true)
    const params = {
      title: value?.title,
      user_guid: submitter_guid,
      body: value?.body,
      forum_category_guid: value?.forum_category_guid,
    }
    convertToForum(params)
      .then((res: any) => {
        ToastMessage({message: res?.data?.message, type: 'success'})
        setShowModal(false)
      })
      .catch((err: any) => {
        setLoading(false)
        if (err.response) {
          const {devMessage, data} = err?.response?.data || {}
          if (!devMessage) {
            const {fields} = data || {}
            const {title, body} = fields || {}
            if (title?.toString()?.length === 28 || body) {
              ToastMessage({message: require_filed_message, type: 'error'})
            }

            setErrTitle(title)
            setErrMessage(body)
          }
        }
      })
  }

  const onHide = () => {
    setShowModal(false)
    setErrTitle([])
    setErrMessage([])
  }

  const initialValues = {
    title: name || '-',
    body: description?.replace(/<\/?[^>]+(>|$)/g, '') || '-',
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => onHide()}>
      <Formik onSubmit={onSubmit} initialValues={initialValues} enableReinitialize>
        {({setFieldValue, values}) => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header closeButton>
              <Modal.Title>Convert to Forum</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='row'>
                <div className='col'>
                  <label htmlFor='' className={`${configClass.label} required`}>
                    Submiter
                  </label>
                  <div className=''>
                    <span className='badge text-white bg-primary'>
                      {detailTicket?.submitter_name}
                    </span>
                    &nbsp; -
                    <span className='badge text-white bg-primary mx-2'>
                      {detailTicket?.reporter_email}
                    </span>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col'>
                  <label htmlFor='' className={`${configClass.label} required`}>
                    Summary
                  </label>
                  <Field
                    type='text'
                    name='title'
                    placeholder='Enter Summary'
                    className={configClass?.form}
                  />
                  {errTitle && (
                    <div className='fv-plugins-message-container invalid-feedback mb-2 mt-0'>
                      {errTitle}
                    </div>
                  )}
                </div>
              </div>
              <div className='row'>
                <div className='col'>
                  <label htmlFor='' className={`${configClass.label} required`}>
                    Message
                  </label>
                  <TextEditor
                    id='editor'
                    placeholder='Enter Message'
                    defaultData={values?.body}
                    onChange={(e: any) => setFieldValue('body', e)}
                  />
                </div>
                {errMessage && (
                  <div className='fv-plugins-message-container invalid-feedback mb-2 mt-0'>
                    {errMessage}
                  </div>
                )}
              </div>
              <div className='row'>
                <div className='col'>
                  <label className={`${configClass.label}`}>Forum Category</label>
                  <div className='col-md-5'>
                    <Select
                      sm={true}
                      className='col p-0'
                      name='forum_category_guid'
                      api={getForumCategory}
                      params={false}
                      reload={false}
                      placeholder='Select Forum Category'
                      defaultValue={{
                        value: detail?.category?.guid,
                        label: detail?.category?.name,
                      }}
                      onChange={(e: any) => {
                        setFieldValue('forum_category_guid', e.value || '')
                      }}
                      parse={(e: any) => {
                        return {
                          value: e.guid,
                          label: e.name,
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                {!loading && <span className='indicator-label'>Add</span>}
                {loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </Button>
              <Button className='btn-sm' variant='secondary' onClick={onHide}>
                Cancel
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}
export {ConvertToForum}
