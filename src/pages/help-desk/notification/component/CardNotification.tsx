import {ToastMessage} from '@components/toast-message'
import {postReadNotification} from '@pages/help-desk/notification/Service'
import cx from 'classnames'
import {FC, useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'

import NotificationRead from './NotificationRead'
import NotificationUnread from './NotificationUnread'

const CardNotification: FC<any> = ({module}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [tab, setTab] = useState<string>('unread')
  const [totalRead, setTotalRead] = useState<number>(0)
  const [totalUnread, setTotalUnread] = useState<number>(0)
  const [reload, setReload] = useState<number>(1)
  const [dataCheckedRead, setDataCheckedRead] = useState<any>([])
  const [dataCheckedUnRead, setDataCheckedUnRead] = useState<any>([])
  const [checkedUnRead, setCheckedUnRead] = useState<boolean>(false)
  const [pageUnRead, setPageUnRead] = useState<number>(1)

  useEffect(() => {
    setTab(location.hash ? location.hash.split('#')[1] : 'unread')
  }, [location.hash])

  const markAsReadAction = () => {
    if (dataCheckedUnRead?.length > 0) {
      const params: any = {
        guids: dataCheckedUnRead,
      }
      postReadNotification(params).then(({data: res}: any) => {
        const {message}: any = res
        ToastMessage({message, type: 'success'})
        // setPageUnRead(1)
        setCheckedUnRead(false)
        setDataCheckedUnRead([])
        setReload(reload + 1)
      })
    }
  }

  return (
    <div className='card card-custom card-table'>
      <ul className='nav nav-tabs nav-line-tabs nav-line-tabs-2x fs-6 bg-gray-100'>
        <li className='nav-item'>
          <div
            className={cx(
              'm-0 px-5 py-3 cursor-pointer',
              tab === 'unread' && 'bg-primary border-primary text-white fw-bolder'
            )}
            onClick={() => {
              navigate({...location, hash: 'unread'}, {replace: true})
              setTab('unread')
            }}
          >
            Unread
            <div
              className={cx('btn btn-sm', tab === 'unread' ? 'btn-light' : 'btn-primary')}
              style={{
                padding: '5px 10px',
                float: 'right',
                fontSize: '10px',
                marginTop: '-3px',
                marginLeft: '10px',
              }}
            >
              {totalUnread}
            </div>
          </div>
        </li>
        <li className='nav-item'>
          <div
            className={cx(
              'm-0 px-5 py-3 cursor-pointer',
              tab === 'read' && 'bg-primary border-primary text-white fw-bolder'
            )}
            onClick={() => {
              navigate({...location, hash: 'read'}, {replace: true})
              setTab('read')
            }}
          >
            Read
            <div
              className={cx('btn btn-sm', tab === 'read' ? 'btn-light' : 'btn-primary')}
              style={{
                padding: '5px 10px',
                float: 'right',
                fontSize: '10px',
                marginTop: '-3px',
                marginLeft: '10px',
              }}
            >
              {totalRead}
            </div>
          </div>
        </li>
        <li className='nav-item' style={{position: 'absolute', right: 0}}>
          {dataCheckedUnRead?.length > 0 && checkedUnRead && tab !== 'read' ? (
            <div
              className={cx(
                'm-0 px-10 py-3 cursor-pointer bg-primary border-primary text-white fw-bolder'
              )}
              onClick={() => {
                markAsReadAction()
              }}
            >
              Mark all as Read
            </div>
          ) : (
            <div
              className={cx('m-0 px-10 py-3 bg-secondary border-secondary text-white fw-bolder')}
            >
              Mark all as Read
            </div>
          )}
        </li>
      </ul>
      <div className='tab-content'>
        <div className={cx('tab-pane fade', {show: tab === 'unread'}, {active: tab === 'unread'})}>
          <NotificationUnread
            module={module}
            setTotalUnread={setTotalUnread}
            reload={reload}
            setReload={setReload}
            dataChecked={dataCheckedUnRead}
            setDataChecked={setDataCheckedUnRead}
            setCheckedUnRead={setCheckedUnRead}
            page={pageUnRead}
            setPage={setPageUnRead}
          />
        </div>
        <div className={cx('tab-pane fade', {show: tab === 'read'}, {active: tab === 'read'})}>
          <NotificationRead
            module={module}
            setTotalRead={setTotalRead}
            reload={reload}
            setReload={setReload}
            dataChecked={dataCheckedRead}
            setDataChecked={setDataCheckedRead}
          />
        </div>
      </div>
    </div>
  )
}

export default CardNotification
