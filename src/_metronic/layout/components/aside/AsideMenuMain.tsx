import {getDefaultMenu, getMenu, updateMenu} from '@api/menu'
import {Alert} from '@components/alert'
import Tooltip from '@components/alert/tooltip'
import {restrictToVerticalAxis} from '@components/dnd-kit/util'
import {ListLoader, SimpleLoader} from '@components/loader/list'
import {ToastMessage} from '@components/toast-message'
import {DndContext, DragOverlay, rectIntersection} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext as SortableContextProvider,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {errorValidation, useTimeOutMessage} from '@helpers'
import {withRouter} from '@hooks'
import SortableContext from '@metronic/layout/components/aside/sortable/Level2'
import {useQuery, useQueryClient} from '@tanstack/react-query'
import {debounce, find, flatMap, orderBy} from 'lodash'
import {FC, memo, useState} from 'react'

let Index: FC<any> = () => {
  const queryClient: any = useQueryClient()

  const [initialItem, setInitialItem] = useState<any>([])
  const [activeIdx, setActiveIdx] = useState<any>(undefined)
  const [level, setLevel] = useState<number>(1)
  const [disabled, setDisabled] = useState<boolean>(true)
  const [showModalSave, setShowModalSave] = useState<boolean>(false)
  const [loadingBtn, setLoadingBtn] = useState<boolean>(false)

  const menuQueryKey: any = ['getMenu']
  const menuQuery: any = useQuery({
    // initialData: [],
    staleTime: Infinity,
    queryKey: menuQueryKey,
    queryFn: async () => {
      const api: any = await getMenu()
      const res: any = api?.data?.data
      const orderedResult: any = orderBy(res, 'order_no')?.map((level1: any) => {
        let result: any = level1
        const {children: level2} = level1 || {}
        if (level2) {
          const resLevel2: any = orderBy(level2?.data, 'order_no')?.map((m: any) => {
            let resLevel3: any = m
            const {children: level3} = m || {}
            if (level3) {
              resLevel3 = {
                ...m,
                children: {data: orderBy(level3?.data, 'order_no')},
              }
            }
            return resLevel3
          })
          result = {
            ...level1,
            children: {data: resLevel2},
          }
        }
        return result
      })
      setInitialItem(orderedResult)
      return orderedResult
    },
  })
  const items: any = menuQuery?.data
  console.log('items: ', items)
  const loading: any = !menuQuery?.isFetched

  const onVisibilityChange: any = ({level, guid, is_show}: any) => {
    if (level === 1) {
      const res: any = items?.map((m: any) => {
        if (m?.guid === guid) {
          m = {...m, is_show}
        }
        return m
      })
      queryClient.setQueryData(menuQueryKey, res)
    } else if (level === 2) {
      const res = items?.map((item: any) => {
        const thisItem = items?.find(
          ({children}: any) => children?.data?.map(({guid: id}: any) => id)?.includes(guid)
        )
        if (item?.guid === thisItem?.guid) {
          item = {
            ...item,
            children: {
              ...thisItem.children,
              data: thisItem?.children?.data?.map((m: any) => {
                if (m?.guid === guid) {
                  m = {...m, is_show}
                }
                return m
              }),
            },
          }
        }
        return item
      })
      queryClient.setQueryData(menuQueryKey, res)
    } else if (level === 3) {
      const res = items?.map((item: any) => {
        const thisItem = items?.find(
          ({children}: any) =>
            children?.data?.find(
              ({children: subChild}: any) =>
                subChild?.data?.map(({guid: id}: any) => id)?.includes(guid)
            )
        )
        if (item?.guid === thisItem?.guid) {
          const thisData: any = thisItem?.children?.data?.map((child: any) => {
            const thisChild = child?.children?.data?.find(({guid: id}: any) => id === guid)
            if (thisChild) {
              child = {
                ...child,
                children: {
                  ...child.children,
                  data: child?.children?.data?.map((m: any) => {
                    if (m?.guid === guid) {
                      m = {...m, is_show}
                    }
                    return m
                  }),
                },
              }
            }
            return child
          })
          item = {
            ...item,
            children: {
              ...thisItem.children,
              data: thisData,
            },
          }
        }
        return item
      })
      queryClient.setQueryData(menuQueryKey, res)
    }
  }
  const handleDragStart: any = debounce((e: any) => {
    // LEVEL 1
    const {active} = e || {}
    const {id} = active
    let detail: any = items?.find(({guid}: any) => guid === id)
    setLevel(1)
    if (!detail) {
      // LEVEL 2
      let dataItems: any = flatMap(items, 'children.data')?.filter((f: any) => f)
      detail = dataItems?.find(({guid}: any) => guid === id)
      setLevel(2)
      if (!detail) {
        // LEVEL 3
        dataItems = flatMap(dataItems, 'children.data')?.filter((f: any) => f)
        detail = dataItems?.find(({guid}: any) => guid === id)
        setLevel(3)
      }
    }
    setActiveIdx(detail)
  }, 100)
  const handleDragOver = () => {
    // When drag is over
  }
  const handleDragEnd = (e: any) => {
    const {active, over} = e || {}
    const {id} = active || {}
    const {id: overId} = over || {}
    let activeIndex = items?.findIndex(({guid}: any) => guid === id)
    let overIndex = items?.findIndex(({guid}: any) => guid === overId)
    if (level === 1) {
      const res = arrayMove(items, activeIndex, overIndex)?.map((m: any, index: number) => {
        m.order_no = index + 1
        return m
      })
      queryClient.setQueryData(menuQueryKey, res)
    }
    if (level === 2) {
      const res = items?.map((item: any) => {
        const thisItem = items?.find(
          ({children}: any) => children?.data?.map(({guid}: any) => guid)?.includes(id)
        )
        if (item?.guid === thisItem?.guid) {
          activeIndex = item?.children?.data?.findIndex(({guid}: any) => guid === id)
          overIndex = item?.children?.data?.findIndex(({guid}: any) => guid === overId)
          item = {
            ...item,
            children: {
              ...thisItem.children,
              data: arrayMove(thisItem?.children?.data, activeIndex, overIndex)?.map(
                (m: any, index: number) => {
                  m.order_no = index + 1
                  return m
                }
              ),
            },
          }
        }
        return item
      })
      queryClient.setQueryData(menuQueryKey, res)
    }
    if (level === 3) {
      const res = items?.map((item: any) => {
        const thisItem = items?.find(
          ({children}: any) =>
            children?.data?.find(
              ({children: subChild}: any) =>
                subChild?.data?.map(({guid}: any) => guid)?.includes(id)
            )
        )
        if (item?.guid === thisItem?.guid) {
          const thisData: any = thisItem?.children?.data?.map((child: any) => {
            const thisChild = child?.children?.data?.find(({guid}: any) => guid === id)
            if (thisChild) {
              activeIndex = child?.children?.data?.findIndex(({guid}: any) => guid === id)
              overIndex = child?.children?.data?.findIndex(({guid}: any) => guid === overId)
              child = {
                ...child,
                children: {
                  ...child.children,
                  data: arrayMove(child?.children?.data, activeIndex, overIndex)?.map(
                    (m: any, index: number) => {
                      m.order_no = index + 1
                      return m
                    }
                  ),
                },
              }
            }
            return child
          })
          item = {
            ...item,
            children: {
              ...thisItem.children,
              data: thisData,
            },
          }
        }
        return item
      })
      queryClient.setQueryData(menuQueryKey, res)
    }
  }
  const handleSave = () => {
    setLoadingBtn(true)
    const mapper: any = (data: any) =>
      data?.map(({guid, is_show, order_no}: any) => ({guid, is_show, order_no}))
    const level1: any = mapper(items)
    const level2: any = flatMap(items, 'children.data')?.filter((f: any) => f)
    const level3: any = flatMap(level2, 'children.data')?.filter((f: any) => f)
    const menus: any = [...level1, ...mapper(level2), ...mapper(level3)]
    updateMenu({menus})
      .then(({data: {message}}: any) => {
        queryClient.invalidateQueries({queryKey: menuQueryKey})
        setDisabled(true)
        setLoadingBtn(false)
        setShowModalSave(false)
        ToastMessage({type: 'success', message})
      })
      .catch((err: any) => {
        setLoadingBtn(false)
        Object.values(errorValidation(err)).map((message: any) =>
          ToastMessage({type: 'error', message})
        )
      })
  }
  const handleReset = () => {
    setLoadingBtn(true)
    getDefaultMenu()
      .then(({data: {data: res}}: any) => {
        queryClient.setQueryData(menuQueryKey, res)
      })
      .catch((err: any) => {
        Object.values(errorValidation(err)).map((message: any) =>
          ToastMessage({type: 'error', message})
        )
      })
      .finally(() => {
        setLoadingBtn(false)
        useTimeOutMessage('clear', 200)
      })
  }
  const saveChangeMenu = () => {
    const mapper: any = (data: any) => data?.map(({is_show}: any) => ({is_show}))
    const menuSelected: any = find(mapper(items), {is_show: 1})
    if (menuSelected !== undefined) {
      setShowModalSave(true)
    } else {
      ToastMessage({type: 'error', message: 'Please select at least one menu'})
    }
  }
  if (loading) {
    return (
      <div className='mt-5 ps-5'>
        <div className='row'>
          <div className='col-12 mb-5'>
            <SimpleLoader count={1} height={25} className='w-50 ms-auto pe-6' />
          </div>
          <ListLoader count={5} height={20} className='col-12 d-flex flex-center my-2' />
        </div>
      </div>
    )
  }
  return (
    <>
      <div className='position-relative'>
        <div
          className='position-sticky top-0 w-100 bg-white border-bottom border-bottom-2'
          style={{zIndex: 9}}
        >
          <div className='d-flex align-items-center justify-content-end py-3 px-4'>
            {disabled ? (
              <div
                className='btn btn-sm btn-light-primary py-1 px-3'
                onClick={() => setDisabled(false)}
              >
                {/* <i className='las la-object-ungroup fs-3' /> */}
                Manage Menu
              </div>
            ) : (
              <>
                <Tooltip placement='top' title='Reset Menu'>
                  <button
                    type='button'
                    disabled={loadingBtn}
                    className='btn btn-icon btn-light-success w-25px h-25px me-2'
                    onClick={handleReset}
                  >
                    {loadingBtn ? (
                      <div className='spinner-border spinner-border-sm align-middle' />
                    ) : (
                      <i className='las la-sync-alt' />
                    )}
                  </button>
                </Tooltip>
                <Tooltip placement='top' title='Cancel'>
                  <div
                    className='btn btn-icon btn-light-danger w-25px h-25px me-2'
                    onClick={() => {
                      setDisabled(true)
                      queryClient.setQueryData(menuQueryKey, initialItem)
                      useTimeOutMessage('clear', 200)
                    }}
                  >
                    <i className='las la-times' />
                  </div>
                </Tooltip>
                <div className='btn btn-sm btn-primary py-1 px-3' onClick={saveChangeMenu}>
                  <i className='las la-check' />
                  Save
                </div>
              </>
            )}
          </div>
        </div>
        <DndContext
          collisionDetection={rectIntersection}
          modifiers={[restrictToVerticalAxis]}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <SortableContextProvider
            id='level1'
            items={items?.map(({guid}: any) => guid)}
            strategy={verticalListSortingStrategy}
            disabled={disabled} // Level 1
          >
            <div className='d-flex flex-wrap my-2'>
              {items
                ?.filter(({is_show}: any) => (disabled ? [1] : [0, 1])?.includes(is_show))
                ?.map((m: any, sortableIdx: number) => (
                  <SortableContext
                    disabled={disabled} // Level 2
                    data={m}
                    key={sortableIdx}
                    id={m?.guid}
                    items={m?.children?.data}
                    onVisibilityChange={onVisibilityChange}
                  />
                ))}
              <DragOverlay
                className='p-0'
                adjustScale={false}
                dropAnimation={null}
                transition={'transform 0ms ease'}
                wrapperElement='div'
              >
                {activeIdx?.guid && (
                  <div className='bg-white' style={{opacity: 0.5, transform: 'scale(1)'}}>
                    <SortableContext
                      data={activeIdx}
                      id={activeIdx?.guid}
                      items={activeIdx?.children?.data}
                      isOverlay={true}
                    />
                  </div>
                )}
              </DragOverlay>
            </div>
          </SortableContextProvider>
        </DndContext>
      </div>
      {/* MODAL SAVE */}
      <Alert
        setShowModal={setShowModalSave}
        showModal={showModalSave}
        loading={loadingBtn}
        body={'Are you sure want to save changes ?'}
        type={'save'}
        key={'save'}
        title={`Save Change`}
        confirmLabel={'Save Change'}
        onConfirm={handleSave}
        onCancel={() => {
          useTimeOutMessage('clear', 0)
          setShowModalSave(false)
        }}
      />
    </>
  )
}

Index = memo(Index, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
const AsideMenuMain: any = withRouter(Index)
export {AsideMenuMain}
