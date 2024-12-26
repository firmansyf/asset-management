import {FileUpload} from '@components/FileUpload'
import {KTSVG, urlToFile} from '@helpers'
import {omit, uniqBy} from 'lodash'
import {FC, Fragment, useEffect, useState} from 'react'

type PaymentFileProps = {
  setFieldValue: any
  validation?: any
  files?: any
  configClass?: any
}

const PaymentFile: FC<PaymentFileProps> = ({setFieldValue, validation, files, configClass}) => {
  const [deliveryFile, setDeliveryFile] = useState<any>([])
  const [fileValidation, setFileValidation] = useState<any>([])

  useEffect(() => {
    if (Object.keys(files || {})?.length > 0) {
      files?.map(({url, title}: any) =>
        urlToFile(url, title).then(({file}: any) => {
          setDeliveryFile((prev: any) => uniqBy([...prev, file], 'file.name'))
        })
      )
    }
  }, [files])

  useEffect(() => {
    setFileValidation(validation)
  }, [validation])

  const removeValidation = () => {
    let result: any
    if (fileValidation) {
      result = omit(fileValidation, Object.keys(fileValidation || {}))
    }
    return result
  }

  const onChangeUploadFile = (e: any) => {
    setFileValidation(removeValidation())
    setDeliveryFile(deliveryFile?.concat(e))
    if (e?.[0]) {
      const data: any = []
      deliveryFile?.concat(e)?.forEach((m: any, index: number) => {
        const reader = new FileReader()
        reader.readAsDataURL(m)
        return (reader.onload = () => {
          data[index] = {data: reader?.result || '', title: m?.name || ''}
        })
      })
      setFieldValue('files', data)
    }
  }

  const onOtherFileRemove = (index: any) => {
    const data: any = []
    let files: any = deliveryFile || []
    files = files
      ?.map((m: any, i: any) => {
        let result: any = m
        i === index && (result = null)
        return result
      })
      ?.filter((f: any) => f)

    files?.forEach((m: any, index: number) => {
      const reader = new FileReader()
      reader.readAsDataURL(m)
      return (reader.onload = () => {
        data[index] = {data: reader?.result || '', title: m?.name || ''}
      })
    })
    setFieldValue('files', data)
    setDeliveryFile(files)
  }

  return (
    <div className='row mt-8'>
      <div className='col-md-12'>
        <label htmlFor='files' className={`${configClass?.label} required`}>
          Upload Payment Files
        </label>

        <FileUpload name='files' multiple onChange={onChangeUploadFile}>
          <button
            type='button'
            className='btn btn-outline btn-bg-light btn-color-gray-600 btn-active-light-primary border-dashed border-primary px-6 py-7 text-start w-100 min-w-150px'
          >
            <KTSVG
              className='svg-icon-3x ms-n1'
              path='/media/icons/duotone/Files/Selected-file.svg'
            />
            <span className='text-gray-800 pt-6'>Drag a file here or click to upload a file</span>
          </button>

          <p style={{margin: '5px 0px', fontSize: '11px', color: '#7e8299'}}>
            * minimum that can be uploaded is 0.1 MB
          </p>
        </FileUpload>

        {deliveryFile &&
          deliveryFile?.length > 0 &&
          deliveryFile?.map((file: any, index: any) => {
            const indexKey: any = index + 1

            return (
              <Fragment key={indexKey}>
                {file && (
                  <div
                    className='file-item my-3 bg-light p-2 border-dashed border-muted'
                    style={{position: 'relative'}}
                  >
                    {file?.name || '-'}
                    <div
                      className='file-item__btn-wrapper'
                      style={{top: '-10px', position: 'absolute', right: '-10px'}}
                    >
                      <button
                        className='btn btn-icon btn-bg-light btn-color-danger btn-active-color-danger btn-sm me-1'
                        onClick={(e: any) => {
                          e?.preventDefault()
                          const validate: any = fileValidation || {}
                          fileValidation &&
                            Object.keys(fileValidation || {})?.includes(`files.${index}.data`) &&
                            delete validate[`files.${index}.data`]
                          setFileValidation(validate || {})
                          onOtherFileRemove(index || 0)
                        }}
                      >
                        <KTSVG
                          path='/media/icons/duotone/General/Trash.svg'
                          className='svg-icon-3'
                        />
                      </button>
                    </div>

                    <div className=''>
                      <img
                        alt=''
                        width='25'
                        style={{marginRight: 5}}
                        src={`/media/svg/files/upload.svg`}
                      />
                      <span className='text-gray-800 pt-6'> {file?.file?.name || '-'} </span>
                    </div>

                    {fileValidation &&
                      Object.keys(fileValidation || {})?.includes(`files.${index}.data`) && (
                        <div className='text-danger'>
                          {fileValidation?.[`files.${index}.data`]?.replace(`files.${index}.`, '')}
                        </div>
                      )}
                  </div>
                )}
              </Fragment>
            )
          })}
      </div>
    </div>
  )
}

export {PaymentFile}
