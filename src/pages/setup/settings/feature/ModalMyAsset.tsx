import {AddInputBtn} from '@components/button/Add'
import {PageLoader} from '@components/loader/cloud'
import MyAssetTours from '@components/page-tours/MyAssetTours'
import {Select as SelectAjax} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {FieldMessageError} from '@helpers'
import {getTeamAlertSetting} from '@pages/setup/alert/setting/Service'
import {AddAlertTeam} from '@pages/setup/alert/team/AddAlertTeam'
import {getFeatureAsset, putFeatureAsset} from '@pages/setup/settings/feature/Service'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import {useNavigate} from 'react-router-dom'
import Swal from 'sweetalert2'

type ModalModalMyAsset = {
  showModal: any
  setShowModal: any
}

let ModalMyAsset: FC<ModalModalMyAsset> = ({showModal, setShowModal}) => {
  const navigate: any = useNavigate()
  const intl: any = useIntl()
  const [myAsset, setMyAsset] = useState<any>([])
  const [setTeam, setTeamDetail] = useState<any>()
  const [dataParams, setDataParams] = useState<any>({})
  const [reloadTeam, setReloadTeam] = useState<boolean>(false)
  const [showModalTeam, setShowModalTeam] = useState<boolean>(false)
  const [loadingForm, setLoadingForm] = useState<boolean>(false)
  const [isErrorApprover, setIsErrorApprover] = useState<boolean>(true)

  const handleOnSubmit = (event: any) => {
    event.preventDefault()
    let params: any = {}
    const item1: any = dataParams['assetnew_approval']
    const item2: any = dataParams['assetupdate_approval']

    Object.keys(dataParams)?.forEach((item: any) => {
      const items: any = dataParams?.[item] || 0
      params = {
        ...params,
        [item]:
          item === 'approver_team'
            ? item1 === 1 || item2 === 1
              ? items?.value !== ''
                ? items?.value
                : undefined
              : null
            : items,
      }
    })

    let approverValidation: boolean = true
    if (isErrorApprover && params?.approver_team === undefined) {
      ToastMessage({message: 'The approver is required.', type: 'error'})
      approverValidation = false
    }

    if (approverValidation) {
      putFeatureAsset(params)
        .then(() => {
          setShowModal(false)
          Swal.fire({
            imageUrl: '/images/approved.png',
            imageWidth: 65,
            imageHeight: 65,
            imageAlt: 'Custom image',
            html: `
            <p class='text-dark'>You have successfully set up My Assets module.</p>
            <p class='text-dark'>Next, you can request user to add their asset(s)</p>
            <p class='text-dark'>or you can add it on your own.</p>
            `,
            showCloseButton: true,
            showConfirmButton: true,
            confirmButtonColor: '#050990',
            confirmButtonText: 'Request Add Asset',
            showDenyButton: true,
            denyButtonColor: '#050990',
            denyButtonText: 'Add Asset',
          }).then((result: any) => {
            if (result?.isConfirmed) {
              navigate('/asset-management/request-add-asset')
            } else if (result?.isDenied) {
              navigate('/asset-management/add')
            } else {
              //
            }
          })
        })
        .catch((e: any) => FieldMessageError(e, []))
    }
  }

  useEffect(() => {
    if (showModal) {
      let res: any = {}
      setLoadingForm(true)
      getFeatureAsset({})
        .then(({data: {data: arr}}: any) => {
          const data: any = []
          arr?.forEach((item: any) => {
            const itm: any = item || {}
            let order: any = 0
            if (item?.key === 'assignee_add') {
              order = 1
            }
            if (item?.key === 'photo_required') {
              order = 2
            }
            if (item?.key === 'assetnew_approval') {
              order = 3
            }
            if (item?.key === 'assetupdate_approval') {
              order = 4
            }
            if (item?.key === 'approver_team') {
              order = 5
            }
            itm['order'] = order
            data?.push(itm)
          })

          setMyAsset(data)
          const dataTeam: any = data?.filter(({key}: any) => key === 'approver_team')
          if (dataTeam?.[0]?.value !== null) {
            getTeamAlertSetting({'filter[name]': dataTeam?.[0]?.value})
              .then(({data: {data: arr}}: any) => {
                data
                  ?.sort((a: any, b: any) => (a?.order > b?.order ? 1 : -1))
                  ?.forEach((item: any) => {
                    let dataItem: any = item?.key === 'approver_team' ? {value: '', label: ''} : 0
                    if (item?.key === 'approver_team') {
                      dataItem = {value: arr?.[0]?.guid, label: dataTeam?.[0]?.value} || {}
                    } else {
                      dataItem = item?.value || 0
                    }
                    res = {...res, [item?.key]: dataItem}
                  })
                setDataParams(res || {})
                setLoadingForm(false)
              })
              .catch(() => setLoadingForm(false))
          } else {
            data
              ?.sort((a: any, b: any) => (a?.order > b?.order ? 1 : -1))
              ?.forEach((item: any) => {
                res = {...res, [item?.key]: item?.value || 0}
              })
            setDataParams(res || {})
            setLoadingForm(false)
          }
        })
        .catch(() => setLoadingForm(false))
    }
  }, [showModal])

  useEffect(() => {
    if (dataParams?.assetnew_approval === 1 || dataParams?.assetupdate_approval === 1) {
      setIsErrorApprover(true)
    } else {
      setIsErrorApprover(false)
    }
  }, [dataParams])

  const onCloseModal = () => {
    setShowModal(false)
    setIsErrorApprover(false)
  }

  return (
    <>
      <Modal dialogClassName='modal-md' show={showModal} onHide={onCloseModal}>
        <Modal.Header>
          <Modal.Title>{intl.formatMessage({id: 'MY_ASSETS_SETUP'})}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingForm ? (
            <div className='row'>
              <div className='col-12 text-center'>
                <PageLoader height={250} />
              </div>
            </div>
          ) : (
            <div className='row'>
              <div className='col-12 mb-3'>
                <div className='row'>
                  <div className='col-11 pe-1'>
                    {intl.formatMessage({id: 'ASSIGNED_USER_TO_CONFIRM'})}
                  </div>
                  <div className='col-1 p-0 ps-2'>
                    <div className='d-flex align-items-center form-check form-check-sm form-check-custom form-check-solid mb-1 mt-1'>
                      <input
                        className='form-check-input border border-gray-300'
                        type='checkbox'
                        name='assigned'
                        value='true'
                        id='ckechboxAll'
                        disabled={true}
                        checked={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {myAsset &&
                myAsset?.length &&
                myAsset?.map((item: any, key: any) => {
                  return (
                    <div className='col-12 mb-3' key={key}>
                      <div className='row'>
                        {item?.key === 'approver_team' ? (
                          (dataParams['assetupdate_approval'] === 1 ||
                            dataParams['assetnew_approval'] === 1) && (
                            <div
                              className={item?.key === 'approver_team' ? 'col-6' : 'col-11 pe-1'}
                              style={item?.key === 'approver_team' ? {marginTop: '8px'} : {}}
                            >
                              {item?.label || ''}
                            </div>
                          )
                        ) : (
                          <div
                            className={item?.key === 'approver_team' ? 'col-6' : 'col-11 pe-1'}
                            style={item?.key === 'approver_team' ? {marginTop: '8px'} : {}}
                          >
                            {item?.label || ''}
                          </div>
                        )}
                        <div className={item?.key === 'approver_team' ? 'col-6' : 'col-1 p-0 ps-2'}>
                          {item?.key === 'approver_team' ? (
                            (dataParams['assetupdate_approval'] === 1 ||
                              dataParams['assetnew_approval'] === 1) && (
                              <div className='d-flex align-items-center input-group input-group-solid'>
                                <SelectAjax
                                  sm={true}
                                  className='col p-0 select-custom-width'
                                  name='team_guid'
                                  api={getTeamAlertSetting}
                                  params={{orderCol: 'name', orderDir: 'asc'}}
                                  reload={reloadTeam}
                                  isClearable={true}
                                  placeholder='Select Team'
                                  defaultValue={{
                                    value: dataParams?.['approver_team']?.value || '',
                                    label: dataParams?.['approver_team']?.label || '',
                                  }}
                                  onChange={(e: any) => {
                                    setDataParams((prev: any) => ({
                                      ...prev,
                                      approver_team: e || {},
                                    }))
                                  }}
                                  parse={({guid, name}: any) => {
                                    return {
                                      value: guid,
                                      label: name,
                                    }
                                  }}
                                />
                                <AddInputBtn
                                  size={'sm'}
                                  onClick={() => {
                                    setShowModalTeam(true)
                                    setTeamDetail(undefined)
                                  }}
                                />
                              </div>
                            )
                          ) : (
                            <div className='d-flex align-items-center form-check form-check-sm form-check-custom form-check-solid mb-1 mt-1'>
                              <input
                                className='form-check-input border border-gray-300'
                                type='checkbox'
                                name='checkall'
                                value='false'
                                id='ckechboxAll'
                                style={{
                                  cursor: 'pointer',
                                }}
                                checked={dataParams?.[item?.key] === 1 ? true : false}
                                onChange={({target: {checked}}: any) => {
                                  setDataParams((prev: any) => ({
                                    ...prev,
                                    [item?.key]: checked ? 1 : 0,
                                  }))
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className='btn-sm' variant='secondary' onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            className='btn-sm'
            type='submit'
            onClick={handleOnSubmit}
            form-id=''
            variant='primary'
          >
            <span className='indicator-label'>Save</span>
          </Button>
        </Modal.Footer>
      </Modal>
      <AddAlertTeam
        showModal={showModalTeam}
        setShowModal={setShowModalTeam}
        setReload={setReloadTeam}
        reload={reloadTeam}
        detail={setTeam}
      />
      <MyAssetTours />
    </>
  )
}

ModalMyAsset = memo(ModalMyAsset)
export {ModalMyAsset}
