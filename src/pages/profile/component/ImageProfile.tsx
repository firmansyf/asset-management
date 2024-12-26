import Tooltip from '@components/alert/tooltip'
import {KTSVG, toAbsoluteUrl} from '@helpers'
import {FC, memo, useCallback, useEffect, useState} from 'react'
import ImageUploading, {ImageListType} from 'react-images-uploading'
import {shallowEqual, useSelector} from 'react-redux'

let ImageProfile: FC<any> = ({
  imageProfile,
  setImageProfile,
  setFormChangeAvatar,
  images,
  setImages,
}) => {
  const {currentUser: user, token}: any = useSelector(
    ({currentUser, token}: any) => ({currentUser, token}),
    shallowEqual
  )
  const {email, roles, photos}: any = user || {}
  const {label: user_label} = roles?.[0] || {}

  const [reload, setReload] = useState<number>(0)

  const onChangeUploadImage = useCallback(
    (imageList: ImageListType) => {
      if (imageList?.[0]) {
        const data: any = imageList?.map((m: any) => {
          return {
            data: m?.dataURL || '',
            title: m?.file?.name || '',
          }
        })
        setImageProfile(data?.[0] || '')
        setImages(imageList as never[])
        setFormChangeAvatar(true)
        setReload(reload + 1)

        if (imageProfile !== undefined) {
          if (imageProfile?.title !== imageList?.[0]?.file?.name) {
            setFormChangeAvatar(true)
          } else {
            setFormChangeAvatar(false)
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [imageProfile, reload]
  )

  const toDataURL = (url: any, callback: any) => {
    const xhr: any = new XMLHttpRequest()
    xhr.onload = function () {
      const reader: any = new FileReader()
      reader.onloadend = function () {
        callback(reader?.result)
      }
      reader.readAsDataURL(xhr?.response)
    }
    xhr.open('GET', `${url}?token=${token}`)
    xhr.responseType = 'blob'
    xhr.send()
  }

  useEffect(() => {
    if (photos?.length > 0) {
      toDataURL(photos[0]?.url, (dataUrl: any) => {
        setImageProfile({
          title: photos[0]?.title,
          data: dataUrl,
        })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className='d-flex image-logo'>
      <ImageUploading
        multiple
        value={images}
        maxNumber={10}
        onChange={onChangeUploadImage}
        acceptType={['jpg', 'png', 'jpeg']}
      >
        {({imageList, onImageUpload, onImageUpdate}) => {
          let data_photo: any = `url(${toAbsoluteUrl('/images/no-image-profile.jpg')})`
          if (imageProfile) {
            data_photo = imageProfile?.data || ''
          }

          return (
            <div className='py-2 position-relative'>
              <div
                className='image-input image-input-outline mb-5'
                data-kt-image-input='true'
                style={{backgroundImage: data_photo || ''}}
              >
                {imageList &&
                  imageList?.length > 0 &&
                  imageList?.map(({dataURL, file}: any, index) => (
                    <img
                      key={index || 0}
                      className='image-input-wrapper'
                      src={dataURL || ''}
                      alt={file?.name || 'Profile Picture'}
                      title={file?.name || 'Profile Picture'}
                      width='125'
                      height='125'
                    />
                  ))}

                {imageProfile && imageList?.length === 0 && (
                  <img
                    className='image-input-wrapper'
                    src={data_photo || ''}
                    alt={imageProfile?.title || 'Profile Picture'}
                    title={imageProfile?.title || 'Profile Picture'}
                    width='125'
                    height='125'
                  />
                )}

                {!imageProfile && (
                  <div
                    className='image-input-wrapper w-125px h-125px'
                    style={{
                      backgroundImage: data_photo || '',
                      backgroundPosition: 'center',
                    }}
                  ></div>
                )}
              </div>
              <Tooltip placement='left' title='Browse'>
                <div
                  className='edit-logo'
                  onClick={(e: any) => {
                    e.preventDefault()

                    if (imageProfile) {
                      onImageUpdate(0)
                    } else {
                      onImageUpload()
                    }
                  }}
                  style={{
                    top: '-5px',
                    position: 'absolute',
                    right: '-10px',
                    boxShadow: '1px 3px 10px rgba(0,0,0,0.2)',
                    backgroundColor: '#fff',
                    padding: '2px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                  }}
                >
                  <KTSVG
                    path='/media/icons/duotone/Navigation/arr013.svg'
                    className='svg-icon-1 mb-3'
                  />
                </div>
              </Tooltip>
              <Tooltip placement='left' title='Reset'>
                <div
                  className='del-logo'
                  onClick={(e: any) => {
                    e.preventDefault()

                    setImages([])
                    setImageProfile(null)
                    setFormChangeAvatar(true)
                  }}
                  style={{
                    top: '32px',
                    position: 'absolute',
                    right: '-10px',
                    boxShadow: '1px 3px 10px rgba(0,0,0,0.2)',
                    backgroundColor: '#fff',
                    padding: '2px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                  }}
                >
                  <KTSVG
                    path='/media/icons/duotone/Navigation/arr015.svg'
                    className='svg-icon-1 mb-3'
                  />
                </div>
              </Tooltip>
            </div>
          )
        }}
      </ImageUploading>

      <div className='p-4 mx-4'>
        <div className='p-1'>
          <b>{user_label || '-'}</b>
        </div>
        <div className='p-1'>{email || '-'}</div>
      </div>
    </div>
  )
}

ImageProfile = memo(ImageProfile)
export {ImageProfile}
