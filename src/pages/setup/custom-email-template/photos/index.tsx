import {KTSVG, toAbsoluteUrl} from '@helpers'
import {useFormikContext} from 'formik'
import {FC, useState} from 'react'
import ImageUploading, {ImageListType} from 'react-images-uploading'
import {useIntl} from 'react-intl'

interface Props {
  photoDetail: any
}

const Photos: FC<Props> = ({photoDetail}) => {
  const intl: any = useIntl()
  const {setFieldValue, values}: any = useFormikContext()
  const [images, setImages] = useState<any>([])
  const [imageCompany, setImageCompany] = useState<any>(photoDetail || null)

  const onChange = (imageList: ImageListType) => {
    if (imageList?.[0]) {
      setFieldValue('company_logo', {
        data: imageList?.[0]?.dataURL,
        title: imageList?.[0]?.file?.name || '',
      })
    }
    setImages(imageList as never[])
  }

  return (
    <>
      {/* <div className='d-flex image-logo col-md-10 offset-md-1 text-center'> */}
      <div className='image-logo col-md-11 offset-md-1 text-center'>
        <ImageUploading
          value={images}
          onChange={onChange}
          maxNumber={1}
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
            if (imageCompany) {
              data_photo = photoDetail?.company_logo?.data || ''
            }
            return (
              // write your building UI
              <div className='upload__image-wrapper'>
                <div className='my-2'>
                  {errors?.acceptType && (
                    <span className='text-danger'>
                      {intl.formatMessage({id: 'YOUR_SELECTED_FILE_TYPE_IS_NOT_ALLOW'})}
                    </span>
                  )}
                </div>
                {imageList &&
                  imageList?.length > 0 &&
                  imageList?.map((image, index) => (
                    <div
                      key={index}
                      className='image-item my-3'
                      style={{position: 'relative', height: 'auto'}}
                    >
                      <div>
                        <img
                          src={image?.dataURL || ''}
                          alt=''
                          width='130'
                          className='img-thumbnail'
                        />
                      </div>
                      <div className='image-item__btn-wrapper' style={{position: 'relative'}}>
                        <div className='position-absolute text-center w-100'>
                          <button
                            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                            title='Edit'
                            onClick={(e: any) => {
                              e?.preventDefault()
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
                              e?.preventDefault()
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
                    </div>
                  ))}

                {values?.company_logo !== null && imageList?.length === 0 && (
                  <div className='image-item my-3' style={{position: 'relative'}}>
                    <div>
                      <img src={data_photo} alt='' width='130' className='img-thumbnail' />
                    </div>

                    <div className='image-item__btn-wrapper' style={{position: 'relative'}}>
                      <div className='position-absolute text-center w-100'>
                        <button
                          className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                          title='Edit'
                          onClick={(e: any) => {
                            e?.preventDefault()
                            onImageUpload()
                          }}
                        >
                          <KTSVG path='/media/icons/duotone/Code/Plus.svg' className='svg-icon-3' />
                        </button>
                        <button
                          className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1'
                          title='Delete'
                          onClick={(e: any) => {
                            e?.preventDefault()
                            setImageCompany(null)
                            setImages([])
                            setFieldValue('company_logo', null)
                          }}
                        >
                          <KTSVG
                            path='/media/icons/duotone/Code/Error-circle.svg'
                            className='svg-icon-3'
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {values?.company_logo === null && imageList?.length === 0 && (
                  <div
                    className='d-flex align-items-center mx-auto image-input-wrapper h-100px btn btn-outline btn-bg-light btn-color-gray-600 btn-active-light-primary border-dashed border-primary'
                    {...dragProps}
                    onClick={(e: any) => {
                      e?.preventDefault()
                      onImageUpload()
                    }}
                  >
                    <div className='w-100'>
                      <KTSVG
                        className='svg-icon-3x'
                        path='/media/icons/duotone/Files/Pictures1.svg'
                      />
                      <small className='text-gray-800 d-block pt-0 '>
                        Drag and drop your logo here <br /> or{' '}
                        <u className='fw-bolder text-primary'>Click Here</u> to browse
                      </small>
                    </div>
                  </div>
                )}
              </div>
            )
          }}
        </ImageUploading>
      </div>
    </>
  )
}

export {Photos}
