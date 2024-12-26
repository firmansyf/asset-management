import {hasPermission} from '@helpers'
import {FC} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {useNavigate} from 'react-router-dom'

import {ExportPdfExcel} from '../export/ExportPdfExcel'

interface Props {
  onExport: any
}

const ToolbacActions: FC<Props> = ({onExport}) => {
  const navigate = useNavigate()
  return (
    <div className='dropdown' data-cy='actions' style={{marginRight: '5px'}}>
      <Dropdown>
        <Dropdown.Toggle variant='light-primary' size='sm' id='dropdown-basic'>
          Actions
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {hasPermission('user-management.export') && <ExportPdfExcel onExport={onExport} />}
          {/* <ToolbarImport
            actionName='Import New User'
            pathName='/tools/import'
            type='user'
            permission='null'
          /> */}
          <Dropdown.Item
            aria-labelledby='setupColumns'
            href='#'
            onClick={() => {
              navigate('/user/setup-column-user')
            }}
          >
            Setup Column
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

export default ToolbacActions
