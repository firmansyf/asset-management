import {useState} from 'react'
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd'

// fake data generator
const getItems = (count: any, offset = 0) =>
  Array.from({length: count}, (_v: any, k: any) => k)?.map((k: any) => ({
    id: `item-${k + offset}`,
    content: `item ${k + offset}`,
  }))

// a little function to help us with reordering the result
const reorder = (list: any, startIndex: any, endIndex: any) => {
  const result = Array.from(list)
  const [removed] = result?.splice(startIndex, 1)
  result?.splice(endIndex, 0, removed)
  return result
}

/**
 * Moves an item from one list to another list.
 */
const move = (source: any, destination: any, droppableSource: any, droppableDestination: any) => {
  const sourceClone = Array.from(source)
  const destClone = Array.from(destination)
  const [removed] = sourceClone.splice(droppableSource.index, 1)

  destClone.splice(droppableDestination.index, 0, removed)

  const result: any = {}
  result[droppableSource.droppableId] = sourceClone
  result[droppableDestination.droppableId] = destClone

  return result
}

const grid = 8

const getItemStyle = (isDragging: any, draggableStyle: any) => ({
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  // change background colour if dragging
  color: '#fff',
  background: isDragging ? '#f1416c' : '#7239ea',
  // styles we need to apply on draggables
  ...draggableStyle,
})

const getListStyle = (isDraggingOver: any) => ({
  background: isDraggingOver ? 'lightblue' : '#ddd',
  padding: grid,
  width: 'auto',
})

const Dnd = () => {
  const [list, setList] = useState<any>({
    items: getItems(10),
    selected: getItems(5, 10),
  })

  const id2List: any = {
    droppable: 'items',
    droppable2: 'selected',
  }

  const getList = (id: any) => list[id2List[id]]

  const onDragUpdate = () => ''

  const onDragEnd = (result: any) => {
    const {source, destination} = result
    // dropped outside the list
    if (!destination) {
      return
    }
    if (source.droppableId === destination.droppableId) {
      const items = reorder(getList(source.droppableId), source.index, destination.index)
      let state: any = {...list, items}
      if (source.droppableId === 'droppable2') {
        state = {
          ...list,
          selected: items,
        }
      }
      setList(state)
    } else {
      const result = move(
        getList(source.droppableId),
        getList(destination.droppableId),
        source,
        destination
      )

      setList({
        items: result.droppable,
        selected: result.droppable2,
      })
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
      <div className='row'>
        <div className='col-md-3'>
          <Droppable droppableId='droppable'>
            {(provided, snapshot) => (
              <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                {list.items.map((item: any, index: number) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                      >
                        {item.content}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
        <div className='col-md-3'>
          <Droppable droppableId='droppable2'>
            {(provided, snapshot) => (
              <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                {list.selected.map((item: any, index: number) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                      >
                        {item.content}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </DragDropContext>
  )
}

export {Dnd}
