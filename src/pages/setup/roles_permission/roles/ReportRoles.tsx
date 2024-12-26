import filter from 'lodash/filter'
import includes from 'lodash/includes'
import {FC, memo, useEffect} from 'react'

import RoleTable from '../sections/RoleTable'

type ReportRolesProps = {
  reportRoles: any
  setReportRoles: any
  reportSetupRoles: any
  setReportSetupRoles: any
  reportAutomatedRoles: any
  setReportAutomatedRoles: any
  roleReport: any
  features: any
}

let ReportRoles: FC<ReportRolesProps> = ({
  reportRoles,
  setReportRoles,
  reportSetupRoles,
  setReportSetupRoles,
  reportAutomatedRoles,
  setReportAutomatedRoles,
  roleReport,
  features,
}) => {
  useEffect(() => {
    roleReport?.map((data_role: any) => {
      const data_report = [
        'reports.asset_by_audit_status',
        'reports.asset_by_category_manufacture',
        'reports.asset_by_department',
        'reports.asset_by_employee',
        'reports.asset_by_history_report',
        'reports.asset_by_maintenance',
        'reports.asset_by_qr_codes',
        'reports.asset_by_status',
      ]
      const dataReport: any = filter(data_role?.items, (role: any) =>
        includes(data_report, role?.name)
      )
      return setReportRoles(dataReport as never)
    })
    roleReport?.map((data_role: any) => {
      const data_automated_report = [
        'reports.automation_report.view',
        'reports.automation_report.add',
        'reports.automation_report.edit',
        'reports.automation_report.delete',
      ]
      const dataAutomatedReport: any = filter(data_role?.items, (role: any) =>
        includes(data_automated_report, role?.name)
      )
      return setReportAutomatedRoles(dataAutomatedReport as never)
    })
    roleReport?.map((data_role: any) => {
      let dataReportSetup = []
      dataReportSetup = data_role.items
        ?.filter((role_item: {name: any}) => role_item.name === 'reports.custom-report.create')
        ?.map((data: any) => data)
      return setReportSetupRoles(dataReportSetup)
    })
  }, [roleReport, setReportAutomatedRoles, setReportRoles, setReportSetupRoles])

  return (
    <>
      {(features?.custom_report === 1 || features?.automated_report === 1) && (
        <div className='container'>
          <div className='mb-0 mt-10'>
            <h3>Custom Reports and Setup</h3>
          </div>
          <div className='mb-10'>
            User can generate custom reports and setup column for reports.
          </div>
          {features?.custom_report === 1 && (
            <RoleTable
              dataRoles={reportSetupRoles}
              setDataRoles={setReportSetupRoles}
              roleName={'sub-report'}
              roleTitle={'Report Setup'}
            />
          )}
          {features?.automated_report === 1 && (
            <RoleTable
              dataRoles={reportAutomatedRoles}
              setDataRoles={setReportAutomatedRoles}
              roleName={'automated-report'}
              roleTitle={'Automated Report'}
            />
          )}
        </div>
      )}
      <div className='container'>
        <div className='mb-0 mt-10'>
          <h3>View and Print Reports</h3>
        </div>
        <div className='mb-10'>User can generate these reports:</div>
        <RoleTable
          dataRoles={reportRoles}
          setDataRoles={setReportRoles}
          roleName={'report'}
          roleTitle={'Reports'}
        />
      </div>
    </>
  )
}

ReportRoles = memo(
  ReportRoles,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default ReportRoles
