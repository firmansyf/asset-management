import {ViewerCustom as FileViewer} from '@components/viewer/indexViewCustom'
import {configClass, KTSVG} from '@helpers'
import {FC, memo, useEffect, useState} from 'react'
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

let File: FC<any> = ({onClick, data}) => {
  return (
    <div
      onClick={onClick}
      className='btn btn-outline w-100 btn-bg-light btn-color-gray-600 btn-active-light-primary border-dashed border-primary'
    >
      <KTSVG className='svg-icon-3x' path='/media/icons/duotone/Files/File.svg' />
      <small className='text-gray-800 d-block w-100 pt-0 text-truncate'>{data?.title || '-'}</small>
    </div>
  )
}

const ModalImage: FC<any> = ({data, show, setShow}) => {
  const [datas, setData] = useState<any>({})
  const [showModal, setShowModal] = useState<boolean>(false)

  useEffect(() => {
    setData(data)
  }, [data])
  useEffect(() => {
    setShowModal(show)
  }, [show])
  const closeModal = () => {
    setShowModal(false)
    setShow && setShow(false)
  }

  return (
    <Modal dialogClassName='modal-lg' show={showModal} onHide={closeModal}>
      <Modal.Header>
        <Modal.Title>{datas?.description || '-'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='text-center'>
          {datas?.file_url && datas?.file_type?.split('/')?.[0] === 'image' && (
            <div
              className='w-100'
              style={{
                background: `url(${datas?.file_url}) center center / contain no-repeat`,
                height: '65vh',
              }}
            />
          )}

          {datas?.file_url && datas?.file_type?.split('/')?.[0] !== 'image' ? (
            <div className='' style={{width: '100%', height: '65vh'}}>
              <FileViewer type={datas?.file_type} src={datas?.file_url} />
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
        <a href={datas?.download_url} className='btn btn-sm btn-primary' onClick={closeModal}>
          Download
        </a>
      </Modal.Footer>
    </Modal>
  )
}

type FileType = {
  document: any
  reloadPolicy: any
}
export const Files: FC<FileType> = ({document, reloadPolicy}) => {
  const [documents, setDocument] = useState<any>([])
  const [imageDetail, setImageDetail] = useState<any>()
  const [showModalImage, setShowModalImage] = useState<boolean>(false)
  const [reloadFiles, setReloadFiles] = useState<boolean>(true)
  useEffect(() => {
    if (Object.keys(document || {})?.length > 0) {
      const res_doc: any = document?.filter((f: any) => !Object.values(f || {})?.includes(null))
      res_doc && setDocument(res_doc)
    }
  }, [document])

  useEffect(() => {
    setReloadFiles(false)
    setTimeout(() => {
      setReloadFiles(true)
    }, 500)
  }, [reloadPolicy])

  return (
    <div className='card border border-2'>
      <div className='card-header align-items-center px-4'>
        <h3 className='card-title fw-bold fs-3 m-0'>Documents</h3>
      </div>
      <div className='card-body align-items-center'>
        {reloadFiles && documents && documents?.length > 0 ? (
          <div className='row mt-2 mb-5 pb-5'>
            {documents?.map((e: any, index: number) => (
              <div className='col-md-6 h-100px d-flex align-items-center row' key={index}>
                {e?.file_type?.split('/')?.[0] === 'image' ? (
                  <>
                    <div
                      style={{background: `url(${e?.file_url}) center center / contain no-repeat`}}
                      onClick={() => {
                        setImageDetail(e)
                        setShowModalImage(true)
                      }}
                      className='thumbnails shadow h-100 rounded overflow-hidden cursor-pointer col-md-12'
                    ></div>
                    <div className='w-100 fw-bold col-md-12 mt-4'>{e?.description || '-'}</div>
                  </>
                ) : (
                  <>
                    {e?.file_type !== null && (
                      <>
                        <File
                          onClick={() => {
                            setImageDetail(e)
                            setShowModalImage(true)
                          }}
                          data={e}
                        />
                        <label className={configClass?.label}>{e?.description || '-'}</label>
                      </>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <NoFile />
        )}
      </div>
      <ModalImage
        data={imageDetail}
        show={showModalImage}
        setShow={() => setShowModalImage(false)}
      />
    </div>
  )
}

File = memo(File, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export {File}
