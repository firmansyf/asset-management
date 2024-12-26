import {useSortable} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import {FC, useState} from 'react'

import {AsideMenuItem} from '../AsideMenuItem'

const Index: FC<any> = ({id, data, isOverlay, disabled, onVisibilityChange}) => {
  const [isHover, setIsHover] = useState<boolean>(false)
  const {active, over, attributes, listeners, setNodeRef, transform, isDragging, overIndex} =
    useSortable({id})

  const style: any = {
    transform: CSS?.Transform?.toString(transform)
      ?.replace(/scaleY\((.*)\)/gi, 'scaleY(1)')
      ?.replace(/scaleX\((.*)\)/gi, 'scaleX(1)'),
    opacity: isDragging ? 0.5 : 1,
    height: active && isDragging && overIndex >= 0 ? over?.rect?.height : '100%',
    transition: active && !isDragging && !isOverlay ? 'transform 200ms ease 0s' : 'unset',
    background: isHover ? 'unset' : 'unset',
  }

  return (
    <div
      className='w-100 cursor-move radius-10 position-relative'
      style={style}
      ref={setNodeRef}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {!disabled && !isOverlay && (
        <>
          <div className='mt-2 ms-n2 position-absolute start-0' style={{zIndex: 7}}>
            <div
              className={`btn btn-${
                data?.is_show ? 'primary' : 'muted'
              } btn-icon w-15px h-15px radius-50`}
              onClick={() =>
                onVisibilityChange({
                  level: 3,
                  guid: data?.guid,
                  is_show: data?.is_show === 1 ? 0 : 1,
                })
              }
            >
              <i className={`las la-${data?.is_show ? 'eye' : 'eye-slash'} fs-6`} />
            </div>
          </div>
          <div
            className='ms-6 mt-2 position-absolute start-0'
            style={{zIndex: 2}}
            {...attributes}
            {...listeners}
          >
            <div className='h-20px w-20px d-flex flex-center rounded btn btn-icon btn-light-primary'>
              <i className='las la-braille fs-5' />
            </div>
          </div>
        </>
      )}
      <div
        className={`${
          isDragging ? 'bg-light-primary border border-dashed border-primary' : 'border-gray-400'
        }`}
        style={{transform: isHover && !isDragging ? 'scale(1)' : 'scale(1)'}}
      >
        <AsideMenuItem
          to={disabled ? `/${data?.path || ''}` : '#'}
          title={data?.name || 'Menu'}
          hasBullet={true}
          truncate={!disabled}
          className={`opacity-${data?.is_show ? '100' : '50'}`}
        />
      </div>
    </div>
  )
}

export default Index
