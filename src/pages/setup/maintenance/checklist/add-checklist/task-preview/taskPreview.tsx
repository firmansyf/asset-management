import {reorder} from '@components/dnd/dnd'
import {Sortable} from '@components/dnd/sortable'
import {customStyles} from '@components/select/config'
import {configClass} from '@helpers'
import lodash from 'lodash'
import {FC} from 'react'
import Select from 'react-select'

type Props = {
  values?: any
  setFieldValue?: any
}

const TaskPreview: FC<Props> = ({values, setFieldValue}) => {
  const subTaskValue: any = ['Open', 'On Hold', 'In Progress', 'Completed']

  const onSortend = (_arr: any, source: any, destination: any, droppableId: any) => {
    const sortResult: any = {
      source: {
        index: source,
        droppableId,
      },
      destination: {
        index: destination,
        droppableId,
      },
    }
    onDragEnd(sortResult)
  }

  const onDragEnd = (e: any) => {
    const {source, destination} = e || {}
    if (!destination) {
      return
    }

    let items: any = reorder(values, source?.index, destination?.index)
    items =
      lodash &&
      lodash?.length > 0 &&
      lodash?.map(items, (m: any, index: any) => {
        m.order = index + 1
        return m
      })
    setFieldValue('tasks', items as never[])
  }

  return (
    <div className='row py-5 mx-1'>
      <Sortable
        onSort={(arr: any, source: any, destination: any) =>
          onSortend(arr, source, destination, 'active_widget')
        }
        className='row m-2'
      >
        {values && values?.length > 0 ? (
          values?.map((item: any, index: number) => {
            return (
              <div className='col-12' key={index}>
                <div className='card border border-gray-300 mt-5'>
                  <div className='card-body row'>
                    <div className='col-12 fw-bolder'>
                      <i className='fas fa-lg fa-clipboard-list text-black me-3'></i>
                      Task Preview
                    </div>

                    <div className='col-12 pt-5'>
                      <p className='pt-1'>{item?.name || '-'}</p>
                    </div>

                    <div className='col-12 py-2'>
                      {item?.field_type === 'select_dropdown' ||
                      item?.field_type === 'sub_task_status' ? (
                        <Select
                          styles={customStyles(true, {option: {color: 'black'}})}
                          options={
                            item?.field_type === 'select_dropdown'
                              ? item?.option !== null &&
                                item?.option?.length > 0 &&
                                item?.option?.map((val: any) => ({value: val, label: val}))
                              : item?.field_type === 'sub_task_status'
                              ? subTaskValue &&
                                subTaskValue?.length > 0 &&
                                subTaskValue?.map((val: any) => ({value: val, label: val}))
                              : ''
                          }
                          name='type'
                          defaultValue={`${
                            item?.option !== null && item?.option?.length > 0
                              ? item?.option?.[0]
                              : ''
                          }`}
                        />
                      ) : item?.field_type === 'number' ? (
                        <input
                          name='type'
                          type='number'
                          className={configClass?.form}
                          style={{height: '38px', fontSize: '12px'}}
                        />
                      ) : item?.field_type === 'text' ? (
                        <input
                          type='text'
                          name='type'
                          className={configClass?.form}
                          style={{height: '38px', fontSize: '12px'}}
                        />
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className='col-12'>
            <div className='card border border-gray-300 mt-5'>
              <div className='card-body fw-bolder'>
                <i className='fas fa-lg fa-clipboard-list text-black me-3'></i>
                Task Preview
              </div>
            </div>
          </div>
        )}
      </Sortable>
    </div>
  )
}

export default TaskPreview
