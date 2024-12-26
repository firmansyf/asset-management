import Tooltip from '@components/alert/tooltip'
import {Select} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {getTickets, sendLinkForum} from '@pages/help-desk/ticket/Service'
import {FC, useEffect, useState} from 'react'

const Links: FC<any> = ({guid}) => {
  const [clearLink, setClearLink] = useState<any>(false)
  const [data, setData] = useState<any>([])
  const [ticketGuid, setTicketGuid] = useState<any>([])

  useEffect(() => {
    setClearLink(false)
    setData([])
  }, [])

  const handleLink = () => {
    if (guid !== undefined) {
      setClearLink(true)
      const param = {forum_guid_links: guid !== undefined ? [guid] : []}
      sendLinkForum(ticketGuid, param)
        .then(({data}: any) => {
          setClearLink(false)
          ToastMessage({type: 'success', message: data?.message})
        })
        .catch((error: any) => {
          setClearLink(false)
          if (error?.response) {
            const {devMessage, data, message} = error?.response?.data || {}
            if (!devMessage) {
              const {fields} = data || {}
              if (fields === undefined) {
                ToastMessage({message: message, type: 'error'})
              }
              if (fields) {
                Object.keys(fields || {})?.map((item: any) => {
                  ToastMessage({message: fields?.[item]?.[0], type: 'error'})
                  return true
                })
              }
            }
          }
        })
    }
  }

  return (
    <div className='card'>
      <div className='card-body py-3 px-4'>
        {clearLink ? (
          <span
            className='indicator-progress'
            style={{display: 'block', textAlign: 'center', marginBottom: '20px'}}
          >
            Please wait...
            <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
          </span>
        ) : (
          <div className='d-flex flex-nowrap input-group input-group-solid align-items-center p-1'>
            <div className='col'>
              {!clearLink && (
                <Select
                  id=''
                  name=''
                  sm={true}
                  api={getTickets}
                  params={false}
                  reload={false}
                  className='col p-0'
                  isClearable={false}
                  defaultValue={undefined}
                  placeholder='Link to Forum'
                  onChange={({value}: any) => setTicketGuid(value)}
                  parse={(e: any) => {
                    return {
                      value: e?.guid,
                      label: `${e?.ticket_id} - ${e?.name}`,
                    }
                  }}
                />
              )}
            </div>
            <div className='col-auto me-1'>
              <button
                type='submit'
                className='btn btn-icon btn-primary w-30px h-30px'
                onClick={handleLink}
              >
                <i className='las la-paper-plane' style={{fontSize: '20px', padding: '10px 0px'}} />
              </button>
            </div>
          </div>
        )}

        {data?.length > 0 && (
          <div className='max-h-250px overflow-auto mt-3'>
            {data?.map((item: any, index: number) => {
              return (
                <div
                  className='d-flex align-items-center radius-5 p-2 bg-hover-gray-100'
                  key={index}
                >
                  <div className='col'>{`${item?.unique_id} - ${item?.title}`}</div>
                  <Tooltip placement='top' title='Unlink Forum'>
                    <div
                      onClick={() => ''}
                      className='cl-auto d-flex ms-auto align-items-center justify-content-center btn btn-icon border border-secondary h-30px w-30px btn-color-gray-600 btn-light-primary radius-10'
                    >
                      <i className='lar la-times-circle fs-3' />
                    </div>
                  </Tooltip>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export {Links}
