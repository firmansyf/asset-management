import {FileUpload} from '@components/FileUpload'
import {configClass, KTSVG, urlToFile} from '@helpers'
import omit from 'lodash/omit'
import uniqBy from 'lodash/uniqBy'
import {FC, Fragment, useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'

type TicketAddFileProps = {
  setFieldValue: any
  validation?: any
  files?: any
}

const TicketAddFile: FC<TicketAddFileProps> = ({setFieldValue, validation, files}) => {
  const [ticketFile, setTicketFile] = useState<any>([])
  const [fileValidation, setFileValidation] = useState<any>([])
  const [messageError, setMessageError] = useState<any>(false)
  const token: any = useSelector(({token}: any) => token, shallowEqual)

  useEffect(() => {
    if (files) {
      const data: any = []
      files?.forEach(({url, title}: any, index: number) =>
        urlToFile(`${url}?token=${token}`, title).then((res: any) => {
          setTicketFile((prev: any) => uniqBy([...prev, res.file], 'name'))
          data[index] = {data: res?.base64, title: res?.file?.name}
        })
      )
      setFieldValue('files', data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const onChangeUploadOtherFile = (e: any) => {
    setFileValidation(removeValidation())
    setTicketFile(ticketFile.concat(e))
    if (e?.[0]) {
      setMessageError(false)
      const data: any = []
      ticketFile?.concat(e)?.forEach((m: any, index: number) => {
        const reader = new FileReader()
        reader.readAsDataURL(m)
        return (reader.onload = () => {
          data[index] = {data: reader.result, title: m?.name}
        })
      })
      setFieldValue('files', data)
    } else {
      setMessageError(true)
    }
  }

  const onOtherFileRemove = (index: any) => {
    let files = ticketFile
    files = files
      .map((m: any, i: any) => {
        let itemReslut: any = m
        i === index && (itemReslut = null)
        return itemReslut
      })
      .filter((f: any) => f)
    const data: any = []
    files.forEach((m: any, index: number) => {
      const reader = new FileReader()
      reader.readAsDataURL(m)
      return (reader.onload = () => {
        data[index] = {data: reader.result, title: m.name}
      })
    })
    setFieldValue('files', data)
    setTicketFile(files)
  }

  return (
    <div className='row mt-8'>
      <div className='col-md-12'>
        <label className={`${configClass.label}`}>Ticket Files</label>
        <FileUpload name='files' multiple onChange={onChangeUploadOtherFile}>
          <button
            type='button'
            className='btn btn-outline btn-bg-light btn-color-gray-600 btn-active-light-primary border-dashed border-primary px-6 py-7 text-start w-100 min-w-150px'
          >
            <KTSVG
              className='svg-icon-3x ms-n1'
              path='/media/icons/duotone/Files/Selected-file.svg'
            />{' '}
            <span className='text-gray-800 pt-6'>Drag a file here or click to upload a file</span>
          </button>
          <p style={{margin: '5px 0px', fontSize: '11px', color: '#7e8299'}}>
            * minimum that can be uploaded is 0.1 MB
          </p>
          {messageError && (
            <span
              className='text-danger'
              style={{margin: '5px 0px', fontStyle: 'italic', fontSize: '11px'}}
            >
              * Your selected file type is not allowed
            </span>
          )}
        </FileUpload>
        {ticketFile.map((file: any, index: any) => (
          <Fragment key={index}>
            {file && (
              <div
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
                        Object.keys(fileValidation || {}).includes(`files.${index}.data`) &&
                        delete validate[`files.${index}.data`]
                      setFileValidation(validate)
                      onOtherFileRemove(index)
                    }}
                  >
                    <KTSVG path='/media/icons/duotone/General/Trash.svg' className='svg-icon-3' />
                  </button>
                </div>
                <div className=''>
                  <img
                    src={`/media/svg/files/upload.svg`}
                    alt=''
                    width='25'
                    style={{marginRight: 5}}
                  />
                  <span className='text-gray-800 pt-6'> {file?.name} </span>
                </div>
                {fileValidation &&
                  Object.keys(fileValidation || {}).includes(`files.${index}.data`) && (
                    <div className='text-danger'>
                      {fileValidation[`files.${index}.data`].replace(`files.${index}.`, '')}
                    </div>
                  )}
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

export {TicketAddFile}
