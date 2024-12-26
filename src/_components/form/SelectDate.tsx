import chunk from 'lodash/chunk'
import {FC, useState} from 'react'

const SelectDate: FC<any> = ({defaultValue, onChange}) => {
  const [value, setValue] = useState<any>(defaultValue.map((m: any) => parseInt(m || 0)))
  let date: any = Array(31)
    ?.fill('')
    ?.map((_m: any, index: number) => index + 1)
  date = chunk(date, 7)
  return (
    <div className='row'>
      {date.map((week: any, key: number) => (
        <div className='col-12' key={key}>
          <div className='row flex-nowrap'>
            {week.map((m: any, index: any) => (
              <div className={`col-auto my-2`} key={index} style={{width: `${100 / 7}%`}}>
                <div
                  className={`d-flex align-items-center justify-content-center cursor-pointer user-select-none`}
                >
                  <div
                    className={`h-25px w-25px d-flex align-items-center justify-content-center border rounded-circle ${
                      value.includes(m) ? 'bg-primary border-primary' : 'bg-light border-secondary'
                    }`}
                    onClick={() => {
                      let result: any = []
                      if (value.includes(m)) {
                        result = value?.filter((f: any) => f !== m)
                      } else {
                        result = [...value, m]
                      }
                      setValue(result)
                      onChange && onChange(result)
                    }}
                  >
                    <span className={`${value.includes(m) && 'text-white'} fw-bold`}>{m}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export {SelectDate}
