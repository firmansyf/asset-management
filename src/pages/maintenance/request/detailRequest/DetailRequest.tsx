/* eslint-disable react-hooks/exhaustive-deps */
import {PageLoader} from '@components/loader/cloud'
import {PageSubTitle, useTimeOutMessage} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {useQuery} from '@tanstack/react-query'
import {FC, useEffect} from 'react'
import {useParams} from 'react-router-dom'

import {getDetailRequest} from '../core/service'
import {Actions} from './section/actions'
import Comment from './section/comment'
import {Files} from './section/files'
import {General} from './section/general'

const DetailRequest: FC = () => {
  const params: any = useParams()

  useEffect(() => {
    useTimeOutMessage('clear', 5000)
  }, [])

  const detailRequestQuery: any = useQuery({
    queryKey: ['getDetailRequest', {guid: params?.guid}],
    queryFn: async () => {
      if (params?.guid) {
        const res: any = await getDetailRequest(params?.guid)
        const dataResult: any = res?.data?.data
        return dataResult
      } else {
        return {}
      }
    },
  })

  const data: any = detailRequestQuery?.data || {}

  if (!detailRequestQuery?.isFetched) {
    return <PageLoader />
  }

  return (
    <>
      <PageTitle breadcrumbs={[]}>Request Detail</PageTitle>
      <PageSubTitle title={`Details of ${data?.title || 'request'}`} />
      <Actions data={data} />

      <div className='row'>
        <div className='col-md-8'>
          <div className='card border border-2'>
            <div className='card-header  bg-light align-items-center px-4'>
              <h3 className='card-title fw-bold fs-3 m-0' data-cy='card-title'>
                Request Information
              </h3>
            </div>
            <div className='card-body align-items-center p-0'>
              <General data={data} />
            </div>
          </div>
        </div>

        <div className='col-md-4 row'>
          <div className='col-md-12'>
            <Files data={data} />
            <Comment data={data} />
          </div>
        </div>
      </div>
    </>
  )
}

export default DetailRequest
