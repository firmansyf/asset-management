// REORDER
export const reorder = (list: any, startIndex: any, endIndex: any) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

// MOVE
export const move = (
  source: any,
  destination: any,
  droppableSource: any,
  droppableDestination: any
) => {
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

export const getItemStyle = (_isDragging: any, draggableStyle: any) => ({
  userSelect: 'none',
  // padding: grid * 2,
  // margin: `0 0 ${grid}px 0`,
  // change background colour if dragging
  // color: '#fff',
  // background: isDragging ? '#f1416c' : '#7239ea',
  // width: isDragging ? '100px' : 'auto',
  // styles we need to apply on draggables
  height: '100%',
  ...draggableStyle,
})

export const getListStyle = (isDraggingOver: any) => ({
  background: isDraggingOver ? 'lightyellow' : 'white',
  maxHeight: '400px',
  overflow: 'auto',
  padding: grid,
  width: 'auto',
})
