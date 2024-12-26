import {Alert} from '@components/alert'
import {Select as Option} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {getDetailWorkOrder} from '@pages/maintenance/Service'
import {getMaintenanceChecklist} from '@pages/setup/maintenance/checklist/Service'
import {Form} from 'formik'
import {FC, useEffect, useRef, useState} from 'react'
import {Button} from 'react-bootstrap'

import {OptionTask} from './optionTask'
import {OptionTaskSelect} from './optionTaskSelect'
import {deleteTaskWO} from './service'

const TaskEdit: FC<any> = ({
  detail,
  setClickChecklist,
  setClickTask,
  clickTask,
  clickChecklist,
  setFieldValue,
  setDetailChecklist,
  setGuid,
  checklist,
  loading,
  setLoading,
  isGuid,
  setChecklist,
  loadingDeleteTasks,
  setLoadingDeleteTasks,
  reload,
  dataNewTasks,
  setDataNewTasks,
}) => {
  const {guid}: any = detail || {}
  const refCurrent: any = useRef()

  const [dataTasks, setDataTasks] = useState<any>([])
  const [newTasks, setNewTasks] = useState<boolean>(true)
  const [typeChecklist, setTypeChecklist] = useState<any>(true)
  const [showModalDel, setShowModalDelete] = useState<boolean>(false)
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true)

  const msg_alert: any = ['Are you sure you want to delete this task ?']

  const confirmDeleteTask = () => {
    setLoading(true)
    setLoadingDeleteTasks(true)

    if (typeChecklist === 'new') {
      const opt: any = dataNewTasks
        ?.filter(({order}: any) => order !== isGuid)
        ?.map((item: any) => item)

      setLoading(false)
      setShowModalDelete(false)
      setDataNewTasks([...opt])
      dataNewTasks?.length === 0 && setNewTasks(false)
    } else if (typeChecklist === 'checklist') {
      setLoading(false)
      setShowModalDelete(false)
      setChecklist(checklist?.filter(({guid}: any) => guid !== isGuid) as never[])
    } else {
      deleteTaskWO(isGuid)
        .then(({data: {message}}: any) => {
          setLoading(false)
          setShowModalDelete(false)
          setLoadingDeleteTasks(false)
          ToastMessage({type: 'success', message})
          dataTasks?.length === 0 && setClickTask(!clickTask)
        })
        .catch(() => {
          setLoading(false)
          setLoadingDeleteTasks(false)
        })
    }
  }

  useEffect(() => {
    guid !== undefined &&
      getDetailWorkOrder(guid).then(({data: {data: res}}) => {
        res && setDataTasks(res?.tasks as never[])
      })
  }, [guid, loadingDeleteTasks, reload])

  useEffect(() => {
    setButtonDisabled(clickTask || clickChecklist ? false : true)
  }, [clickTask, clickChecklist])

  useEffect(() => {
    setButtonDisabled(dataNewTasks?.length === 0 && checklist?.length === 0 ? true : false)
  }, [checklist, dataNewTasks])

  const addTask = () => {
    const taskLast: any = dataNewTasks
      // ?.sort((a: any, b: any) => (a?.order?.toLowerCase() < b.order?.toLowerCase() ? 1 : -1))
      ?.sort((a: any, b: any) => (a?.order < b?.order ? 1 : -1))
      ?.map((res: any) => res)

    if (dataNewTasks && dataNewTasks?.length === 0) {
      const currentValue: any = []
      dataTasks.forEach((item: any, key: number) => {
        currentValue.push({
          order: key,
          task_status_guid: '',
          name: item?.name || '',
          user_guid: item?.user?.guid || '',
          description: item?.description || '',
        })
      })
      setDataNewTasks(currentValue)
    }

    const currentValue: any = {
      name: '',
      user_guid: '',
      description: '',
      task_status_guid: '',
      order: taskLast?.[0] !== undefined ? taskLast?.[0]?.order + 1 : 1,
    }
    setDataNewTasks([...dataNewTasks, currentValue])
    refCurrent?.current?.focus()
  }

  return (
    <>
      <div className='col-12 mb-5 pb-5' style={{textAlign: 'right'}}>
        <button
          className='btn btn-sm btn-primary mx-2 fs-12'
          onClick={() => {
            addTask()
            setNewTasks(true)
            setClickTask(true)
          }}
        >
          + Task
        </button>

        <button
          className='btn btn-sm btn-light-primary fs-12'
          onClick={() => setClickChecklist(!clickChecklist)}
        >
          + Checklist
        </button>
      </div>

      <div className='col-sm-12 col-md-6 col-lg-6'>
        <div className='card card-custom'>
          <div className='option-task'>
            <Form>
              {clickChecklist && (
                <div className='col-md-12'>
                  <label htmlFor='checklist' className='mb-3 fs-12'>
                    Select a checklist to this work order :
                  </label>
                  <Option
                    sm={true}
                    params={false}
                    reload={false}
                    id='checklist'
                    name='checklist'
                    className='col p-0'
                    api={getMaintenanceChecklist}
                    placeholder='Choose Checklist'
                    onChange={({value}: any) => setDetailChecklist(value || '')}
                    parse={({guid, name}: any) => ({value: guid || '', label: name || ''})}
                  />
                </div>
              )}

              <div className='col-md-12 mt-5 mb-3'>
                {clickTask && newTasks && (
                  <OptionTask
                    type='new'
                    detail={detail}
                    setGuid={setGuid}
                    dataNewTasks={dataNewTasks}
                    setFieldValue={setFieldValue}
                    setTypeChecklist={setTypeChecklist}
                    setShowModalDelete={setShowModalDelete}
                  />
                )}

                {clickTask && (
                  <OptionTaskSelect
                    type='update'
                    setGuid={setGuid}
                    tasks={dataTasks}
                    detail={detail}
                    setFieldValue={setFieldValue}
                    setTypeChecklist={setTypeChecklist}
                    setShowModalDelete={setShowModalDelete}
                  />
                )}

                {clickChecklist && checklist?.length > 0 && (
                  <OptionTaskSelect
                    id={guid}
                    type='checklist'
                    detail={detail}
                    setGuid={setGuid}
                    tasks={checklist as never[]}
                    setFieldValue={setFieldValue}
                    setTypeChecklist={setTypeChecklist}
                    setShowModalDelete={setShowModalDelete}
                  />
                )}
              </div>

              <div className='my-5 float-end'>
                <Button
                  form-id=''
                  type='submit'
                  variant='primary'
                  className='btn-sm mx-2'
                  disabled={buttonDisabled}
                  onClick={() => {
                    setNewTasks(false)
                    setClickChecklist(false)
                  }}
                >
                  {!loading && <span className='indicator-label'>Save</span>}

                  {loading && (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Please wait...
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}
                </Button>

                <Button
                  form-id=''
                  type='button'
                  className='btn-sm'
                  variant='secondary'
                  onClick={() => {
                    setDataNewTasks([])
                    setClickTask(false)
                    setClickChecklist(false)
                    setFieldValue('name', '')
                    setFieldValue('user_guid', '')
                    setFieldValue('description', '')
                    setFieldValue('task_status_guid', '')
                  }}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>

      <Alert
        type={'delete'}
        body={msg_alert}
        loading={loading}
        title={'Delete Task'}
        confirmLabel={'Delete'}
        showModal={showModalDel}
        setShowModal={setShowModalDelete}
        onConfirm={() => confirmDeleteTask()}
        onCancel={() => setShowModalDelete(false)}
      />
    </>
  )
}

export default TaskEdit
