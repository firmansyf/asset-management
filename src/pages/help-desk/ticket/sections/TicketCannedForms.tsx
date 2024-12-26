/* eslint-disable react-hooks/exhaustive-deps */
import {Search} from '@components/form/searchAlert'
import {KTSVG} from '@helpers'
import {getCannedForms} from '@pages/help-desk/canned-forms/Service'
import parse from 'html-react-parser'
import {FC, Fragment, useEffect, useState} from 'react'

import {CannedFormAddButton} from '../form/CannedFormAddButton'

export const TicketCannedForms: FC<any> = ({
  classBarCannedForms,
  setClassBarCannedForms,
  setLoadingTextEditor,
  setdataMessage,
  dataMessage,
}) => {
  const [page, setPage] = useState<number>(1)
  const [keyword, setKeyword] = useState<any>('')
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)
  const [dataCannedForms, setCannedForms] = useState<any>([])

  const submitCannedForms = (response: any) => {
    setLoadingTextEditor(true)
    setTimeout(() => setLoadingTextEditor(false), 1700)
    setdataMessage(dataMessage + '  ' + (response || ''))
  }

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e ? `*${e}*` : '')
  }

  useEffect(() => {
    if (resetKeyword) {
      onSearch('')
      setResetKeyword(false)
    }
  }, [resetKeyword])

  useEffect(() => {
    getCannedForms({keyword, page}).then(({data: {data: res}}: any) => {
      res && setCannedForms(res ?? [])
    })
  }, [keyword])

  return (
    <div id='seconddiv' className={'card card-custom card-table ' + classBarCannedForms}>
      <div className='card-table-header' style={{position: 'initial'}}>
        <span>Canned Forms</span>
        <a
          href='#'
          onClick={() => {
            setClassBarCannedForms('')
          }}
        >
          <i className='las la-times' style={{float: 'right', fontSize: '18px'}}></i>
        </a>
      </div>
      <div className='card-body mt-5'>
        <div className='d-flex align-items-center position-relative me-4 my-5'>
          <KTSVG
            path='/media/icons/duotone/General/Search.svg'
            className='svg-icon-3 position-absolute ms-3'
          />
          <Search
            bg='solid'
            width='80%'
            onChange={onSearch}
            resetKeyword={resetKeyword}
            setResetKeyword={setResetKeyword}
          />
        </div>

        {dataCannedForms && dataCannedForms?.length > 0 && (
          <CannedFormAddButton
            id='canned_form'
            default='canned_form'
            style={{
              overflowY: 'scroll',
              height: '60vh',
            }}
          >
            {dataCannedForms?.map((item: any, index: number) => (
              <Fragment key={index}>
                <div
                  className='d-flex'
                  data-value={`${item?.guid || ''}`}
                  data-label={`${item?.name || ''}`}
                  data-body={`${item?.message || ''}`}
                  data-addAction={submitCannedForms}
                >
                  <div className='row'>
                    <div className='col-12'>{parse(`${item?.message}`)}</div>
                  </div>
                </div>
              </Fragment>
            ))}
          </CannedFormAddButton>
        )}
      </div>
    </div>
  )
}
