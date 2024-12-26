import {FC, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'

import {Alert} from '../alert'

interface Props {
  onExport?: any
  length?: any
}

const ExportPdfExcel: FC<Props> = ({onExport, length}) => {
  const [dataExport, setDataExport] = useState<any>('')
  const [showModalExport, setShowModalExport] = useState<any>(false)
  const [messageAlert, setMessage] = useState<any>(false)

  return (
    <>
      <Dropdown.Item
        href='#'
        aria-labelledby='export to Excel'
        data-cy='exportToExcel'
        onClick={() => {
          setShowModalExport(true)
          setDataExport('xlsx')
          setMessage([`Are you sure want to download xlsx file ?`])
        }}
      >
        Export to Excel
      </Dropdown.Item>

      <Dropdown.Item
        href='#'
        aria-labelledby='export to PDF'
        data-cy='exportToPDF'
        onClick={() => {
          setShowModalExport(true)
          setDataExport('pdf')
          setMessage([
            `Are you sure want to download pdf file ?`,
            <br key='notunique' />,
            length > 20 && (
              <b>
                Note: Due to high number of columns, some of the columns may not be available in the
                export file.
              </b>
            ),
          ])
        }}
      >
        Export to PDF
      </Dropdown.Item>

      <Alert
        setShowModal={setShowModalExport}
        showModal={showModalExport}
        loading={false}
        body={messageAlert}
        type={'download'}
        title={'Download File Export'}
        confirmLabel={'Download'}
        onConfirm={() => {
          onExport(dataExport)
          setShowModalExport(false)
        }}
        onCancel={() => {
          setShowModalExport(false)
        }}
      />
    </>
  )
}

export {ExportPdfExcel}
