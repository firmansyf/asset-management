import {getUserV1} from '@api/UserCRUD'
import Tooltip from '@components/alert/tooltip'
import {Select} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {errorValidation, IMG} from '@helpers'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import map from 'lodash/map'
import {FC, useEffect, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {shallowEqual, useSelector} from 'react-redux'

import {addWatcherTicket, getWatcherTicket, removeWatcherTicket} from '../Service'

export const ActionWatcher: FC<any> = ({guid}) => {
  const user: any = useSelector(({currentUser}: any) => currentUser, shallowEqual)
  const [showUsers, setShowUser] = useState<any>(false)
  const [watchers, setWatchers] = useState<any>([])
  const [watchersGuid, setWatchersGuid] = useState<any>([])
  const [isWatching, setIsWaching] = useState<any>(false)
  const [reload, setReload] = useState<any>(false)
  const [removeOption, setRemoveOption] = useState<any>([])

  useEffect(() => {
    if (guid) {
      getWatcherTicket({filter: {ticket_guid: guid}})
        .then(({data: {data: res}}: any) => {
          if (res) {
            setWatchers(res)
            setWatchersGuid(map(res, 'user_guid'))
            const isMe: any = res?.find(({user_guid}: any) => user_guid === user?.guid)
            setIsWaching(isMe || false)
          }
        })
        .catch(() => '')
    }
  }, [guid, user?.guid, reload])

  useEffect(() => {
    if (guid) {
      getUserV1({})
        .then(({data: {data: res}}: any) => {
          if (res) {
            const userWatch: any = filter(res, (user: any) => includes(watchersGuid, user?.guid))
            setRemoveOption(
              userWatch?.map(({guid, first_name, last_name}: any) => {
                return {
                  value: guid,
                  label: `${first_name} ${last_name}`,
                }
              })
            )
          }
        })
        .catch(() => '')
    }
  }, [guid, watchersGuid, reload])

  const addWatcher: any = (userGuid: any) => {
    if (guid) {
      addWatcherTicket({ticket_guid: guid, user_guid: userGuid})
        .then(({data: {message}}: any) => {
          setReload(!reload)
          setShowUser(false)
          ToastMessage({type: 'success', message})
        })
        .catch((err: any) => {
          Object.values(errorValidation(err))?.map((message: any) =>
            ToastMessage({type: 'error', message})
          )
        })
    }
  }
  const removeWatcher: any = (userGuid: any) => {
    if (guid) {
      removeWatcherTicket({ticket_guid: guid, user_guid: userGuid})
        .then(({data: {message}}: any) => {
          setReload(!reload)
          ToastMessage({type: 'success', message})
        })
        .catch((err: any) => {
          Object.values(errorValidation(err))?.map((message: any) =>
            ToastMessage({type: 'error', message})
          )
        })
    }
  }
  return (
    <div className='col-auto mb-5 mx-1 pe-0'>
      <Dropdown>
        <Dropdown.Toggle variant='transparent' size='sm' className='p-0 btn-icon'>
          <Tooltip placement='top' title='Watch'>
            <div
              data-cy='watchTicket'
              className='d-flex align-items-center justify-content-center w-35px h-35px radius-10 cursor-pointer btn btn-outline btn-outline-primary shadow-sm watcher-icon'
            >
              <i className='las la-eye fs-1' />
            </div>
          </Tooltip>
        </Dropdown.Toggle>
        <Dropdown.Menu className='text-nowrap' style={{minWidth: '250px'}}>
          <div className='row m-0'>
            <div className='col-12'>
              <div
                className='d-flex align-items-center cursor-pointer pt-2 pb-3'
                onClick={() => (isWatching ? removeWatcher(user?.guid) : addWatcher(user?.guid))}
              >
                <div
                  className={`btn btn-icon w-25px h-25px radius-20 ${
                    isWatching ? 'bg-primary' : 'bg-gray-200'
                  } me-2`}
                >
                  <i className={`las la-eye fs-2 ${isWatching ? 'text-white' : 'text-gray-400'}`} />
                </div>
                <span className=''>{isWatching ? 'Stop watching' : 'Start watching'}</span>
              </div>
            </div>
            <div className='col-12 border-top border-gray-300 border-bottom py-3'>
              <p className='m-0 fs-8 text-gray-500'>WATCHING THIS ISSUE</p>
              <div className='row'>
                {watchers &&
                  watchers?.length > 0 &&
                  watchers?.map(({user_name}: any, index: number) => (
                    <div className='col-12 mt-3' key={index}>
                      <div className='d-flex align-items-center'>
                        <IMG path={'/images/blank.png'} className='h-20px rounded-circle me-2' />
                        <span className='text-capitalize'>{user_name}</span>
                        <div
                          className='btn btn-icon w-15px h-15px radius-20 bg-dark ms-auto'
                          onClick={() => removeWatcher('user_guid')}
                        >
                          <i className='las la-times text-white' />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className='col-12 mt-3 mb-1'>
              {showUsers ? (
                <div className='d-flex align-items-center'>
                  <Select
                    sm={true}
                    className='col p-0'
                    name='user'
                    api={getUserV1}
                    params={false}
                    reload={false}
                    isClearable={false}
                    placeholder='Choose User'
                    defaultValue={undefined}
                    removeOption={removeOption}
                    onChange={({value}: any) => addWatcher(value)}
                    parse={({guid, first_name, last_name}: any) => ({
                      value: guid,
                      label: `${first_name} ${last_name}`,
                    })}
                  />
                  <div
                    className='btn btn-icon w-30px h-30px radius-5 bg-gray-200 ms-2'
                    onClick={() => setShowUser(false)}
                  >
                    <i className='las la-times fs-2 text-gray-500' />
                  </div>
                </div>
              ) : (
                <div
                  className='d-flex align-items-center cursor-pointer'
                  onClick={() => setShowUser(true)}
                >
                  <i className='las la-plus text-dark fs-2' />
                  <div className='col ps-0 pe-5 text-center fw-bold'>Add Watchers</div>
                </div>
              )}
            </div>
          </div>
        </Dropdown.Menu>
      </Dropdown>

      <style>{`
        .watcher-icon > i {
          color:#050990;
        }
        .watcher-icon:hover > i {
          color:#fff;
        }
      `}</style>
    </div>
  )
}
