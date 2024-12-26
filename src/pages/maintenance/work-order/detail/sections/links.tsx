import {Accordion} from '@components/Accordion'
import {Alert} from '@components/alert'
import Tooltip from '@components/alert/tooltip'
import {Select} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {arrayConcat} from '@helpers'
import {
  getDetailWorkOrder,
  getWorkOrderV1,
  sendLinkWorkOrder,
  sendUnLinkWorkOrder,
} from '@pages/maintenance/Service'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import map from 'lodash/map'
import {FC, Fragment, memo, useEffect, useState} from 'react'

let Links: FC<any> = ({detail}) => {
  const [data, setData] = useState<any>([])
  const [linkWorkOrder, setLinkWorkOrder] = useState<any>({})
  const [clearLink, setClearLink] = useState<any>(false)
  const [showUnliks, setShowUnliks] = useState<any>(false)
  const [linkId, setLikId] = useState<any>(0)
  const [linkName, setLikName] = useState<any>('')
  const [removeOption, setRemoveOption] = useState<any>([])
  const [linkedWorkOrderGuid, setLinkedWorkOrderGuid] = useState<any>()

  useEffect(() => {
    if (detail?.guid) {
      getDetailWorkOrder(detail?.maintenance_guid || detail?.guid || '')
        .then(({data: {data: res}}: any) => {
          if (res) {
            setData(res?.linked_maintenances || [])
            setLinkedWorkOrderGuid(arrayConcat([res?.guid], map(res?.linked_maintenances, 'guid')))
          }
        })
        .catch(() => '')
    } else {
      setData({})
    }
  }, [detail, clearLink])

  useEffect(() => {
    if (detail?.guid) {
      getWorkOrderV1({})
        .then(({data: {data: res}}: any) => {
          if (res) {
            const likedWorkOrderAvail: any = filter(res, (wo: any) =>
              includes(linkedWorkOrderGuid, wo?.guid)
            )
            setRemoveOption(
              likedWorkOrderAvail?.map(({guid, wo_id, wo_title}: any) => {
                return {
                  value: guid,
                  label: `${wo_id} - ${wo_title}`,
                }
              })
            )
          }
        })
        .catch(() => '')
    }
  }, [detail?.guid, linkedWorkOrderGuid, clearLink])

  const handleLink = () => {
    if (detail?.guid !== undefined) {
      setClearLink(true)
      const param = {link_maintenance_guid: linkWorkOrder || ''}
      sendLinkWorkOrder(detail?.guid, param)
        .then(({data}: any) => {
          setLinkWorkOrder({})
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
      const valueLink = {link_maintenance_guid: linkId || ''}
      sendUnLinkWorkOrder(detail?.guid, valueLink)
        .then(({data}: any) => {
          setLinkWorkOrder({})
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
    <strong key='link-name'>{linkName}</strong>,
    ' ?',
  ]

  return (
    <>
      <div className='card border border-gray-300'>
        <div className='card-body align-items-center p-0'>
          <Accordion id='files' default={data ? 'link' : ''}>
            <div data-value='link' data-label={`Link Work Order`}>
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
                        name='link_wo'
                        id='linkWo'
                        api={getWorkOrderV1}
                        params={false}
                        reload={false}
                        isClearable={false}
                        placeholder='Link to Work Order'
                        defaultValue={undefined}
                        removeOption={removeOption}
                        onChange={({value}: any) => {
                          setLinkWorkOrder(value)
                        }}
                        parse={({guid, wo_id, wo_title}: any) => ({
                          value: guid,
                          label: `${wo_id} - ${wo_title}`,
                        })}
                      />
                    )}
                  </div>
                  <div className='col-2'>
                    <button
                      type='submit'
                      data-cy='submitLink'
                      className='btn btn-sm btn-primary'
                      onClick={handleLink}
                    >
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
                            {`${item?.unique_id} - ${item?.title}`}
                          </p>
                          <Tooltip placement='top' title='Unlink Work Orkder'>
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
        type={'unlink'}
        title={'UnLink Work Order'}
        confirmLabel={'Unlink'}
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

Links = memo(Links, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default Links
