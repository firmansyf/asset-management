/* eslint-disable react-hooks/exhaustive-deps */
import {PageLoader} from '@components/loader/cloud'
import {useTimeOutMessage} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {getDetailMeter} from '@pages/maintenance/Service'
import cx from 'classnames'
import {FC, memo, useEffect, useState} from 'react'
import {useLocation, useNavigate, useParams} from 'react-router-dom'

import Actions from './sections/actions'
import Comment from './sections/comment'
import Delete from './sections/delete'
import Files from './sections/files'
import General from './sections/general'
import MeterHistory from './sections/history'

let MeterDetail: FC<any> = () => {
  const params: any = useParams()
  const location: any = useLocation()
  const navigate: any = useNavigate()

  const [reload, setReload] = useState<any>([])
  const [detailMeter, setData] = useState<any>({})
  const [tab, setTab] = useState<string>('general')
  const [loading, setLoading] = useState<boolean>(true)
  const [meterGuid, setMeterGuid] = useState<string>('')
  const [meterName, setMeterName] = useState<string>('')
  const [showModalConfirm, setShowModalConfirm] = useState<boolean>(false)

  const subTitle: any = document.querySelector('.pageSubTitle')

  const onDelete = () => {
    if (detailMeter) {
      const {guid, name} = detailMeter || {}
      setMeterName(name || '')
      setMeterGuid(guid || '')
      setShowModalConfirm(true)
    }
  }

  useEffect(() => {
    setTab(location.hash ? location?.hash?.split('#')?.[1] : 'general')
  }, [location.hash])

  useEffect(() => {
    setLoading(true)
    const {guid} = params || {}

    guid
      ? getDetailMeter(guid)
          .then(({data: {data: res}}: any) => {
            res && setData(res)
            setTimeout(() => setLoading(false), 800)
          })
          .catch(() => setTimeout(() => setLoading(false), 800))
      : setTimeout(() => setLoading(false), 800)
  }, [reload])

  useEffect(() => {
    subTitle &&
      detailMeter?.name &&
      (subTitle.innerHTML = `Details of Meter ${detailMeter?.unit_of_measurement || ''}`)
    return () => {
      subTitle && (subTitle.innerHTML = '')
    }
  }, [subTitle, detailMeter])

  useEffect(() => {
    useTimeOutMessage('clear', 5000)
  }, [])
  return (
    <>
      <PageTitle breadcrumbs={[]}>{detailMeter?.name || 'Detail Meter'}</PageTitle>
      {loading ? (
        <PageLoader />
      ) : (
        <>
          <Actions data={detailMeter} onDelete={onDelete} reload={reload} setReload={setReload} />

          <div className='row'>
            <div className='col-md-8'>
              <div className='card border border-2'>
                <div className='card-header align-items-center px-4'>
                  <h3 className='card-title fw-bold fs-3 m-0' data-cy='card-title'>
                    Meter Information
                  </h3>
                </div>

                <div className='card-body align-items-center p-0'>
                  <ul className='nav nav-tabs nav-line-tabs nav-line-tabs-2x fs-6 bg-gray-100'>
                    <li className='nav-item'>
                      <div
                        className={cx(
                          'm-0 px-5 py-3 cursor-pointer',
                          tab === 'general' && 'bg-primary border-primary text-white fw-bolder'
                        )}
                        onClick={() => {
                          setTab('general')
                          navigate({...location, hash: 'general'}, {replace: true})
                        }}
                      >
                        Meter Detail
                      </div>
                    </li>

                    <li className='nav-item'>
                      <div
                        className={cx(
                          'm-0 px-5 py-3 cursor-pointer',
                          tab === 'history' && 'bg-primary border-primary text-white fw-bolder'
                        )}
                        onClick={() => {
                          setTab('history')
                          navigate({...location, hash: 'history'}, {replace: true})
                        }}
                      >
                        Meter History
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
                        <General detail={detailMeter} reload={reload} setReload={setReload} />
                      )}
                    </div>

                    <div
                      className={cx(
                        'tab-pane fade',
                        {show: tab === 'history'},
                        {active: tab === 'history'}
                      )}
                    >
                      {loading ? (
                        <PageLoader height={250} />
                      ) : (
                        <MeterHistory History detail={detailMeter} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-md-4'>
              <Files data={detailMeter} />
              <Comment data={detailMeter} />
            </div>
          </div>

          <Delete
            reloadMeter={reload}
            meterGuid={meterGuid}
            meterName={meterName}
            setReloadMeter={setReload}
            showModal={showModalConfirm}
            setShowModal={setShowModalConfirm}
          />
        </>
      )}
    </>
  )
}

MeterDetail = memo(
  MeterDetail,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default MeterDetail
