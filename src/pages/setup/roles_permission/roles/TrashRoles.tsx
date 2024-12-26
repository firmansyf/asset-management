import {filter, includes} from 'lodash'
import {FC, useEffect} from 'react'

import RoleTable from '../sections/RoleTable'

type TrashRolesProps = {
  roleTrash: any
  trashRoles: any
  setTrashRoles: any
}
const TrashRoles: FC<TrashRolesProps> = ({roleTrash, trashRoles, setTrashRoles}) => {
  useEffect(() => {
    roleTrash.map((data_role: any) => {
      const data_trash: any = ['trash.delete', 'trash.empty', 'trash.restore', 'trash.view']
      const dataTrash: any = filter(data_role?.items, (role: any) =>
        includes(data_trash, role?.name)
      )
      return setTrashRoles(dataTrash)
    })
  }, [roleTrash, setTrashRoles])

  return (
    <div className='container'>
      <div className='mb-0 mt-10'>
        <h3>Permission</h3>
      </div>
      <div className='mb-10'>Set user&lsquo;s permission add/edit/delete/view.</div>
      <div className='row'>
        <div className='col-sm-12 col-md-6 col-lg-6'>
          <RoleTable
            dataRoles={trashRoles}
            setDataRoles={setTrashRoles}
            roleName={'trash'}
            roleTitle={'Trash'}
          />
        </div>
      </div>
    </div>
  )
}

export default TrashRoles
