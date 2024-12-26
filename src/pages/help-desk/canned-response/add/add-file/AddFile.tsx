import {FileUpload} from '@components/FileUpload'
import {configClass, KTSVG, urlToFile} from '@helpers'
import {omit} from 'lodash'
import {FC, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'

type AddFileProps = {
  setFieldValue: any
  validation?: any
  files?: any
}

const AddFile: FC<AddFileProps> = ({setFieldValue, validation, files}) => {
  const intl = useIntl()
  const [File, setFile] = useState<any>([])
  const [fileValidation, setFileValidation] = useState<any>([])
  const [messageErrorFile, setMessageErrorFile] = useState<boolean>(false)

  useEffect(() => {
    if (files) {
      const File: any = []
      files &&
        files?.map(({url, title}: any) =>
          urlToFile(url, title).then((res: any) => {
            File.push({
              dataURL: res.base64 || '',
              file: {name: title || ''},
            })
            setFile(File as never[])
          })
        )
    }
  }, [files])

  useEffect(() => {
    setFileValidation(validation)
  }, [validation])

  const onChangeUploadFile = (e: any) => {
    setFileValidation(removeValidation('files'))
    setFile(File.concat(e))
    if (e[0]) {
      setMessageErrorFile(false)
      const data: any = []
      File.concat(e).forEach((m: any, index: number) => {
        const reader = new FileReader()
        reader.readAsDataURL(m)
        return (reader.onload = () => {
          data[index] = {data: reader.result, title: m.name}
        })
      })
      setFieldValue('files', data)
    } else {
      setMessageErrorFile(true)
    }
  }

  const onFileRemove = (index: any) => {
    const files = File
    files.splice(index, 1)
    const data: any = []
    files.forEach((m: any, index: number) => {
      const reader = new FileReader()
      reader.readAsDataURL(m)
      return (reader.onload = () => {
        data[index] = {data: reader.result, title: m.name}
      })
    })
    setFieldValue('files', data)
    setFile([...files])
  }

  const removeValidation = (type: string) => {
    let result: any
    if (fileValidation) {
      result = omit(
        fileValidation,
        Object.keys(fileValidation || {})?.filter((f: string) => f.split('.')[1] === type)
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
    'video/*',
  ]

  return (
    <div className='row'>
      <div className='col-md-4'>
        <label htmlFor='file' className={`${configClass?.label}`}>
          Attach Files
        </label>
        <FileUpload
          name='files'
          multiple
          onChange={onChangeUploadFile}
          accept={typeFile.join(',') || ''}
        >
          <button
            type='button'
            className='d-flex align-items-center image-input-wrapper h-100px btn btn-outline btn-bg-light btn-color-gray-600 btn-active-light-primary border-dashed border-primary'
          >
            <div className='w-100'>
              <KTSVG className='svg-icon-3x' path='/media/icons/duotone/Files/Pictures1.svg' />
              <small className='text-gray-800 d-block pt-0'>
                Drag a file here or <u className='fw-bolder text-primary'>Click</u> to upload file
              </small>
            </div>
          </button>
          {messageErrorFile && (
            <span
              className='text-danger'
              style={{margin: '5px 0px', fontStyle: 'italic', fontSize: '11px'}}
            >
              * {intl.formatMessage({id: 'YOUR_SELECTED_FILE_TYPE_IS_NOT_ALLOW'})}
            </span>
          )}
        </FileUpload>
        {File?.map((file: any, index: any) => (
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
                  e?.preventDefault()
                  const validate = fileValidation
                  fileValidation &&
                    Object.keys(fileValidation || {})?.includes(`files.${index}.data`) &&
                    delete validate[`files.${index}.data`]
                  setFileValidation(validate)
                  onFileRemove(index)
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
              Object.keys(fileValidation || {})?.includes(`files.${index}.data`) && (
                <div className='text-danger'>
                  {fileValidation[`files.${index}.data`].replace(`files.${index}.`, '')}
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AddFile
