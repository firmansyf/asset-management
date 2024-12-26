import {ToastMessage} from '@components/toast-message'
import {configClass} from '@helpers'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

import {sendReview2} from '../Service'

let ModalReview2: FC<any> = ({showModal, setShowModal, data, setReload, reload, id}) => {
  const [comment, setComment] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [claimable, setClaimable] = useState<boolean>(false)
  const [commentError, setCommentError] = useState<string>('')

  const {review_status, first_review_comment, is_claimable}: any = data || {}

  useEffect(() => {
    is_claimable !== null && setClaimable(is_claimable)
  }, [is_claimable])

  const submit = () => {
    const params: any = {
      submit_comment: comment || '',
      is_claimable: claimable ? 1 : 0,
      review_status: 1,
    }

    if (comment === '') {
      setCommentError('The comment is required.')
    } else {
      sendReview2(params, id)
        .then(({data: {message}}: any) => {
          setLoading(false)
          setShowModal(false)
          setReload(reload + 1)
          ToastMessage({message, type: 'success'})
        })
        .catch(({response}: any) => {
          setLoading(false)
          const {message} = response?.data || {}
          ToastMessage({message, type: 'error'})
        })
    }
  }

  const reject = () => {
    const params: any = {
      submit_comment: comment,
      is_claimable: claimable ? 1 : 0,
      review_status: 0,
    }

    if (comment === '') {
      setCommentError('The comment is required.')
    } else {
      sendReview2(params, id)
        .then(({data: {message}}: any) => {
          setLoading(false)
          setShowModal(false)
          setReload(reload + 1)
          ToastMessage({message, type: 'success'})
        })
        .catch(({response}: any) => {
          setLoading(false)
          const {message} = response?.data || {}
          ToastMessage({message, type: 'error'})
        })
    }
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Review 2</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='row'>
          <div className='col-4 fw-bolder'>
            <div className='mb-2'>Review Status</div>
            <div className='mb-2'>Review 1 Comment</div>
          </div>
          <div className='col-8'>
            <div className='mb-2'> : {review_status || '-'}</div>
            <div className='mb-2'>: {first_review_comment || '-'}</div>
          </div>
        </div>

        <div className='mt-3'>
          <textarea
            name='comment'
            onChange={({target: {value}}: any) => {
              setCommentError('')
              setComment(value || '')
            }}
            placeholder='Enter submission comment (if any)'
            className={configClass?.form}
          ></textarea>
          {commentError !== '' && (
            <div className='fv-plugins-message-container invalid-feedback'>{commentError}</div>
          )}
        </div>

        <div className='row mt-3'>
          <div className='col-4 fw-bolder'>
            <div>Claimable</div>
          </div>
          <div className='col-8'>
            <div>
              :
              <label htmlFor='claimable-yes' className='form-checkform-check-solid ms-3'>
                <input
                  type='checkbox'
                  name='claimable-yes'
                  checked={claimable}
                  onClick={() => setClaimable(true)}
                  style={{position: 'relative', top: '2px'}}
                />
                <span className='form-check-label mx-2'>Yes</span>
              </label>
              <label htmlFor='claimable-no' className='form-checkform-check-solid'>
                <input
                  type='checkbox'
                  name='claimable-no'
                  checked={!claimable}
                  onClick={() => setClaimable(false)}
                  style={{position: 'relative', top: '2px'}}
                />
                <span className='form-check-label mx-2'>No</span>
              </label>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className='btn-sm' disabled={loading} variant='primary' onClick={submit}>
          {!loading && <span className='indicator-label'>Submit for Approval</span>}
          {loading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </Button>

        <Button className='btn-sm' disabled={loading} variant='danger' onClick={reject}>
          {!loading && <span className='indicator-label'>Reject and Close</span>}
          {loading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </Button>

        <Button className='btn-sm' variant='secondary' onClick={() => setShowModal(false)}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

ModalReview2 = memo(
  ModalReview2,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default ModalReview2
