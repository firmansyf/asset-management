import './style.scss'

import {KTSVG} from '@helpers'
import React, {ReactNode, useEffect} from 'react'
interface ThumbnailsType {
  handleRemove: any
  files: any
}

const Thumbnails: React.FC<ThumbnailsType> = ({files, handleRemove}) => {
  if (files?.length) {
    return files.map((file: {name: string; preview: string}, index: number) => {
      if (index === 0) {
        return (
          <div className='thumbnails' key={index}>
            <img src={file.preview} alt={file.name} width={120} />
            <button
              className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
              onClick={handleRemove}
            >
              <KTSVG path='/media/icons/duotone/General/Trash.svg' className='svg-icon-3' />
            </button>
          </div>
        )
      }
      return null
    })
  } else {
    return (
      <div className='d-flex align-items-center mx-auto image-input-wrapper w-125px h-125px btn btn-outline btn-bg-light btn-color-gray-600 btn-active-light-primary border-dashed border-primary'>
        <div className=''>
          <KTSVG className='svg-icon-3x' path='/media/icons/duotone/Files/Pictures1.svg' />
          <small className='text-gray-800 d-block pt-0'>Browse Image</small>
        </div>
      </div>
    )
  }
}

interface ImagePreviewProps {
  files: string[]
  rootProps: any
  children: ReactNode
  handleRemove: any
}

const ImagePreview: React.FC<ImagePreviewProps> = ({files, rootProps, children, handleRemove}) => {
  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file: any) => URL.revokeObjectURL(file.preview))
    },
    [files]
  )

  return (
    <label htmlFor='inputImage' className='image-preview container'>
      <div {...rootProps}>
        {children}
        <p className='bg-f5 p-2 rounded fs-7 mb-1 d-inline-block mb-3'>
          Drag 'n' drop some files here, or click to select files
        </p>
      </div>
      <Thumbnails handleRemove={handleRemove} files={files} />
    </label>
  )
}

export default ImagePreview
