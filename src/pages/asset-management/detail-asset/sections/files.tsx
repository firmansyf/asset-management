import {Accordion} from '@components/Accordion'
import {Title as CardTitle} from '@components/form/Title'
import {ViewerCustom} from '@components/viewer/indexViewCustom'
import {Video} from '@components/viewer/video'
import {KTSVG} from '@helpers'
import {FC, memo, useEffect, useState} from 'react'
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
  const token: any = useSelector(({token}: any) => token, shallowEqual)
  const [showModal, setShowModal] = useState(false)
  const [data, setData] = useState<any>({})

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
        {(
          data?.mime_type
            ? data?.mime_type?.split('/')?.length > 0 &&
              data?.mime_type?.split('/')?.[0] === 'video'
            : false
        ) ? (
          <div className='mx-auto'>
            <Video src={`${data?.url}?token=${token}`} />
          </div>
        ) : (
          data?.url && (
            <div className='mx-auto'>
              <ViewerCustom type={data?.mime_type} src={`${data?.url}?token=${token}`} />
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

let Files: FC<any> = (props: any) => {
  const token: any = useSelector(({token}: any) => token, shallowEqual)
  const [data, setData] = useState<any>({})
  const [imageDetail, setImageDetail] = useState<any>()
  const [showModalImage, setShowModalImage] = useState<any>(false)

  useEffect(() => {
    props?.data?.files && setData(props?.data?.files)
  }, [props?.data])

  return (
    <div className='card border border-gray-200 border-2'>
      <div className='card-header align-items-center px-4'>
        <CardTitle
          title='Files'
          sticky={false}
          icon={''}
          uppercase={false}
          space='0'
          line={false}
        />
      </div>
      <div className='card-body align-items-center p-0'>
        <Accordion id='files' default={data?.photos ? 'image' : ''}>
          <div
            className=''
            data-value='image'
            data-label={`Image (${data?.photos ? data?.photos?.length : 0})`}
          >
            {data?.photos && data?.photos?.length > 0 ? (
              <div className='row'>
                {data?.photos?.map((e: any, index: number) => (
                  <div className='col-md-6 h-100px d-flex align-items-center my-2' key={index}>
                    {e?.mime_type?.split('/')?.[0] === 'image' ? (
                      <img
                        src={`${e?.url}?token=${token}`}
                        className='thumbnails shadow h-100 rounded overflow-hidden cursor-pointer'
                        alt={e?.title}
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
            data-value='video'
            data-label={`Video (${data?.videos ? data?.videos?.length : 0})`}
          >
            {data?.videos && data?.videos?.length > 0 ? (
              <div className='row'>
                {data?.videos?.map((e: any, index: number) => (
                  <div className='col-md-6 h-100px d-flex align-items-center my-2' key={index}>
                    {e?.mime_type?.split('/')?.[0] === 'image' ? (
                      <div
                        style={{
                          background: `url(${e?.url}?token=${token}) center center / contain no-repeat`,
                        }}
                        onClick={() => {
                          setImageDetail(e)
                          setShowModalImage(true)
                        }}
                        className='thumbnails shadow h-100 rounded overflow-hidden cursor-pointer'
                      ></div>
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

          {/* 
          <div
            className=''
            value='serial_numbers'
            label={`Serial Numbers (${data?.serial_numbers ? data?.serial_numbers?.length : 0})`}
          >
            {data?.serial_numbers && data?.serial_numbers?.length > 0 ? (
              <div className='row'>
                {data?.serial_numbers?.map((e: any, index: number) => (
                  <div className='col-md-6 h-100px d-flex align-items-center my-2' key={index}>
                    {e?.mime_type?.split('/')?.[0] === 'image' ? (
                      <div
                        style={{background: `url(${e.url}) center center / contain no-repeat`}}
                        onClick={() => {
                          setImageDetail(e)
                          setShowModalImage(true)
                        }}
                        className='thumbnails shadow h-100 rounded overflow-hidden cursor-pointer'
                      ></div>
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
            value='invoices'
            label={`Invoices (${data?.invoices ? data?.invoices?.length : 0})`}
          >
            {data?.invoices && data?.invoices?.length > 0 ? (
              <div className='row'>
                {data?.invoices?.map((e: any, index: number) => (
                  <div className='col-md-6 h-100px d-flex align-items-center my-2' key={index}>
                    {e?.mime_type?.split('/')?.[0] === 'image' ? (
                      <div
                        style={{background: `url(${e.url}) center center / contain no-repeat`}}
                        onClick={() => {
                          setImageDetail(e)
                          setShowModalImage(true)
                        }}
                        className='thumbnails shadow h-100 rounded overflow-hidden cursor-pointer'
                      ></div>
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
          */}

          <div
            className=''
            data-value='others'
            data-label={`Other Files (${data?.others ? data?.others?.length : 0})`}
          >
            {data?.others && data?.others?.length > 0 ? (
              <div className='row'>
                {data?.others?.map((e: any, index: number) => (
                  <div className='col-md-6 h-100px d-flex align-items-center my-2' key={index}>
                    {e?.mime_type?.split('/')?.[0] === 'image' ? (
                      <div
                        style={{
                          background: `url(${e?.url}?token=${token}) center / contain no-repeat`,
                        }}
                        onClick={() => {
                          setImageDetail(e)
                          setShowModalImage(true)
                        }}
                        className='thumbnails shadow h-100px w-100px rounded overflow-hidden cursor-pointer'
                      ></div>
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

Files = memo(Files, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default Files
