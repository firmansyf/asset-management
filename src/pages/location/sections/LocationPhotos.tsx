import {Title as CardTitle} from '@components/form/Title'
import {ViewerCustom} from '@components/viewer/indexViewCustom'
import {KTSVG} from '@helpers'
import isEmpty from 'lodash/isEmpty'
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

const ModalImage: FC<any> = ({imageDetail, showModalImage, setShowModalImage}) => {
  const closeModal = () => {
    setShowModalImage(false)
  }
  return (
    <Modal dialogClassName='modal-lg' show={showModalImage} onHide={closeModal}>
      <Modal.Header>
        <Modal.Title>{imageDetail?.file?.name || '-'}</Modal.Title>
      </Modal.Header>
      <div className='text-center'>
        {imageDetail?.dataURL && (
          <div className='mx-auto'>
            <ViewerCustom type={imageDetail?.mimeType} src={imageDetail?.dataURL} />
          </div>
        )}
      </div>
      <Modal.Footer>
        <div className='btn btn-sm btn-light' onClick={closeModal}>
          Cancel
        </div>
        <a href={imageDetail?.downloadUrl} className='btn btn-sm btn-primary' onClick={closeModal}>
          Download
        </a>
      </Modal.Footer>
    </Modal>
  )
}

let LocationPhotos: FC<any> = ({detailLocation}) => {
  const token: any = useSelector(({token}: any) => token, shallowEqual)
  const [images, setImages] = useState([])
  const [imageDetail, setImageDetail] = useState<any>()
  const [showModalImage, setShowModalImage] = useState<any>(false)

  useEffect(() => {
    if (!isEmpty(detailLocation)) {
      const promises = detailLocation?.photos?.map(
        (m: any) =>
          new Promise((resolve: any) => {
            try {
              const xhr = new XMLHttpRequest()
              xhr.onload = () => {
                const reader = new FileReader()
                reader.onloadend = () => {
                  const arrData = {
                    mimeType: m?.mime_type,
                    dataURL: `${m?.url}?token=${token}`,
                    downloadUrl: `${m?.download_url}?token=${token}`,
                    file: {
                      name: m?.title,
                    },
                  }
                  resolve(arrData)
                }
                reader.readAsDataURL(xhr.response)
              }
              xhr.open('GET', `${m?.download_url}?token=${token}`)
              xhr.responseType = 'blob'
              xhr.send()
            } catch (error) {
              resolve(null)
            }
          })
      )
      Promise.all(promises)
        .then((mediaArray: any) => {
          setImages(mediaArray)
        })
        .catch(() => '')
    } else {
      setImages([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailLocation])

  return (
    <div className='card border border-gray-300 mt-6'>
      <div className='card-header align-items-center px-4'>
        <CardTitle title='Photos' sticky={false} />
      </div>
      <div className='card-body align-items-center px-4 py-3'>
        {images && images?.length > 0 ? (
          <div className='row'>
            {images.map((e: any, index: any) => (
              <div className='col-md-6 h-100px d-flex align-items-center my-2' key={index}>
                {e?.mimeType?.split('/')?.[0] === 'image' ? (
                  <img
                    src={e?.dataURL}
                    alt={e?.title || 'image-location'}
                    onClick={() => {
                      setImageDetail(e)
                      setShowModalImage(true)
                    }}
                    className='thumbnails shadow h-100 rounded overflow-hidden cursor-pointer'
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
        <ModalImage
          imageDetail={imageDetail}
          showModalImage={showModalImage}
          setShowModalImage={setShowModalImage}
        />
      </div>
    </div>
  )
}

LocationPhotos = memo(
  LocationPhotos,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default LocationPhotos
