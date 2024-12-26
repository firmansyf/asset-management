import {Button} from '@components/button'
import {FC, useState} from 'react'
import {Modal as MODAL} from 'react-bootstrap'

const Modal: FC<any> = ({
  show,
  setShow,
  title = '',
  body = 'Content',
  bodyClass = 'd-flex flex-center',
  children = '',
  buttonText = 'Save',
  buttonIcon = 'check-double',
  buttonSave = true,
  loading = false,
  disabled = false,
  onSubmit,
  footer = true,
  size = 'md',
  isFullScreen = false,
  onHide,
  backdrop = true, // boolean or string 'static'
}) => {
  const [fullscreen, setFullscreen] = useState<any>(false)

  const onClose: any = () => {
    setShow(false)
    onHide && onHide()
    setTimeout(() => {
      setFullscreen(false)
    }, 1000)
  }

  return (
    <MODAL
      dialogClassName={`modal-${size}`}
      centered
      fullscreen={fullscreen}
      scrollable
      backdrop={backdrop}
      show={show}
      onHide={onClose}
    >
      <div className='p-2'>
        <div className='row m-0 w-100 flex-center'>
          {title && <div className='col fw-bolder text-primary'>{title}</div>}
          <div className='col-auto ms-auto me-n3'>
            {isFullScreen && (
              <div
                className='btn btn-icon btn-light-success w-20px h-20px rounded-circle me-2'
                onClick={() => setFullscreen(!fullscreen)}
              >
                <i className={`las la-angle-double-${fullscreen ? 'down' : 'up'}`} />
              </div>
            )}
            <div className='btn btn-icon w-20px h-20px rounded-circle' onClick={onClose}>
              <i className='las la-times fs-5 text-dark' />
            </div>
          </div>
        </div>
      </div>
      <MODAL.Body className={bodyClass}>{children || body}</MODAL.Body>
      {footer && (
        <MODAL.Footer className='p-3'>
          <Button
            text='Cancel'
            theme='white'
            className='text-dark'
            icon={false}
            iconClass='fs-5'
            dir='left'
            disabled={loading}
            onClick={onClose}
          />
          {buttonSave && (
            <Button
              text={buttonText}
              theme='primary'
              icon={buttonIcon}
              iconClass='fs-5'
              dir='left'
              loading={loading}
              disabled={disabled}
              onClick={onSubmit}
            />
          )}
        </MODAL.Footer>
      )}
    </MODAL>
  )
}

export {Modal}
