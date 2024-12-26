import {roleImportConcat} from '@helpers'
import {FC, memo, useEffect} from 'react'

import RoleTable from '../sections/RoleTable'

type LocationRolesProps = {
  feature: any
  locationRoles: any
  setLocationRoles: any
  subLocationRoles: any
  setSubLocationRoles: any
  dataImportExport: any
  dataLocation: any
  dataSubLocation: any
}

let LocationRoles: FC<LocationRolesProps> = ({
  feature,
  locationRoles,
  setLocationRoles,
  subLocationRoles,
  setSubLocationRoles,
  dataImportExport,
  dataLocation,
  dataSubLocation,
}) => {
  useEffect(() => {
    dataImportExport?.map((data_role: any) => {
      if (feature?.bulk_import === 1) {
        setLocationRoles(
          roleImportConcat(['import-export.import_locations'], data_role, dataLocation)
        )
        setSubLocationRoles(
          roleImportConcat(['import-export.import_location_sub'], data_role, dataSubLocation)
        )
      } else {
        setLocationRoles(dataLocation)
        setSubLocationRoles(dataSubLocation)
      }
      return true
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataImportExport, dataLocation, setLocationRoles, dataSubLocation, setSubLocationRoles])
  return (
    <div className='container'>
      <div className='mb-0 mt-10'>
        <h3>Permission</h3>
      </div>
      <div className='mb-10'>Set user&apos;s permission add/edit/delete/view.</div>
      <div className='row'>
        <div className='col-sm-12 col-md-6 col-lg-6'>
          <RoleTable
            dataRoles={locationRoles}
            setDataRoles={setLocationRoles}
            roleName={'location'}
            roleTitle={'Location'}
          />
        </div>
        <div className='col-sm-12 col-md-6 col-lg-6'>
          <RoleTable
            dataRoles={subLocationRoles}
            setDataRoles={setSubLocationRoles}
            roleName={'sub-location'}
            roleTitle={'	Sub Location'}
          />
        </div>
      </div>
    </div>
  )
}

LocationRoles = memo(
  LocationRoles,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default LocationRoles
