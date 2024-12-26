import {isValidURL, KTSVG, urlToFile} from '@helpers'
import {FC, memo, useEffect, useState} from 'react'
import DocViewer, {DocViewerRenderers} from 'react-doc-viewer'

import {DOCX} from './docx'
import {PDF} from './pdfEditor'
import {Video} from './video'
import {XLSX} from './xlsx'

let ViewerCustom: FC<any> = ({type, src, mode, onChange}) => {
  const [dataFile, setDataFile] = useState<any>([])
  const [_xlsx, setXlsx] = useState<any>([])
  useEffect(() => {
    if (src) {
      if (['pdf', 'application/pdf'].includes(type) && isValidURL(src)) {
        urlToFile(src, '').then((file: any) => {
          const uri: any = file.base64.replace('data:text/html', 'data:application/pdf')
          setDataFile([{uri}])
        })
      } else if (['xlsx', 'application/sheet'].includes(type) && isValidURL(src)) {
        urlToFile(src, '').then((file: any) => {
          const uri: any = file.base64.replace(
            'data:application/sheet',
            'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          )
          setXlsx([{uri}])
        })
      } else {
        setDataFile([{uri: src}])
      }
    }
    return () => {
      setDataFile([])
    }
  }, [src, type])

  if (type && type?.split('/')?.[0] === 'video') {
    return (
      <div className='row'>
        <div className='col-11 ms-5 ps-5 py-5'>
          <Video src={src} />
        </div>
      </div>
    )
  }

  switch (type?.toLowerCase()) {
    case 'csv':
    case 'xls':
    case 'xlsx':
    case 'application/sheet':
    case 'application/ms-excel':
    case 'application/vnd.ms-excel':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return (
        <div className='row'>
          <div className='col-12 px-7'>
            <XLSX src={src} />
          </div>
        </div>
      )
    case 'docx':
    case 'application/document':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return (
        <div className='row'>
          <div className='col-11 ms-5 ps-5 py-5'>
            <DOCX src={src} />
          </div>
        </div>
      )
    case 'pdf':
    case 'application/pdf':
      return (
        <div className='w-100'>
          <PDF src={dataFile[0]?.uri} readOnly={mode !== 'edit'} onChange={onChange} />
        </div>
      )
    default:
      return src !== null && src !== '' ? (
        <DocViewer
          pluginRenderers={DocViewerRenderers}
          documents={dataFile}
          config={{
            header: {
              disableHeader: true,
              disableFileName: true,
              retainURLParams: false,
            },
          }}
          style={{height: 500}}
        />
      ) : (
        <div className='my-3'>
          <KTSVG className='svg-icon-5x' path='/media/icons/duotone/Files/File.svg' />
          <p className='text-muted'>This file type is not supported</p>
        </div>
      )
  }
}

ViewerCustom = memo(ViewerCustom, (prev: any, next: any) => prev?.src === next.src)
export {ViewerCustom}
