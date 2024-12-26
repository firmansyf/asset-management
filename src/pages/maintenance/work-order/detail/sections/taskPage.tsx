import cx from 'classnames'
import {FC, memo, useEffect, useState} from 'react'

import TaskEdit from './taskEdit'

let TaskPage: FC<any> = ({detail}) => {
  const [, setData] = useState<any>({}) //data
  const [tab, setTab] = useState('edit')

  useEffect(() => {
    detail && setData(detail)
  }, [detail])

  return (
    <div className='card card-custom'>
      <div className='card-body p-5'>
        <div className='row'>
          <div className='col-md-12'>
            <p>
              {`if you plan to reuse this set of tasks, or use a similar set of tasks in the future,` +
                `create them as a Checklist first use as a template for easyaddition.`}
            </p>
          </div>
          <div className='col-md-12'>
            <div className='card-body align-items-center p-0'>
              <ul className='nav nav-tabs nav-line-tabs nav-line-tabs-2x fs-6'>
                <li className='nav-item'>
                  <div
                    className={cx(
                      'm-0 px-5 py-3 cursor-pointer',
                      tab === 'edit' && 'bg-primary border-primary text-white fw-bolder'
                    )}
                    onClick={() => {
                      // navigate({...location, hash: 'edit'}, {replace: true})
                      setTab('edit')
                    }}
                  >
                    Edit
                  </div>
                </li>

                <li className='nav-item'>
                  <div
                    className={cx(
                      'm-0 px-5 py-3 cursor-pointer',
                      tab === 'preview' && 'bg-primary border-primary text-white fw-bolder'
                    )}
                    onClick={() => {
                      // navigate({...location, hash: 'preview'}, {replace: true})
                      setTab('preview')
                    }}
                  >
                    Preview
                  </div>
                </li>
              </ul>
              <div className='tab-content'>
                <div
                  className={cx('tab-pane fade', {show: tab === 'edit'}, {active: tab === 'edit'})}
                >
                  <TaskEdit />
                </div>

                <div
                  className={cx(
                    'tab-pane fade',
                    {show: tab === 'preview'},
                    {active: tab === 'preview'}
                  )}
                >
                  <div className='card p-5'>
                    <p>{`Preview`}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

TaskPage = memo(TaskPage, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default TaskPage
