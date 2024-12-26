import '@metronic/assets/sass/custom/react_file_viewer.scss'

import {Accordion} from '@components/Accordion'
import {ViewerCustom} from '@components/viewer/indexViewCustom'
import {KTSVG} from '@helpers'
import {FC, useEffect, useState} from 'react'
import {Modal} from 'react-bootstrap'

const NoFile: FC<any> = () => {
  return (
    <div
      style={{opacity: 0.5}}
      className='d-flex align-items-center justify-content-center mx-auto w-75px h-75px btn btn-outline btn-bg-light btn-color-gray-600 btn-active-light-secondary border-dashed border-secondary'
    >
      <div className='mx-auto'>
        <KTSVG className='svg-icon-3x' path='/media/icons/duotone/Files/File.svg' />
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
      <KTSVG className='svg-icon-3x' path='/media/icons/duotone/Files/File.svg' />
      <small className='text-gray-800 d-block w-100 pt-0 text-truncate'>
        {props?.data?.title || '-'}
      </small>
    </div>
  )
}

const ModalImage: FC<any> = (props: any) => {
  const [data, setData] = useState<any>({})
  const [showModal, setShowModal] = useState<boolean>(false)

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

  const isVideoVal: any = data?.mime_type
    ? data?.mime_type?.split('/')?.length > 0 && data?.mime_type?.split('/')?.[0] === 'video'
    : false

  return (
    <Modal dialogClassName='modal-lg' show={showModal} onHide={closeModal}>
      <Modal.Header>
        <Modal.Title>{data?.title || '-'}</Modal.Title>
      </Modal.Header>
      <div className='text-center'>
        {isVideoVal ? (
          <div className='mx-auto'>{/* <Video src={data?.url} /> */}</div>
        ) : (
          data?.url && (
            <div className='mx-auto'>
              <ViewerCustom type={data?.mime_type} src={data?.url} />
            </div>
          )
        )}
      </div>
      <Modal.Footer>
        <div className='btn btn-sm btn-light' onClick={closeModal}>
          Cancel
        </div>
        <a href={data?.download_url} className='btn btn-sm btn-primary' onClick={closeModal}>
          Download
        </a>
      </Modal.Footer>
    </Modal>
  )
}

export const Files: FC<any> = (props: any) => {
  const [data, setData] = useState<any>({})
  const [imageDetail, setImageDetail] = useState<any>()
  const [showModalImage, setShowModalImage] = useState<boolean>(false)

  useEffect(() => {
    props?.data?.files && setData(props?.data?.files)
  }, [props?.data])

  return (
    <div className='card'>
      <div className='card-header align-items-center px-4 border border-2 border-bottom-0'>
        <h3 className='card-title fw-bold fs-3 m-0 px-2'>Files</h3>
      </div>
      <div className='card-body align-items-center p-0'>
        <Accordion id='Image' default={data?.delivery_file?.length > 0 && 'image'}>
          <div
            className=''
            data-value='image'
            data-label={`Delivery Check (${data?.delivery_file ? data?.delivery_file?.length : 0})`}
          >
            {data?.delivery_file && data?.delivery_file?.length > 0 ? (
              <div className='row'>
                {data?.delivery_file?.map((e: any) => (
                  <div className='col-md-6 h-100px d-flex align-items-center my-2' key={e?.url}>
                    {e?.mime_type?.split('/')?.[0] === 'image' ? (
                      <img
                        src={e?.url || ''}
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
          <div
            className=''
            data-value='others'
            data-label={`Payment (${data?.payment_file ? data?.payment_file?.length : 0})`}
          >
            {data?.payment_file && data?.payment_file?.length > 0 ? (
              <div className='row'>
                {data?.payment_file?.map((e: any) => (
                  <div className='col-md-6 h-100px d-flex align-items-center my-2' key={e?.url}>
                    {e?.mime_type?.split('/')?.[0] === 'image' ? (
                      <img
                        src={e?.url}
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
        data={imageDetail}
        show={showModalImage}
        setShow={() => setShowModalImage(false)}
      />
    </div>
  )
}
