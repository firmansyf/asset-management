import {FC} from 'react'
import {Dropdown} from 'react-bootstrap'

interface Props {
  onExport: any
}

const Export: FC<Props> = ({onExport}) => {
  return (
    <Dropdown>
      <Dropdown.Toggle variant='white' size='sm' id='dropdown-basic'>
        Actions
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item
          href='#'
          onClick={() => {
            onExport('pdf')
          }}
        >
          Export to PDF
        </Dropdown.Item>
        <Dropdown.Item
          href='#'
          onClick={() => {
            onExport('xlsx')
          }}
        >
          Export to Excel
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export {Export}
