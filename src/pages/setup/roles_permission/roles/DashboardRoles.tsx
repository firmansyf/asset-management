import {checkLength, updateRoles, updateRolesAll} from '@helpers'
import {FC, memo, useEffect, useState} from 'react'
import {Table} from 'react-bootstrap'

import RoleTable from '../sections/RoleTable'

type DashboardRolesProps = {
  feature: any
  dashboardChartRoles: any
  setDashboardChartRoles: any
  dashboardWidgetRoles: any
  setDashboardWidgetRoles: any
  dashboardInsuranceRoles: any
  setDashboardInsuranceRoles: any
  dashboardOtherRoles: any
  setDashboardOtherRoles: any
  dashboardInventoryRoles: any
  setDashboardInventoryRoles: any
  manageDashboardRoles: any
  setManageDashboardRoles: any
}

let DashboardRoles: FC<DashboardRolesProps> = ({
  feature,
  dashboardChartRoles,
  setDashboardChartRoles,
  dashboardWidgetRoles,
  setDashboardWidgetRoles,
  dashboardInsuranceRoles,
  setDashboardInsuranceRoles,
  dashboardOtherRoles,
  setDashboardOtherRoles,
  dashboardInventoryRoles,
  setDashboardInventoryRoles,
  manageDashboardRoles,
  setManageDashboardRoles,
}) => {
  const [chartAllCk, setchartAllCk] = useState<boolean>(false)
  const [widgetAllCk, setWidgetAllCk] = useState<boolean>(false)
  const [insuranceClaimAllCk, setInsuranceClaimAllCk] = useState<boolean>(false)
  const [otherAllCk, setOtherAllCk] = useState<boolean>(false)
  const [checkAllCk, setCheckAllCk] = useState<boolean>(false)
  const [inventoryAllCk, setInventoryAllCk] = useState<boolean>(false)
  const [manageDashboardAllCk, setManageDashboardAllCk] = useState<boolean>(false)

  const handleCheckChield = (checked: any, role_name: any) => {
    if (role_name === 'chart') {
      const new_arr_roles: any = dashboardChartRoles?.map((item: any) => updateRoles(checked, item))
      setDashboardChartRoles(new_arr_roles)
      if (checked?.target?.checked === false) {
        setchartAllCk(false)
        setCheckAllCk(false)
      }
    }
    if (role_name === 'widget') {
      const new_arr_roles: any = dashboardWidgetRoles?.map((item: any) =>
        updateRoles(checked, item)
      )
      setDashboardWidgetRoles(new_arr_roles)
      if (checked?.target?.checked === false) {
        setWidgetAllCk(false)
        setCheckAllCk(false)
      }
    }
    if (role_name === 'insurance_claim') {
      const new_arr_roles: any = dashboardInsuranceRoles?.map((item: any) =>
        updateRoles(checked, item)
      )
      setDashboardInsuranceRoles(new_arr_roles)
      if (checked?.target?.checked === false) {
        setInsuranceClaimAllCk(false)
        setCheckAllCk(false)
      }
    }
    if (role_name === 'other') {
      const new_arr_roles: any = dashboardOtherRoles?.map((item: any) => updateRoles(checked, item))
      setDashboardOtherRoles(new_arr_roles)
      if (checked?.target?.checked === false) {
        setOtherAllCk(false)
        setCheckAllCk(false)
      }
    }
    if (role_name === 'inventory') {
      const new_arr_roles: any = dashboardInventoryRoles?.map((item: any) =>
        updateRoles(checked, item)
      )
      setDashboardInventoryRoles(new_arr_roles)
      if (checked?.target?.checked === false) {
        setInventoryAllCk(false)
        setCheckAllCk(false)
      }
    }
    if (role_name === 'manage_dashboard') {
      const new_arr_roles: any = manageDashboardRoles?.map((item: any) =>
        updateRoles(checked, item)
      )
      setManageDashboardRoles(new_arr_roles)
      if (checked?.target?.checked === false) {
        setManageDashboardAllCk(false)
        setCheckAllCk(false)
      }
    }
  }

  const handleAllDashboard = (checked: any) => {
    setCheckAllCk(checked)
    // all chart roles
    const chart_roles: any = dashboardChartRoles?.map((item: any) => updateRolesAll(checked, item))
    setDashboardChartRoles(chart_roles)
    setchartAllCk(checked)

    // all widget roles
    const widget_roles: any = dashboardWidgetRoles?.map((item: any) =>
      updateRolesAll(checked, item)
    )
    setDashboardWidgetRoles(widget_roles)
    setWidgetAllCk(checked)

    // all insurance claim roles
    const insurance_roles: any = dashboardInsuranceRoles?.map((item: any) =>
      updateRolesAll(checked, item)
    )
    setDashboardInsuranceRoles(insurance_roles)
    setInsuranceClaimAllCk(checked)

    // all other roles
    const other_roles: any = dashboardOtherRoles?.map((item: any) => updateRolesAll(checked, item))
    setDashboardOtherRoles(other_roles)
    setOtherAllCk(checked)

    // all inventory roles
    const inventory_roles: any = dashboardInventoryRoles?.map((item: any) =>
      updateRolesAll(checked, item)
    )
    setDashboardInventoryRoles(inventory_roles)
    setInventoryAllCk(checked)

    // all manage dashboard roles
    const manage_dashboard: any = manageDashboardRoles?.map((item: any) =>
      updateRolesAll(checked, item)
    )
    setManageDashboardRoles(manage_dashboard)
    setManageDashboardAllCk(checked)
  }

  useEffect(() => {
    let chart_count: number = 0
    dashboardChartRoles
      ?.filter((role: {is_allow: any}) => role?.is_allow === 1)
      .map((data_role: any) => {
        if (data_role?.is_allow === 1) {
          chart_count++
        }
        return true
      })
    setchartAllCk(checkLength(chart_count, dashboardChartRoles?.length))

    let widget_count: number = 0
    dashboardWidgetRoles
      ?.filter((role: {is_allow: any}) => role?.is_allow === 1)
      .map((data_role: any) => {
        if (data_role?.is_allow === 1) {
          widget_count++
        }
        return true
      })
    setWidgetAllCk(checkLength(widget_count, dashboardWidgetRoles?.length))

    let insurance_count: number = 0
    dashboardInsuranceRoles
      ?.filter((role: {is_allow: any}) => role?.is_allow === 1)
      .map((data_role: any) => {
        if (data_role?.is_allow === 1) {
          insurance_count++
        }
        return true
      })
    setInsuranceClaimAllCk(checkLength(insurance_count, dashboardInsuranceRoles?.length))

    let other_count: number = 0
    dashboardOtherRoles
      ?.filter((role: {is_allow: any}) => role?.is_allow === 1)
      .map((data_role: any) => {
        if (data_role?.is_allow === 1) {
          other_count++
        }
        return true
      })
    setOtherAllCk(checkLength(other_count, dashboardOtherRoles?.length))

    let inventory_count: number = 0
    dashboardInventoryRoles
      ?.filter((role: {is_allow: any}) => role?.is_allow === 1)
      .map((data_role: any) => {
        if (data_role?.is_allow === 1) {
          inventory_count++
        }
        return true
      })
    setInventoryAllCk(checkLength(inventory_count, dashboardInventoryRoles?.length))

    let manage_count: number = 0
    manageDashboardRoles
      ?.filter((role: {is_allow: any}) => role?.is_allow === 1)
      .map((data_role: any) => {
        if (data_role?.is_allow === 1) {
          manage_count++
        }
        return true
      })
    setManageDashboardAllCk(checkLength(manage_count, manageDashboardRoles?.length))

    if (
      chartAllCk &&
      widgetAllCk &&
      insuranceClaimAllCk &&
      otherAllCk &&
      inventoryAllCk &&
      manageDashboardAllCk
    ) {
      setCheckAllCk(true)
    } else {
      setCheckAllCk(false)
    }
  }, [
    dashboardChartRoles,
    dashboardWidgetRoles,
    dashboardInsuranceRoles,
    dashboardOtherRoles,
    dashboardInventoryRoles,
    manageDashboardRoles,
    chartAllCk,
    widgetAllCk,
    insuranceClaimAllCk,
    otherAllCk,
    inventoryAllCk,
    manageDashboardAllCk,
  ])

  return (
    <div className='container'>
      <div className='mb-15 mt-10'>
        <h3>Permission</h3>
        <p>User can view selected items in their Dashboard.</p>
      </div>
      <div className='form-check form-check-custom form-check-solid mx-5 mb-10'>
        <input
          className='form-check-input'
          type='checkbox'
          name='alldashboard'
          value='true'
          checked={checkAllCk}
          onChange={(e: any) => handleAllDashboard(e?.target?.checked)}
        />
        <span className='ms-10'>
          <strong>All Dashboard Items</strong>
        </span>
      </div>
      <div className='row'>
        <div className='col-sm-12 col-md-6 col-lg-6'>
          <RoleTable
            dataRoles={dashboardChartRoles}
            setDataRoles={setDashboardChartRoles}
            roleName={'chart'}
            roleTitle={'Charts'}
          />
          {feature?.insurance_claim === 1 && (
            <RoleTable
              dataRoles={dashboardInsuranceRoles}
              setDataRoles={setDashboardInsuranceRoles}
              roleName={'insurance_claim'}
              roleTitle={'Insurance Claim'}
            />
          )}
          <RoleTable
            dataRoles={dashboardOtherRoles}
            setDataRoles={setDashboardOtherRoles}
            roleName={'other'}
            roleTitle={'Other'}
          />
          {feature?.inventory === 1 && (
            <RoleTable
              dataRoles={dashboardInventoryRoles}
              setDataRoles={setDashboardInventoryRoles}
              roleName={'inventory'}
              roleTitle={'Inventory'}
            />
          )}
        </div>
        <div className='col-sm-12 col-md-6 col-lg-6'>
          <RoleTable
            dataRoles={dashboardWidgetRoles}
            setDataRoles={setDashboardWidgetRoles}
            roleName={'widget'}
            roleTitle={'Widget'}
          />
        </div>
      </div>
      <div className='row'>
        <div className='col-sm-5 mb-5'>
          <h3>Manage Dashboard</h3>
          <Table striped bordered hover>
            <tbody>
              {Array.isArray(manageDashboardRoles) &&
                manageDashboardRoles?.map(({name, label, is_allow}: any, index: any) => {
                  return (
                    <tr key={index} className='border-bottom mt-15 mb-15'>
                      <td>
                        <div className='form-check form-check-custom form-check-solid mx-5'>
                          <input
                            className='form-check-input'
                            type='checkbox'
                            name={name}
                            checked={is_allow}
                            defaultChecked={is_allow}
                            onChange={(e: any) => handleCheckChield(e, 'manage_dashboard')}
                          />
                        </div>
                      </td>
                      <td>{label}</td>
                    </tr>
                  )
                })}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  )
}

DashboardRoles = memo(
  DashboardRoles,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default DashboardRoles
