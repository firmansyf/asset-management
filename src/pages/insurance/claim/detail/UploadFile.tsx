/* eslint-disable react-hooks/exhaustive-deps */
import 'cropperjs/dist/cropper.css'

import {FileUpload} from '@components/FileUpload'
import {ToastMessage} from '@components/toast-message'
import {ViewerCustom} from '@components/viewer/indexViewCustom'
import {configClass, KTSVG} from '@helpers'
import {getDetailDocument} from '@pages/setup/insurance/claim-document/Service'
import {Field, Form, Formik} from 'formik'
import {head} from 'lodash'
import {FC, memo, useEffect, useRef, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import Cropper from 'react-cropper'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import Select from 'react-select'
import {ClearIndicator, customStyles, DropdownIndicator} from 'src/_components/select/config'

import {addDocument, addInvoice, editDocument, editInvoice} from '../Service'

let ModalUploadInvoice: FC<any> = ({
  detail,
  showModal,
  setShowModal,
  setReload,
  reload,
  type,
  id,
  idDoc,
  isCurrentPeril,
  onSubmit,
  mode,
  optionRO,
}) => {
  const intl: any = useIntl()
  const token: any = useSelector(({token}: any) => token, shallowEqual)
  const cropperRef: any = useRef(null)

  const [image, setImage] = useState<any>()
  const [src, setSRC] = useState<any>(null)
  const [rot, setRotate] = useState<any>(0)
  const [result, setResult] = useState<any>('')
  const [typeFile, setType] = useState<any>('')
  const [options, setOptions] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [nameDocument, setNameDocument] = useState<any>('')
  const [isAvailable, setIsAvailable] = useState<boolean>(true)
  const [messageErrorUpload, setMessageErrorUpload] = useState<boolean>(false)

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
    if (detail !== undefined && detail !== null) {
      const {url, title, mime_type}: any = detail || {}

      if (url !== null) {
        toDataURL(url, (dataUrl: any) => {
          setImage({
            data: dataUrl || '',
            title: title || '',
          })
          setSRC(dataUrl || '')
          setType(mime_type || '')
        })
      }
    } else {
      setImage(undefined)
      setSRC(null)
      setType('')
    }
  }, [detail, showModal])

  useEffect(() => {
    if (idDoc !== undefined && idDoc !== '') {
      getDetailDocument(idDoc).then(({data: {data: res}}: any) => {
        res && setNameDocument(res?.name)
      })
    }
  }, [idDoc])

  useEffect(() => {
    if (optionRO !== undefined && optionRO !== '') {
      const dataOption: any =
        optionRO &&
        optionRO?.length > 0 &&
        optionRO?.map((ro: any) => {
          return {
            value: ro?.guid || '',
            label: ro?.ro_number || '',
          }
        })

      setOptions(dataOption as never[])
    }
  }, [optionRO])

  const onCrop = () => {
    const imageElement: any = cropperRef?.current
    const cropper: any = imageElement?.cropper
    setResult(cropper?.getCroppedCanvas()?.toDataURL())
  }

  const rotateImage = (v: any) => {
    let rotate = v + 90
    if (v === 270) {
      rotate = 0
    }
    const imageElement: any = cropperRef?.current
    const cropper: any = imageElement?.cropper
    cropper?.rotate(rotate)
    cropper?.render()
    setResult(cropper?.getCroppedCanvas()?.toDataURL())
  }

  const onChangeUploadInvoice = (e: any) => {
    // setInvoice(invoice.concat(e))
    if (e[0]) {
      setMessageErrorUpload(false)
      let data: any = ''
      e?.forEach((m: any) => {
        const reader: any = new FileReader()
        reader.readAsDataURL(m)
        reader.onload = () => {
          const {name, type: type_file} = m
          data = {data: reader.result, title: name}
          setType(type_file)

          setSRC(reader?.result)
          setImage(data)
        }
      })
    } else {
      setMessageErrorUpload(true)
    }
  }

  const typeFileEx: any = [
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
    'video/*',
    'message/rfc822',
    'application/x-mpegURL',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/rtf',
    'application/vnd.ms-outlook',
    'application/vnd.ms-office',
  ]

  const handleSubmit = (value: any) => {
    setLoading(true)
    if (type === 'invoice') {
      if (detail) {
        const {guid} = detail
        const params = {
          files: [
            {
              comments: value?.comment || '',
              ro_guid: value?.ro_number?.value || '',
              data: result || image?.data,
              title: image?.title,
            },
          ],
        }
        editInvoice(params, id, guid)
          .then(({data: {message}}: any) => {
            setRotate(0)
            setSRC(null)
            setLoading(false)
            setShowModal(false)
            setReload(reload + 1)
            ToastMessage({message, type: 'success'})
          })
          .catch(({response}: any) => {
            setLoading(false)
            if (response) {
              const {devMessage, data, message}: any = response?.data || {}
              const {fields}: any = data || {}

              if (!devMessage) {
                if (fields === undefined) {
                  ToastMessage({message, type: 'error'})
                } else {
                  Object.keys(fields || {})?.map((item: any) => {
                    if (item !== 'file.data' && item !== 'file.title') {
                      ToastMessage({message: fields?.[item]?.[0] || '', type: 'error'})
                    }
                    return true
                  })
                }
              }
            }
          })
      } else {
        const params: any = {
          files: [
            {
              comments: value?.comment || '',
              ro_guid: value?.ro_number?.value || '',
              data: result || image?.data,
              title: image?.title,
            },
          ],
        }
        addInvoice(params, id)
          .then(({data: {message}}: any) => {
            setRotate(0)
            setSRC(null)
            setLoading(false)
            setShowModal(false)
            setReload(reload + 1)
            ToastMessage({message, type: 'success'})
          })
          .catch(({response}: any) => {
            setLoading(false)
            if (response) {
              const {devMessage, data, message}: any = response?.data || {}
              const {fields}: any = data || {}

              if (!devMessage) {
                if (fields === undefined) {
                  ToastMessage({message, type: 'error'})
                } else {
                  Object.keys(fields || {})?.map((item: any) => {
                    if (item !== 'file.data' && item !== 'file.title') {
                      ToastMessage({message: fields?.[item]?.[0] || '', type: 'error'})
                    }
                    return true
                  })
                }
              }
            }
          })
      }
    }

    if (isAvailable && image === undefined) {
      setLoading(false)
      ToastMessage({type: 'error', message: 'File document is required'})
    } else {
      if (type === 'document') {
        if (detail) {
          const {guid}: any = detail || {}
          let params: any = {
            comments: value?.comment || '',
            insurance_claim_document_guid: idDoc,
            is_available: isAvailable,
          }

          if (isAvailable) {
            params = {
              ...params,
              file: {
                data: result || image?.data,
                title: image?.title,
              },
            }
          }
          onSubmit && onSubmit(params)
          if (!isCurrentPeril) {
            setLoading(false)
            setShowModal(false)
            setRotate(0)
            setSRC(null)
          }
          // }

          isCurrentPeril &&
            editDocument(params, id, guid)
              .then(({data: {message}}: any) => {
                setRotate(0)
                setSRC(null)
                setLoading(false)
                setShowModal(false)
                setReload(reload + 1)
                ToastMessage({message, type: 'success'})
              })
              .catch(({response}: any) => {
                setLoading(false)
                if (response) {
                  const {devMessage, data, message}: any = response?.data || {}
                  const {fields}: any = data || {}

                  if (!devMessage) {
                    if (fields === undefined) {
                      ToastMessage({message, type: 'error'})
                    } else {
                      Object.keys(fields || {})?.map((item: any) => {
                        if (item !== 'file.data' && item !== 'file.title') {
                          ToastMessage({message: fields?.[item]?.[0] || '', type: 'error'})
                        }
                        return true
                      })
                    }
                  }
                }
              })
        } else {
          let params: any = {
            comments: value?.comment || '',
            insurance_claim_document_guid: idDoc,
            is_available: isAvailable,
          }

          if (isAvailable) {
            params = {
              ...params,
              file: {
                data: result || image?.data,
                title: image?.title,
              },
            }
          }
          onSubmit && onSubmit(params)
          // }

          addDocument(params, id)
            .then(({data: {message}}: any) => {
              setRotate(0)
              setSRC(null)
              setLoading(false)
              setShowModal(false)
              setReload(reload + 1)
              ToastMessage({message, type: 'success'})
            })
            .catch(({response}: any) => {
              setLoading(false)
              if (response) {
                const {devMessage, data, message}: any = response?.data || {}
                const {fields} = data || {}

                if (!devMessage) {
                  if (fields === undefined) {
                    ToastMessage({message, type: 'error'})
                  } else {
                    Object.keys(fields || {})?.map((item: any) => {
                      if (item !== 'file.data' && item !== 'file.title') {
                        ToastMessage({message: fields?.[item]?.[0] || '', type: 'error'})
                      }
                      return true
                    })
                  }
                }
              }
            })
        }
      }
    }
  }

  return (
    <Modal dialogClassName='modal-lg' show={showModal} onHide={() => setShowModal(false)}>
      <Formik
        initialValues={{
          comment: detail?.comments || '',
          ro_number:
            detail !== undefined && detail?.ro_guid !== null && detail?.ro_number !== null
              ? {value: detail?.ro_guid, label: detail?.ro_number}
              : head(options),
        }}
        // validationSchema={ManufacturerSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({setFieldValue, values}: any) => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title style={{textDecoration: 'capitalize'}}>
                {detail ? 'Edit' : 'Add'} {type}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {type === 'invoice' && (
                <div className='row mt-4 mb-4'>
                  <div className='col-md-2'>
                    <label className={`${configClass?.label} mt-2`} htmlFor='comment'>
                      RO Number
                    </label>
                  </div>
                  <div className='col-md-4'>
                    <Select
                      noOptionsMessage={(e: any) => (e.inputValue = 'No Data...')}
                      name='ro_number'
                      placeholder='Select RO number'
                      value={values?.ro_number}
                      styles={customStyles(true, {})}
                      components={{ClearIndicator, DropdownIndicator}}
                      isClearable={true}
                      options={options}
                      onChange={(e: any) => {
                        setFieldValue('ro_number', e || {})
                      }}
                    />
                  </div>
                </div>
              )}
              <div>
                {type === 'document' && (
                  <>
                    <div className='mb-4'>
                      <label
                        className={`${configClass.label} mt-2`}
                        htmlFor='category'
                        style={{
                          color: '#7e8299',
                          fontStyle: 'italic',
                          fontWeight: 500,
                          fontSize: '12px',
                        }}
                      >
                        Document Category : {nameDocument || '-'}
                      </label>
                    </div>

                    <div className='mb-4'>
                      <label className={`${configClass?.label} mt-2`} htmlFor='is_available'>
                        <input
                          type='checkbox'
                          name='is_available'
                          id='is_available'
                          checked={isAvailable}
                          onChange={() => setIsAvailable(!isAvailable)}
                          style={{position: 'relative', top: '2px'}}
                        />
                        <span className='form-check-label mx-2'>Document Available</span>
                      </label>
                    </div>
                  </>
                )}

                {isAvailable && (
                  <>
                    <div className='mb-4'>
                      <FileUpload
                        name='invoice'
                        onChange={onChangeUploadInvoice}
                        accept={typeFileEx?.join(',') || ''}
                      >
                        <button
                          type='button'
                          className='btn btn-outline btn-bg-light btn-color-gray-600 btn-active-light-primary border-dashed border-primary px-3 py-4 text-center w-100 min-w-150px'
                        >
                          <KTSVG
                            className='svg-icon-2x ms-n1'
                            path='/media/icons/duotone/Files/File.svg'
                          />
                          <span className='text-gray-800 pt-6'>
                            {intl.formatMessage({id: 'DRAG_FILE_HERE_OR_CLICK_TO_UPLOAD_A_FILE'})}
                          </span>
                        </button>
                        {messageErrorUpload && (
                          <div className='my-2'>
                            <span className='text-danger'>
                              {intl.formatMessage({id: 'YOUR_SELECTED_FILE_TYPE_IS_NOT_ALLOW'})}
                            </span>
                          </div>
                        )}
                      </FileUpload>
                    </div>
                    <div className='mt-5 text-center'>
                      {/* {image && <img alt='img-document' width={300} src={result} />} */}
                      {!!typeFile && typeFile?.indexOf('image') >= 0 ? (
                        <>
                          {src && (
                            <>
                              <Cropper
                                src={src}
                                style={{height: 400, width: '100%'}}
                                // Cropper.js options
                                // initialAspectRatio={16 / 9}
                                autoCropArea={1}
                                guides={false}
                                cropend={onCrop}
                                ref={cropperRef}
                                checkCrossOrigin={false}
                                modal={false}
                                background={true}
                                viewMode={2}
                              />
                              <Button className='mt-5' onClick={() => rotateImage(rot)}>
                                Rotate
                              </Button>
                            </>
                          )}
                        </>
                      ) : (
                        !messageErrorUpload &&
                        showModal &&
                        typeFile && (
                          <ViewerCustom
                            src={src}
                            mode={mode}
                            type={typeFile}
                            onChange={(e: any) => {
                              setResult(e)
                              setImage((prev: any) => ({...prev, data: e}))
                            }}
                          />
                        )
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className='mt-4'>
                <label className={`${configClass?.label} mt-2`} htmlFor='comment'>
                  Comment / Description
                </label>
                <Field
                  name='comment'
                  as='textarea'
                  type='text'
                  placeholder='Enter Comment / Description'
                  className={configClass?.form}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                disabled={loading}
                className='btn-sm'
                type='submit'
                form-id=''
                variant='primary'
              >
                {!loading && <span className='indicator-label'>Submit</span>}
                {loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </Button>
              <Button className='btn-sm' variant='secondary' onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

ModalUploadInvoice = memo(
  ModalUploadInvoice,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default ModalUploadInvoice
