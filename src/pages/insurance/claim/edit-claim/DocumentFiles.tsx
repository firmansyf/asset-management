import Tooltip from '@components/alert/tooltip'
import {preferenceDate, validationViewDate} from '@helpers'
import {includes} from 'lodash'
import {FC, memo} from 'react'
import {Draggable, Droppable} from 'react-beautiful-dnd'

const grid = 3

const getItemStyle = (isDragging: any, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: '5px',
  margin: `1px`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : '#fff',
  display: 'inline-flex',
  borderBottom: '1px dashed #dfdfdf',
  borderLeft: '1px dashed #dfdfdf',
  // styles we need to apply on draggables
  ...draggableStyle,
})

const getListStyle = (isDraggingOver: any) => ({
  background: isDraggingOver ? '#f1f4f7' : '#fff',
  padding: grid,
  margin: '1px 0',
})

let DocumentFiles: FC<any> = ({
  subItems,
  documentGuid,
  permissions,
  isCurrentPeril,
  setDetailDoc,
  setShowModalView,
  setShowGuidDocument,
  setShowModalDocument,
  deleteLocalDoc,
  setShowModalDelete,
  formChange,
  setConfirmAction,
  setShowModalConfimSave,
}) => {
  const pref_date = preferenceDate()

  const onEditDocument = (item: any, documentGuid: any) => {
    if (includes(formChange, true)) {
      setConfirmAction('edit-document')
      setDetailDoc(item)
      setShowGuidDocument(documentGuid)
      setShowModalConfimSave(true)
    } else {
      setDetailDoc(item)
      setShowGuidDocument(documentGuid)
      setShowModalDocument(true)
    }
  }

  const onDeleteDocument = (item: any, documentGuid: any, index: any) => {
    if (includes(formChange, true)) {
      setConfirmAction('remove-document')
      setDetailDoc(item)
      setShowGuidDocument(documentGuid)
      setShowModalConfimSave(true)
    } else {
      if (item?.local) {
        deleteLocalDoc(documentGuid, index)
      } else {
        setDetailDoc(item)
        setShowModalDelete(true)
      }
    }
  }

  return (
    <Droppable droppableId={documentGuid} type={`droppableSubItem`}>
      {(provided, snapshot) => (
        <div
          className='row'
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={getListStyle(snapshot.isDraggingOver)}
        >
          {subItems.map((item: any, index: any) => (
            <Draggable key={item.guid} draggableId={item.guid} index={index}>
              {(provided, snapshot) => (
                <div
                  className='col-12'
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                >
                  <div className='col-3'>
                    <div className='d-flex my-1'>
                      <div>
                        <span
                          {...provided.dragHandleProps}
                          style={{
                            display: 'block',
                            margin: '2px',
                            paddingRight: '10px',
                          }}
                        >
                          <i className='fas fa-grip-vertical text-dark-25'></i>
                        </span>
                      </div>
                      <div className='pr-5'>{item?.title !== null ? item?.title : '-'}</div>
                    </div>
                  </div>
                  <div className='col-3'>{item?.comments !== null ? item?.comments : '-'}</div>
                  <div className='col-2'>
                    {item?.uploaded_by?.name !== null ? item?.uploaded_by?.name : '-'}
                  </div>
                  <div className='col-2'>
                    {item?.uploaded_date !== null
                      ? validationViewDate(item?.uploaded_date, pref_date)
                      : 'N/A'}
                  </div>
                  <div className='col-2'>
                    <div className='d-flex flex-row-reverse'>
                      {item?.mime_type !== null && (
                        <Tooltip placement='top' title='View'>
                          <div
                            onClick={() => {
                              setDetailDoc(item)
                              setShowModalView(true)
                            }}
                            className='d-flex mx-1 align-items-center justify-content-center btn btn-icon border border-secondary h-30px w-30px btn-color-gray-600 btn-light-primary radius-10'
                          >
                            <i className='las la-eye fs-3' />
                          </div>
                        </Tooltip>
                      )}
                      {permissions?.includes('insurance_claim.document_edit') && (
                        <Tooltip placement='top' title='Edit' active={isCurrentPeril}>
                          <div
                            onClick={() => {
                              if (isCurrentPeril) {
                                onEditDocument(item, documentGuid)
                              }
                            }}
                            className={`d-flex mx-1 align-items-center justify-content-center w-30px h-30px btn btn-icon border border-dashed radius-10 ${
                              isCurrentPeril
                                ? 'btn-light-warning border-warning'
                                : 'bg-gray-100 border-secondary'
                            }`}
                            style={{cursor: isCurrentPeril ? 'pointer' : 'not-allowed'}}
                          >
                            <i className='las la-pen-nib fs-3' />
                          </div>
                        </Tooltip>
                      )}
                      {permissions?.includes('insurance_claim.document_delete') && (
                        <Tooltip placement='top' title='Delete'>
                          <div
                            onClick={() => {
                              onDeleteDocument(item, documentGuid, index)
                            }}
                            className='d-flex mx-1 align-items-center justify-content-center btn btn-icon border border-dashed h-30px w-30px radius-10 btn-light-danger border-danger'
                          >
                            <i className='las la-trash-alt fs-3' />
                          </div>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}

DocumentFiles = memo(
  DocumentFiles,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {DocumentFiles}
