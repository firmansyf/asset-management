import './style.scss'

import {isValidURL} from '@helpers'
import {FC, useEffect, useState} from 'react'
import * as excel from 'xlsx'
const LoadingElement: FC<any> = ({title}) => (
  <div className='react-excel p-5 d-flex align-items-center justify-content-center text-muted'>
    {title || 'waiting for load excel . . .'}
  </div>
)
export const XLSX: FC<any> = ({src}) => {
  const [loading, setLoading] = useState(true)
  const [loadData, setLoadData] = useState(false)
  const [sheet, setSheet] = useState<any>([])
  const [activeSheet, setActiveSheet] = useState(undefined)
  const [thead, setThead] = useState<any>([])
  const [data, setData] = useState<any>([])
  useEffect(() => {
    if (src) {
      const wb: any = excel.read(src, {type: isValidURL(src) ? 'binary' : 'base64'})
      setSheet(wb?.SheetNames)
      setActiveSheet(wb?.SheetNames?.[0])
      setLoading(false)
    }
    return () => {
      // unmounting
      setSheet([])
      setActiveSheet(undefined)
      setLoading(true)
    }
  }, [src])
  useEffect(() => {
    setLoadData(true)
    if (activeSheet) {
      fetch(src)
        .then((res: any) => res.arrayBuffer())
        .then((arrayBuffer: any) => {
          const dataArr = new Uint8Array(arrayBuffer)
          const arr: any = []
          for (let i = 0; i !== dataArr?.length; i += 1) {
            arr.push(String.fromCharCode(dataArr[i]))
          }
          const book = excel.read(arr.join(''), {type: 'binary'})
          const dataSheet: any = excel.utils.sheet_to_json(book.Sheets[activeSheet])
          setThead(
            Object.keys(dataSheet?.[0] || {}).map((m: any) => {
              m === '__EMPTY' && (m = '#')
              return m
            })
          )
          setSheet(book.SheetNames)
          setData(dataSheet)
          setLoadData(false)
        })
        .catch(() => setLoadData(false))
    }
  }, [src, activeSheet])
  return (
    <>
      {loading ? (
        <LoadingElement />
      ) : (
        <div className='react-excel'>
          <div
            className='d-flex align-items-center justify-content-between border-bottom'
            style={{padding: '1rem 0'}}
          >
            <div
              className='btn-group overflow-auto'
              role='group'
              aria-label='Basic example'
              style={{borderRadius: '5px'}}
            >
              {sheet.map((m: any, index: number) => (
                <button
                  key={index}
                  type='button'
                  className={`btn py-1 px-3 fs-8 fw-bolder btn-${
                    m === activeSheet ? 'success' : 'light'
                  }`}
                  onClick={() => setActiveSheet(m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          {loadData ? (
            <LoadingElement title='loading data . . .' />
          ) : (
            <table className='table table-row-dashed gx-3 gy-2'>
              <thead>
                <tr>
                  {thead.map((m: any, index: number) => (
                    <th
                      key={index}
                      className='fs-7 text-start'
                      style={{verticalAlign: 'middle', lineHeight: 1.2}}
                    >
                      {m}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.map((tr: any, trIndex: number) => (
                  <tr
                    key={trIndex}
                    className='fs-8 text-start'
                    style={{verticalAlign: 'middle', lineHeight: 1.2}}
                  >
                    {Object.values(tr || {}).map((td: any, tdIndex: number) => (
                      <td key={tdIndex}>{td}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </>
  )
}
