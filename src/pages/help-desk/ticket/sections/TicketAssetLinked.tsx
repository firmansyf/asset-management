import {Accordion} from '@components/Accordion'
import {Alert} from '@components/alert'
import Tooltip from '@components/alert/tooltip'
import {Select} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {arrayConcat} from '@helpers'
import {getAssetV1} from '@pages/asset-management/redux/AssetRedux'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import map from 'lodash/map'
import {FC, memo, useEffect, useState} from 'react'
import {Link} from 'react-router-dom'

import {getTicketAssetLinked, removeTicketAssetLinked, sendTicketAssetLinked} from '../Service'

const TicketAssetLink: FC<any> = ({detailTicket, setReload, reload}) => {
  const [data, setData] = useState<any>([])
  const [linkId, setLikId] = useState<string>('')
  const [linkName, setLikName] = useState<string>('')
  const [linkAsset, setLinkAsset] = useState<any>({})
  const [removeOption, setRemoveOption] = useState<any>([])
  const [clearLink, setClearLink] = useState<boolean>(false)
  const [showUnliks, setShowUnliks] = useState<boolean>(false)
  const [linkedAssetGuid, setLinkedAssetGuid] = useState<any>()

  const noSelectedLink: boolean = typeof linkAsset !== 'string'

  useEffect(() => {
    detailTicket?.guid
      ? getTicketAssetLinked(detailTicket?.guid || '').then(({data: {data: res}}: any) => {
          res && setData(res || {})
          res && setLinkedAssetGuid(arrayConcat([detailTicket?.guid], map(res, 'guid')))
        })
      : setData([])
  }, [detailTicket, clearLink, showUnliks, reload])

  useEffect(() => {
    if (detailTicket?.guid) {
      getAssetV1({}).then(({data: {data: res}}: any) => {
        if (res) {
          const likedAssetAvail: any = filter(res, (asset: any) =>
            includes(linkedAssetGuid, asset?.asset_guid)
          )

          const linkedAssetData: any =
            likedAssetAvail &&
            likedAssetAvail?.length > 0 &&
            likedAssetAvail?.map(({asset_guid, asset_id, asset_name}: any) => {
              return {
                value: asset_guid,
                label: `${asset_id} - ${asset_name}`,
              }
            })
          setRemoveOption(linkedAssetData as never[])
        }
      })
    }
  }, [detailTicket?.guid, linkedAssetGuid, clearLink])

  const handleLink = () => {
    if (detailTicket?.guid !== undefined) {
      setClearLink(true)
      const param: any = {asset_guid_links: [linkAsset || '']}
      sendTicketAssetLinked(detailTicket?.guid, param)
        .then(({data: {message}}: any) => {
          setLinkAsset({})
          setClearLink(false)
          setReload(reload + 1)
          ToastMessage({type: 'success', message})
        })
        .catch(({response}: any) => {
          setClearLink(false)
          if (response) {
            const {devMessage, data, message} = response?.data || {}
            if (!devMessage) {
              const {fields} = data || {}

              if (fields === undefined) {
                ToastMessage({message, type: 'error'})
              }

              if (fields) {
                Object.keys(fields || {})?.map((item: any) => {
                  ToastMessage({message: fields[item]?.[0] || '', type: 'error'})
                  return true
                })
              }
            } else if (devMessage) {
              ToastMessage({message: devMessage, type: 'error'})
            }
          }
        })
    }
  }

  const handleUnlinks = () => {
    if (detailTicket?.guid !== undefined) {
      setClearLink(true)
      const param: any = {asset_guid_links: [linkId]}
      removeTicketAssetLinked(detailTicket?.guid, param)
        .then(({data: {message}}: any) => {
          setLinkAsset({})
          setClearLink(false)
          setShowUnliks(false)
          setReload(reload + 1)
          ToastMessage({type: 'success', message})
        })
        .catch(({response}: any) => {
          setClearLink(false)
          if (response) {
            const {devMessage, data, message} = response?.data || {}
            if (!devMessage) {
              const {fields} = data || {}

              if (fields === undefined) {
                ToastMessage({message, type: 'error'})
              }

              if (fields) {
                Object.keys(fields || {})?.map((item: any) => {
                  ToastMessage({message: fields[item]?.[0] || '', type: 'error'})
                  return true
                })
              }
            }
          }
        })
    }
  }

  const msg_alert_unlinks: any = [
    'Are you sure want to remove the link on ',
    <strong key='str1'>{linkName || ''}</strong>,
    ' ?',
  ]

  return (
    <>
      <div className='card border border-gray-300 mb-6 mt-6'>
        <div className='card-body align-items-center p-0'>
          <Accordion id='files' default={data ? 'link' : ''}>
            <div data-value='link' data-label={`Link Asset(s)`}>
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
                        api={getAssetV1}
                        params={{
                          is_not_linked: 1,
                          orderCol: 'asset_id',
                          orderDir: 'asc',
                        }}
                        reload={false}
                        name='link_ticket'
                        isClearable={false}
                        className='text-nowrap'
                        defaultValue={undefined}
                        removeOption={removeOption}
                        placeholder='Type Asset ID to add'
                        onChange={({value}: any) => setLinkAsset(value)}
                        parse={({asset_guid, asset_id, asset_name}: any) => ({
                          value: asset_guid || '',
                          label: `${asset_id || ''} - ${asset_name || ''}`,
                        })}
                      />
                    )}
                  </div>

                  <Tooltip active={noSelectedLink} placement='top' title='Select asset first'>
                    <div className='col-auto'>
                      <button
                        type='submit'
                        onClick={handleLink}
                        disabled={noSelectedLink}
                        className='btn btn-icon btn-primary w-30px h-30px'
                      >
                        <i className='las la-plus fs-2' />
                      </button>
                    </div>
                  </Tooltip>
                </div>
              )}
              <div className='row'>
                {data &&
                  data?.length > 0 &&
                  data?.map((item: any, index: any) => {
                    return (
                      <div
                        key={index || ''}
                        className='col-12 mb-0 pb-4 pt-4 border-top border-1 border-top-solid border-secondary'
                      >
                        <p
                          style={{
                            width: '85%',
                            float: 'left',
                            marginTop: '5px',
                            marginBottom: '0',
                          }}
                        >
                          <Link
                            className='link-primary'
                            to={`/asset-management/detail/${item?.guid || ''}`}
                          >
                            <div className='link-primary'>
                              {`${item?.unique_id || ''} - ${item?.name || ''}`}
                            </div>
                          </Link>
                        </p>
                        <Tooltip placement='top' title='Unlink Asset'>
                          <div
                            onClick={() => {
                              setShowUnliks(true)
                              setLikId(item?.guid || '')
                              setLikName(`${item?.unique_id || ''} - ${item?.name || ''}`)
                            }}
                            className='d-flex mx-1 align-items-center justify-content-center btn btn-icon border border-secondary h-30px w-30px btn-color-gray-600 btn-light-primary radius-10'
                            style={{float: 'right'}}
                          >
                            <i className='lar la-times-circle fs-3' />
                          </div>
                        </Tooltip>
                      </div>
                    )
                  })}
              </div>
            </div>
          </Accordion>
        </div>
      </div>

      <Alert
        type={'delete'}
        loading={clearLink}
        showModal={showUnliks}
        title={'Delete Asset'}
        confirmLabel={'Delete'}
        body={msg_alert_unlinks}
        setShowModal={setShowUnliks}
        onConfirm={() => handleUnlinks()}
        onCancel={() => setShowUnliks(false)}
      />
    </>
  )
}

const TicketAssetLinked = memo(
  TicketAssetLink,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default TicketAssetLinked
