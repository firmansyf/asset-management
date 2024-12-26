import {FC, useEffect, useState} from 'react'
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc'

type Props = {
  onChange?: any
  children?: any
  axis?: any
  lockAxis?: any
  useDragHandle?: any
  className?: any
  onSort?: any
}

const Handle = SortableHandle((props: Props) => props.children)
const SortableItem: any = SortableElement((props: Props) => props.children)
const SortableList: any = SortableContainer((props: Props) => props.children)

const Sortable: FC<Props> = ({
  onChange,
  children,
  axis,
  // lockAxis,
  useDragHandle,
  className,
  onSort,
}) => {
  const [items, setItems] = useState<any>([])
  const arrayMove = (array: any, from: any, to: any) => {
    array = array.slice()
    array.splice(to < 0 ? array?.length + to : to, 0, array?.splice(from, 1)?.[0])
    return array
  }
  const onSortEnd = ({oldIndex, newIndex}: any) => {
    const arr: any = arrayMove(items, oldIndex, newIndex)
    if (onChange) {
      onChange(arr)
      setItems(arr)
    }
    onSort && onSort(items, oldIndex, newIndex)
  }
  const onSortOver = ({index, oldIndex, newIndex, collection}: any) => ({
    index,
    oldIndex,
    newIndex,
    collection,
  })
  const onSortMove = (e: any) => e
  useEffect(() => {
    setItems(Object.keys(children || {})?.map((r: any) => parseInt(r)))
  }, [children])
  return (
    <SortableList
      onSortOver={onSortOver}
      onSortMove={onSortMove}
      onSortEnd={onSortEnd}
      axis={axis || 'xy'}
      lockAxis={axis || ''}
      useDragHandle={useDragHandle}
    >
      <div className={className}>
        {children?.length &&
          children.map((r: any, index: number) => (
            <SortableItem index={index} key={index} collection={1}>
              {r}
            </SortableItem>
          ))}
      </div>
    </SortableList>
  )
}

export {Handle, Sortable}
