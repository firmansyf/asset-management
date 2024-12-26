// import {Dropdown1} from '@metronic/partials/content/dropdown/Dropdown1'
import {KTSVG} from '@helpers'
import {getDataWidget} from '@pages/dashboard/redux/DashboardService'
import {map, max} from 'lodash'
import {FC, memo, useEffect, useState} from 'react'

const ItemBarChart: FC<any> = ({label, value, max, color}: any) => {
  return (
    <div className={'d-flex mb-3 flex-column'}>
      <div className='d-flex flex-row mb-3'>
        <span className='flex-grow-1'>{label}</span>
        <span className={'value-indicator'}>{value}</span>
      </div>
      <div
        className={'bar-item'}
        style={{
          height: '10px',
          backgroundColor: '#f0f0f0',
          borderRadius: '5px',
        }}
      >
        <div
          style={{
            backgroundColor: color,
            width: `${(value / max) * 100}%`,
            height: '10px',
            borderRadius: '5px',
          }}
        />
      </div>
    </div>
  )
}

type Props = {
  title: string
  dashboard_guid?: string
  unique_id: string
}

let BarChart: FC<Props> = ({title, unique_id, dashboard_guid}) => {
  const [dataWidget, setData] = useState([])
  const [maxValue, setMaxValue] = useState(0)
  const color = [
    '#36d5e3',
    '#0549e1',
    '#40b781',
    '#ffc500',
    '#ff7171',
    '#a244e2',
    '#007EA7',
    '#FFDD4A',
    '#FE9000',
    '#519872',
    '#06D6A0',
    '#8A89C0',
  ]

  useEffect(() => {
    if (dashboard_guid) {
      getDataWidget(dashboard_guid, unique_id)
        .then(({data: {data: result_widget}}) => {
          setData(result_widget)
          setMaxValue(max(map(result_widget, 'total')))
        })
        .catch(() => '')
    }
  }, [dashboard_guid, unique_id])

  return (
    <div className={`card`}>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>{title}</span>
        </h3>
        <div className='card-toolbar'>
          <button
            type='button'
            className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='top-end'
          >
            <KTSVG
              path='/media/icons/duotone/Layout/Layout-4-blocks-2.svg'
              className='svg-icon-2'
            />
          </button>
          {/* <Dropdown1 /> */}
        </div>
      </div>
      <div className='card-body' style={{minHeight: '400px'}}>
        {dataWidget?.map(({name, total}, index) => {
          return (
            <ItemBarChart
              key={index}
              label={name}
              value={total}
              max={maxValue}
              color={color[index]}
            />
          )
        })}
      </div>
    </div>
  )
}

BarChart = memo(BarChart, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export {BarChart}
