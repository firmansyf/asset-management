import {DataTable} from '@components/datatable'
import {Search} from '@components/form/searchValue'
import {IMG, KTSVG} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'

import {getDataBillingHistory} from '../Service'

let BillingHistory: FC<any> = () => {
  const intl = useIntl()
  const [page, setPage] = useState<any>(1)
  const [limit, setLimit] = useState<any>(10)
  const [keyword, setKeyword] = useState<any>('')
  const [loading, setLoading] = useState<any>(true)
  const [orderCol, setOrderCol] = useState('paid_at')
  const [orderDir, setOrderDir] = useState('asc')
  const [totalPage, setTotalPage] = useState(0)
  const [dataHistory, setDataHistory] = useState<any>([])

  const columns: any = [
    {header: 'Date', sort: true, value: 'paid_at'},
    {header: 'Package', sort: true, value: 'package'},
    {header: 'Service Period', sort: true, value: 'period_start'},
    {header: 'Payment Method', sort: true, value: 'payment_method'},
    {header: 'Total', sort: true, value: 'amount_total'},
    {header: 'Download', sort: false, value: 'download'},
  ]

  const onChangeLimit = (e: any) => {
    setLimit(e)
  }

  const onDownload = (e: any) => {
    const {download} = e || {}
    if (download) {
      window.open(download, '_blank')
    }
  }

  const onPageChange = (e: any) => {
    setPage(e)
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  useEffect(() => {
    setLoading(true)
    getDataBillingHistory({page, limit, keyword: `*${keyword}*`, orderDir, orderCol})
      .then(({data: {data: res, meta}}: any) => {
        const {total} = meta || {}
        setTotalPage(total)
        if (res) {
          const data = res?.map((arr: any) => {
            const {
              paid_at,
              subscription,
              amount_total,
              currency,
              billing_details,
              period_start,
              period_end,
              download,
            } = arr || {}
            const {plan} = subscription || {}
            const {name} = plan || {}
            const {card} = billing_details || {}
            const {brand, last4} = card || {}
            return {
              original: arr,
              date: moment(paid_at).format('DD-MM-YYYY') || '-',
              package: name || '-',
              service_period:
                moment(period_start).format('DD/MM/YYYY') +
                ' - ' +
                moment(period_end).format('DD/MM/YYYY'),
              payment_method:
                last4 !== undefined ? brand + '/**** **** **** ' + (last4 || '') : '-',
              amount_total: amount_total !== null ? currency + ' ' + amount_total : 0,
              download: download ? 'Download' : false,
            }
          })
          setDataHistory(data)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [page, limit, keyword, orderDir, orderCol])

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'PAGETITLE.BILLING_HISTORY'})}
      </PageTitle>
      <div className='card card-table card-custom'>
        <div className='card-table-header d-flex align-items-center'>
          <div className='d-flex align-items-center position-relative'>
            <KTSVG
              path='/media/icons/duotone/General/Search.svg'
              className='svg-icon-3 position-absolute ms-3'
            />
            <Search bg='solid' delay={1500} onChange={(e: any) => setKeyword(e)} value={keyword} />
          </div>
        </div>
        <div className='card-body'>
          <DataTable
            limit={limit}
            onSort={onSort}
            columns={columns}
            total={totalPage}
            loading={loading}
            data={dataHistory}
            onChangePage={onPageChange}
            onChangeLimit={onChangeLimit}
            onDownload={onDownload}
            render={(val: any) => ({
              payment_method: () => {
                const item = val.split('/')
                switch (item[0]?.toLowerCase()) {
                  case 'visa':
                    return (
                      <span>
                        <IMG path={'/media/svg/card-logos/visa.svg'} className={'h-25px'} />{' '}
                        {item[1]}
                      </span>
                    )
                  case 'mastercard':
                    return (
                      <span>
                        <IMG path={'/media/svg/card-logos/mastercard.svg'} className={'h-25px'} />{' '}
                        {item[1]}
                      </span>
                    )
                  case 'american-express':
                    return (
                      <span>
                        <IMG
                          path={'/media/svg/card-logos/american-express.svg'}
                          className={'h-25px'}
                        />{' '}
                        {item[1]}
                      </span>
                    )
                  default:
                    return <span>{item[1]}</span>
                }
              },
            })}
          />
        </div>
      </div>
    </>
  )
}

BillingHistory = memo(
  BillingHistory,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)

export default BillingHistory
