import {Alert} from '@components/alert'
import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {configClass} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {useQuery} from '@tanstack/react-query'
import {FC, Fragment, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {useIntl} from 'react-intl'

import {exportReportPercentage, getOptionYear, getReportPercentage} from '../Service'
import Detail from './detail'

const InsuranceReportPercentage: FC = () => {
  const intl: any = useIntl()

  const [showModalExport, setShowModalExport] = useState<boolean>(false)
  const [messageAlert, setMessage] = useState<any>(false)
  const [showDetail, setShowDetail] = useState<boolean>(false)
  const [detail, setDetail] = useState<any>({})
  const [year, setYear] = useState<any>()

  const dataYearQuery: any = useQuery({
    // initialData: {data: []},
    refetchOnMount: false,
    staleTime: Infinity,
    queryKey: ['getOptionYear'],
    queryFn: async () => {
      const res: any = await getOptionYear()
      const dataResult: any = res?.data
        ?.sort((a: any, b: any) => (a < b ? 1 : -1))
        ?.filter((f: any) => f)
        ?.map((m: any) => ({value: m, label: m}))

      return dataResult
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })

  const optionYear: any = dataYearQuery?.data || []

  const onExport = (year: any) => {
    exportReportPercentage(year || optionYear?.[0]?.value)
      .then(({data: res}) => {
        const {data, message} = res || {}
        const {url} = data || {}
        window.open(url, '_blank')
        ToastMessage({message, type: 'success'})
      })
      .catch(({response}: any) => {
        const {message} = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }

  const showPercentage = (month: any, value: any, label: any) => {
    setShowDetail(true)
    const selectedYear: any = year || optionYear?.[0]?.value
    setDetail({month: month, year: selectedYear, data: value, label: label})
  }

  const reportPercentageQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getReportPercentage', {year, optionYear}],
    queryFn: async () => {
      const selectedYear: any = year || optionYear?.[0]?.value
      if (selectedYear) {
        const api: any = await getReportPercentage(selectedYear)
        const res: any = api?.data?.data
        const tmp: any = []
        res?.forEach(({regions}: any) => {
          if (regions?.length > 0) {
            regions?.forEach((e: any) => {
              const {name: label} = e || {}
              if (label !== null) {
                if (tmp?.length > 0) {
                  const avail = tmp?.find((a: any) => a === label)
                  if (!avail) {
                    tmp.push(label)
                  }
                } else {
                  tmp.push(label)
                }
              } else {
                tmp.push('No Region')
              }
            })
          }
        })

        const dataResult: any = {
          dataRegions: tmp,
          result: res,
        }

        return dataResult
      } else {
        return {
          dataRegions: [],
          result: [],
        }
      }
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })

  const {result, dataRegions}: any = reportPercentageQuery?.data || []

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.INSURANCE.REPORT_PERCENTAGE'})}
      </PageTitle>
      <div className='card card-custom card-table'>
        <div className='card-table-header'>
          <div className='row'>
            <div className='col-6'>
              <span className='me-2'>Year :</span>
              <select
                style={{width: '100px', display: 'inline'}}
                className={configClass?.select}
                value={year || optionYear?.[0]?.value}
                onChange={({target}: any) => {
                  setYear(target?.value)
                }}
              >
                {optionYear?.map(({value, label}: any, index: number) => (
                  <option key={index} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className='col-6 text-end'>
              <Dropdown>
                <Dropdown.Toggle variant='light-primary' size='sm'>
                  Actions
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    href='#'
                    onClick={() => {
                      setShowModalExport(true)
                      setMessage([`Are you sure want to download xlsx file ?`])
                    }}
                  >
                    Export to Excel
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <Alert
                setShowModal={setShowModalExport}
                showModal={showModalExport}
                loading={false}
                body={messageAlert}
                type={'download'}
                title={'Download File Export'}
                confirmLabel={'Download'}
                onConfirm={() => {
                  onExport(year || optionYear?.[0]?.value)
                  setShowModalExport(false)
                }}
                onCancel={() => setShowModalExport(false)}
              />
            </div>
          </div>
        </div>
        <div
          className='card-body table-responsive'
          ref={(node: any) => node && node.style.setProperty('padding', 0, 'important')}
        >
          <table className='table table-sm border'>
            <thead>
              <tr className='fw-boldest border' style={{backgroundColor: '#fafafa'}}>
                <td
                  align='center'
                  valign='middle'
                  rowSpan={2}
                  className='p-2'
                  style={{width: '120px', paddingTop: '20px'}}
                >
                  Month
                </td>
                {Array.isArray(dataRegions) &&
                  dataRegions?.map((e: any, index: number) => (
                    <td align='center' className='p-2' colSpan={2} key={index}>
                      {e}
                    </td>
                  ))}
              </tr>
              <tr className='fw-boldest border' style={{backgroundColor: '#fafafa'}}>
                {Array.isArray(dataRegions) &&
                  dataRegions?.map((_key: any, index: number) => (
                    <Fragment key={index}>
                      <td align='center' className='p-2'>
                        No. of Incidents
                      </td>
                      <td align='center' className='p-2'>
                        % of Completion
                      </td>
                    </Fragment>
                  ))}
              </tr>
            </thead>
            {!reportPercentageQuery?.isFetched && (
              <tbody>
                <tr>
                  <td className='text-center' colSpan={15}>
                    <PageLoader />
                  </td>
                </tr>
              </tbody>
            )}
            {Array.isArray(result) &&
              reportPercentageQuery?.isFetched &&
              Boolean(dataRegions?.length) && (
                <tbody>
                  {result?.map(({name, regions}: any, index: number) => (
                    <tr className='data-hover border' key={index}>
                      <td className='p-2'>{name}</td>
                      {Array.isArray(dataRegions) &&
                        dataRegions?.map((label: any, index: any) => {
                          const data_region = regions.find(({name}: any) => name === label)
                          if (regions.length === 0 || !data_region) {
                            return (
                              <Fragment key={index}>
                                <td
                                  align='center'
                                  onClick={() => showPercentage(name, data_region, label)}
                                >
                                  0
                                </td>
                                <td
                                  align='center'
                                  onClick={() => showPercentage(name, data_region, label)}
                                >
                                  0
                                </td>
                              </Fragment>
                            )
                          }
                          const {percetage, incident} = data_region || {}
                          return (
                            <Fragment key={index}>
                              {incident === 0 && (
                                <td
                                  className='p-2 text-center'
                                  onClick={() => showPercentage(name, data_region, label)}
                                >
                                  {incident}
                                </td>
                              )}
                              {incident !== 0 && (
                                <td
                                  className='p-2 text-center'
                                  style={{fontWeight: 'bold'}}
                                  onClick={() => showPercentage(name, data_region, label)}
                                >
                                  {incident}
                                </td>
                              )}
                              {percetage === 0 && (
                                <td
                                  className='p-2 text-center'
                                  onClick={() => showPercentage(name, data_region, label)}
                                >
                                  {percetage}
                                </td>
                              )}
                              {percetage !== 0 && (
                                <td
                                  className='p-2 text-center'
                                  style={{fontWeight: 'bold'}}
                                  onClick={() => showPercentage(name, data_region, label)}
                                >
                                  {percetage}
                                </td>
                              )}
                            </Fragment>
                          )
                        })}
                    </tr>
                  ))}
                </tbody>
              )}
          </table>
        </div>
      </div>

      <Detail showModal={showDetail} setShowModal={setShowDetail} detail={detail} />
    </>
  )
}

export default InsuranceReportPercentage
