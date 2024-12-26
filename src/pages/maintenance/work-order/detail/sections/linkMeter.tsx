import {Accordion} from '@components/Accordion'
import {Alert} from '@components/alert'
import Tooltip from '@components/alert/tooltip'
import {Select} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {arrayConcat} from '@helpers'
import {
  getDetailWorkOrder,
  getMeter,
  sendLinkMeter,
  sendUnLinkMeter,
} from '@pages/maintenance/Service'
import {filter, includes, map} from 'lodash'
import {FC, Fragment, memo, useEffect, useState} from 'react'

let LinkMeter: FC<any> = ({detail, setReload, reload}) => {
  const [data, setData] = useState<any>([])
  const [linkMeter, setLinkMeter] = useState<any>({})
  const [clearLink, setClearLink] = useState<any>(false)
  const [showUnliks, setShowUnliks] = useState<any>(false)
  const [linkId, setLikId] = useState<any>(0)
  const [linkName, setLikName] = useState<any>('')
  const [removeOption, setRemoveOption] = useState<any>([])
  const [linkedMeterGuid, setLinkedMeterGuid] = useState<any>()

  useEffect(() => {
    if (detail?.guid) {
      getDetailWorkOrder(detail?.maintenance_guid || detail?.guid || '')
        .then(({data: {data: res}}: any) => {
          if (res) {
            setData(res?.linked_maintenance_meters || {})
            setLinkedMeterGuid(
              arrayConcat([res?.guid], map(res?.linked_maintenance_meters, 'guid'))
            )
          }
        })
        .catch(() => '')
    } else {
      setData([])
    }
  }, [detail, clearLink, showUnliks, reload])

  useEffect(() => {
    if (detail?.guid) {
      getMeter({})
        .then(({data: {data: res}}: any) => {
          if (res) {
            const likedMeterAvail: any = filter(res, (ticket: any) =>
              includes(linkedMeterGuid, ticket?.guid)
            )
            setRemoveOption(
              likedMeterAvail?.map(({guid, ticket_id, name}: any) => {
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
  }, [detail?.guid, linkedMeterGuid, clearLink])

  const handleLink = () => {
    if (detail?.guid !== undefined) {
      setClearLink(true)
      const param = {maintenance_guid: detail?.maintenance_guid || detail?.guid || ''}
      sendLinkMeter(linkMeter || '', param)
        .then(({data}: any) => {
          setLinkMeter({})
          setReload(reload + 1)
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
    if (detail?.guid !== undefined) {
      setClearLink(true)
      const valueLink = {maintenance_guid: detail?.maintenance_guid || detail?.guid || '' || ''}
      sendUnLinkMeter(linkId || '', valueLink)
        .then(({data}: any) => {
          setLinkMeter({})
          setReload(reload + 1)
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

  return (
    <>
      <div className='card border border-gray-300 mt-4'>
        <div className='card-body align-items-center p-0'>
          <Accordion id='files' default={data ? 'link' : ''}>
            <div data-value='link' data-label={`Link to Meter`}>
              {clearLink ? (
                <span
                  className='indicator-progress'
                  style={{display: 'block', textAlign: 'center', marginBottom: '20px'}}
                >
                  Please wait...
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              ) : (
                <div className='row mb-4'>
                  <div className='col-1'>
                    <i
                      className='las la-link position-absolute'
                      style={{
                        marginTop: '10px',
                        fontSize: '20px',
                      }}
                    ></i>
                  </div>
                  <div className='col-9'>
                    {!clearLink && (
                      <Select
                        sm={true}
                        className='col p-0'
                        name='link_ticket'
                        api={getMeter}
                        params={{
                          is_not_linked: 1,
                        }}
                        reload={false}
                        isClearable={false}
                        placeholder='Link to Meter'
                        defaultValue={undefined}
                        removeOption={removeOption}
                        onChange={({value}: any) => setLinkMeter(value)}
                        parse={({guid, name}: any) => ({
                          value: guid,
                          label: `${name}`,
                        })}
                      />
                    )}
                  </div>
                  <div className='col-2'>
                    <button type='submit' className='btn btn-sm btn-primary' onClick={handleLink}>
                      <i
                        className='las la-paper-plane'
                        style={{fontSize: '20px', padding: '10px 0px'}}
                      ></i>
                    </button>
                  </div>
                </div>
              )}

              <div className='row'>
                <hr />
                {data?.length > 0 &&
                  data?.map((item: any, index: any) => {
                    return (
                      <Fragment key={index}>
                        <div className='col-12 mb-3'>
                          <p
                            style={{
                              width: '85%',
                              float: 'left',
                              marginTop: '5px',
                              marginBottom: '0',
                            }}
                          >
                            {`${item?.name}`}
                          </p>
                          <Tooltip placement='top' title='Unlink Meter'>
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

LinkMeter = memo(LinkMeter, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default LinkMeter
