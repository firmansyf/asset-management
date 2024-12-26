import {configClass} from '@helpers'
import {getInsuranceClaimYears} from '@pages/dashboard/redux/DashboardService'
import last from 'lodash/last'
import {FC, memo, useEffect, useState} from 'react'

let InsuranceClaimYearsOption: FC<any> = ({onChange}) => {
  const [optYears, setOptYears] = useState<any>([])
  const [year, setYear] = useState<any>()
  useEffect(() => {
    getInsuranceClaimYears()
      .then(({data}: any) => {
        const yearData: any = []
        const declineYear: any = [null, undefined, 1970]
        data?.forEach((item: any) => {
          if (!declineYear.includes(item)) {
            yearData.push(item)
          }
        })

        // const dataYears: any = data?.filter((f: any) => f)
        // const remove_years = dataYears.indexOf(1970)
        // dataYears.splice(remove_years, 1)
        setOptYears(yearData as never[]) //dataYears
        setYear(last(yearData as never[])) //dataYears
        onChange && onChange(last(yearData as never[])) //dataYears
      })
      .catch(() => '')
  }, [onChange])
  return (
    <select
      name='select'
      value={year}
      data-cy='ic-year-options'
      className={configClass?.select}
      onChange={({target: {value}}: any) => {
        onChange && onChange(value)
        setYear(value)
      }}
    >
      {optYears?.map((y: any, key: number) => (
        <option key={key} value={y}>
          {y}
        </option>
      ))}
    </select>
  )
}

InsuranceClaimYearsOption = memo(
  InsuranceClaimYearsOption,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {InsuranceClaimYearsOption}
