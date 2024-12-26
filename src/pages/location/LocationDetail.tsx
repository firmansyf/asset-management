/* eslint-disable react-hooks/exhaustive-deps */
import {getLocationDetail} from '@api/Service'
import {PageLoader} from '@components/loader/cloud'
import {PageTitle} from '@metronic/layout/core'
import {useQuery} from '@tanstack/react-query'
import cx from 'classnames'
import {FC, useEffect, useState} from 'react'
import {useLocation, useNavigate, useParams} from 'react-router-dom'

import {getFeature} from '../setup/settings/feature/Service'
import {DetailInsurance} from './DetailInsuranceLocation'
import Comment from './sections/comment'
import LocationActions from './sections/LocationActions'
import LocationAssets from './sections/LocationAssets'
import LocationGeneral from './sections/LocationGeneral'
import LocationGps from './sections/LocationGps'
import LocationPhotos from './sections/LocationPhotos'
import LocationSendEmail from './sections/LocationSendEmail'

const LocationDetail: FC<any> = () => {
  const params: any = useParams()
  const subTitle: any = document.querySelector('.pageSubTitle')
  const location: any = useLocation()
  const navigate: any = useNavigate()

  const [reloadSendEmail, setReloadSendEmail] = useState<any>([])
  const [reloadLocation, setReloadLocation] = useState<number>(1)
  const [showModalSendEmail, setShowModalSendEmail] = useState<boolean>(false)
  const [tab, setTab] = useState<string>('general')

  const dataLocationDetailQuery: any = useQuery({
    queryKey: ['getLocationDetail', {guid: params?.guid, reloadLocation}],
    queryFn: async () => {
      if (params?.guid) {
        const res: any = await getLocationDetail(params?.guid)
        const dataResult: any = res?.data?.data || {}
        return {data: dataResult, custom_fields: dataResult?.custom_fields}
      } else {
        return {}
      }
    },
  })
  const detailLocation: any = dataLocationDetailQuery?.data?.data || {}
  const customLocation: any = dataLocationDetailQuery?.data?.custom_fields || []
  const loading: any = !dataLocationDetailQuery?.isFetched

  const dataFeatureQuery: any = useQuery({
    queryKey: ['getFeature'],
    queryFn: async () => {
      const res: any = await getFeature({orderCol: 'name', orderDir: 'asc'})
      const dataResult: any = res?.data?.data || {}
      const insuranceClaim: any = dataResult?.find(
        (features: {unique_name: any}) => features?.unique_name === 'insurance_claim'
      )
      const isCustomField: any = dataResult?.find(
        (features: {unique_name: any}) => features?.unique_name === 'custom_field'
      )
      return {insuranceClaim: insuranceClaim?.value || 0, isCustomField: isCustomField?.value || 0}
    },
  })
  const {insuranceClaim, _isCustomField}: any = dataFeatureQuery?.data || {}

  useEffect(() => {
    subTitle && detailLocation?.name && (subTitle.innerHTML = `Details of ${detailLocation?.name}`)
    return () => {
      subTitle && (subTitle.innerHTML = '')
    }
  }, [subTitle, detailLocation])

  useEffect(() => {
    setTab(location?.hash ? location?.hash?.split('#')[1] : 'general')
  }, [location?.hash])

  return (
    <>
      <PageTitle breadcrumbs={[]}>{'Location Detail'}</PageTitle>
      {loading ? (
        <PageLoader />
      ) : (
        <>
          <LocationActions
            detailLocation={detailLocation}
            setShowModalEmail={setShowModalSendEmail}
            setReloadLocation={setReloadLocation}
            reloadLocation={reloadLocation}
          />
          <div className='row'>
            <div className='col-md-8'>
              <div className='card border border-2'>
                <div className='card-header align-items-center px-4'>
                  <h3 className='card-title fw-bold fs-3 m-0'>Location Information</h3>
                </div>
                {insuranceClaim === 1 && (
                  <div className='card-body align-items-center p-0'>
                    <ul className='nav nav-tabs nav-line-tabs nav-line-tabs-2x fs-6 bg-gray-100'>
                      <li className='nav-item'>
                        <div
                          className={cx(
                            'm-0 px-5 py-3 cursor-pointer',
                            tab === 'general' && 'bg-primary border-primary text-white fw-bolder'
                          )}
                          onClick={() => {
                            navigate({...location, hash: 'general'}, {replace: true})
                            setTab('general')
                          }}
                        >
                          Location Detail
                        </div>
                      </li>
                      <li className='nav-item'>
                        <div
                          className={cx(
                            'm-0 px-5 py-3 cursor-pointer',
                            tab === 'insurance' && 'bg-primary border-primary text-white fw-bolder'
                          )}
                          onClick={() => {
                            navigate({...location, hash: 'insurance'}, {replace: true})
                            setTab('insurance')
                          }}
                        >
                          Insurance
                        </div>
                      </li>
                    </ul>

                    <div className='tab-content'>
                      <div
                        className={cx(
                          'tab-pane fade',
                          {show: tab === 'general'},
                          {active: tab === 'general'}
                        )}
                      >
                        {loading ? (
                          <PageLoader height={250} />
                        ) : (
                          <LocationGeneral
                            detailLocation={detailLocation}
                            customLocation={customLocation}
                            insuranceClaim={insuranceClaim}
                            // isCustomField={isCustomField}
                          />
                        )}
                      </div>

                      <div
                        className={cx(
                          'tab-pane fade',
                          {show: tab === 'insurance'},
                          {active: tab === 'insurance'}
                        )}
                      >
                        {loading ? (
                          <PageLoader height={250} />
                        ) : (
                          <DetailInsurance detail={detailLocation} />
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {insuranceClaim === 0 && (
                  <div className='card-body align-items-center p-0'>
                    <ul className='nav nav-tabs nav-line-tabs nav-line-tabs-2x fs-6 bg-gray-100'>
                      <li className='nav-item'>
                        <div
                          className={cx(
                            'm-0 px-5 py-3 cursor-pointer',
                            tab === 'general' && 'bg-primary border-primary text-white fw-bolder'
                          )}
                          onClick={() => {
                            navigate({...location, hash: 'general'}, {replace: true})
                            setTab('general')
                          }}
                        >
                          Location Detail
                        </div>
                      </li>
                    </ul>

                    <div className='tab-content'>
                      <div
                        className={cx(
                          'tab-pane fade',
                          {show: tab === 'general'},
                          {active: tab === 'general'}
                        )}
                      >
                        {loading ? (
                          <PageLoader height={250} />
                        ) : (
                          <LocationGeneral
                            detailLocation={detailLocation}
                            customLocation={customLocation}
                            insuranceClaim={insuranceClaim}
                            // isCustomField={isCustomField}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className='col-md-4'>
              <LocationAssets detailLocation={detailLocation} reloadLocation={reloadLocation} />
              <LocationGps detailLocation={detailLocation} />
              <LocationPhotos detailLocation={detailLocation} />
              <Comment data={detailLocation} />
            </div>
          </div>

          <LocationSendEmail
            showModal={showModalSendEmail}
            setShowModal={setShowModalSendEmail}
            reloadSendEmail={reloadSendEmail}
            setReloadSendEmail={setReloadSendEmail}
            detailLocation={detailLocation}
          />
        </>
      )}
    </>
  )
}

export default LocationDetail
