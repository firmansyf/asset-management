import {DatatableLoader} from '@components/loader/table'
import {configClass, KTSVG, preferenceDate, validationViewDate} from '@helpers'
import {FC, memo, useState} from 'react'

import ShowFile from '../edit-claim/ShowFile'

let TableDocument: FC<any> = ({data, optionDocument, loadingPage}) => {
  const pref_date: any = preferenceDate()

  const [detailDoc, setDetailDoc] = useState<any>()
  const [showModalView, setShowModalView] = useState<boolean>(false)

  const documents: any = data?.documents || []

  if (loadingPage) {
    return (
      <>
        <table className='table table-borderless table-striped table-hover'>
          <thead className='table-header-blue'>
            <tr className='table-tr-border-none'>
              <th className='fw-bolder'>Document</th>
              <th className='fw-bolder'>File Name</th>
              <th className='fw-bolder'>Comment/Description</th>
              <th className='fw-bolder'>Upload By</th>
              <th className='fw-bolder'>Upload Date</th>
              <th className='fw-bolder text-center'>Action</th>
            </tr>
          </thead>
        </table>
        <DatatableLoader className='my-5' count={2} />
      </>
    )
  }
  return (
    <>
      <ShowFile data={detailDoc} showModal={showModalView} setShowModal={setShowModalView} />
      <table className='table table-borderless table-striped table-hover'>
        <thead className='table-header-blue'>
          <tr className='table-tr-border-none'>
            <th className='p-3'>Document</th>
            <th className='p-3'>File Name</th>
            <th className='p-3'>Comment/Description</th>
            <th className='p-3'>Upload Date</th>
            <th className='p-3'>Upload By</th>
            <th className='p-3'>Action</th>
          </tr>
        </thead>
        <tbody>
          {documents &&
            documents?.length > 0 &&
            documents?.map((e: any, index: number) => {
              const {guid, name, files}: any = e || {}
              const doc: any = optionDocument?.find(({guid: id}: any) => id === guid)

              return files?.length === 0 ? (
                <tr key={index} className='table-tr-border-none'>
                  <td className='px-3'>
                    <label
                      className={
                        doc?.is_mandatory_document === 1
                          ? `${configClass?.label} required`
                          : configClass?.label
                      }
                    >
                      {name || ''}
                    </label>
                  </td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
              ) : (
                files &&
                  files?.length > 0 &&
                  files?.map((e: any, index: any) => {
                    const {title, comments, uploaded_by, mime_type, uploaded_date}: any = e || {}
                    return (
                      <tr key={index} className='table-tr-border-none'>
                        {index === 0 && (
                          <td rowSpan={files?.length} className='px-3'>
                            <label
                              className={
                                doc?.is_mandatory_document === 1
                                  ? `${configClass?.label} required`
                                  : configClass?.label
                              }
                            >
                              {name || ''}
                            </label>
                          </td>
                        )}
                        <td style={{padding: '0.75rem 0.75rem'}}>{title}</td>
                        <td>{comments || '-'}</td>
                        <td>
                          {uploaded_date !== null
                            ? validationViewDate(uploaded_date, pref_date)
                            : 'N/A'}
                        </td>
                        <td>{uploaded_by?.name || '-'}</td>
                        <td>
                          {mime_type !== null ? (
                            <span
                              title='view'
                              onClick={() => {
                                setDetailDoc(e)
                                setShowModalView(true)
                              }}
                              className='align-items-center justify-content-center w-30px h-30px btn btn-icon radius-50 btn-light-primary'
                            >
                              <KTSVG path='/images/view-icon2.svg' className='svg-icon-2' />
                            </span>
                          ) : (
                            '-'
                          )}
                        </td>
                      </tr>
                    )
                  })
              )
            })}
        </tbody>
      </table>
    </>
  )
}

TableDocument = memo(
  TableDocument,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default TableDocument
