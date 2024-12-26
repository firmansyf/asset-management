import {KTSVG, toAbsoluteUrl} from '@helpers'
import {FC, memo, useEffect, useState} from 'react'
import ImageUploading, {ImageListType} from 'react-images-uploading'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'

interface Photo {
  photoDetail: any
  setFieldValue: any
  setFiles: any
  photoTitle: any
  photoDescription: any
}

let SinglePhoto: FC<Photo> = ({
  photoDetail,
  setFieldValue,
  setFiles,
  photoTitle,
  photoDescription,
}) => {
  const intl = useIntl()
  const token: any = useSelector(({token}: any) => token, shallowEqual)
  const maxNumber = 1
  const [images, setImages] = useState([])
  const [imageProfile, setImageProfile] = useState<any>()

  const onChange = (imageList: ImageListType) => {
    if (imageList[0]) {
      setFieldValue('photo', {data: imageList[0]?.dataURL, title: imageList[0]?.file?.name})
      setFiles({preview: imageList[0]?.dataURL, title: imageList[0]?.file?.name})
    }
    setImages(imageList as never[])
  }

  const toDataURL = (url: any, callback: any) => {
    const xhr = new XMLHttpRequest()
    xhr.onload = function () {
      const reader = new FileReader()
      reader.onloadend = function () {
        callback(reader.result)
      }
      reader.readAsDataURL(xhr.response)
    }
    xhr.open('GET', `${url}?token=${token}`)
    xhr.responseType = 'blob'
    xhr.send()
  }

  useEffect(() => {
    if (Object.keys(photoDetail || {}).length !== 0) {
      toDataURL(photoDetail?.url, (dataUrl: any) => {
        setImageProfile({
          title: photoDetail?.title,
          data: dataUrl,
        })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoDetail])

  return (
    <div className='form-row border-top'>
      <div className='py-5'>
        <h5 className='text-center'>{intl.formatMessage({id: photoTitle})}</h5>
        {/* ms-13 */}
        <div className='text-black-400 fs-7 text-center'>
          {intl.formatMessage({
            id: photoDescription,
          })}
        </div>
      </div>
      <div>
        {/* column d-flex */}
        <div className=''>
          <div className='col-md-10 offset-md-1 text-center'>
            <ImageUploading
              value={images}
              onChange={onChange}
              maxNumber={maxNumber}
              acceptType={['jpg', 'png']}
            >
              {({
                imageList,
                onImageUpload,
                onImageUpdate,
                onImageRemove,
                // isDragging,
                dragProps,
                errors,
              }) => {
                let data_photo = `url(${toAbsoluteUrl('/images/no-image-profile.jpeg')})`
                if (imageProfile) {
                  data_photo = imageProfile?.data
                }
                return (
                  // write your building UI
                  <div className='upload__image-wrapper'>
                    <div className='my-2'>
                      {errors?.acceptType && (
                        <span className='text-danger'>
                          {intl.formatMessage({
                            id: 'YOUR_SELECTED_FILE_TYPE_IS_NOT_ALLOW',
                          })}
                        </span>
                      )}
                    </div>
                    {imageList?.length > 0 &&
                      imageList.map((image, index) => (
                        <div key={index} className='image-item my-3' style={{position: 'relative'}}>
                          <img src={image?.dataURL} alt='' width='180' />
                          <div
                            className='image-item__btn-wrapper text-center position-absolute w-100'
                            style={{bottom: '5px'}}
                          >
                            <button
                              className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                              title='Edit'
                              onClick={(e: any) => {
                                e.preventDefault()
                                onImageUpdate(index)
                              }}
                            >
                              <KTSVG
                                path='/media/icons/duotone/Code/Plus.svg'
                                className='svg-icon-3'
                              />
                            </button>
                            <button
                              className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1'
                              title='Delete'
                              onClick={(e: any) => {
                                e.preventDefault()
                                onImageRemove(index)
                              }}
                            >
                              <KTSVG
                                path='/media/icons/duotone/Code/Error-circle.svg'
                                className='svg-icon-3'
                              />
                            </button>
                          </div>
                        </div>
                      ))}

                    {imageProfile?.title !== undefined && imageList.length === 0 && (
                      <div className='image-item my-3' style={{position: 'relative'}}>
                        <img src={data_photo} alt='' width='180' />
                        <div
                          className='image-item__btn-wrapper text-center position-absolute w-100'
                          style={{bottom: '5px'}}
                        >
                          <button
                            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                            title='Edit'
                            onClick={(e: any) => {
                              e.preventDefault()
                              onImageUpload()
                            }}
                          >
                            <KTSVG
                              path='/media/icons/duotone/Code/Plus.svg'
                              className='svg-icon-3'
                            />
                          </button>
                          <button
                            className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1'
                            title='Delete'
                            onClick={(e: any) => {
                              e.preventDefault()
                              setImages([])
                              setImageProfile(null)
                              setFieldValue('photo', null)
                            }}
                          >
                            <KTSVG
                              path='/media/icons/duotone/Code/Error-circle.svg'
                              className='svg-icon-3'
                            />
                          </button>
                        </div>
                      </div>
                    )}

                    {imageProfile?.title === undefined && imageList.length === 0 && (
                      <div
                        className='d-flex align-items-center mx-auto image-input-wrapper h-100px btn btn-outline btn-bg-light btn-color-gray-600 btn-active-light-primary border-dashed border-primary'
                        {...dragProps}
                        onClick={(e: any) => {
                          e.preventDefault()
                          onImageUpload()
                        }}
                      >
                        <div className='w-100'>
                          <KTSVG
                            className='svg-icon-3x'
                            path='/media/icons/duotone/Files/Pictures1.svg'
                          />
                          <small className='text-gray-800 d-block pt-0'>
                            Drag your photo here or <u className='fw-bolder text-primary'>Click</u>{' '}
                            to upload photo
                          </small>
                        </div>
                      </div>
                    )}
                  </div>
                )
              }}
            </ImageUploading>
            <div className='form-text text-dark mb-8 mt-3'>
              Only <span style={{color: 'black', fontWeight: 600}}>(JPG, GIF, PNG)</span> are
              allowed
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  )
}

SinglePhoto = memo(
  SinglePhoto,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)

export default SinglePhoto
