import Linkify from '@components/linkify'
import {ToastMessage} from '@components/toast-message'
import {
  PreviewCannedResponse,
  sendEmailCannedResponse,
} from '@pages/help-desk/canned-response/Service'
import parse from 'html-react-parser'
import {FC, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

type Props = {
  setShowModal?: any
  showModal?: any
  message?: any
  ResponseGuid?: any
}

const Preview: FC<Props> = ({setShowModal, showModal, message, ResponseGuid}) => {
  const [loadingSendEmail, setLoadingSendEmail] = useState<boolean>(false)
  const [dataPreview, setDataPreview] = useState<any>({})

  useEffect(() => {
    if (ResponseGuid !== undefined) {
      PreviewCannedResponse(ResponseGuid)
        .then(({data: {data: res}}: any) => {
          if (res) {
            setDataPreview(res)
          }
        })
        .catch(() => '')
    }
  }, [ResponseGuid])

  const sendEmail = () => {
    if (ResponseGuid !== undefined) {
      setLoadingSendEmail(true)
      sendEmailCannedResponse(ResponseGuid, {})
        .then((res: any) => {
          const {message} = res?.data || {}
          ToastMessage({type: 'success', message})
          setLoadingSendEmail(false)
          setShowModal(false)
        })
        .catch((e: any) => {
          setLoadingSendEmail(false)
          const {message} = e?.response?.data || {}
          ToastMessage({type: 'error', message})
        })
    }
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header>
        <Modal.Title>Message Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {Object.keys(dataPreview || {})?.length > 0 ? (
          <Linkify>
            <div id='editor' className='editor-class editor-class-custom border-0 p-4 shadow-sm'>
              {parse(`${dataPreview?.message}`)}
            </div>
          </Linkify>
        ) : message?.bodyText ? (
          <Linkify>
            <div id='editor' className='editor-class editor-class-custom border-0 p-4 shadow-sm'>
              {parse(`${message?.bodyText}`)}
            </div>
          </Linkify>
        ) : (
          ''
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button className='btn-sm' type='button' form-id='' variant='primary' onClick={sendEmail}>
          {!loadingSendEmail && <span className='indicator-label'>Send Email</span>}
          {loadingSendEmail && (
            <span className='indicator-progress' style={{display: 'block'}}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default Preview
