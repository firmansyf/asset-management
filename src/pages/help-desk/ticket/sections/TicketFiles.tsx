import {Accordion} from '@components/Accordion'
import {ViewerCustom} from '@components/viewer/indexViewCustom'
import {KTSVG} from '@helpers'
import {FC, useEffect, useState} from 'react'
import {Modal} from 'react-bootstrap'
import {shallowEqual, useSelector} from 'react-redux'

const NoFile: FC<any> = () => {
  return (
    <div
      style={{opacity: 0.5}}
      className='d-flex align-items-center justify-content-center mx-auto w-75px h-75px btn btn-outline btn-bg-light btn-color-gray-600 btn-active-light-secondary border-dashed border-secondary'
    >
      <div className='mx-auto'>
        <KTSVG className='svg-icon-3x' path='/media/icons/duotone/Media/fil012.svg' />
        <small className='text-gray-800 d-block pt-0'>No File</small>
      </div>
    </div>
  )
}

const File: FC<any> = (props: any) => {
  return (
    <div
      onClick={props?.onClick}
      className='btn btn-outline w-100 btn-bg-light btn-color-gray-600 btn-active-light-primary border-dashed border-primary'
    >
      <KTSVG className='svg-icon-3x' path='/media/icons/duotone/Media/fil012.svg' />
      <small className='text-gray-800 d-block w-100 pt-0 text-truncate'>{props?.data?.title}</small>
    </div>
  )
}

const ModalImage: FC<any> = (props: any) => {
  const [showModal, setShowModal] = useState<any>(false)
  const [data, setData] = useState<any>({})
  const [token, setToken] = useState<any>()

  useEffect(() => {
    setToken(props?.token)
  }, [props?.token])

  useEffect(() => {
    setData(props?.data)
  }, [props?.data])

  useEffect(() => {
    setShowModal(props?.show)
  }, [props?.show])

  const closeModal = () => {
    setShowModal(false)
    props?.setShow && props?.setShow(false)
  }

  return (
    <Modal dialogClassName='modal-lg' show={showModal} onHide={closeModal}>
      <Modal.Header>
        <Modal.Title>{data?.title || '-'}</Modal.Title>
      </Modal.Header>
      <div className='text-center'>
        <div className='mx-auto'>
          <ViewerCustom type={data?.mime_type} src={`${data?.url}?token=${token}`} />
        </div>
      </div>
      <Modal.Footer>
        <div className='btn btn-sm btn-light' onClick={closeModal}>
          Cancel
        </div>
        <a
          href={`${data?.download_url}?token=${token}`}
          className='btn btn-sm btn-primary'
          onClick={closeModal}
        >
          Download
        </a>
      </Modal.Footer>
    </Modal>
  )
}

const TicketFiles: FC<any> = ({detailTicket}) => {
  const [data, setData] = useState<any>({})
  const [imageDetail, setImageDetail] = useState<any>()
  const [showModalImage, setShowModalImage] = useState<any>(false)
  const token: any = useSelector(({token}: any) => token, shallowEqual)

  useEffect(() => {
    setData(detailTicket.files)
  }, [detailTicket])

  return (
    <div className='card border border-gray-300'>
      <div className='card-header align-items-center px-4'>
        <h3 className='card-title fw-bold fs-3 m-0'>Files</h3>
      </div>
      <div className='card-body align-items-center p-0'>
        <Accordion id='files' default={data ? 'image' : ''}>
          <div className='' data-value='image' data-label={`Files (${data ? data?.length : 0})`}>
            {data && data?.length > 0 ? (
              <div className='row'>
                {data?.map((e: any, index: number) => (
                  <div className='col-md-6 h-100px d-flex align-items-center my-2' key={index}>
                    {e?.mime_type?.split('/')?.[0] === 'image' ? (
                      <img
                        src={`${e?.url}?token=${token}`}
                        alt={e?.title}
                        className='thumbnails shadow h-100 rounded overflow-hidden cursor-pointer'
                        onClick={() => {
                          setImageDetail(e)
                          setShowModalImage(true)
                        }}
                      />
                    ) : (
                      <File
                        onClick={() => {
                          setImageDetail(e)
                          setShowModalImage(true)
                        }}
                        data={e}
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <NoFile />
            )}
          </div>
        </Accordion>
      </div>
      <ModalImage
        token={token}
        data={imageDetail}
        show={showModalImage}
        setShow={() => setShowModalImage(false)}
      />
    </div>
  )
}

export default TicketFiles
