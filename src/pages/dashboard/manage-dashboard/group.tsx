import {useDroppable} from '@dnd-kit/core'
import {
  rectSortingStrategy,
  SortableContext as SortableContextProvider,
  useSortable,
} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import cx from 'classnames'
import {FC} from 'react'

import Item from './item'

const Index: FC<any> = ({
  items,
  id,
  className,
  colItem,
  type,
  onSelectGridFromChart,
  container,
}) => {
  const {
    active,
    over,
    setNodeRef: sortableGroup,
    transform,
    isDragging,
    overIndex,
  }: any = useSortable({id})
  const {setNodeRef}: any = useDroppable({id})

  const style: any = {
    transform: CSS?.Transform?.toString(transform)
      ?.replace(/scaleY\((.*)\)/gi, 'scaleY(1)')
      ?.replace(/scaleX\((.*)\)/gi, 'scaleX(1)'),
    opacity: isDragging ? 0.35 : 1,
    height:
      active && isDragging && overIndex >= 0
        ? over?.rect?.height
        : container?.current?.clientHeight || '100%',
    maxHeight: '35vh',
    transition: active && !isDragging ? 'transform 200ms ease 0s' : 'unset',
  }

  return (
    <SortableContextProvider
      id={id}
      items={items?.map(({guid}: any) => guid)}
      strategy={rectSortingStrategy}
    >
      <div className={className} ref={sortableGroup} style={style}>
        <div ref={setNodeRef} style={{maxHeight: '35vh', overflow: 'auto'}}>
          {items?.length ? (
            <div className={colItem === 1 ? 'row mx-5 ms-2' : 'row mx-5 me-2'}>
              {items?.map((m: any, index: number) => (
                <div
                  className={cx(
                    'd-flex align-items-center px-2',
                    `mb-${id === 'active' ? 3 : 1}`,
                    type === 'chart'
                      ? `col-md-${(m?.setting_column || 1) * (12 / (colItem || 1))}`
                      : `col grid-md-${colItem}`
                  )}
                  key={`${index}-${m?.guid}`}
                >
                  {id === 'available' && (
                    <div className='ms-1 me-2 w-15px fw-bold fs-7 text-primary'>{index + 1}.</div>
                  )}
                  <Item
                    data={m}
                    group={id}
                    type={type}
                    id={m?.guid}
                    grid={colItem}
                    onSelectGridFromChart={onSelectGridFromChart}
                  />
                </div>
              ))}

              {id === 'active' && (
                <div className='col d-flex flex-column'>
                  <div className='h-100 w-100 pb-3'>
                    <div className='p-3 cursor-pointer h-100 d-flex align-items-center justify-content-center text-center radius-10 border border-dashed border-ee bg-fc'>
                      <span className='fw-bold color-aa fs-8'>
                        Drop <span className='text-capitalize'>{type}</span> on "Available
                        <span className='text-capitalize'> {type}</span>s" here
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className='row m-0'>
              <div className='col d-flex flex-column'>
                <div className='h-100 w-100 py-3'>
                  <div className='p-3 cursor-pointer h-100 d-flex align-items-center justify-content-center text-center radius-10 border border-dashed border-ee bg-fc'>
                    <span className='fw-bold color-aa fs-8'>
                      Drop <span className='text-capitalize'>{type}</span> on "Available
                      <span className='text-capitalize'> {type}</span>s" here
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SortableContextProvider>
  )
}

export default Index
