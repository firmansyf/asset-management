import {Accordion} from '@components/Accordion'
import {Alert} from '@components/alert'
import Tooltip from '@components/alert/tooltip'
import {Select} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {arrayConcat} from '@helpers'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import map from 'lodash/map'
import {FC, Fragment, memo, useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'

import {getTicketDetail, getTickets, sendLinkTicket, sendUnLinkTicket} from '../Service'

let TicketLinks: FC<any> = ({detailTicket}) => {
  const navigate = useNavigate()
  const [data, setData] = useState<any>({})
  const [linkTicket, setLinkTicket] = useState<any>({})
  const [clearLink, setClearLink] = useState<any>(false)
  const [showUnliks, setShowUnliks] = useState<any>(false)
  const [linkId, setLikId] = useState<any>(0)
  const [linkName, setLikName] = useState<any>('')
  const [removeOption, setRemoveOption] = useState<any>([])
  const [linkedTicketGuid, setLinkedTicketGuid] = useState<any>()
  const noSelectedLink: boolean = typeof linkTicket !== 'string'

  useEffect(() => {
    if (detailTicket?.guid) {
      getTicketDetail(detailTicket?.guid)
        .then(({data: {data: res}}: any) => {
          if (res) {
            setData(res?.ticket_links || {})
            setLinkedTicketGuid(arrayConcat([res?.guid], map(res?.ticket_links, 'guid')))
          }
        })
        .catch(() => '')
    } else {
      setData({})
    }
  }, [detailTicket?.guid, clearLink])

  useEffect(() => {
    if (detailTicket?.guid) {
      getTickets({})
        .then(({data: {data: res}}: any) => {
          if (res) {
            const likedTicketAvail: any = filter(res, (ticket: any) =>
              includes(linkedTicketGuid, ticket?.guid)
            )
            setRemoveOption(
              likedTicketAvail?.map(({guid, ticket_id, name}: any) => {
                return {
                  value: guid,
                  label: `${ticket_id} - ${name}`,
                }
              })
            )
          }
        })
        .catch(() => '')
    }
  }, [detailTicket?.guid, linkedTicketGuid, clearLink])

  const handleLink = () => {
    if (detailTicket?.guid !== undefined) {
      setClearLink(true)
      const param = {ticket_guid_links: linkTicket !== undefined ? [linkTicket] : []}
      sendLinkTicket(detailTicket?.guid, param)
        .then(({data}: any) => {
          setLinkTicket({})
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

  const handleUnlinks = () => {
    if (detailTicket?.guid !== undefined) {
      setClearLink(true)
      const valueLink = {ticket_guid_links: linkId !== undefined ? [linkId] : []}
      sendUnLinkTicket(detailTicket?.guid, valueLink)
        .then(({data}: any) => {
          setLinkTicket({})
          setShowUnliks(false)
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

  const msg_alert_unlinks = [
    'Are you sure want to remove the link on ',
    <strong key='str1'>{linkName}</strong>,
    ' ?',
  ]

  const openLink = (guid: string) => {
    navigate(`/help-desk/ticket/detail/${guid}`)
  }

  return (
    <>
      <div className='card border border-gray-300 mb-4'>
        <div className='card-body align-items-center p-0'>
          <Accordion id='files' default={data ? 'link' : ''}>
            <div data-value='link' data-label={`Link Ticket`}>
              {clearLink ? (
                <span
                  className='indicator-progress'
                  style={{display: 'block', textAlign: 'center', marginBottom: '20px'}}
                >
                  Please wait...
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              ) : (
                <div className='d-flex flex-nowrap input-group input-group-solid align-items-center p-1 mb-4'>
                  <div className='col-auto ps-2 pe-0'>
                    <i className='las la-link fs-2' />
                  </div>
                  <div className='col'>
                    {!clearLink && (
                      <Select
                        sm={true}
                        className='col p-0'
                        name='link_ticket'
                        api={getTickets}
                        params={{orderDir: 'asc', orderCol: 'ticket_id'}}
                        reload={false}
                        isClearable={false}
                        removeOption={removeOption}
                        placeholder='Link to Ticket'
                        defaultValue={{value: '', label: ''}}
                        onChange={({value}: any) => setLinkTicket(value)}
                        parse={({guid, ticket_id, name}: any) => ({
                          value: guid,
                          label: `${ticket_id} - ${name}`,
                        })}
                      />
                    )}
                  </div>
                  <Tooltip active={noSelectedLink} placement='top' title='Select asset first'>
                    <div className='col-auto'>
                      <button
                        type='submit'
                        disabled={noSelectedLink}
                        className='btn btn-icon btn-primary w-30px h-30px'
                        onClick={handleLink}
                      >
                        <i className='las la-paper-plane fs-2' />
                      </button>
                    </div>
                  </Tooltip>
                </div>
              )}

              <div className='row'>
                <hr />
                {data?.length > 0 &&
                  data?.map((item: any, index: any) => {
                    return (
                      <Fragment key={index}>
                        <div className='col-12 mb-3'>
                          <div
                            style={{
                              width: '85%',
                              float: 'left',
                              marginTop: '5px',
                              marginBottom: '0',
                            }}
                          >
                            <div
                              onClick={() => openLink(item?.guid)}
                              className='cursor-pointer text-primary me-3'
                              style={{textDecoration: 'underline', fontWeight: 500}}
                            >
                              {`${item?.ticket_id} - ${item?.name}`}
                            </div>
                          </div>
                          <Tooltip placement='top' title='Unlink Ticket'>
                            <div
                              onClick={() => {
                                setLikId(item?.guid)
                                setLikName(item?.name)
                                setShowUnliks(true)
                              }}
                              className='d-flex mx-1 align-items-center justify-content-center btn btn-icon border border-secondary h-30px w-30px btn-color-gray-600 btn-light-primary radius-10'
                              style={{float: 'right'}}
                            >
                              <i className='lar la-times-circle fs-3' />
                            </div>
                          </Tooltip>
                        </div>
                        <hr />
                      </Fragment>
                    )
                  })}
              </div>
            </div>
          </Accordion>
        </div>
      </div>

      <Alert
        setShowModal={setShowUnliks}
        showModal={showUnliks}
        loading={clearLink}
        body={msg_alert_unlinks}
        type={'delete'}
        title={'Delete Tag'}
        confirmLabel={'Delete'}
        onConfirm={() => {
          handleUnlinks()
        }}
        onCancel={() => {
          setShowUnliks(false)
        }}
      />
    </>
  )
}

TicketLinks = memo(
  TicketLinks,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default TicketLinks
