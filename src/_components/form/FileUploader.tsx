import {Modal} from '@components/alert/modal'
import Tooltip from '@components/alert/tooltip'
import {SimpleLoader} from '@components/loader/list'
import {KTSVG, urlToBase64} from '@helpers'
import {DragEvent, FC, useEffect, useRef, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'

export const FileUploader: FC<any> = ({defaultValue, onChange, accept}) => {
  const inputFileRef: any = useRef()
  const token: any = useSelector(({token}: any) => token, shallowEqual)
  const [files, setFiles] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [detail, setDetail] = useState<any>({})
  const [showModalView, setShowModalView] = useState<boolean>(false)
  const [isDragging, setIsDragging] = useState<boolean>(false)

  useEffect(() => {
    if (defaultValue) {
      setLoading(true)

      const tmpFiles: any = Promise.all(
        defaultValue?.map(async ({url, title, mime_type, guid}: any) => {
          const base64: any = await urlToBase64(`${url}?token=${token}`)
          const res: any = {data: base64, title, type: mime_type, guid}
          return res
        })
      )

      tmpFiles?.then((e: any) => {
        setFiles(e)
        onChange(e?.map(({data, title, guid}: any) => ({data, title, guid})))
        setLoading(false)
      })
    }
  }, [defaultValue, token, onChange])

  const onChangeImage = () => {
    const inputFiles: any = inputFileRef?.current?.files
    const sources: any = Array.from(inputFiles || [])
    if (sources?.length && sources?.[0]) {
      sources?.forEach((src: any) => {
        const reader: any = new FileReader()
        reader.readAsDataURL(src)
        return (reader.onload = () => {
          setFiles((prev: any) => {
            const isOverSize: any = Number(src?.size) > 5000000
            const merged = prev?.concat({
              data: reader?.result,
              title: src?.name,
              type: src?.type,
              errors: isOverSize ? (prev?.errors || [])?.concat('Max 5mb') : prev?.errors,
            })
            onChange(
              merged?.map(({data, title, guid, errors}: any) => ({data, title, guid, errors}))
            )
            return merged
          })
        })
      })

      inputFileRef.current.value = ''
    }
  }

  const onRemove = (index: any) => {
    const res: any = files
      ?.map((m: any, i: any) => {
        let item: any = m
        i === index && (item = null)
        return item
      })
      ?.filter((f: any) => f)
    setFiles(res)
    onChange(res?.map(({data, title, guid, errors}: any) => ({data, title, guid, errors})))
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const inputFiles: any = e.dataTransfer.files
    const sources: any = Array.from(inputFiles || [])
    if (sources?.length && sources?.[0]) {
      sources?.forEach((src: any) => {
        const reader: any = new FileReader()
        reader.readAsDataURL(src)
        return (reader.onload = () => {
          setFiles((prev: any) => {
            const isOverSize: any = Number(src?.size) > 5000000
            const merged = prev?.concat({
              data: reader.result,
              title: src?.name,
              type: src?.type,
              errors: isOverSize ? (prev?.errors || [])?.concat('Max 5mb') : prev?.errors,
            })
            onChange(
              merged?.map(({data, title, guid, errors}: any) => ({data, title, guid, errors}))
            )
            return merged
          })
        })
      })
      inputFileRef.current.value = ''
    }
  }

  return (
    <>
      <div
        className={`btn btn-flex btn-outline bg-light border-dashed border-primary px-4 py-3 text-start w-100 ${
          isDragging ? 'opacity-100' : 'opacity-75'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputFileRef?.current?.click()}
      >
        <KTSVG className='svg-icon-2x ms-n1' path='/media/icons/duotone/Interface/Image.svg' />
        <div className='fs-7 text-primary'>Drag a file here</div>
      </div>
      <input
        type='file'
        className='d-none'
        ref={inputFileRef}
        multiple={true}
        accept={accept}
        onChange={onChangeImage}
      />

      {loading ? (
        <div className='row mx-n2 mt-3'>
          <SimpleLoader count={3} height={75} className='col' />
        </div>
      ) : (
        <div className='row mx-n2 mt-3'>
          {files?.map(({data, type, title, errors}: any, index: number) => (
            <div key={title} className='col-auto px-2 mb-3'>
              <Tooltip placement='top' title={title}>
                <div
                  className={`position-relative h-75px w-75px rounded border bg-gray-100 ${
                    Array.isArray(errors) && errors?.length
                      ? 'border-danger cursor-na'
                      : 'border-gray-300'
                  }`}
                  style={{
                    background: type?.startsWith('image')
                      ? `#fff url(${data}) center / cover no-repeat`
                      : `inherit`,
                  }}
                  onClick={() => {
                    if (!errors?.length) {
                      setDetail({data, type, title})
                      setShowModalView(true)
                    }
                  }}
                >
                  {!type?.startsWith('image') && (
                    <div className='d-flex flex-center h-100'>
                      <div className='text-center'>
                        <KTSVG
                          className='svg-icon-3x'
                          path='/media/icons/duotone/Interface/File.svg'
                        />
                        <div className='text-primary fs-9 fw-bold'>
                          {title?.split('.')?.slice(-1)?.[0]}
                        </div>
                      </div>
                    </div>
                  )}

                  {errors?.map((error: any) => (
                    <div className='fw-bold fs-9 text-danger mt-1' key={error}>
                      {error}
                    </div>
                  ))}

                  <div className='position-absolute top-0 end-0 mt-n2 me-n2'>
                    <button
                      className='btn btn-danger radius-50 btn-icon h-15px w-15px'
                      onClick={(e: any) => {
                        e.stopPropagation()
                        onRemove(index)
                      }}
                    >
                      <i className='las la-times fs-8' />
                    </button>
                  </div>
                </div>
              </Tooltip>
            </div>
          ))}
        </div>
      )}

      <Modal
        show={showModalView}
        setShow={setShowModalView}
        title={detail?.title}
        header={false}
        footer={false}
        bodyClass='p-0'
      >
        {detail?.type?.includes('image') ? (
          <div
            className='w-100'
            style={{
              height: '50vh',
              background: `#fff url(${detail?.data}) center / contain no-repeat`,
            }}
          />
        ) : (
          <object
            style={{height: '50vh'}}
            className='w-100'
            data={detail?.data}
            type={detail?.type}
          >
            <div className='text-center h-200px d-flex flex-center text-gray-500'>
              File does not support for view
            </div>
          </object>
        )}
      </Modal>
    </>
  )
}
