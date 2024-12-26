/* eslint-disable react-hooks/exhaustive-deps */
import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {PageTitle} from '@metronic/layout/core'
import {useQuery} from '@tanstack/react-query'
import {FC, memo, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'

import {getDetailInsurancePolicies, getDocumentInsurancePolicies} from '../Service'
import {Actions} from './sections/actions'
import {Assets} from './sections/assets'
import Comment from './sections/comment'
import {Files} from './sections/files'
import {General} from './sections/general'
import SendEmail from './SendEmail'

let PolicyDetail: FC<any> = () => {
  const subTitle: any = document.querySelector('.pageSubTitle')
  const params: any = useParams()
  const {guid}: any = params || {}

  const [reloadAsset, setReloadAsset] = useState<number>(0)
  const [reloadPolicy, setReloadPolicy] = useState<number>(0)
  const [reloadSendEmail, setReloadSendEmail] = useState<any>([])
  const [showModalSendEmail, setShowModalSendEmail] = useState<boolean>(false)

  const detailPolicyQuery: any = useQuery({
    queryKey: [
      'getDetailInsurancePolicies',
      {
        reloadPolicy,
        guid,
      },
    ],
    queryFn: async () => {
      const res: any = await getDetailInsurancePolicies(guid)
      const result: any = res?.data?.data || {}
      return result
    },
  })
  const detailPolicy: any = detailPolicyQuery?.data || []
  const loading: any = !detailPolicyQuery?.isFetched || false

  const documentInsurancePoliciesQuery: any = useQuery({
    queryKey: [
      'getDocumentInsurancePolicies',
      {
        reloadPolicy,
        guid,
      },
    ],
    queryFn: async () => {
      const res: any = await getDocumentInsurancePolicies(guid, {})
      const result: any = res?.data?.data || {}
      return result
    },
  })
  const documentPolicy: any = documentInsurancePoliciesQuery?.data || []

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  useEffect(() => {
    subTitle && detailPolicy?.name && (subTitle.innerHTML = `Details of ${detailPolicy.name}`)
    return () => {
      subTitle && (subTitle.innerHTML = '')
    }
  }, [subTitle, detailPolicy])

  useEffect(() => {
    if (showModalSendEmail) {
      ToastMessage({type: 'clear'})
    }
  }, [showModalSendEmail])

  return (
    <>
      <PageTitle breadcrumbs={[]}>Insurance Policy Detail</PageTitle>
      {loading ? (
        <PageLoader />
      ) : (
        <>
          <Actions
            data={detailPolicy}
            reloadAsset={reloadAsset}
            reloadPolicy={reloadPolicy}
            setReloadAsset={setReloadAsset}
            setReloadPolicy={setReloadPolicy}
            setShowModal={setShowModalSendEmail}
          />

          <div className='row'>
            <div className='col-md-8'>
              <div className='card border border-2'>
                <div className='card-header align-items-center px-4'>
                  <h3 className='card-title fw-bold fs-3 m-0' data-cy='card-title'>
                    Insurance Policy Information
                  </h3>
                </div>
                <div className='card-body align-items-center p-0'>
                  <General data={detailPolicy} />
                </div>
              </div>
            </div>

            <div className='col-md-4'>
              <div className='mb-5'>
                <Assets paramGuid={params} reloadAsset={reloadAsset} />
              </div>
              <Files document={documentPolicy} reloadPolicy={reloadPolicy} />
              <Comment data={detailPolicy} />
            </div>
          </div>

          <SendEmail
            detailPolicy={detailPolicy}
            showModal={showModalSendEmail}
            reloadSendEmail={reloadSendEmail}
            setShowModal={setShowModalSendEmail}
            setReloadSendEmail={setReloadSendEmail}
          />
        </>
      )}
    </>
  )
}

PolicyDetail = memo(PolicyDetail)
export default PolicyDetail
