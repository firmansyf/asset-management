import {Select as Option} from '@components/select/ajax'
import {
  getDetailMaintenanceChecklist,
  getMaintenanceChecklist,
} from '@pages/setup/maintenance/checklist/Service'
import {FC, memo, useEffect, useState} from 'react'

import {InputClone} from './inputClone'

let TaskPage: FC<any> = ({detail}) => {
  const [, setData] = useState<any>({}) //data
  const [, setChecklist] = useState<any>({}) //checklist
  const [arrOption, setArrOption] = useState<any>([])
  const [addTask, setAddTask] = useState<any>([])
  const [optionMessage, setOptionMessage] = useState(false)

  const setDetailChecklist = (guid: any) => {
    getDetailMaintenanceChecklist(guid)
      .then(({data: {data: res}}: any) => {
        if (res) {
          setChecklist(res)
          setArrOption(res?.tasks as never[])
        }
      })
      .catch(() => '')
  }

  useEffect(() => {
    detail && setData(detail)
  }, [detail])

  return (
    <div className='card card-custom'>
      <div className='card-body p-5'>
        <div className='row'>
          <div className='col-md-12' style={{textAlign: 'right'}}>
            <a href='#' className='me-3'>
              + Task
            </a>
            <a href='#'>+ Checklist</a>
          </div>
          <div className='col-md-12 mt-5'>
            <label htmlFor='checklist' className='mb-3'>
              Select a checklist to this work order :{' '}
            </label>
            <Option
              sm={true}
              id='checklist'
              className='col p-0'
              name='checklist'
              api={getMaintenanceChecklist}
              params={false}
              reload={false}
              placeholder='Choose Checklist'
              onChange={({value}: any) => {
                setDetailChecklist(value)
              }}
              parse={(e: any) => {
                return {
                  value: e?.guid,
                  label: e?.name,
                }
              }}
            />
          </div>

          <div className='col-md-12 mt-5 mb-3 px-5'>
            <InputClone
              name='tasks'
              defaultValue={arrOption}
              className='col-md-12'
              onChange={(e: any) => setAddTask([...addTask, e])}
              optionMessage={optionMessage}
              setOptionMessage={setOptionMessage}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

TaskPage = memo(TaskPage, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default TaskPage
