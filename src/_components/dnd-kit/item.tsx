import {useSortable} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import {FC, useState} from 'react'

import Field from './itemCase'
const Index: FC<any> = ({id, data, isOverlay}) => {
  const [isHover, setIsHover] = useState<boolean>(false)
  const {active, over, attributes, listeners, setNodeRef, transform, isDragging, overIndex} =
    useSortable({id})

  const style: any = {
    transform: CSS?.Transform?.toString(transform)
      ?.replace(/scaleY\((.*)\)/gi, 'scaleY(1)')
      ?.replace(/scaleX\((.*)\)/gi, 'scaleX(1)'),
    opacity: isDragging ? 0.35 : 1,
    height: active && isDragging && overIndex >= 0 ? over?.rect?.height : '100%',
    transition: active && !isDragging && !isOverlay ? 'transform 200ms ease 0s' : 'unset',
    boxShadow: isHover ? '0 2rem 5rem 1rem rgb(0 0 0 / 7.5%)' : 'unset',
    zIndex: 2,
  }

  return (
    <div
      className='w-100 cursor-move radius-10'
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div
        className={`d-flex h-100 overflow-hidden py-2 rounded ${
          isDragging
            ? 'flex-center bg-light-primary border border-dashed border-primary'
            : 'border-gray-400'
        }`}
        style={{transform: isHover && !isDragging ? 'scale(0.9)' : 'scale(1)'}}
      >
        {isDragging ? (
          <div className='fw-bolder text-primary'>PUT HERE</div>
        ) : (
          <div className='w-100 position-relative'>
            <div
              className={`fw-bold fs-8 mb-1 text-uppercase ${data?.is_required ? 'required' : ''}`}
            >
              {data?.label || 'Label'}
            </div>
            <Field data={data} />
            <div className='position-absolute w-100 h-100 start-0 top-0' style={{zIndex: 3}} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Index
