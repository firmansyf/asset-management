import {KTSVG} from '@helpers'
import {getDataWidget} from '@pages/dashboard/redux/DashboardService'
import {useQuery} from '@tanstack/react-query'
import {FC, memo} from 'react'
import {useNavigate} from 'react-router-dom'

import collection from './collection'

interface Props {
  title: string
  unique_id: string
  dashboard_guid?: string
  className?: string | undefined
}

let Summary: FC<Props> = ({title, unique_id, dashboard_guid, className}) => {
  // const themeDefault = 'primary'
  // const iconColorDefault = 'white'
  const navigate: any = useNavigate()
  const iconDefault: any = '/media/icons/duotone/Media/Equalizer.svg'
  const {icon, url}: any = collection?.find(({unique_id: uniq}) => uniq === unique_id) || {}

  const summaryQuery: any = useQuery({
    initialData: 0,
    queryKey: ['getDataWidgetSummary', {dashboard_guid, unique_id}],
    queryFn: async () => {
      if (dashboard_guid) {
        const api: any = await getDataWidget(dashboard_guid, unique_id)
        const result_widget: any = api?.data?.data
        return result_widget
      } else {
        return 0
      }
    },
  })
  const dataWidget: any = summaryQuery?.data || 0

  const onClickHref = () => {
    if (unique_id === 'maintenance-total-worker') {
      url && navigate(`${url}?filter[role_name]=worker`)
    } else if (unique_id === 'my-tickets') {
      url && navigate(`${url}?filter[quick_filter]=my_tickets`)
    } else if (unique_id === 'unresolved-tickets') {
      url && navigate(`${url}?filter[quick_filter]=all_unresolved_tickets`)
    } else if (unique_id === 'total-audited') {
      url && navigate(`${url}?filter[audit_status]=audited`)
    } else {
      url && navigate(url)
    }
  }

  return (
    <div
      className='card bg-transparent px-2 card-xl-stretch cursor-pointer h-100'
      onClick={onClickHref}
    >
      <div
        className={`card-body position-relative px-2 py-3 radius-10 ${className}`}
        style={{backgroundColor: '#f9f9ff', border: '1px solid #dadaff'}}
      >
        <div
          className='position-absolute w-40px h-40px bg-primary d-flex flex-center radius-5 shadow-lg'
          style={{top: '50%', transform: 'translate(-65%, -50%)'}}
        >
          <KTSVG path={icon || iconDefault} className={`svg-icon-white svg-icon-2x`} />
        </div>

        <div className='d-flex flex-center w-75 mx-auto'>
          <div className='text-center'>
            {!summaryQuery?.isFetched ? (
              <div className='d-flex h-25px flex-center mb-1'>
                <span className='indicator-progress d-block text-center'>
                  <span className='spinner-border spinner-border-sm text-primary w-25px h-25px align-middle'></span>
                </span>
              </div>
            ) : (
              <div className={`text-primary fw-bolder fs-2x lh-1`}>{dataWidget || 0}</div>
            )}
            <div className={`fw-bolder text-primary fs-7 lh-15`}>{title || ''}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

Summary = memo(Summary, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export {Summary}
