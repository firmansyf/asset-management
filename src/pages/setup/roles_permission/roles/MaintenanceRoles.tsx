import {arrayConcat} from '@helpers'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import {FC, memo, useEffect, useState} from 'react'

import RoleTable from '../sections/RoleTable'

type MaintenanceRolesProps = {
  maintenanceRoles: any
  setMaintenanceRoles: any
  preventiveRoles: any
  setPreventiveRoles: any
  checklistRoles: any
  setChecklistRoles: any
  vendorRoles: any
  setVendorRoles: any
  meterRoles: any
  setMeterRoles: any
  setCustomerRoles: any
  setMeterReadingRoles: any
  roleMaintenance: any
  requestRoles: any
  setRequestRoles: any
  dataImportExport: any
  feature: any
}

let MaintenanceRoles: FC<MaintenanceRolesProps> = ({
  maintenanceRoles,
  setMaintenanceRoles,
  preventiveRoles,
  setPreventiveRoles,
  meterRoles,
  setMeterRoles,
  checklistRoles,
  setChecklistRoles,
  vendorRoles,
  setVendorRoles,
  setCustomerRoles,
  setMeterReadingRoles,
  roleMaintenance,
  requestRoles,
  setRequestRoles,
  dataImportExport,
  feature,
}) => {
  const [dataSetting, setDataSetting] = useState<any>([])
  const [dataImport, setDataImport] = useState<any>([])

  useEffect(() => {
    if (roleMaintenance !== undefined) {
      roleMaintenance?.map((data_role: any) => setDataSetting(data_role?.items))
      dataImportExport?.map((data_role: any) => setDataImport(data_role?.items))
      const data_setting = [
        {
          id: 'maintenance',
          items: arrayConcat(dataSetting, dataImport),
        },
      ]
      data_setting?.map((data_role: any) => {
        let data_maintenance: any = [
          'maintenance.add',
          'maintenance.edit',
          'maintenance.delete',
          'maintenance.view',
          'maintenance.export',
          'maintenance.flag',
          'maintenance.link',
          'maintenance.duplicate',
          'maintenance.print',
          'maintenance.change-status',
          'maintenance.feedback.view',
          'maintenance.share',
          'maintenance.list',
          'maintenance.setup',
          'maintenance.add-files',
        ]
        if (feature?.bulk_import === 1) {
          data_maintenance = [...data_maintenance, 'import-export.import_maintenance']
        }

        const dataCategory: any = filter(data_role?.items, (role: any) =>
          includes(data_maintenance, role?.name)
        )
        return setMaintenanceRoles(dataCategory as never)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleMaintenance, dataImportExport, setMaintenanceRoles, dataSetting, dataImport])

  useEffect(() => {
    roleMaintenance?.map((data_role: any) => {
      const data_request = [
        'maintenance.request.view',
        'maintenance.request.add',
        'maintenance.request.edit',
        'maintenance.request.delete',
        'maintenance.request.update-status',
      ]
      const dataRequest: any = filter(data_role?.items, (role: any) =>
        includes(data_request, role?.name)
      )
      return setRequestRoles(dataRequest as never)
    })

    roleMaintenance?.map((data_role: any) => {
      const data_checklist = [
        'maintenance.checklist.assigned',
        'maintenance.checklist.view',
        'maintenance.checklist.add',
        'maintenance.checklist.edit',
        'maintenance.checklist.delete',
      ]
      const dataChecklist: any = filter(data_role?.items, (role: any) =>
        includes(data_checklist, role?.name)
      )
      return setChecklistRoles(dataChecklist as never)
    })

    roleMaintenance?.map((data_role: any) => {
      const data_vendors = [
        'maintenance.vendor.view',
        'maintenance.vendor.add',
        'maintenance.vendor.edit',
        'maintenance.vendor.delete',
        'maintenance.vendor.export',
        'maintenance.vendor.setup-column',
        'maintenance.vendor-management.worker-view',
      ]
      const dataVendor: any = filter(data_role?.items, (role: any) =>
        includes(data_vendors, role?.name)
      )
      return setVendorRoles(dataVendor as never)
    })

    roleMaintenance?.map((data_role: any) => {
      const data_customers = [
        'maintenance.customer.view',
        'maintenance.customer.add',
        'maintenance.customer.edit',
        'maintenance.customer.delete',
        'maintenance.customer.export',
      ]
      const dataCustomer: any = filter(data_role?.items, (role: any) =>
        includes(data_customers, role?.name)
      )
      return setCustomerRoles(dataCustomer as never)
    })

    roleMaintenance?.map((data_role: any) => {
      const data_meter_reading = ['maintenance.receive-meter-reading-alert']
      const dataMeterReading: any = filter(data_role?.items, (role: any) =>
        includes(data_meter_reading, role?.name)
      )
      return setMeterReadingRoles(dataMeterReading as never)
    })

    roleMaintenance?.map((data_role: any) => {
      const data_meters = [
        'maintenance.meter.view',
        'maintenance.meter.add',
        'maintenance.meter.edit',
        'maintenance.meter.delete',
        'maintenance.meter.setup-column',
      ]
      const dataMeter: any = filter(data_role?.items, (role: any) =>
        includes(data_meters, role?.name)
      )
      return setMeterRoles(dataMeter as never)
    })

    roleMaintenance?.map((data_role: any) => {
      const data_preventive = [
        'maintenance.preventive.add',
        'maintenance.preventive.edit',
        'maintenance.preventive.delete',
        'maintenance.preventive.view',
      ]
      const dataPreventive: any = filter(data_role?.items, (role: any) =>
        includes(data_preventive, role?.name)
      )
      return setPreventiveRoles(dataPreventive as never)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    roleMaintenance,
    setChecklistRoles,
    setMeterRoles,
    setMaintenanceRoles,
    setRequestRoles,
    setMeterReadingRoles,
    setVendorRoles,
  ])

  return (
    <div className='container'>
      <div className='mb-0 mt-10'>
        <h3>Permission</h3>
      </div>
      <div className='mb-10'>Set user&apos;s permission add/edit/delete/view.</div>
      <div className='row'>
        <div className='col-sm-12 col-md-6 col-lg-6'>
          <RoleTable
            dataRoles={maintenanceRoles}
            setDataRoles={setMaintenanceRoles}
            roleName={'maintenance'}
            roleTitle={'Work Order'}
          />
          <RoleTable
            dataRoles={checklistRoles}
            setDataRoles={setChecklistRoles}
            roleName={'checklist'}
            roleTitle={'Checklist'}
          />
        </div>
        <div className='col-sm-12 col-md-6 col-lg-6'>
          <RoleTable
            dataRoles={requestRoles}
            setDataRoles={setRequestRoles}
            roleName={'request'}
            roleTitle={'Request'}
          />
          <RoleTable
            dataRoles={preventiveRoles}
            setDataRoles={setPreventiveRoles}
            roleName={'preventive'}
            roleTitle={'Preventive'}
          />
          <RoleTable
            dataRoles={vendorRoles}
            setDataRoles={setVendorRoles}
            roleName={'vendor'}
            roleTitle={'Vendor'}
          />
          <RoleTable
            dataRoles={meterRoles}
            setDataRoles={setMeterRoles}
            roleName={'meter'}
            roleTitle={'Meter'}
          />
        </div>
      </div>
    </div>
  )
}

MaintenanceRoles = memo(
  MaintenanceRoles,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default MaintenanceRoles
