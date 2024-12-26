import {snapCenterToCursor} from '@components/dnd-kit/util'
import {InputNumber} from '@components/form/InputNumber'
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  rectIntersection,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext as GroupContextProvider,
} from '@dnd-kit/sortable'
import {flatMap} from 'lodash'
import {FC, useEffect, useMemo, useRef, useState} from 'react'

import SortableContext from './group'
import Item from './item'

const WidgetNew: FC<any> = ({
  widget,
  activeWidget,
  setWidget,
  setActiveWidget,
  widgetGrid,
  setWidgetGrid,
  col,
}) => {
  const containerRef: any = useRef()
  const {setNodeRef}: any = useDroppable({id: 'group'})

  const [items, setItems] = useState<any>([])
  const [grid, setGrid] = useState<number>(widgetGrid)
  const [activeIdx, setActiveIdx] = useState<any>(undefined)
  const sensors: any = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

  const column: any = useMemo(
    () =>
      Array(col)
        ?.fill(0)
        ?.map((_arr: any, index: any) => ({value: index + 1, label: index + 1})),
    [col]
  )

  const activeWG: any = items?.find(({guid}: any) => guid === 'active')
  const availableWG: any = items?.find(({guid}: any) => guid === 'available')

  const updateWidget: any = (res: any) => {
    const resAvailable: any = res
      ?.find(({guid}: any) => guid === 'available')
      ?.items?.map((m: any) => {
        m.is_active = 0
        m.is_update = true
        return m
      })
    const resActive: any = res
      ?.find(({guid}: any) => guid === 'active')
      ?.items?.map((m: any) => {
        m.is_active = 1
        m.is_update = true
        return m
      })
    setWidget(resAvailable)
    setActiveWidget(resActive)
  }

  const findContainer: any = (idx: any) => {
    if (items?.find(({guid}: any) => guid === idx)) {
      return items?.find(({guid}: any) => guid === idx)
      // return id
    }
    return items?.find(({items: it}: any) => !!it?.find(({guid}: any) => guid === idx))
  }

  const handleDragStart: any = (e: any) => {
    const {active} = e || {}
    const {id: idx} = active
    const detail: any = flatMap(items, 'items')?.find(({guid}: any) => guid === idx)
    setActiveIdx(detail)
  }

  const handleDragOver: any = (e: any) => {
    const {active, over, draggingRect}: any = e || {}
    const {id: idx}: any = active || {}
    const {id: overId}: any = over || {}

    const activeGroup: any = findContainer(idx)
    const overGroup: any = findContainer(overId)
    if (activeGroup && overGroup && activeGroup?.guid !== overGroup?.guid) {
      const activeItems: any = items?.find(({guid}: any) => guid === activeGroup?.guid)?.items
      const overItems: any = items?.find(({guid}: any) => guid === overGroup?.guid)?.items
      const activeIndex: any = activeItems?.findIndex(({guid}: any) => guid === idx)
      const overIndex: any = overItems?.findIndex(({guid}: any) => guid === overId)

      let newIndex: any
      if (items?.find(({guid}: any) => guid === overId)?.guid) {
        newIndex = overItems?.length + 1
      } else {
        const isBelowLastItem: any =
          over &&
          overIndex === overItems?.length - 1 &&
          draggingRect?.offsetTop > over?.rect?.offsetTop + over?.rect?.height

        const modifier: any = isBelowLastItem ? 1 : 0
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems?.length + 1
      }

      const res: any = items?.map((m: any) => {
        if (m?.guid === activeGroup?.guid) {
          m = {
            ...m,
            items: m?.items
              ?.filter(({guid}: any) => guid !== idx)
              ?.map((group: any, groupIndex: any) => {
                group.order_number = groupIndex + 1
                return group
              }),
          }
        }
        if (m?.guid === overGroup?.guid) {
          m = {
            ...m,
            items: [
              ...m?.items?.slice(0, newIndex),
              items?.find(({guid}: any) => guid === activeGroup?.guid)?.items?.[activeIndex],
              ...m?.items?.slice(newIndex, m?.items?.length),
            ]
              ?.filter((group: any) => group)
              ?.map((group: any, groupIndex: any) => {
                group?.order_number && (group.order_number = groupIndex + 1)
                group?.parent_guid && (group.parent_guid = m?.guid)
                return group
              }),
          }
        }
        return m
      })
      setItems(res)
      updateWidget(res)
    }
  }

  const handleDragEnd: any = (e: any) => {
    const {active, over}: any = e || {}
    const {id: idx}: any = active || {}
    const {id: overId}: any = over || {}

    const activeContainer: any = findContainer(idx)
    const overContainer: any = findContainer(overId)
    if (activeContainer && overContainer && activeContainer?.guid === overContainer?.guid) {
      const overIndex: any = overContainer?.items?.findIndex(({guid}: any) => guid === overId)
      const activeIndex: any = activeContainer?.items?.findIndex(({guid}: any) => guid === idx)
      if (activeIndex !== overIndex) {
        const res: any = items?.map((m: any) => {
          if (m?.guid === overContainer?.guid) {
            m = {
              ...m,
              items: arrayMove(m?.items, activeIndex, overIndex)?.map(
                (group: any, groupIndex: any) => {
                  group.order_number = groupIndex + 1
                  return group
                }
              ),
            }
          }
          return m
        })
        setItems(res)
        updateWidget(res)
      }
      setActiveIdx(undefined)
    }
  }

  const onColumnChange = ({value}: any) => {
    setGrid(value)
    setWidgetGrid(value)
  }

  useEffect(() => {
    const available: any = {
      guid: 'available',
      title: 'Available Widget',
      order_number: 1,
      items: widget,
    }
    const active: any = {
      guid: 'active',
      title: 'Active Widget',
      order_number: 2,
      items: activeWidget,
    }
    setItems([available, active])
  }, [widget, activeWidget])

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      modifiers={[snapCenterToCursor]}
      collisionDetection={rectIntersection}
    >
      <GroupContextProvider
        id='group'
        items={items?.map(({guid}: any) => guid)}
        strategy={rectSortingStrategy}
      >
        <div className='row' ref={setNodeRef}>
          <div className='col-12'>
            <div className='border rounded shadow-xs pb-3'>
              <div className='d-flex w-100 align-items-center p-3 border-bottom mb-3'>
                <div className='btn btn-icon btn-flex w-15px h-15px rounded-circle'>
                  <i className='las la-dot-circle fs-2 mb-1 text-primary' />
                </div>
                <div className='fw-bold text-primary text-nowrap ms-2 fs-5'>WIDGETS</div>
                <div className='separator w-100 border-bottom-4 mx-3' />
                <div className='col-6 col-md-4 col-lg-2'>
                  <InputNumber
                    min={1}
                    max={8}
                    btn={true}
                    nullable={false}
                    defaultValue={widgetGrid || 1}
                    onChange={(e: any) =>
                      onColumnChange(column?.find(({value}: any) => value === e))
                    }
                  />
                </div>
              </div>

              <div className='row' ref={containerRef}>
                {availableWG?.guid && (
                  <SortableContext
                    colItem={1}
                    type='widget'
                    data={availableWG}
                    id={availableWG?.guid}
                    container={containerRef}
                    items={availableWG?.items}
                    className='col-sm-3 mb-6 border-end'
                  />
                )}

                {activeWG?.guid && (
                  <SortableContext
                    type='widget'
                    colItem={grid}
                    data={activeWG}
                    id={activeWG?.guid}
                    items={activeWG?.items}
                    container={containerRef}
                    className='col-sm-9 mb-6'
                  />
                )}

                <DragOverlay
                  className='p-0'
                  adjustScale={false}
                  wrapperElement='div'
                  dropAnimation={null}
                  transition={'transform 0ms ease'}
                >
                  {activeIdx?.guid ? (
                    <div
                      className='bg-white rounded'
                      style={{opacity: 0.75, transform: 'scale(0.75)'}}
                    >
                      <Item type='widget' id={activeIdx?.guid} data={activeIdx} isOverlay={true} />
                    </div>
                  ) : null}
                </DragOverlay>
              </div>
            </div>
          </div>
        </div>
      </GroupContextProvider>
    </DndContext>
  )
}

export default WidgetNew
