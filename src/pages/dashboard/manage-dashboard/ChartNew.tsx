import {snapCenterToCursor} from '@components/dnd-kit/util'
import {RadioNumber} from '@components/form/radio'
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
import {rectSortingStrategy, SortableContext as GroupContextProvider} from '@dnd-kit/sortable'
import {debounce, flatMap} from 'lodash'
import {FC, useEffect, useMemo, useRef, useState} from 'react'

import SortableContext from './group'
import Item from './item'

const Index: FC<any> = ({
  chart,
  activeChart,
  setChart,
  setActiveChart,
  chartGrid,
  setChartGrid,
  col,
}) => {
  const containerRef: any = useRef()
  const {setNodeRef}: any = useDroppable({id: 'group'})
  const sensors: any = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

  const [items, setItems] = useState<any>([])
  const [grid, setGrid] = useState<number>(chartGrid)
  const [activeIdx, setActiveIdx] = useState<any>(undefined)

  const availableCH: any = items?.find(({guid}: any) => guid === 'available')
  const activeCH: any = items?.find(({guid}: any) => guid === 'active')

  const column: any = useMemo(
    () =>
      Array(col)
        ?.fill(0)
        ?.map((_ar: any, index: any) => ({value: index + 1, label: index + 1})),
    [col]
  )

  const updateChart: any = (res: any) => {
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

    setChart(resAvailable)
    setActiveChart(resActive)
  }

  const findContainer: any = (idx: any) => {
    if (items?.find(({guid}: any) => guid === idx)) {
      return items?.find(({guid}: any) => guid === idx)
      // return id
    }
    return items?.find(({items: it}: any) => !!it?.find(({guid}: any) => guid === idx))
  }

  const handleDragStart: any = (e: any) => {
    const {active}: any = e || {}
    const {id: idx}: any = active || {}
    const detail: any = flatMap(items, 'items')?.find(({guid}: any) => guid === idx)
    setActiveIdx(detail)
  }

  const handleDragOver: any = debounce(
    (e: any) => {
      const {active, over, draggingRect}: any = e || {}
      const {id: idx}: any = active || {}
      const {id: overId}: any = over || {}

      const activeGroup: any = findContainer(idx)
      const overGroup: any = findContainer(overId)
      if (activeGroup && overGroup) {
        const overItems: any = items?.find(({guid}: any) => guid === overGroup?.guid)?.items
        const activeItems: any = items?.find(({guid}: any) => guid === activeGroup?.guid)?.items
        const overIndex: any = overItems?.findIndex(({guid}: any) => guid === overId)
        const activeIndex: any = activeItems?.findIndex(({guid}: any) => guid === idx)

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
        updateChart(res)
      }
    },
    100,
    {leading: false, trailing: true}
  )

  const onColumnChange = ({value}: any) => {
    setGrid(value)
    setChartGrid(value)
  }

  const onSelectGridFromChart: any = (value: any, selected: any) => {
    const res: any = activeChart?.map((m: any, index: number) => {
      m.order_number = index + 1
      m.is_update = true
      if (m?.guid === selected?.guid) {
        m.grid = value
        m.setting_column = value
      } else {
        m.setting_column = m?.setting_column || 1
      }
      return m
    })

    setActiveChart(res)
  }

  useEffect(() => {
    const available: any = {
      guid: 'available',
      title: 'Available Chart',
      order_number: 1,
      items: chart,
    }

    const active: any = {
      guid: 'active',
      title: 'Active Chart',
      order_number: 2,
      items: activeChart,
    }
    setItems([available, active])
  }, [chart, activeChart])

  return (
    <DndContext
      sensors={sensors}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      modifiers={[snapCenterToCursor]}
      collisionDetection={rectIntersection}
      // onDragEnd={handleDragEnd}
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

                <div className='fw-bold text-primary text-nowrap ms-2 fs-5'>CHARTS</div>
                <div className='separator w-100 border-bottom-4 mx-3' />

                <RadioNumber
                  name='chart'
                  defaultChecked={chartGrid}
                  variant='primary'
                  onChange={onColumnChange}
                  options={column}
                />
              </div>

              <div className='row' ref={containerRef}>
                {availableCH?.guid && (
                  <SortableContext
                    colItem={1}
                    type='chart'
                    data={availableCH}
                    id={availableCH?.guid}
                    container={containerRef}
                    items={availableCH?.items}
                    className='col-sm-3 mb-6 pe-0 border-end'
                  />
                )}

                {activeCH?.guid && (
                  <SortableContext
                    type='chart'
                    colItem={grid}
                    data={activeCH}
                    id={activeCH?.guid}
                    items={activeCH?.items}
                    container={containerRef}
                    className='col-sm-9 mb-6 ps-0'
                    onSelectGridFromChart={onSelectGridFromChart}
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
                      <Item type='chart' id={activeIdx?.guid} data={activeIdx} isOverlay={true} />
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

export default Index
