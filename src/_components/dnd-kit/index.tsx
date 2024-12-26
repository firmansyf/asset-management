import {PageLoader} from '@components/loader/cloud'
import {DndContext, DragOverlay, rectIntersection, useDroppable} from '@dnd-kit/core'
import {
  arrayMove,
  horizontalListSortingStrategy,
  rectSortingStrategy,
  SortableContext as GroupContextProvider,
} from '@dnd-kit/sortable'
import {debounce, flatMap} from 'lodash'
import {FC, useEffect, useLayoutEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'

import {Toolbar} from '../layout/Toolbar'
import SortableContext from './group'
import Item from './item'
import {snapCenterToCursor} from './util'

const Index: FC<any> = ({
  data,
  loading,
  onChange = () => undefined,
  onSave,
  onAddGroup,
  onEditGroup,
  onDeleteGroup,
}) => {
  const {setNodeRef} = useDroppable({id: 'group'})
  const navigate: any = useNavigate()
  const [items, setItems] = useState<any>([])
  const [activeIdx, setActiveIdx] = useState<any>(undefined)
  const [gridStep, setGridStep] = useState<any>(1)
  const [isGroup, setIsgroup] = useState<boolean>(false)
  const [activeCollapseGuid, setActiveCollapseGuid] = useState<any>([])
  const [minOfCllientHeight, setminOfCllientHeight] = useState<number | undefined>(0)

  useEffect(() => {
    setItems(data)
  }, [data])

  useLayoutEffect(() => {
    const minHeight: any = Array.from(document.querySelectorAll('.dnd-container'))?.map(
      ({clientHeight}: any) => clientHeight
    )
    setminOfCllientHeight(Math.min(...minHeight))
  }, [activeCollapseGuid])

  const findContainer: any = (id: any) => {
    if (items?.find(({guid}: any) => guid === id)) {
      return items?.find(({guid}: any) => guid === id)
      // return id
    }
    return items?.find(({forms}: any) => !!forms?.find(({guid}: any) => guid === id))
  }
  const handleDragStart: any = debounce((e: any) => {
    const {active} = e || {}
    const {id, data} = active
    let detail: any
    if (data?.current?.sortable?.containerId === 'group') {
      setIsgroup(true)
      detail = items?.find(({guid}: any) => guid === id)
    } else {
      setIsgroup(false)
      detail = flatMap(items, 'forms')?.find(({guid}: any) => guid === id)
    }
    setActiveIdx(detail)
  }, 100)
  const handleDragOver: any = debounce((e: any) => {
    const {active, over, draggingRect} = e || {}
    const {id} = active || {}
    const {id: overId} = over || {}

    const activeGroup: any = findContainer(id)
    const overGroup: any = findContainer(overId)

    if (!isGroup && activeGroup && overGroup && activeGroup?.guid !== overGroup?.guid) {
      const activeItems: any = items?.find(({guid}: any) => guid === activeGroup?.guid)?.forms
      const overItems: any = items?.find(({guid}: any) => guid === overGroup?.guid)?.forms

      const activeIndex: any = activeItems?.findIndex(({guid}: any) => guid === id)
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
            forms: m?.forms
              ?.filter(({guid}: any) => guid !== id)
              ?.map((form: any, formIndex: any) => {
                form.order = formIndex + 1
                return form
              }),
          }
        }
        if (m?.guid === overGroup?.guid) {
          m = {
            ...m,
            forms: [
              ...m?.forms?.slice(0, newIndex),
              items?.find(({guid}: any) => guid === activeGroup?.guid)?.forms?.[activeIndex],
              ...m?.forms?.slice(newIndex, m?.forms?.length),
            ]
              ?.filter((form: any) => form)
              ?.map((form: any, formIndex: any) => {
                form?.order && (form.order = formIndex + 1)
                form?.parent_guid && (form.parent_guid = m?.guid)
                return form
              }),
          }
        }
        return m
      })
      setItems(res)
      onChange(res)
    }
  }, 150)
  const handleDragEnd: any = (e: any) => {
    const {active, over} = e || {}
    const {id} = active || {}
    const {id: overId} = over || {}

    const activeContainer: any = findContainer(id)
    const overContainer: any = findContainer(overId)

    if (
      !isGroup &&
      activeContainer &&
      overContainer &&
      activeContainer?.guid === overContainer?.guid
    ) {
      const activeIndex: any = activeContainer?.forms?.findIndex(({guid}: any) => guid === id)
      const overIndex: any = overContainer?.forms?.findIndex(({guid}: any) => guid === overId)

      if (activeIndex !== overIndex) {
        const res: any = items?.map((m: any) => {
          if (m?.guid === overContainer?.guid) {
            m = {
              ...m,
              forms: arrayMove(m?.forms, activeIndex, overIndex)?.map(
                (form: any, formIndex: any) => {
                  form.order = formIndex + 1
                  return form
                }
              ),
            }
          }
          return m
        })
        setItems(res)
        onChange(res)
      }
      setActiveIdx(undefined)
      setIsgroup(false)
    }

    if (isGroup && activeContainer?.guid !== overContainer?.guid) {
      const activeIndex: any = items?.findIndex(({guid}: any) => guid === id)
      const overIndex: any = items?.findIndex(({guid}: any) => guid === overId)
      if (activeIndex !== overIndex) {
        const res: any = arrayMove(items, activeIndex, overIndex)?.map((m: any, index: any) => {
          m.order = index + 1
          return m
        })
        setItems(res)
        onChange(res)
      }
      setActiveIdx(undefined)
      setIsgroup(false)
    }
  }
  if (loading) {
    return (
      <div className='row'>
        <PageLoader />
      </div>
    )
  }
  return (
    <div className='row'>
      <Toolbar dir='right'>
        <div className='mx-n5'>
          <div
            className='btn btn-icon w-30px h-30px btn-light-primary rounded-circle border border-primary me-2'
            onClick={() => gridStep < 3 && setGridStep(gridStep + 1)}
          >
            <i className='fas fa-search-minus' />
          </div>
          <div
            className='btn btn-icon w-30px h-30px btn-light-primary rounded-circle border border-primary me-4'
            onClick={() => gridStep > 1 && setGridStep(gridStep - 1)}
          >
            <i className='fas fa-search-plus' />
          </div>
          <div
            onClick={() => navigate(-1)}
            className='d-inline-flex align-items-center col-auto btn btn-sm btn-light-primary radius-50 p-2 ms-2 border border-primary'
          >
            <span className='btn btn-icon w-20px h-20px btn-primary rounded-circle'>
              <i className='las la-arrow-left text-white' />
            </span>
            <span className='px-2'>Back</span>
          </div>
          <div
            onClick={() => onSave(items)}
            className='d-inline-flex align-items-center col-auto btn btn-sm btn-primary radius-50 p-2 ms-2 border border-primary'
          >
            <span className='btn btn-icon w-20px h-20px btn-primary rounded-circle'>
              <i className='las la-check text-white' />
            </span>
            <span className='px-2'>Save Changes</span>
          </div>
        </div>
      </Toolbar>
      <div className='col-12 p-0 mx-n1 mt-n7'>
        <div
          className='p-3'
          style={{
            height: `70vh`,
            overflow: 'auto',
          }}
        >
          <DndContext
            collisionDetection={rectIntersection}
            modifiers={isGroup ? [] : [snapCenterToCursor]}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <GroupContextProvider
              id='group'
              items={data?.map(({guid}: any) => guid)}
              strategy={gridStep > 2 ? horizontalListSortingStrategy : rectSortingStrategy}
            >
              <div className={`row flex-${gridStep > 2 ? 'nowrap m-0' : 'wrap'}`} ref={setNodeRef}>
                {items?.map((data: any, index: number) => (
                  <SortableContext
                    data={data}
                    key={index}
                    id={data?.guid}
                    items={data?.forms}
                    gridStep={gridStep}
                    setActiveCollapseGuid={(guid: any, isCollapse: boolean) => {
                      isCollapse
                        ? setActiveCollapseGuid([...activeCollapseGuid, guid])
                        : setActiveCollapseGuid(activeCollapseGuid?.filter((f: any) => f !== guid))
                    }}
                    overlayCollapseGuid={activeCollapseGuid}
                    onEditGroup={() => onEditGroup(data)}
                    onDeleteGroup={() => onDeleteGroup(data)}
                  />
                ))}
                <SortableContext
                  gridStep={gridStep}
                  onAddGroup={onAddGroup}
                  minOfCllientHeight={minOfCllientHeight}
                />
                <DragOverlay
                  className='p-0'
                  adjustScale={false}
                  dropAnimation={null}
                  transition={'transform 0ms ease'}
                  wrapperElement='div'
                >
                  {activeIdx?.guid && isGroup ? (
                    <div
                      className='bg-white px-2 rounded'
                      style={{opacity: 0.75, transform: 'scale(0.975)'}}
                    >
                      <SortableContext
                        data={activeIdx}
                        id={activeIdx?.guid}
                        items={activeIdx?.forms}
                        gridStep={gridStep}
                        isOverlay={true}
                        overlayCollapseGuid={activeCollapseGuid}
                      />
                    </div>
                  ) : activeIdx?.guid && !isGroup ? (
                    <div
                      className='bg-white px-2 rounded'
                      style={{opacity: 0.75, transform: 'scale(0.65)'}}
                    >
                      <Item id={activeIdx?.guid} data={activeIdx} isOverlay={true} />
                    </div>
                  ) : null}
                </DragOverlay>
              </div>
            </GroupContextProvider>
          </DndContext>
        </div>
      </div>
    </div>
  )
}

export default Index
