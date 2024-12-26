import '@metronic/assets/sass/custom/react_file_viewer.scss'

import {Accordion} from '@components/Accordion'
import {Title as CardTitle} from '@components/form/Title'
import {DOCX} from '@components/viewer/docx'
import {PDF} from '@components/viewer/pdfEditor'
import {Video} from '@components/viewer/video'
import {XLSX} from '@components/viewer/xlsx'
import {KTSVG} from '@helpers'
import last from 'lodash/last'
import {FC, useCallback, useEffect, useState} from 'react'
import {Modal} from 'react-bootstrap'
import {shallowEqual, useSelector} from 'react-redux'

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
  const [showModal, setShowModal] = useState<boolean>(false)
  const [data, setData] = useState<any>({})
  const [token, setDataToken] = useState<any>()

  useEffect(() => {
    const {token} = props || {}
    setDataToken(token)
  }, [props])

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

  const FileViewer = useCallback(() => {
    const extension: any = last(data?.title?.split('.'))
    switch (extension?.toLowerCase()) {
      case 'pdf':
        return <PDF readOnly src={`${data?.url}?token=${token}`} />
      case 'docx':
        return <DOCX src={`${data?.url}?token=${token}`} />
      case 'xls':
      case 'xlsx':
        return <XLSX src={`${data?.url}?token=${token}`} />
      case 'mp4':
      case 'mov':
      case 'wmv':
      case 'avi':
      case 'flv':
      case 'mkv':
      case 'webm':
        return <Video src={`${data?.url}?token=${token}`} />
      default:
        return <KTSVG className='svg-icon-5x' path='/media/icons/duotone/Files/File.svg' />
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.url, data?.title])

  return (
    <Modal dialogClassName='modal-lg' show={showModal} onHide={closeModal}>
      <Modal.Header>
        <Modal.Title>{data?.title || '-'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='text-center'>
          {data?.url && data?.mime_type?.split('/')[0] === 'image' ? (
            <div
              className='w-100'
              style={{
                background: `url(${data?.url}?token=${token}) center center / contain no-repeat`,
                height: '65vh',
              }}
            />
          ) : data?.url ? (
            <div className='' style={{width: '100%', height: '65vh'}}>
              <FileViewer />
            </div>
          ) : (
            <div className='mx-auto my-5' style={{opacity: 0.5}}>
              <KTSVG className='svg-icon-5x' path='/media/icons/duotone/Files/File.svg' />
            </div>
          )}
        </div>
      </Modal.Body>
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

export const Files: FC<any> = (props: any) => {
  const [data, setData] = useState<any>({})
  const [imageDetail, setImageDetail] = useState<any>()
  const [showModalImage, setShowModalImage] = useState<boolean>(false)
  const token: any = useSelector(({token}: any) => token, shallowEqual)

  useEffect(() => {
    const {files} = props?.data || {}
    files && setData(files)
  }, [props?.data])

  return (
    <div className='card border border-1'>
      <div className='card-header align-items-center px-5 border border-1 border-bottom-0'>
        <CardTitle title='Files' sticky={false} className='m-0 p-0' />
      </div>
      <div className='card-body align-items-center p-0'>
        <Accordion id='files' default={data?.photos?.length > 0 && 'image'}>
          <div
            className=''
            data-value='image'
            data-label={`Image (${data?.photos ? data?.photos?.length : 0})`}
          >
            {data?.photos && data?.photos?.length > 0 ? (
              <div className='row'>
                {data?.photos?.map((e: any, index: number) => {
                  return (
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
                  )
                })}
              </div>
            ) : (
              <NoFile />
            )}
          </div>
          <div
            className=''
            data-value='invoices'
            data-label={`Invoices (${data?.invoices ? data?.invoices?.length : 0})`}
          >
            {data?.invoices && data?.invoices?.length > 0 ? (
              <div className='row'>
                {data?.invoices?.map((e: any, index: number) => (
                  <div className='col-md-6 h-100px d-flex align-items-center my-2' key={index}>
                    {e?.mime_type?.split('/')?.[0] === 'image' ? (
                      <div
                        style={{
                          background: `url(${e?.url}?token=${token}) center center / contain no-repeat`,
                          width: '100%',
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
        token={token}
        data={imageDetail}
        show={showModalImage}
        setShow={() => setShowModalImage(false)}
      />
    </div>
  )
}
