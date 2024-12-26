import 'cropperjs/dist/cropper.css'

import {FC, useRef} from 'react'
import Cropper from 'react-cropper'
export const IMAGE: FC<any> = ({src, _title = ''}) => {
  const imageRef = useRef<any>()
  return (
    <div className=''>
      <Cropper
        src={src}
        style={{height: '65vh', width: '100%'}}
        initialAspectRatio={1 / 1}
        aspectRatio={1 / 1}
        guides={false}
        viewMode={2}
        crop={() => false}
        autoCrop={true}
        autoCropArea={1}
        movable={false}
        dragMode='none'
        ref={imageRef}
        cropBoxResizable={false}
        cropBoxMovable={false}
        background={false}
        highlight={false}
        modal={false}
      />
      <div className='d-flex align-items-center justify-content-end m-2 px-5'>
        <i
          className='fa fa-lg fa-undo cursor-pointer text-primary mx-1'
          onClick={() => imageRef?.current?.cropper?.rotate(-90)}
        />
        <i
          className='fa fa-lg fa-redo cursor-pointer text-primary mx-1'
          onClick={() => imageRef?.current?.cropper?.rotate(90)}
        />
        <i
          className='fa fa-lg fa-save cursor-pointer text-primary mx-1'
          onClick={() => {
            const cropper: any = imageRef?.current?.cropper?.getCroppedCanvas().toDataURL()
            const a = document.createElement('a')
            a.href = cropper
            a.download = 'image.jpg'
            a.click()
          }}
        />
      </div>
    </div>
  )
}
