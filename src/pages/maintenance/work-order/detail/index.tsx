import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {hasPermission, useTimeOutMessage} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {getDetailWorkOrder} from '@pages/maintenance/Service'
import cx from 'classnames'
import {FC, memo, useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import {useLocation, useNavigate, useParams} from 'react-router-dom'

import Actions from './sections/actions'
import Cards from './sections/cards'
import Comment from './sections/comment'
import DeleteWorkOrder from './sections/delete'
import Files from './sections/files'
import General from './sections/general'
import LinkMeter from './sections/linkMeter'
import Links from './sections/links'
import WorkOrderSendEmail from './sections/sendEmail'
import Tasks from './sections/tasks'
import TimeLogWorkOrder from './sections/timeLog'
import TaskPage from './task/taskPage'

let WorkOrderDetail: FC<any> = () => {
  const location: any = useLocation()
  const navigate: any = useNavigate()
  const params: any = useParams()

  const subTitle: any = document.querySelector('.pageSubTitle')
  const {preference: preferenceStore, currentUser: user}: any = useSelector(
    ({preference, currentUser}: any) => ({preference, currentUser}),
    shallowEqual
  )
  const {feature}: any = preferenceStore || {}
  const {guid} = params || {}

  const [reload, setReload] = useState<any>([])
  const [tab, setTab] = useState<string>('general')
  const [detailWorkOrder, setData] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [workOrderGuid, setWorkOrderGuid] = useState<any>()
  const [workOrderName, setWorkOrderName] = useState<any>()
  const [reloadSendEmail, setReloadSendEmail] = useState<any>([])
  const [maintenanceAdvance, setMaintenanceAdvance] = useState<number>(0)
  const [showModalConfirm, setShowModalConfirm] = useState<boolean>(false)
  const [showModalSendEmail, setShowModalSendEmail] = useState<boolean>(false)

  const linkPermission = hasPermission('maintenance.link') || false

  const onDelete = () => {
    if (detailWorkOrder) {
      const {guid, wo_title} = detailWorkOrder || {}
      setWorkOrderName(wo_title || '')
      setWorkOrderGuid(guid || '')
      setShowModalConfirm(true)
      ToastMessage({type: 'clear'})
    }
  }

  useEffect(() => {
    setTab(location.hash ? location?.hash?.split('#')?.[1] : 'general')
  }, [location.hash])

  useEffect(() => {
    if (guid !== undefined) {
      setLoading(true)
      getDetailWorkOrder(guid)
        .then(({data: {data: res}}: any) => {
          setLoading(true)
          setData(res || {})
          setTimeout(() => setLoading(false), 400)
        })
        .catch(() => setTimeout(() => setLoading(false), 400))
    }
  }, [guid, reload])

  useEffect(() => {
    if (Object.keys(feature || {})?.length > 0) {
      const feat: any = feature?.find(({unique_name}: any) => unique_name === 'maintenance_advance')
      setMaintenanceAdvance(feat?.value || 0)
    }
  }, [feature])

  useEffect(() => {
    subTitle &&
      detailWorkOrder?.wo_title &&
      (subTitle.innerHTML = `Details of Work Order ${detailWorkOrder?.wo_id}`)
    return () => {
      subTitle && (subTitle.innerHTML = '')
    }
  }, [subTitle, detailWorkOrder])

  useEffect(() => {
    useTimeOutMessage('clear', 5000)
  }, [])

  return (
    <>
      <PageTitle breadcrumbs={[]}>{detailWorkOrder?.wo_title || 'Detail Work Order'}</PageTitle>
      {loading ? (
        <div className='row'>
          <div className='col-12 text-center'>
            <PageLoader height={250} />
          </div>
        </div>
      ) : (
        <>
          <Actions
            data={detailWorkOrder}
            onDelete={onDelete}
            reload={reload}
            setReload={setReload}
            setShowModalEmail={setShowModalSendEmail}
            maintenanceAdvance={maintenanceAdvance}
          />

          <Cards detail={detailWorkOrder} />

          <div className='row'>
            <div className='col-md-8'>
              <div className='card border border-2 mb-5'>
                <div className='card-header align-items-center px-4'>
                  <h3 className='card-title fw-bold fs-3 m-0' data-cy='card-title'>
                    Work Order Information
                  </h3>
                </div>

                <div className='card-body align-items-center p-0'>
                  <ul className='nav nav-tabs nav-line-tabs nav-line-tabs-2x fs-6 bg-gray-100'>
                    <li className='nav-item'>
                      <div
                        className={cx(
                          'm-0 px-5 py-3 cursor-pointer',
                          tab === 'general' && 'bg-primary border-primary text-white fw-bolder'
                        )}
                        onClick={() => {
                          navigate({...location, hash: 'general'}, {replace: true})
                          setTab('general')
                        }}
                      >
                        Work Order Detail
                      </div>
                    </li>
                    <li className='nav-item'>
                      <div
                        className={cx(
                          'm-0 px-5 py-3 cursor-pointer',
                          tab === 'tasks' && 'bg-primary border-primary text-white fw-bolder'
                        )}
                        onClick={() => {
                          navigate({...location, hash: 'tasks'}, {replace: true})
                          setTab('tasks')
                        }}
                      >
                        Task
                      </div>
                    </li>
                  </ul>
                  <div className='tab-content'>
                    <div
                      className={cx(
                        'tab-pane fade',
                        {show: tab === 'general'},
                        {active: tab === 'general'}
                      )}
                    >
                      {loading ? <PageLoader height={250} /> : <General detail={detailWorkOrder} />}
                    </div>
                    <div
                      className={cx(
                        'tab-pane fade',
                        {show: tab === 'tasks'},
                        {active: tab === 'tasks'}
                      )}
                    >
                      {loading ? (
                        <PageLoader height={250} />
                      ) : (
                        <TaskPage detail={detailWorkOrder} tabs={tab} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-md-4'>
              {detailWorkOrder?.status?.unique_id !== 'completed' && (
                <TimeLogWorkOrder detail={detailWorkOrder} user={user} />
              )}

              {maintenanceAdvance === 1 && linkPermission && <Links detail={detailWorkOrder} />}
              <Tasks detail={detailWorkOrder} setReload={setReload} reload={reload} />
              {maintenanceAdvance === 1 && (
                <LinkMeter detail={detailWorkOrder} setReload={setReload} reload={reload} />
              )}
              <Files data={detailWorkOrder} />
              <Comment data={detailWorkOrder} />
            </div>
          </div>

          <DeleteWorkOrder
            showModal={showModalConfirm}
            setShowModal={setShowModalConfirm}
            setReloadWorkOrder={setReload}
            reloadWorkOrder={reload}
            workOrderGuid={workOrderGuid}
            workOrderName={workOrderName}
          />

          <WorkOrderSendEmail
            showModal={showModalSendEmail}
            setShowModal={setShowModalSendEmail}
            reloadSendEmail={reloadSendEmail}
            setReloadSendEmail={setReloadSendEmail}
            detail={detailWorkOrder}
          />
        </>
      )}
    </>
  )
}

WorkOrderDetail = memo(
  WorkOrderDetail,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default WorkOrderDetail
