/* eslint-disable react-hooks/exhaustive-deps */
import {Alert} from '@components/alert'
import Tooltip from '@components/alert/tooltip'
import {ToastMessage} from '@components/toast-message'
import {hasPermission} from '@helpers'
import {deleteAsset, printAsset} from '@pages/asset-management/redux/AssetRedux'
import {keyBy, mapValues} from 'lodash'
import {FC, memo, useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import {Link, useNavigate} from 'react-router-dom'

let Actions: FC<any> = ({setShowModal, data}) => {
  const navigate: any = useNavigate()
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {feature}: any = preferenceStore || {}

  const [isFeature, setFeature] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [printLoading, setPrintLoading] = useState<boolean>(false)
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false)
  const [redirect, setRedirect] = useState<boolean>(false)

  const validationButtonEdit: any = data?.approval_status === 'Pending Approval' ? true : false
  const approvalTypeNew: any = data?.approval_type === 'New Asset' ? true : false
  const approvalTypeUpdate: any = data?.approval_type === 'Asset Updated' ? true : false

  useEffect(() => {
    if (feature) {
      const resObj: any = keyBy(feature, 'unique_name')
      setFeature(mapValues(resObj, 'value'))
    }
  }, [feature])

  const confirmDeleteAsset = () => {
    setLoading(true)
    const {guid}: any = data || {}
    deleteAsset(guid)
      .then(({data: {message}}: any) => {
        setTimeout(() => {
          setLoading(false)
          setShowModalDelete(false)
          ToastMessage({type: 'success', message})
          setTimeout(() => setRedirect(true), 1000)
        }, 1000)
      })
      .catch(() => setLoading(false))
  }
  const print = () => {
    setPrintLoading(true)
    printAsset(data?.guid)
      .then(({data: {url, message}}: any) => {
        ToastMessage({type: 'success', message})
        setTimeout(() => {
          setPrintLoading(false)
          window.open(url, '_blank')
        }, 3000)
      })
      .catch(({response}: any) => {
        setPrintLoading(false)
        const {message}: any = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }

  useEffect(() => {
    redirect && navigate(`/asset-management/all`)
  }, [redirect])

  return (
    <>
      <div className='row'>
        <div className='col-auto mb-5 pe-0'>
          <Tooltip placement='top' title='Print'>
            <div
              data-cy='onClickAssetPrint'
              className='d-flex align-items-center justify-content-center w-35px h-35px radius-10 cursor-pointer bg-light-primary border border-dashed border-primary shadow-sm'
              onClick={print}
            >
              {printLoading ? (
                <span className='spinner-border spinner-border-sm text-primary' />
              ) : (
                <i className='fa fa-lg fa-print text-primary'></i>
              )}
            </div>
          </Tooltip>
        </div>

        {hasPermission('asset-management.edit') && (
          <div className='col-auto mb-5 pe-0'>
            <Tooltip placement='top' title='Edit'>
              <Link
                data-cy='onClickAssetEdit'
                to={!validationButtonEdit ? `/asset-management/edit?id=${data?.guid || ''}` : '#'}
                className={`${
                  !validationButtonEdit
                    ? 'bg-light-warning border-warning '
                    : 'bg-light-secondary border-secondary'
                } d-flex align-items-center justify-content-center w-35px h-35px radius-10 cursor-pointer border border-dashed shadow-sm`}
              >
                <i
                  className={`fa fa-lg fa-pencil-alt ${
                    !validationButtonEdit ? 'text-warning' : 'text-secondary'
                  }`}
                ></i>
              </Link>
            </Tooltip>
          </div>
        )}

        <div className='col-auto mb-5 pe-0'>
          <Tooltip placement='top' title='Delete'>
            <div
              data-cy='onClickAssetDelete'
              className='d-flex align-items-center justify-content-center w-35px h-35px radius-10 cursor-pointer bg-light-danger border border-dashed border-danger shadow-sm'
              onClick={() => setShowModalDelete(true)}
            >
              <i className='fa fa-lg fa-trash-alt text-danger'></i>
            </div>
          </Tooltip>
        </div>

        {isFeature?.email_asset === 1 && (
          <div className='col-auto mb-5 pe-0'>
            <Tooltip placement='top' title='Email'>
              <div
                data-cy='onClickAssetEmail'
                className='d-flex align-items-center justify-content-center w-35px h-35px radius-10 cursor-pointer bg-light-success border border-dashed border-success shadow-sm'
                onClick={() => {
                  setShowModal(true)
                }}
              >
                <i className='fa fa-lg fa-envelope text-success'></i>
              </div>
            </Tooltip>
          </div>
        )}

        {validationButtonEdit && (approvalTypeNew || approvalTypeUpdate) && (
          <>
            <div className='col-auto mb-5 pe-0'>
              <div className='alert alert-danger d-flex align-items-center justify-content-center w-100 h-35px'>
                <i className='fa fa-lg fa-warning text-warning me-3'></i>
                {approvalTypeNew
                  ? 'Editing is not permitted until a pending update is approved/rejected.'
                  : approvalTypeUpdate
                  ? 'Editing is not permitted until a pending update is approved/rejected.'
                  : ''}
              </div>
            </div>
            {/* {approvalTypeNew && (
              <div className='col-auto mb-5 pe-0'>
                <div className='alert alert-warning d-flex align-items-center justify-content-center w-100 h-35px'>
                  <i className='fa fa-lg fa-warning text-warning me-3'></i>
                  <span>Please review your asset details before clicking the approval button.</span>
                </div>
              </div>
            )} */}
          </>
        )}
      </div>

      <Alert
        setShowModal={setShowModalDelete}
        showModal={showModalDelete}
        loading={loading}
        body={
          <p className='m-0'>
            Are you sure you want to delete <strong>{data.name}</strong> ?
          </p>
        }
        type={'delete'}
        title={'Delete Asset'}
        confirmLabel={'Delete'}
        onConfirm={confirmDeleteAsset}
        onCancel={() => setShowModalDelete(false)}
      />
    </>
  )
}

Actions = memo(Actions, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default Actions
