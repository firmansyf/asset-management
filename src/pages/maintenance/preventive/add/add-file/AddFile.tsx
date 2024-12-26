/* eslint-disable react-hooks/exhaustive-deps */
import {FileUpload} from '@components/FileUpload'
import {configClass, KTSVG, urlToFile} from '@helpers'
import {omit, uniqBy} from 'lodash'
import {FC, memo, useEffect, useState} from 'react'
import ImageUploading, {ImageListType} from 'react-images-uploading'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'

type AddFileProps = {
  setFieldValue: any
  validation?: any
  files?: any
}

let AddFile: FC<AddFileProps> = ({setFieldValue, validation, files}) => {
  const token: any = useSelector(({token}: any) => token, shallowEqual)
  const intl = useIntl()
  const [images, setImages] = useState<any>([])
  const [otherFile, setOtherFile] = useState<any>([])
  const [otherDefault, setOtherDefault] = useState<any>([])
  const [fileValidation, setFileValidation] = useState<any>([])
  const [messageErrorOther, setMessageErrorOther] = useState<boolean>(false)

  useEffect(() => {
    if (files) {
      files?.photos &&
        files?.photos?.map(({url, title}: any) =>
          urlToFile(`${url}?token=${token}`, title).then((res: any) => {
            setImages(
              (prev: any) =>
                uniqBy([...prev, {dataURL: res?.base64, file: res?.file}], 'file.name') as never[]
            )
          })
        )
      files?.others &&
        files?.others?.map(({url, title}: any) =>
          urlToFile(`${url}?token=${token}`, title).then((res: any) => {
            setOtherFile((prev: any) => uniqBy([...prev, res?.file], 'name') as never[])
          })
        )
      files?.others &&
        files?.others?.map(({url, title}: any) =>
          urlToFile(`${url}?token=${token}`, title).then((res: any) => {
            setOtherDefault(
              (prev: any) =>
                uniqBy([...prev, {dataURL: res?.base64, file: res?.file}], 'file.name') as never[]
            )
          })
        )
    }
  }, [files])

  useEffect(() => {
    if (otherDefault && otherDefault?.length > 0) {
      const data = otherDefault?.map((m: any) => {
        return {
          data: m?.dataURL,
          title: m?.file?.name,
        }
      })
      setFieldValue('files.others', data)
    } else {
      setFieldValue('files.others', [])
    }
  }, [otherDefault])

  useEffect(() => {
    if (images && images?.length > 0) {
      const data = images?.map((m: any) => {
        return {
          data: m?.dataURL,
          title: m?.file?.name,
        }
      })
      setFieldValue('files.photos', data)
    } else {
      setFieldValue('files.photos', [])
    }
  }, [images])

  useEffect(() => {
    setFileValidation(validation)
  }, [validation])

  const onChangeUploadPhoto = (imageList: ImageListType) => {
    if (imageList?.[0]) {
      const data = imageList?.map((m: any) => {
        return {
          data: m?.dataURL,
          title: m?.file?.name,
        }
      })
      setFieldValue('files.photos', data)
    } else {
      setFieldValue('files.photos', [])
    }
    setImages(imageList as never[])
  }

  const onChangeUploadOtherFile = (e: any) => {
    setFileValidation(removeValidation('others'))
    setOtherFile(otherFile?.concat(e))
    if (e?.[0]) {
      setMessageErrorOther(false)
      const data: any = []
      otherFile?.concat(e)?.forEach((m: any, index: number) => {
        const reader = new FileReader()
        reader.readAsDataURL(m)
        return (reader.onload = () => {
          data[index] = {data: reader?.result, title: m?.name}
        })
      })
      setFieldValue('files.others', data)
    } else {
      setMessageErrorOther(true)
    }
  }

  const onOtherFileRemove = (index: any) => {
    const files = otherFile
    files?.splice(index, 1)
    const data: any = []
    files?.forEach((m: any, index: number) => {
      const reader = new FileReader()
      reader?.readAsDataURL(m)
      return (reader.onload = () => {
        data[index] = {data: reader?.result, title: m?.name}
      })
    })
    setFieldValue('files.others', data)
    setOtherFile([...files])
  }

  const removeValidation = (type: string) => {
    let result: any
    if (fileValidation) {
      result = omit(
        fileValidation,
        Object.keys(fileValidation || {})?.filter((f: string) => f?.split('.')[1] === type)
      )
    }
    return result
  }

  const typeFile: any = [
    'jpg',
    'jpeg',
    'png',
    'image/jpeg',
    'image/png',
    'pdf',
    'application/pdf',
    'doc',
    'docx',
    'application/document',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'csv',
    'xls',
    'xlsx',
    'application/excel',
    'application/vnd.ms-excel',
    'application/x-excel',
    'application/x-msexcel',
    'application/sheet',
    'application/ms-excel',
    'application/x-mpegURL',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-office',
    'video/*',
  ]

  return (
    <div className='row'>
      <div className='col-md-4'>
        <label className={`${configClass.label}`}>01. Upload Image</label>
        <ImageUploading
          value={images}
          onChange={onChangeUploadPhoto}
          maxNumber={3}
          multiple
          // acceptType={['jpg', 'gif', 'png']}
        >
          {({
            imageList,
            onImageUpload,
            onImageUpdate,
            onImageRemove,
            // isDragging,
            dragProps,
            errors,
          }) => (
            // write your building UI
            <div className='upload__image-wrapper'>
              <button
                type='button'
                {...dragProps}
                onClick={(e: any) => {
                  e.preventDefault()
                  onImageUpload()
                }}
                className='btn btn-outline btn-bg-light btn-color-gray-600 btn-active-light-primary border-dashed border-primary px-6 py-7 text-start w-100 min-w-150px'
              >
                <KTSVG
                  className='svg-icon-3x ms-n1'
                  path='/media/icons/duotone/Files/Pictures1.svg'
                />
                <span className='text-gray-800 d-block pt-6'>
                  {intl.formatMessage({id: 'DRAG_FILE_HERE_OR_CLICK_TO_UPLOAD_A_FILE'})}
                </span>
              </button>
              <p
                style={{
                  margin: '5px 0px',
                  fontStyle: 'italic',
                  fontSize: '11px',
                  color: '#7e8299',
                }}
              >
                * Maximum upload 3 files
              </p>
              <div className='my-2'>
                {errors?.maxNumber && (
                  <span
                    className='text-danger'
                    style={{margin: '5px 0px', fontStyle: 'italic', fontSize: '11px'}}
                  >
                    * You posted more than 3 images
                  </span>
                )}
                {errors?.acceptType && (
                  <span
                    className='text-danger'
                    style={{margin: '5px 0px', fontStyle: 'italic', fontSize: '11px'}}
                  >
                    * {intl.formatMessage({id: 'YOUR_SELECTED_FILE_TYPE_IS_NOT_ALLOW'})}
                  </span>
                )}
              </div>
              {imageList?.map((image, index) => (
                <div
                  key={index}
                  className='image-item my-3 border-dashed border-muted'
                  style={{position: 'relative', padding: '5px'}}
                >
                  <img src={image?.dataURL} alt='' style={{width: '100%'}} />
                  <div
                    className='image-item__btn-wrapper'
                    style={{marginTop: '-38px', marginLeft: '5px', position: 'absolute'}}
                  >
                    <button
                      className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                      onClick={(e: any) => {
                        e.preventDefault()
                        onImageUpdate(index)
                      }}
                    >
                      <KTSVG
                        path='/media/icons/duotone/Communication/Write.svg'
                        className='svg-icon-3'
                      />
                    </button>
                    <button
                      className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                      onClick={(e: any) => {
                        e.preventDefault()
                        const validate = fileValidation
                        fileValidation &&
                          Object.keys(fileValidation || {}).includes(
                            `files.photos.${index}.data`
                          ) &&
                          delete validate[`files.photos.${index}.data`]
                        setFileValidation(validate)
                        onImageRemove(index)
                      }}
                    >
                      <KTSVG path='/media/icons/duotone/General/Trash.svg' className='svg-icon-3' />
                    </button>
                  </div>
                  <div>{image?.file?.name}</div>
                  {fileValidation &&
                    Object.keys(fileValidation || {}).includes(`files.photos.${index}.data`) && (
                      <div className='text-danger'>
                        {fileValidation[`files.photos.${index}.data`].replace(
                          `files.photos.${index}.`,
                          ''
                        )}
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </ImageUploading>
      </div>

      <div className='col-md-4'>
        <label className={`${configClass.label}`}>02. Upload Other Files</label>
        <FileUpload
          name='other'
          multiple
          onChange={onChangeUploadOtherFile}
          accept={typeFile.join(',') || ''}
        >
          <button
            type='button'
            className='btn btn-outline btn-bg-light btn-color-gray-600 btn-active-light-primary border-dashed border-primary px-6 py-7 text-start w-100 min-w-150px'
          >
            <KTSVG
              className='svg-icon-3x ms-n1'
              path='/media/icons/duotone/Files/Selected-file.svg'
            />
            <span className='text-gray-800 d-block pt-6'>
              {intl.formatMessage({id: 'DRAG_FILE_HERE_OR_CLICK_TO_UPLOAD_A_FILE'})}
            </span>
          </button>
          {messageErrorOther && (
            <span
              className='text-danger'
              style={{margin: '5px 0px', fontStyle: 'italic', fontSize: '11px'}}
            >
              * {intl.formatMessage({id: 'YOUR_SELECTED_FILE_TYPE_IS_NOT_ALLOW'})}
            </span>
          )}
        </FileUpload>
        {otherFile?.map((file: any, index: any) => (
          <div
            key={index}
            className='file-item my-3 bg-light p-2 border-dashed border-muted'
            style={{position: 'relative'}}
          >
            {file?.name}
            <div
              className='file-item__btn-wrapper'
              style={{top: '-10px', position: 'absolute', right: '-10px'}}
            >
              <button
                className='btn btn-icon btn-bg-light btn-color-danger btn-active-color-danger btn-sm me-1'
                onClick={(e: any) => {
                  e.preventDefault()
                  const validate = fileValidation
                  fileValidation &&
                    Object.keys(fileValidation || {}).includes(`files.others.${index}.data`) &&
                    delete validate[`files.others.${index}.data`]
                  setFileValidation(validate)
                  onOtherFileRemove(index)
                }}
              >
                <KTSVG path='/media/icons/duotone/General/Trash.svg' className='svg-icon-3' />
              </button>
            </div>
            <div className=''>
              {/*<img src={`/media/svg/files/${file.name.split('.').pop()}.svg`} alt="" width="25" style={{marginRight: 5}} />*/}
              <img src={`/media/svg/files/upload.svg`} alt='' width='25' style={{marginRight: 5}} />
              <span className=''> {file?.file?.name} </span>
            </div>
            {fileValidation &&
              Object.keys(fileValidation || {}).includes(`files.others.${index}.data`) && (
                <div className='text-danger'>
                  {fileValidation[`files.others.${index}.data`].replace(
                    `files.others.${index}.`,
                    ''
                  )}
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  )
}

AddFile = memo(AddFile, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default AddFile
