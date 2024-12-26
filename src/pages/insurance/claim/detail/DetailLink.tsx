/* eslint-disable react-hooks/exhaustive-deps */
import {Accordion} from '@components/Accordion'
import {Alert} from '@components/alert'
import Tooltip from '@components/alert/tooltip'
import {Select} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {arrayConcat} from '@helpers'
import {filter, includes, map} from 'lodash'
import {FC, memo, useEffect, useState} from 'react'

import {getInsuranceClaim, getSearchLink, sendLink, sendUnLink} from '../Service'

let DetailLinkCase: FC<any> = ({detailInsurance, setReload}) => {
  const [data, setData] = useState<any>({})
  const [linkInsurance, setLinkInsurance] = useState<any>({})
  const [clearLink, setClearLink] = useState<boolean>(false)
  const [showUnliks, setShowUnliks] = useState<boolean>(false)
  const [linkId, setLikId] = useState<string>('')
  const [linkName, setLikName] = useState<string>('')
  const [removeOption, setRemoveOption] = useState<any>([])
  const [linkedInsuranceGuid, setLinkedInsuranceGuid] = useState<any>()

  useEffect(() => {
    if (detailInsurance?.guid) {
      setData(detailInsurance?.link_cases || [])
      setLinkedInsuranceGuid(
        arrayConcat([detailInsurance?.guid], map(detailInsurance?.link_cases, 'guid'))
      )
    } else {
      setData({})
    }
  }, [detailInsurance, clearLink])

  useEffect(() => {
    if (detailInsurance?.guid) {
      getInsuranceClaim({}).then(({data: {data: res}}: any) => {
        if (res) {
          const likedInsuranceAvail: any = filter(res, (insurance: any) =>
            includes(linkedInsuranceGuid, insurance?.guid)
          )
          setRemoveOption(
            likedInsuranceAvail.map(({guid, case_id, case_title}: any) => {
              return {
                value: guid,
                label: `${case_id} - ${case_title}`,
              }
            })
          )
        }
      })
    }
  }, [clearLink])

  const handleLink = () => {
    const params: any = {
      insurance_claim_guid: detailInsurance?.guid || '',
      insurance_claim_link_guid: linkInsurance || '',
    }

    if (detailInsurance?.guid !== undefined) {
      setClearLink(true)
      sendLink(params)
        .then(({data: {message}}: any) => {
          setLinkInsurance({})
          setClearLink(false)
          setReload((reload: any) => !reload)
          ToastMessage({type: 'success', message})
        })
        .catch(({response}: any) => {
          setClearLink(false)
          const {devMessage, data: dataRes, message}: any = response?.data || {}
          const {insurance_claim_link_guid}: any = message || {}

          if (response) {
            if (insurance_claim_link_guid && insurance_claim_link_guid?.length > 0) {
              insurance_claim_link_guid?.forEach((item: any) => {
                ToastMessage({message: item, type: 'error'})
              })
            } else if (!devMessage) {
              const {fields}: any = dataRes || {}
              if (fields === undefined) {
                ToastMessage({message: message, type: 'error'})
              } else {
                Object.keys(fields || {})?.forEach((item: any) => {
                  ToastMessage({message: fields?.[item]?.[0], type: 'error'})
                })
              }
            }
          }
        })
    }
  }

  const handleUnlinks = () => {
    if (detailInsurance?.guid !== undefined) {
      setClearLink(true)
      sendUnLink(linkId)
        .then(({data: {message}}: any) => {
          setLinkInsurance({})
          setShowUnliks(false)
          setClearLink(false)
          setReload((reload: any) => !reload)
          ToastMessage({type: 'success', message})
        })
        .catch(({response}: any) => {
          setClearLink(false)
          if (response) {
            const {devMessage, data, message}: any = response?.data || {}
            const {fields}: any = data || {}

            if (!devMessage) {
              if (fields === undefined) {
                ToastMessage({message, type: 'error'})
              } else {
                Object.keys(fields || {})?.forEach((item: any) => {
                  ToastMessage({message: fields[item]?.[0], type: 'error'})
                })
              }
            }
          }
        })
    }
  }

  const msg_alert_unlinks: any = [
    'Are you sure want to remove the link on ',
    <strong key='link-name'>{linkName}</strong>,
    ' ?',
  ]

  return (
    <>
      <div className='card border border-gray-300 mt-4'>
        <div className='card-body align-items-center p-0'>
          <Accordion id='files' default={data ? 'link' : ''}>
            <div data-value='link' data-label={`Link Case(s)`}>
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
                  <div className='col-8'>
                    {!clearLink && detailInsurance?.guid !== null && (
                      <Select
                        sm={true}
                        className='col p-0'
                        name='link_insurance'
                        api={getSearchLink}
                        params={{guid: detailInsurance?.guid}}
                        reload={false}
                        isClearable={false}
                        placeholder='Type Case ID to add'
                        defaultValue={undefined}
                        removeOption={removeOption}
                        onChange={({value}: any) => setLinkInsurance(value)}
                        parse={({guid, case_id, case_title}: any) => ({
                          value: guid,
                          label: `${case_id} - ${case_title}`,
                        })}
                      />
                    )}
                  </div>
                  <div className='col-3'>
                    <button
                      data-cy='saveLink'
                      type='submit'
                      className='btn btn-sm btn-primary'
                      onClick={handleLink}
                    >
                      <i
                        className='las la-plus'
                        style={{fontSize: '20px', padding: '10px 0px'}}
                      ></i>
                    </button>
                  </div>
                </div>
              )}

              {data?.length > 0 &&
                data?.map((item: any, index: any) => {
                  const key: any = index + 1
                  return (
                    <div
                      className='row'
                      key={key}
                      style={{
                        borderTop: '1px solid #e2e6ee',
                        borderBottom: '1px solid  #e2e6ee',
                        padding: '10px 0px',
                      }}
                    >
                      <div className='col-10 mb-3'>
                        <div
                          style={{
                            marginTop: '5px',
                            marginBottom: '-25px',
                          }}
                        >
                          <a
                            href={
                              item?.insurance_claim_guid !== undefined &&
                              item?.insurance_claim_guid !== null
                                ? `/insurance-claims/${item?.insurance_claim_guid}/detail`
                                : 'javascript:void(0)'
                            }
                            className='cursor-pointer text-primary me-3'
                            style={{textDecoration: 'underline', fontWeight: 500}}
                          >
                            {`${item?.case_id} - ${item?.case_title}`}
                          </a>
                        </div>
                      </div>
                      <div className='col-2 mb-3' key={key}>
                        <Tooltip placement='top' title='Unlink Case'>
                          <div
                            onClick={() => {
                              setLikId(item?.guid)
                              setLikName(item?.case_title)
                              setShowUnliks(true)
                            }}
                            data-cy='deleteLink'
                            className='d-flex mx-1 align-items-center justify-content-center btn btn-icon border border-secondary h-30px w-30px btn-color-gray-600 btn-light-primary radius-10'
                            style={{float: 'right'}}
                          >
                            <i className='lar la-times-circle fs-3' />
                          </div>
                        </Tooltip>
                      </div>
                    </div>
                  )
                })}
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
        title={'Unlink Case'}
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

DetailLinkCase = memo(
  DetailLinkCase,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default DetailLinkCase
