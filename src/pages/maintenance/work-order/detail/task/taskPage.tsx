import {ToastMessage} from '@components/toast-message'
import {getDetailMaintenanceChecklist} from '@pages/setup/maintenance/checklist/Service'
import {Formik} from 'formik'
import {FC, memo, useState} from 'react'
import {useIntl} from 'react-intl'

import {createTaskWO} from './service'
import TaskEdit from './taskEdit'
import {TaskPreview} from './taskPreview'

let TaskPage: FC<any> = ({detail}) => {
  const intl: any = useIntl()

  const [isGuid, setGuid] = useState<any>()
  const [reload, setReload] = useState<number>(0)
  const [checklist, setChecklist] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [dataNewTasks, setDataNewTasks] = useState<any>([])
  const [clickTask, setClickTask] = useState<boolean>(false)
  const [clickChecklist, setClickChecklist] = useState<boolean>(false)
  const [loadingDeleteTasks, setLoadingDeleteTasks] = useState<boolean>(false)

  const setDetailChecklist = (guid: any) => {
    getDetailMaintenanceChecklist(guid).then(({data: {data: res}}: any) => {
      res && setChecklist(res?.tasks as never[])
    })
  }

  const handleOnSubmit = (value: any, actions: any) => {
    setLoading(true)

    const param: any = []
    checklist?.forEach((item: any) => {
      param.push({
        name: value?.['name-' + item?.guid] || '',
        user_guid: value?.['user_guid-' + item?.guid] || '',
        description: value?.['description-' + item?.guid] || '',
        field_type: value?.['task_status_guid-' + item?.guid] || '',
      })
    })

    dataNewTasks?.forEach((item: any) => {
      param.push({
        name: value?.['name-' + item?.order] || '',
        user_guid: value?.['user_guid-' + item?.order] || '',
        description: value?.['description-' + item?.order] || '',
        field_type: value?.['task_status_guid-' + item?.order] || '',
      })
    })

    const params: any = {
      maintenance_guid: detail?.guid || '',
      tasks: param as never[],
    }

    createTaskWO(params)
      .then(({data: {message}}: any) => {
        setLoading(false)
        setClickTask(true)
        setDataNewTasks([])
        setReload(reload + 1)
        setClickChecklist(true)
        ToastMessage({type: 'success', message})
        setTimeout(() => {
          setChecklist({})
          actions.resetForm()
          setClickChecklist(false)
        }, 500)
      })
      .catch(({response}: any) => {
        setLoading(false)
        if (response) {
          const {devMessage, data, message} = response?.data || {}
          const {fields} = data || {}

          if (!devMessage) {
            if (fields && Object.keys(fields || {})?.length > 0) {
              ToastMessage({
                message: intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'}),
                type: 'error',
              })
            } else {
              ToastMessage({message, type: 'error'})
            }
          }
        }
      })
  }

  return (
    <div className='card card-custom' style={{border: '3px solid #F7F7F7'}}>
      <div className='card-body'>
        <Formik initialValues={{}} onSubmit={handleOnSubmit} enableReinitialize>
          {({setFieldValue, values}: any) => {
            return (
              <div className='row'>
                <TaskEdit
                  isGuid={isGuid}
                  reload={reload}
                  detail={detail}
                  loading={loading}
                  setGuid={setGuid}
                  clickTask={clickTask}
                  checklist={checklist}
                  setLoading={setLoading}
                  dataNewTasks={dataNewTasks}
                  setClickTask={setClickTask}
                  setFieldValue={setFieldValue}
                  clickChecklist={clickChecklist}
                  setDataNewTasks={setDataNewTasks}
                  setClickChecklist={setClickChecklist}
                  loadingDeleteTasks={loadingDeleteTasks}
                  setDetailChecklist={setDetailChecklist}
                  setLoadingDeleteTasks={setLoadingDeleteTasks}
                />

                <div
                  className='col-sm-12 col-md-6 col-lg-6'
                  style={{
                    backgroundColor: '#F7F7F7',
                    borderRadius: '10px',
                    minHeight: '100vh',
                  }}
                >
                  <TaskPreview
                    detail={detail}
                    reload={reload}
                    values={values}
                    clickTask={clickTask}
                    checklist={checklist}
                    dataNewTasks={dataNewTasks}
                    clickChecklist={clickChecklist}
                    loadingDeleteTasks={loadingDeleteTasks}
                  />
                </div>
              </div>
            )
          }}
        </Formik>
      </div>
    </div>
  )
}

TaskPage = memo(TaskPage, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default TaskPage
