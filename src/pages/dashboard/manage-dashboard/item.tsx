import {useSortable} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import {configClass, KTSVG, toAbsoluteUrl} from '@helpers'
import clsx from 'clsx'
import {FC, useEffect, useState} from 'react'

import collection from '../widget/summary/collection'

const SelectForChart: FC<any> = ({selected, grid, onGridChange}) => {
  const [column, setColumn] = useState<any>(1)

  useEffect(() => {
    if (selected?.setting_column && selected?.setting_column > grid) {
      setColumn(grid)
    } else {
      setColumn(selected?.setting_column)
    }
  }, [selected?.setting_column, grid])

  return (
    <div className='position-absolute end-0 top-0 p-1' style={{zIndex: 2}}>
      <select
        value={column || undefined}
        className={`${configClass?.select} border-0 py-1`}
        style={{cursor: 'pointer', backgroundColor: 'rgba(0,0,0,.05)'}}
        onInput={({target: {value}}: any) => {
          onGridChange(parseInt(value), selected)
        }}
      >
        {Array(grid)
          ?.fill(0)
          ?.map((ar: any, index: any) => {
            const keys = ar + index
            return (
              <option value={index + 1} key={keys}>
                {index + 1}x
              </option>
            )
          })}
      </select>
    </div>
  )
}

const WidgetCard: FC<any> = ({group, data, grid}) => {
  const iconDefault: any = '/media/icons/duotone/Media/Equalizer.svg'
  const {icon}: any = collection?.find(({unique_id: uniq}) => uniq === data?.unique_id) || {}
  return (
    <div
      className={`card border text-start card-xl-stretch cursor-pointer btn p-3 h-100 btn-active-light-primary ${
        group === 'active'
          ? 'border-dashed border-primary bg-gray-100'
          : 'border-gray-300 btn-shadow'
      }`}
      style={group === 'active' ? {minHeight: '65px'} : {boxShadow: '0 5px 15px 0 rgb(0 0 0 / 3%)'}}
    >
      <div className='card-body p-0 h-100'>
        <div className='d-flex align-items-center h-100'>
          {grid <= 6 && (
            <KTSVG
              path={icon || iconDefault}
              className={`d-none d-sm-block svg-icon-primary me-3 svg-icon-${
                group === 'active' ? '2x' : 'lg'
              }`}
            />
          )}

          <div
            className={`fw-bold text-primary fs-${grid <= 7 ? 7 : 8} text-truncate-2`}
            style={{lineHeight: 1.2}}
          >
            {data?.title || ''}
          </div>
        </div>
      </div>
    </div>
  )
}

const ChartCard: FC<any> = ({data, group, grid, onGridChange}) => {
  let icon: any = ''
  let iconStyle: any = {width: '20px'}
  const {title, unique_id, view_type}: any = data || {}
  const titlePlural: string = title?.replace(/Assets?/, 'Assets')

  switch (view_type) {
    case 'bar':
      icon = 'bar'
      iconStyle = {width: '30px'}
      break
    case 'pie':
      icon = 'pie'
      iconStyle = {width: '20px', opacity: 0.75}
      break
    case 'table':
      icon = 'list'
      iconStyle = {width: '20px'}
      break
    case 'calendar':
      icon = 'calendar'
      iconStyle = {width: '20px', opacity: 1}
      break
    default:
      icon = 'bar'
  }

  return (
    <div
      key={unique_id}
      className={clsx(
        `w-100 d-flex align-items-center rounded shadow-sm overflow-hidden`,
        'p-3 position-relative border border-secondary'
      )}
      style={{
        background: '#fff',
        height: group === 'active' ? 75 : 60,
        fontSize: group === 'active' ? 12 : 11,
        // background: `#fff url(${toAbsoluteUrl(`/media/svg/shapes/abstract-4.svg`)}) center / cover no-repeat`
      }}
    >
      <div className='w-25px me-2'>
        <img alt='' src={toAbsoluteUrl(`/media/svg/others/${icon}.svg`)} style={iconStyle} />
      </div>

      <div
        className={`col fw-bold text-${group === 'active' ? 'primary' : 'dark'}`}
        style={{lineHeight: 1.3}}
      >
        {titlePlural}
      </div>

      {group === 'active' && (
        <SelectForChart grid={grid} selected={data} onGridChange={onGridChange} />
      )}
    </div>
  )
}

const Item: FC<any> = ({id, data, isOverlay, group, type, grid, onSelectGridFromChart}) => {
  // const [isHover, setIsHover] = useState<boolean>(false)
  const {active, over, attributes, listeners, setNodeRef, transform, isDragging, overIndex}: any =
    useSortable({id})

  const style: any = {
    transform: CSS?.Translate?.toString(transform),
    opacity: isDragging ? 0.35 : 1,
    height: active && isDragging && overIndex >= 0 ? over?.rect?.height : '100%',
    transition: active && !isDragging && !isOverlay ? 'transform 200ms ease 0s' : 'unset',
    // boxShadow: isHover ? '0 0px 10px 2px rgb(0 0 0 / 5%)' : 'unset',
    zIndex: 2,
  }

  return (
    <div
      className='w-100 cursor-pointer radius-10'
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      // onMouseEnter={() => setIsHover(true)}
      // onMouseLeave={() => setIsHover(false)}
    >
      {type === 'widget' && <WidgetCard group={group} data={data} grid={grid} />}
      {type === 'chart' && (
        <ChartCard group={group} data={data} grid={grid} onGridChange={onSelectGridFromChart} />
      )}
    </div>
  )
}

export default Item
