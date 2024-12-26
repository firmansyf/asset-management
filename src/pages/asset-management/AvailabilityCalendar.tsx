import {Search} from '@components/form/search'
import {ClearIndicator, customStyles, DropdownIndicator} from '@components/select/config'
import {KTSVG} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {debounce} from 'lodash'
import {FC, memo, useState} from 'react'
import {useIntl} from 'react-intl'
import Select from 'react-select'

import {WidgetCalendar} from './calendar/Calendar'

let AvailabilityCalendar: FC<any> = () => {
  const intl: any = useIntl()

  const [keyword, setKeyword] = useState<any>()
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('asset_id')

  const onChangeGroupBy = (e: any) => {
    setOrderCol(e?.value)
    setOrderDir('asc')
  }

  const onSearch = debounce(({target: {value}}: any) => {
    setKeyword(`*${value || ''}*`)
  }, 2000)

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.ASSET_MANAGEMENT.CALENDAR'})}
      </PageTitle>

      <div className='card card-custom mt-5'>
        <div className='card-header border-0'>
          <div className='d-flex flex-wrap flex-stack row'>
            <div className='d-flex align-items-center position-relative me-4 col-sm-12 col-md-7'>
              <KTSVG
                path='/media/icons/duotone/General/Search.svg'
                className='svg-icon-3 position-absolute ms-3'
              />
              <Search bg='solid' onChange={onSearch} />
            </div>
            <div className='col-sm-12 col-md-5'>&nbsp;</div>

            <div className='d-flex align-items-center position-relative me-4 col-12'>
              <span style={{padding: '10px 20px 0px 0px'}}>Group By : </span>
              <Select
                name='group_by'
                className='w-200px mt-3'
                onChange={onChangeGroupBy}
                placeholder='Select Group By'
                styles={customStyles(true, {})}
                components={{ClearIndicator, DropdownIndicator}}
                options={[
                  {value: 'asset_id', label: 'Asset ID'},
                  {value: 'asset_name', label: 'Asset Name '},
                ]}
              />
            </div>
          </div>

          <div className='row' style={{marginTop: '50px', marginRight: '5px'}}>
            <div className='d-flex align-items-center position-relative col-4'>
              <div style={{backgroundColor: 'yellow', padding: '0px 8px', margin: '5px'}}>
                &nbsp;
              </div>
              Reserved
            </div>

            <div className='d-flex align-items-center position-relative col-4'>
              <div style={{backgroundColor: 'red', padding: '0px 8px', margin: '5px'}}>&nbsp;</div>
              Checkout
            </div>

            <div className='d-flex align-items-center position-relative col-4'>
              <div style={{backgroundColor: 'green', padding: '0px 8px', margin: '5px'}}>
                &nbsp;
              </div>
              Available
            </div>
          </div>
        </div>

        <div className='card-body'>
          <WidgetCalendar keyword={keyword} orderCol={orderCol} orderDir={orderDir} />
        </div>
      </div>
    </>
  )
}

AvailabilityCalendar = memo(
  AvailabilityCalendar,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default AvailabilityCalendar
