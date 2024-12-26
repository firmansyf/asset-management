import Tooltip from '@components/alert/tooltip'
import {useDroppable} from '@dnd-kit/core'
import {
  rectSortingStrategy,
  SortableContext as SortableContextProvider,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import {IMG} from '@helpers'
import {FC, useMemo, useState} from 'react'

import Item from './item'

const Index: FC<any> = ({
  items,
  id,
  data,
  gridStep,
  isOverlay,
  onAddGroup,
  onEditGroup,
  onDeleteGroup,
  setActiveCollapseGuid,
  overlayCollapseGuid,
  minOfCllientHeight,
}) => {
  const {setNodeRef} = useDroppable({id})
  const [isCollapse, setIsCollapse] = useState<any>(undefined)
  const [showEdit, setShowEdit] = useState<boolean>(false)
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

  const gridItem: any = useMemo<any>(() => {
    switch (gridStep) {
      case 1:
        return 4
      case 2:
        return 6
      case 3:
        return 12
      default:
        return 4
    }
  }, [gridStep])

  const onToggle: any = () => {
    setIsCollapse(isCollapse ? undefined : id)
    setActiveCollapseGuid(id, !isCollapse)
  }

  if (!id) {
    return (
      <div className={`col-${isOverlay ? 12 : 12 / gridStep} h-100 mb-6`}>
        <div className={minOfCllientHeight ? 'p-1' : `p-2`}>
          <div
            style={{
              height:
                gridStep > 2
                  ? minOfCllientHeight < 100
                    ? `${minOfCllientHeight}px`
                    : 'calc(60vh - 1rem)'
                  : '100%',
              minHeight: `${minOfCllientHeight < 100 ? minOfCllientHeight : 100}px`,
              opacity: 0.75,
            }}
            className='d-flex flex-center w-100 border border-primary border-dashed radius-10 bg-ff'
          >
            <div className='btn btn-sm btn-light-primary' onClick={onAddGroup}>
              Add Group
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <SortableContextProvider
      id={id}
      items={items?.map(({guid}: any) => guid)}
      strategy={gridStep > 2 ? verticalListSortingStrategy : rectSortingStrategy}
    >
      <div
        className={`col-${isOverlay ? 12 : 12 / gridStep} h-100 mb-6`}
        ref={sortableGroup}
        style={style}
      >
        <div className={`px-5 py-1 border rounded shadow-xs pb-3 dnd-container`}>
          <div className='d-flex w-100 align-items-center py-3 border-bottom mb-3'>
            <div
              className='d-flex align-items-center overflow-hidden'
              style={{width: `calc(100% - ${gridStep > 2 ? '55px' : '70px'})`}}
              onMouseEnter={() => setShowEdit(true)}
              onMouseLeave={() => setShowEdit(false)}
            >
              <div className=''>
                {showEdit ? (
                  <div className='d-flex flex-center'>
                    <Tooltip placement='top' title='Edit Group'>
                      <div
                        onClick={onEditGroup}
                        className='btn btn-icon btn-flex w-25px h-25px bg-light-warning border border-warning radius-10'
                      >
                        <i className='las la-pencil-alt text-primary' />
                      </div>
                    </Tooltip>
                    <Tooltip placement='top' title='Delete Group'>
                      <div
                        onClick={onDeleteGroup}
                        className='btn btn-icon btn-flex w-25px h-25px bg-light-danger border border-danger radius-10 ms-2'
                      >
                        <i className='las la-trash-alt text-primary' />
                      </div>
                    </Tooltip>
                  </div>
                ) : (
                  <div className='btn btn-icon btn-flex w-25px h-25px rounded-circle'>
                    <i className='las la-dot-circle fs-2x text-primary' />
                  </div>
                )}
              </div>
              <div
                className={`fw-bolder space-1 text-primary text-uppercase text-nowrap mx-2 ${
                  gridStep > 2 ? 'fs-9' : ''
                }`}
                style={{userSelect: 'none'}}
              >
                {data?.label}
              </div>
              <div className='separator w-100 border-bottom-4' />
            </div>
            <div className='d-flex flex-center ms-auto'>
              <Tooltip active={!isOverlay && !isDragging} placement='top' title='Order Group'>
                <div
                  className='d-flex flex-center bg-light-primary w-25px h-25px radius-50'
                  {...attributes}
                  {...listeners}
                >
                  <i className='las la-arrows-alt fs-5 text-primary' />
                </div>
              </Tooltip>
              <div className='d-flex flex-center ms-2 cursor-pointer' onClick={onToggle}>
                <i
                  className={`las la-angle-${
                    isCollapse || overlayCollapseGuid?.includes(id) ? 'down' : 'up'
                  } fs-3 text-primary`}
                />
              </div>
            </div>
          </div>
          <div
            className={`row ${
              isCollapse === id || overlayCollapseGuid?.includes(id) ? 'd-none' : ''
            }`}
            ref={setNodeRef}
            style={gridStep > 2 ? {overflow: 'auto', maxHeight: '50vh'} : {}}
          >
            {items.length ? (
              items?.map((m: any, index: number) => (
                <div className={`col-sm-${gridItem} px-2 my-2`} key={`${index}-${m?.guid}`}>
                  <Item data={m} id={m?.guid} />
                </div>
              ))
            ) : (
              <div className='col-12'>
                <div className='d-flex flex-center h-100px mt-2 mb-3 border border-gray-400 border-dashed radius-10 bg-fb opacity-50'>
                  <div className='text-center'>
                    <IMG path={'/media/svg/others/drag-and-drop.png'} className={'w-50px'} />
                    <p className='mb-0 mt-1 text-primary fs-8' style={{lineHeight: 1.2}}>
                      Drop here to add form
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SortableContextProvider>
  )
}

export default Index
