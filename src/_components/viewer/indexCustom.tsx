import {KTSVG} from '@helpers'
import {FC} from 'react'

import {DOCX} from './docx'
import {IMAGE} from './image'
import {PDF} from './pdfEditor'
import {XLSX} from './xlsx'

export const ViewerCustom: FC<any> = ({type, src}) => {
  switch (type?.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'image/jpeg':
    case 'image/png':
      return <IMAGE src={src} />
    case 'pdf':
    case 'application/pdf':
      return <PDF src={src} />
    case 'docx':
    case 'application/document':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return <DOCX src={src} />
    case 'csv':
    case 'xls':
    case 'xlsx':
    case 'application/sheet':
    case 'application/ms-excel':
    case 'application/vnd.ms-excel':
      return <XLSX src={src} />
    default:
      return (
        <div className='my-3'>
          <KTSVG className='svg-icon-5x' path='/media/icons/duotone/Files/File.svg' />
          <p className='text-muted'>This file type is not supported</p>
        </div>
      )
  }
}
