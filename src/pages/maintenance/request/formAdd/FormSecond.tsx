/* eslint-disable react-hooks/exhaustive-deps */
import {getLocationV1} from '@api/Service'
import {AddInputBtn} from '@components/button/Add'
import {FileUpload} from '@components/FileUpload'
import {Title as FormTitle} from '@components/form/Title'
import {Select as AjaxSelect} from '@components/select/ajax'
import {configClass, KTSVG, urlToFile} from '@helpers'
import {getAssetLite} from '@pages/maintenance/Service'
import {ErrorMessage} from 'formik'
import {uniqBy} from 'lodash'
import {FC, useEffect, useState} from 'react'
import ImageUploading, {ImageListType} from 'react-images-uploading'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'

import {getMaintenanceCategory, getPriorityMaintenance} from '../core/service'

type Props = {
  setFieldValue: any
  detail: any
  setPhoto: any
  values: any
  endRecuringDate: any
  setEndRecuringDate: any
  setDetailMaintenanceCategory: any
  setShowModalMaintenanceCategory: any
  reloadMaintenanceCategory: any
  setLocationDetail: any
  setShowModalLocation: any
  database: any
}

const FormSecond: FC<Props> = ({
  setFieldValue,
  detail,
  setPhoto,
  values,
  setDetailMaintenanceCategory,
  setShowModalMaintenanceCategory,
  reloadMaintenanceCategory,
  setLocationDetail,
  setShowModalLocation,
  database,
}) => {
  const intl: any = useIntl()
  const token: any = useSelector(({token}: any) => token, shallowEqual)

  const [images, setImages] = useState<any>([])
  const [otherFile, setOtherFile] = useState<any>([])
  const [otherDefault, setOtherDefault] = useState<any>([])
  const [fileValidation, setFileValidation] = useState<any>([])
  const [resetOption, setResetOption] = useState<boolean>(false)
  const [clearOption, setClearOption] = useState<boolean>(false)

  const {
    location_guid: databaseLocation,
    maintenance_category_guid: databaseCategory,
    maintenance_priority_guid: databasePriority,
    asset_guid: databaseAssetLocation,
  }: any = database || {}

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

  const onChangeUploadOtherFile = (e: any) => {
    setOtherFile(otherFile?.concat(e))
    if (e?.[0]) {
      const data: any = []
      e?.forEach((m: any, index: number) => {
        const reader = new FileReader()
        reader.readAsDataURL(m)
        return (reader.onload = () => {
          data[index] = {data: reader?.result, title: m?.name}
        })
      })
      setFieldValue('file', data)
    }
  }

  const onOtherFileRemove = (index: any) => {
    const files = otherFile || []
    files?.splice(index, 1)
    const data: any = []
    files?.forEach((m: any, index: number) => {
      const reader = new FileReader()
      reader.readAsDataURL(m)
      return (reader.onload = () => {
        data[index] = {data: reader?.result, title: m?.name}
      })
    })
    setFieldValue('file', data)
    setOtherFile([...files])
  }

  const onChangeUploadImageVideo = (imageList: ImageListType) => {
    if (imageList[0]) {
      const dataUpload = imageList?.map((m: any) => {
        return {
          data: m?.dataURL,
          title: m?.file?.name,
        }
      })
      setPhoto(dataUpload as never[])
      setFieldValue('photo')
    } else {
      setFieldValue([])
    }
    setImages(imageList as never[])
  }

  useEffect(() => {
    const {photos, file} = detail || {}
    photos &&
      photos?.map(({url, title}: any) =>
        urlToFile(`${url}?token=${token}`, title).then((res: any) => {
          setImages(
            (prev: any) =>
              uniqBy([...prev, {dataURL: res?.base64, file: res?.file}], 'file.name') as never[]
          )
        })
      )
    file &&
      file?.map(({url, title}: any) =>
        urlToFile(`${url}?token=${token}`, title).then((res: any) => {
          setOtherFile((prev: any) => uniqBy([...prev, res?.file], 'name') as never[])
        })
      )
    file &&
      file?.map(({url, title}: any) =>
        urlToFile(`${url}?token=${token}`, title).then((res: any) => {
          setOtherDefault(
            (prev: any) =>
              uniqBy([...prev, {dataURL: res?.base64, file: res?.file}], 'file.name') as never[]
          )
        })
      )
  }, [detail])

  useEffect(() => {
    if (otherDefault && otherDefault?.length > 0) {
      const data = otherDefault?.map((m: any) => {
        return {
          data: m?.dataURL,
          title: m?.file?.name,
        }
      })
      setFieldValue('file', data)
    } else {
      setFieldValue('file', [])
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
      setFieldValue('photo', data)
      setPhoto(data as never[])
    } else {
      setFieldValue('photo', [])

      setPhoto([])
    }
  }, [images])

  return (
    <>
      {databaseCategory?.is_selected && (
        <div className={configClass?.grid}>
          <label
            htmlFor='maintenance_category_guid'
            className={`${configClass?.label} ${databaseCategory?.is_required ? 'required' : ''}`}
          >
            {databaseCategory?.label || 'Work Orders Category'}
          </label>
          <div className='d-flex align-items-center input-group input-group-solid'>
            <AjaxSelect
              sm={true}
              className='col p-0'
              api={getMaintenanceCategory}
              name='maintenance_category_guid'
              reload={reloadMaintenanceCategory}
              params={{orderCol: 'name', orderDir: 'asc'}} // params={{page: 1, limit: 3000}}
              parse={({guid, name}: any) => ({value: guid, label: name})}
              placeholder={`Choose ${databaseCategory?.label || 'Work Orders Category'}`}
              defaultValue={{value: detail?.category_guid, label: detail?.category_name}}
              onChange={(e: any) => setFieldValue('maintenance_category_guid', e?.value || '')}
            />
            <AddInputBtn
              size={'sm'}
              onClick={() => {
                setShowModalMaintenanceCategory(true)
                setDetailMaintenanceCategory(undefined)
              }}
            />
          </div>
          {databaseCategory?.is_required && (
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name='maintenance_category_guid' />
            </div>
          )}
        </div>
      )}
      {databasePriority?.is_selected && (
        <div className={configClass?.grid}>
          <label
            htmlFor='priority_guid'
            className={`${configClass?.label} ${databasePriority?.is_required ? 'required' : ''}`}
          >
            {databasePriority?.label || 'Priority'}
          </label>
          <AjaxSelect
            sm={true}
            name='maintenance_priority_guid'
            className='col p-0'
            api={getPriorityMaintenance}
            params={false}
            reload={false}
            parse={({guid, name}: any) => ({value: guid, label: name})}
            placeholder={`Choose ${databasePriority?.label || 'Priority'}`}
            defaultValue={{value: detail?.priority_guid, label: detail?.priority_name}}
            onChange={({value}: any) => setFieldValue('maintenance_priority_guid', value || '')}
          />
          {databasePriority?.is_required && (
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name='maintenance_priority_guid' />
            </div>
          )}
        </div>
      )}
      {databaseLocation?.is_selected && (
        <div className={configClass?.grid}>
          <label
            htmlFor='location_guid'
            className={`${configClass.label} ${
              databaseLocation?.is_required ? 'required' : 'required'
            }`}
          >
            {databaseLocation?.label || 'Location'}
          </label>
          <div className='d-flex align-items-center input-group input-group-solid'>
            <AjaxSelect
              className='col p-0'
              api={getLocationV1}
              isClearable={false}
              name='location_guid'
              sm={configClass?.size === 'sm'}
              params={{orderCol: 'name', orderDir: 'asc'}}
              parse={({guid, name}: any) => ({value: guid, label: name})}
              placeholder={`Choose ${databaseLocation?.label || 'Location'}`}
              defaultValue={{value: detail?.location_guid, label: detail?.location_name}}
              onChange={({value}: any) => {
                setFieldValue('location_guid', value)
                if (value === '' || value !== detail?.location_guid) {
                  setFieldValue('asset_guid', '')
                  setResetOption(true)
                  setClearOption(true)
                }
              }}
            />
            <AddInputBtn
              size={'sm'}
              onClick={() => {
                setLocationDetail(undefined)
                setShowModalLocation(true)
              }}
            />
          </div>
          {databaseLocation?.is_required && (
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name='location_guid' />
            </div>
          )}
        </div>
      )}
      {databaseAssetLocation?.is_selected && (
        <div className={configClass?.grid}>
          <label
            htmlFor='asset_guid'
            className={`${configClass?.label} ${
              databaseAssetLocation?.is_required ? 'required' : ''
            }`}
          >
            {databaseAssetLocation?.label || 'Asset by location'}
          </label>

          <AjaxSelect
            name='asset_guid'
            api={getAssetLite}
            className='col p-0'
            isClearable={false}
            clearOption={clearOption}
            resetOption={resetOption}
            sm={configClass?.size === 'sm'}
            setResetOption={setResetOption}
            defaultValue={values?.asset_guid || {}}
            onChange={(e: any) => setFieldValue('asset_guid', e)}
            parse={({guid, name}: any) => ({value: guid, label: name})}
            placeholder={`Choose ${databaseAssetLocation?.label || 'Asset by location'}`}
            params={{orderCol: 'name', orderDir: 'asc', guid: values?.location_guid || '0'}}
          />
          {databaseAssetLocation?.is_required && (
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name='asset_guid' />
            </div>
          )}
        </div>
      )}
      <div className='col-lg-12'>
        <FormTitle title='Request Files' sticky={false} />
      </div>
      <div className='col-lg-6'>
        <label className={`${configClass?.label}`}>01. Upload Image</label>
        <ImageUploading
          value={images}
          onChange={onChangeUploadImageVideo}
          maxNumber={4}
          multiple
          acceptType={['jpg', 'gif', 'png', 'pdf', 'xlxs']}
        >
          {({imageList, onImageUpload, onImageUpdate, onImageRemove, dragProps, errors}) => (
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
                  path='/media/icons/duotone/Interface/Image.svg'
                />
                <span className='text-gray-800 d-block pt-6'>
                  {intl.formatMessage({id: 'DRAG_FILE_HERE_OR_CLICK_TO_UPLOAD_A_FILE'})}
                </span>
              </button>
              <div className='my-2'>
                {errors?.acceptType && (
                  <span className='text-danger'>
                    {intl.formatMessage({id: 'YOUR_SELECTED_FILE_TYPE_IS_NOT_ALLOW'})}
                  </span>
                )}
              </div>
              <div className='row'>
                {imageList?.map((image, index) => (
                  <div
                    key={index}
                    className='image-item my-3 border-dashed border-muted col-3 mx-2'
                    style={{position: 'relative', padding: '5px'}}
                  >
                    <img src={image?.dataURL} alt='' style={{width: '100%'}} />
                    <div
                      className='image-item__btn-wrapper'
                      style={{
                        marginTop: '-38px',
                        marginLeft: '5px',
                        position: 'absolute',
                      }}
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
                            Object.keys(fileValidation || {})?.includes(
                              `files.photos.${index}.data`
                            ) &&
                            delete validate[`files.photos.${index}.data`]
                          setFileValidation(validate)
                          onImageRemove(index)
                        }}
                      >
                        <KTSVG
                          path='/media/icons/duotone/General/Trash.svg'
                          className='svg-icon-3'
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ImageUploading>
      </div>
      <div className='col-lg-6'>
        <label className={`${configClass?.label}`}>02. Upload Files</label>
        <FileUpload
          name='file'
          multiple
          onChange={onChangeUploadOtherFile}
          accept={typeFile?.join(',') || ''}
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
        </FileUpload>
        {otherFile?.map((_file: any, index) => (
          <div
            key={index}
            className='file-item my-3 bg-light p-2 border-dashed border-muted'
            style={{position: 'relative'}}
          >
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
                    Object.keys(fileValidation || {})?.includes(`file.${index}.data`) &&
                    delete validate[`file.${index}.data`]
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
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export {FormSecond}
