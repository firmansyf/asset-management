import {useDroppable} from '@dnd-kit/core'
import {
  SortableContext as SortableContextProvider,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import {FC} from 'react'

import {AsideMenuItem} from '../AsideMenuItem'
import {AsideMenuItemWithSub} from '../AsideMenuItemWithSub'
import SortableContext from './Level3'

const Index: FC<any> = ({items, id, data, disabled, isOverlay, onVisibilityChange}) => {
  const {setNodeRef} = useDroppable({id})
  const {
    active,
    over,
    attributes,
    listeners,
    setNodeRef: sortableGroup,
    transform,
    isDragging,
    overIndex,
  } = useSortable({id})

  const style: any = {
    transform: CSS?.Transform?.toString(transform)
      ?.replace(/scaleY\((.*)\)/gi, 'scaleY(1)')
      ?.replace(/scaleX\((.*)\)/gi, 'scaleX(1)'),
    opacity: isDragging ? 0.35 : 1,
    height: active && isDragging && overIndex >= 0 ? over?.rect?.height : '100%',
    transition: active && !isDragging ? 'transform 200ms ease 0s' : 'unset',
  }

  return (
    <SortableContextProvider
      id={id}
      items={(items || [])?.map(({guid}: any) => guid)}
      strategy={verticalListSortingStrategy}
      disabled={disabled}
    >
      <div
        className={`col-12 position-relative ${!disabled && 'pe-0 ps-5'}`}
        ref={sortableGroup}
        style={style}
      >
        {!disabled && !isOverlay && (
          <>
            <div className='mt-2 ms-5 position-absolute start-0' style={{zIndex: 7}}>
              <div
                className={`btn btn-${
                  data?.is_show ? 'primary' : 'muted'
                } btn-icon w-15px h-15px radius-50`}
                onClick={() =>
                  onVisibilityChange({
                    level: 1,
                    guid: data?.guid,
                    is_show: data?.is_show === 1 ? 0 : 1,
                  })
                }
              >
                <i className={`las la-${data?.is_show ? 'eye' : 'eye-slash'} fs-6`} />
              </div>
            </div>
            <div
              className='me-13 mt-2 position-absolute end-0'
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
        {items && items?.length ? (
          <div
            className={
              isDragging
                ? 'bg-light-primary border border-dashed border-primary'
                : 'border-gray-400'
            }
            ref={setNodeRef}
          >
            <AsideMenuItemWithSub
              to={disabled ? `/${data?.path || ''}` : '#'}
              title={data?.name || 'Menu'}
              fontIcon={data?.icon}
              hasBullet={!data?.icon}
              className={`opacity-${data?.is_show ? '100' : '25'}`}
            >
              {items
                ?.filter(({is_show}: any) => (disabled ? [1] : [0, 1])?.includes(is_show))
                ?.map((m: any, index: number) => (
                  <SortableContext
                    disabled={disabled}
                    data={m}
                    key={index}
                    id={m?.guid}
                    items={m?.children?.data}
                    onVisibilityChange={onVisibilityChange}
                  />
                ))}
            </AsideMenuItemWithSub>
          </div>
        ) : (
          <div
            className={
              isDragging
                ? 'bg-light-primary border border-dashed border-primary'
                : 'border-gray-400'
            }
          >
            <AsideMenuItem
              to={disabled ? `/${data?.path || ''}` : '#'}
              title={data?.name || 'Menu'}
              fontIcon={data?.icon}
              hasBullet={!data?.icon}
              truncate={!disabled}
              className={`opacity-${data?.is_show ? '100' : '25'}`}
            />
          </div>
        )}
      </div>
    </SortableContextProvider>
  )
}

export default Index
