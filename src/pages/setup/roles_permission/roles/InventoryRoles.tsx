import {roleImportConcat} from '@helpers'
import {FC, memo, useEffect} from 'react'

import RoleTable from '../sections/RoleTable'

type InventoryRolesProps = {
  feature: any
  inventoryRoles: any
  setInventoryRoles: any
  dataInventory: any
  dataImportExport: any
}
let InventoryRoles: FC<InventoryRolesProps> = ({
  feature,
  inventoryRoles,
  setInventoryRoles,
  dataInventory,
  dataImportExport,
}) => {
  useEffect(() => {
    dataImportExport?.map((data_role: any) => {
      if (feature?.bulk_import === 1) {
        setInventoryRoles(
          roleImportConcat(['import-export.import_inventory'], data_role, dataInventory)
        )
      } else {
        setInventoryRoles(dataInventory)
      }
      return true
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataImportExport, dataInventory, setInventoryRoles])
  return (
    <div className='container'>
      <div className='mb-0 mt-10'>
        <h3>Permission</h3>
      </div>
      <div className='mb-10'>Set user&apos;s permission for inventory.</div>
      <RoleTable
        dataRoles={inventoryRoles}
        setDataRoles={setInventoryRoles}
        roleName={'inventory'}
        roleTitle={'Inventory'}
      />
    </div>
  )
}

InventoryRoles = memo(
  InventoryRoles,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default InventoryRoles
