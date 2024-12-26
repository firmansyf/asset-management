import {getUserByToken} from '@api/AuthCRUD'
import {editRole, getDetailRole, updatePermission} from '@api/role-and-permision'
import {InputText} from '@components/InputText'
import {ToastMessage} from '@components/toast-message'
import {arrayConcat, configClass, errorExpiredToken, errorValidation} from '@helpers'
import {saveCurrentUser} from '@redux'
import {Form, Formik} from 'formik'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Tab, Tabs} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import * as Yup from 'yup'

import AdminRightRoles from './roles/AdminRightRoles'
import ApprovalRoles from './roles/ApprovalRoles'
import AssetRoles from './roles/AssetRoles'
import DashboardRoles from './roles/DashboardRoles'
import HelpdeskRoles from './roles/HelpdeskRoles'
import InsuranceRoles from './roles/InsuranceRoles'
import InventoryRoles from './roles/InventoryRoles'
import LocationRoles from './roles/LocationRoles'
import MaintenanceRoles from './roles/MaintenanceRoles'
import PurchaseOrderRoles from './roles/PurchaseOrderRoles'
import ReportRoles from './roles/ReportRoles'
import SettingRoles from './roles/SettingRoles'
import SetupColumnsRoles from './roles/SetupColumnsRoles'
import TrashRoles from './roles/TrashRoles'

const RolesSchema: any = Yup.object().shape({
  name: Yup.string().required('Role Name is required'),
})

type Props = {
  roleId: any
  permissionRoleData: any
  feature: any
}

const CardRolePermission: FC<Props> = ({roleId, permissionRoleData, feature}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [detailRoles, setDetailRoles] = useState<any>([])
  const [assetManagementRoles, setAssetManagementRoles] = useState<any>([])
  const [insurancePolicyRoles, setInsurancePolicyRoles] = useState<any>([])
  const [warrantyRoles, setWarrantyRoles] = useState<any>([])
  const [myAssetRoles, setMyAssetRoles] = useState<any>([])
  const [auditRoles, setAuditRoles] = useState<any>([])
  const [locationRoles, setLocationRoles] = useState<any>([])
  const [subLocationRoles, setSubLocationRoles] = useState<any>([])
  const [reportRoles, setReportRoles] = useState<any>([])
  const [reportSetupRoles, setReportSetupRoles] = useState<any>([])
  const [reportAutomatedRoles, setReportAutomatedRoles] = useState<any>([])
  const [insuranceClaimRoles, setInsuranceClaimRoles] = useState<any>([])
  const [approvalRoles, setApprovalRoles] = useState<any>([])
  const [setupColumnsRoles, setSetupColumnsRoles] = useState<any>([])
  const [userManagementRoles, setUserManagementRoles] = useState<any>([])
  const [employeeRoles, setEmployeeRoles] = useState<any>([])
  const [teamRoles, setTeamRoles] = useState<any>([])
  const [alertRoles, setAlertRoles] = useState<any>([])
  const [preferenceRoles, setPreferenceRoles] = useState<any>([])
  const [loginRoles, setLoginRoles] = useState<any>([])
  const [profileRoles, setProfileRoles] = useState<any>([])
  const [billingRoles, setBillingRoles] = useState<any>([])
  const [inventoryRoles, setInventoryRoles] = useState<any>([])
  const [maintenanceRoles, setMaintenanceRoles] = useState<any>([])
  const [preventiveRoles, setPreventiveRoles] = useState<any>([])
  const [dashboardChartRoles, setDashboardChartRoles] = useState<any>([])
  const [dashboardWidgetRoles, setDashboardWidgetRoles] = useState<any>([])
  const [dashboardInsuranceRoles, setDashboardInsuranceRoles] = useState<any>([])
  const [dashboardOtherRoles, setDashboardOtherRoles] = useState<any>([])
  const [dashboardInventoryRoles, setDashboardInventoryRoles] = useState<any>([])
  const [manageDashboardRoles, setManageDashboardRoles] = useState<any>([])
  // const [workersRoles, setWorkersRoles] = useState<any>([])
  // const [partsRoles, setPartsRoles] = useState<any>([])
  const [checklistRoles, setChecklistRoles] = useState<any>([])
  const [vendorRoles, setVendorRoles] = useState<any>([])
  const [customerRoles, setCustomerRoles] = useState<any>([])
  const [meterRoles, setMeterRoles] = useState<any>([])
  const [meterReadingRoles, setMeterReadingRoles] = useState<any>([])
  const [requestRoles, setRequestRoles] = useState<any>([])
  const [workingHourRoles, setWorkingHourRoles] = useState<any>([])
  const [shiftsRoles, setShiftsRoles] = useState<any>([])
  const [tagsRoles, setTagsRoles] = useState<any>([])
  const [ticketsRoles, setTicketsRoles] = useState<any>([])
  const [helpdeskRoles, setHelpdeskRoles] = useState<any>([])
  const [categoryRoles, setCategoryRoles] = useState<any>([])
  const [departmentRoles, setDepartmentRoles] = useState<any>([])
  const [companyRoles, setCompanyRoles] = useState<any>([])
  const [modelRoles, setModelRoles] = useState<any>([])
  const [assetStatusRoles, setAssetStatusRoles] = useState<any>([])
  const [typeRoles, setTypeRoles] = useState<any>([])
  const [featureRoles, setFeatureRoles] = useState<any>([])
  const [manufacturerRoles, setManufacturerRoles] = useState<any>([])
  const [brandRoles, setBrandRoles] = useState<any>([])
  const [supplierRoles, setSupplierRoles] = useState<any>([])
  const [customFieldRoles, setCustomFieldRoles] = useState<any>([])
  const [databaseRoles, setDatabaseRoles] = useState<any>([])
  const [roleReport, setRoleReport] = useState<any>([])
  const [roleMaintenance, setRoleMaintenance] = useState<any>([])
  const [roleSettings, setRoleSettings] = useState<any>([])
  const [roleHelpDesk, setRoleHelpDesk] = useState<any>([])
  const [roleInsurance, setRoleInsurance] = useState<any>([])
  const [roleApproval, setRoleApproval] = useState<any>([])
  const [roleSetupColumns, setRoleSetupColumns] = useState<any>([])
  const [roleTrash, setRoleTrash] = useState<any>([])
  const [roleAssetReservation, setRoleAssetReservation] = useState<any>([])
  const [rolePurchaseOrder, setRolePurchaseOrder] = useState<any>([])

  const [dataImportExport, setDataImportExport] = useState<any>([])
  const [dataAssetManagement, setDataAssetManagement] = useState<any>([])
  const [dataInsurancePolicy, setDataInsurancePolicy] = useState<any>([])
  const [dataWarranty, setDataWarranty] = useState<any>([])
  const [dataLocation, setDataLocation] = useState<any>([])
  const [dataSubLocation, setDataSubLocation] = useState<any>([])
  const [dataEmployee, setDataEmployee] = useState<any>([])
  const [dataInventory, setDataInventory] = useState<any>([])
  const [contactRoles, setContactRoles] = useState<any>([])
  const [trashRoles, setTrashRoles] = useState<any>([])
  const [assetReservRoles, setAssetReservRoles] = useState<any>([])
  const [purchaseOrderRoles, setPurchaseOrderRoles] = useState<any>([])

  const initValues: any = {
    name: detailRoles?.label || '',
    description: detailRoles?.description || '',
  }

  const onSubmit = (value: any) => {
    setLoading(true)
    const role_name: any = value?.name?.replace(/\s/g, '_')
    const params: any = {
      name: role_name?.toLowerCase() || '',
      label: value?.name || '',
      description: value?.description || '',
    }

    if (role_name?.toLowerCase() !== 'account_owner') {
      editRole(params, roleId)
        .then(() => setLoading(false))
        .catch((err: any) => {
          setLoading(false)
          errorExpiredToken(err)
          const {message} = err?.response?.data || {}
          ToastMessage({message, type: 'error'})
        })
    }

    const join: any = arrayConcat(
      assetManagementRoles,
      insurancePolicyRoles,
      warrantyRoles,
      insuranceClaimRoles,
      setupColumnsRoles,
      myAssetRoles,
      auditRoles,
      locationRoles,
      subLocationRoles,
      reportRoles,
      reportSetupRoles,
      reportAutomatedRoles,
      userManagementRoles,
      employeeRoles,
      teamRoles,
      alertRoles,
      preferenceRoles,
      loginRoles,
      profileRoles,
      billingRoles,
      inventoryRoles,
      maintenanceRoles,
      dashboardChartRoles,
      dashboardWidgetRoles,
      dashboardInsuranceRoles,
      dashboardOtherRoles,
      dashboardInventoryRoles,
      manageDashboardRoles,
      preventiveRoles,
      requestRoles,
      // workersRoles,
      meterRoles,
      // partsRoles,
      checklistRoles,
      vendorRoles,
      customerRoles,
      meterReadingRoles,
      categoryRoles,
      departmentRoles,
      companyRoles,
      modelRoles,
      assetStatusRoles,
      typeRoles,
      featureRoles,
      manufacturerRoles,
      brandRoles,
      supplierRoles,
      customFieldRoles,
      databaseRoles,
      contactRoles,
      workingHourRoles,
      shiftsRoles,
      tagsRoles,
      ticketsRoles,
      helpdeskRoles,
      trashRoles,
      assetReservRoles,
      purchaseOrderRoles,
      approvalRoles
    )

    const role_params: any = join?.map((param_roles: any) => {
      return {name: param_roles.name, value: param_roles.is_allow}
    })

    updatePermission(role_params, roleId)
      .then(({data: {message}}: any) => {
        getUserByToken().then(({data: {data: res_user}}: any) => {
          setLoading(false)
          saveCurrentUser(res_user)
          ToastMessage({message, type: 'success'})
        })
      })
      .catch((err: any) => {
        setLoading(false)
        errorExpiredToken(err)
        Object.values(errorValidation(err))?.map((message: any) =>
          ToastMessage({type: 'error', message})
        )
      })
  }

  useEffect(() => {
    getDetailRole(roleId).then(({data: {data: result_detail}}: any) => {
      result_detail && setDetailRoles(result_detail)
    })
  }, [roleId])

  useEffect(() => {
    if (roleId) {
      if (permissionRoleData) {
        // Asset Tab
        permissionRoleData
          ?.filter((role: {id: any}) => role?.id === 'asset-management')
          ?.map((data_role: any) => setDataAssetManagement(data_role?.items))
        permissionRoleData
          ?.filter((role: {id: any}) => role?.id === 'insurance_policy')
          ?.map((data_role: any) => setDataInsurancePolicy(data_role?.items))
        permissionRoleData
          ?.filter((role: {id: any}) => role?.id === 'warranty')
          ?.map((data_role: any) => setDataWarranty(data_role?.items))
        permissionRoleData
          ?.filter((role: {id: any}) => role?.id === 'my-assets')
          ?.map((data_role: any) => setMyAssetRoles(data_role?.items))
        permissionRoleData
          ?.filter((role: {id: any}) => role?.id === 'audit')
          ?.map((data_role: any) => setAuditRoles(data_role?.items))

        // Location Tab
        permissionRoleData
          ?.filter((role: {id: any}) => role?.id === 'location')
          ?.map((data_role: any) => setDataLocation(data_role?.items))
        permissionRoleData
          ?.filter((role: {id: any}) => role?.id === 'sub-location')
          ?.map((data_role: any) => setDataSubLocation(data_role?.items))

        // Setup Tab
        setRoleSetupColumns(
          permissionRoleData.filter((role: {id: any}) => role?.id === 'setup-column')
        )

        // Admin Rights Tab
        permissionRoleData
          ?.filter((role: {id: any}) => role?.id === 'user-management')
          ?.map((data_role: any) => setUserManagementRoles(data_role?.items))
        permissionRoleData
          ?.filter((role: {id: any}) => role?.id === 'employee')
          ?.map((data_role: any) => setDataEmployee(data_role?.items))
        permissionRoleData
          ?.filter((role: {id: any}) => role?.id === 'team')
          ?.map((data_role: any) => setTeamRoles(data_role?.items))
        permissionRoleData
          ?.filter((role: {id: any}) => role?.id === 'alert')
          ?.map((data_role: any) => setAlertRoles(data_role?.items))
        permissionRoleData
          ?.filter((role: {id: any}) => role?.id === 'preference')
          ?.map((data_role: any) => setPreferenceRoles(data_role?.items))
        permissionRoleData
          ?.filter((role: {id: any}) => role?.id === 'login')
          ?.map((data_role: any) => setLoginRoles(data_role?.items))
        permissionRoleData
          ?.filter((role: {id: any}) => role?.id === 'profile')
          ?.map((data_role: any) => setProfileRoles(data_role?.items))
        permissionRoleData
          ?.filter((role: {id: any}) => role?.id === 'billing')
          ?.map((data_role: any) => setBillingRoles(data_role?.items))
        permissionRoleData
          ?.filter((role: {id: any}) => role?.id === 'contact')
          ?.map((data_role: any) => setContactRoles(data_role?.items))

        // Inventory Tab
        permissionRoleData
          ?.filter((role: {id: any}) => role?.id === 'inventory')
          ?.map((data_role: any) => setDataInventory(data_role?.items))

        permissionRoleData
          ?.filter((role: {id: any}) => role?.id === 'approval')
          ?.map((data_role: any) => setApprovalRoles(data_role?.items))

        // Dashboard Tab
        permissionRoleData
          ?.filter((role: {id: any}) => role?.id === 'insurance_claim')
          ?.map((data_role: any) => setInsuranceClaimRoles(data_role?.items))
        permissionRoleData
          ?.filter((role: {id: any}) => role?.id === 'dashboard-chart')
          ?.map((data_role: any) => setDashboardChartRoles(data_role?.items))
        permissionRoleData
          ?.filter((role: {id: any}) => role?.id === 'dashboard-widget')
          ?.map((data_role: any) => setDashboardWidgetRoles(data_role?.items))
        permissionRoleData
          ?.filter((role: {id: any}) => role?.id === 'dashboard-insurance_claim')
          ?.map((data_role: any) => setDashboardInsuranceRoles(data_role?.items))
        permissionRoleData
          ?.filter((role: {id: any}) => role?.id === 'dashboard-others')
          ?.map((data_role: any) => setDashboardOtherRoles(data_role?.items))
        permissionRoleData
          ?.filter((role: {id: any}) => role?.id === 'dashboard-inventory')
          ?.map((data_role: any) => setDashboardInventoryRoles(data_role?.items))
        permissionRoleData
          ?.filter((role: {id: any}) => role?.id === 'manage-dashboard')
          ?.map((data_role: any) => setManageDashboardRoles(data_role?.items))
        setRoleMaintenance(
          permissionRoleData?.filter((role: {id: any}) => role?.id === 'maintenance')
        )
        setRoleReport(permissionRoleData?.filter((role: {id: any}) => role?.id === 'reports'))
        setRoleSettings(permissionRoleData?.filter((role: {id: any}) => role?.id === 'setting'))
        setRoleInsurance(
          permissionRoleData.filter((role: {id: any}) => role?.id === 'insurance_claim')
        )
        setRoleApproval(permissionRoleData?.filter((role: {id: any}) => role?.id === 'approval'))
        setDataImportExport(
          permissionRoleData?.filter((role: {id: any}) => role?.id === 'import-export')
        )
        setRoleHelpDesk(permissionRoleData?.filter((role: {id: any}) => role?.id === 'help-desk'))
        setRoleTrash(permissionRoleData?.filter((role: {id: any}) => role?.id === 'trash'))
        setRoleAssetReservation(
          permissionRoleData?.filter((role: {id: any}) => role?.id === 'asset-reservation')
        )
        setRolePurchaseOrder(
          permissionRoleData?.filter((role: {id: any}) => role?.id === 'purchase-order')
        )
      }
    } else {
      window.location.href = '/setup/role-permission'
    }
  }, [roleId, permissionRoleData])

  return (
    <div className='card card-custom'>
      <Formik
        initialValues={initValues}
        validationSchema={RolesSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {() => (
          <>
            <Form className='justify-content-center' noValidate>
              <div className='card-body'>
                <div className='col-md-12 role-permission role-permission-offset sticky-top'>
                  <div className='col-md-12 mb-3 row role-name'>
                    <div className='col-ms-12 col-md-4 col-lg-2 name'>
                      <label
                        htmlFor='name'
                        data-cy='role-name'
                        className={`${configClass?.label} required`}
                      >
                        Role Name
                      </label>
                    </div>
                    <div className='col-ms-12 col-md-6 col-lg-6 role' data-cy='editRoleName'>
                      <InputText
                        name='name'
                        type='text'
                        className='role-name'
                        placeholder='Enter Role Name'
                      />
                    </div>
                  </div>
                  <div className='col-md-12 mb-3 row'>
                    <div className='col-ms-12 col-md-4 col-lg-2'>
                      <label htmlFor='description' className={`${configClass?.label}`}>
                        Description
                      </label>
                    </div>
                    <div className='col-ms-12 col-md-6 col-lg-6'>
                      <InputText
                        type='text'
                        name='description'
                        placeholder='Enter Role Description'
                      />
                    </div>
                  </div>
                </div>

                <div
                  className='body-permission'
                  style={{display: 'block', paddingTop: 5, paddingBottom: 5, marginLeft: 30}}
                >
                  <Tabs defaultActiveKey='asset'>
                    <Tab eventKey='asset' title='Asset'>
                      <div className='mt-5'>
                        <AssetRoles
                          feature={feature}
                          assetManagementRoles={assetManagementRoles}
                          setAssetManagementRoles={setAssetManagementRoles}
                          insurancePolicyRoles={insurancePolicyRoles}
                          setInsurancePolicyRoles={setInsurancePolicyRoles}
                          warrantyRoles={warrantyRoles}
                          setWarrantyRoles={setWarrantyRoles}
                          myAssetRoles={myAssetRoles}
                          setMyAssetRoles={setMyAssetRoles}
                          auditRoles={auditRoles}
                          setAuditRoles={setAuditRoles}
                          dataImportExport={dataImportExport}
                          dataAssetManagement={dataAssetManagement}
                          dataInsurancePolicy={dataInsurancePolicy}
                          dataWarranty={dataWarranty}
                          roleAssetReservation={roleAssetReservation}
                          assetReservRoles={assetReservRoles}
                          setAssetReservRoles={setAssetReservRoles}
                        />
                      </div>
                    </Tab>
                    <Tab eventKey='locations' title='Locations'>
                      <div className='mt-5'>
                        <LocationRoles
                          feature={feature}
                          dataLocation={dataLocation}
                          locationRoles={locationRoles}
                          dataSubLocation={dataSubLocation}
                          dataImportExport={dataImportExport}
                          setLocationRoles={setLocationRoles}
                          subLocationRoles={subLocationRoles}
                          setSubLocationRoles={setSubLocationRoles}
                        />
                      </div>
                    </Tab>
                    <Tab eventKey='dashboard' title='Dashboard'>
                      <div className='mt-5'>
                        <DashboardRoles
                          feature={feature}
                          dashboardOtherRoles={dashboardOtherRoles}
                          dashboardChartRoles={dashboardChartRoles}
                          dashboardWidgetRoles={dashboardWidgetRoles}
                          manageDashboardRoles={manageDashboardRoles}
                          setDashboardOtherRoles={setDashboardOtherRoles}
                          setDashboardChartRoles={setDashboardChartRoles}
                          setDashboardWidgetRoles={setDashboardWidgetRoles}
                          dashboardInsuranceRoles={dashboardInsuranceRoles}
                          dashboardInventoryRoles={dashboardInventoryRoles}
                          setManageDashboardRoles={setManageDashboardRoles}
                          setDashboardInsuranceRoles={setDashboardInsuranceRoles}
                          setDashboardInventoryRoles={setDashboardInventoryRoles}
                        />
                      </div>
                    </Tab>
                    <Tab eventKey='reports' title='Reports'>
                      <div className='mt-5'>
                        <ReportRoles
                          features={feature}
                          roleReport={roleReport}
                          reportRoles={reportRoles}
                          setReportRoles={setReportRoles}
                          reportSetupRoles={reportSetupRoles}
                          setReportSetupRoles={setReportSetupRoles}
                          reportAutomatedRoles={reportAutomatedRoles}
                          setReportAutomatedRoles={setReportAutomatedRoles}
                        />
                      </div>
                    </Tab>
                    {feature?.maintenance === 1 && (
                      <Tab eventKey='maintenances' title='Maintenances' data-cy='maintenanceTab'>
                        <div className='mt-5'>
                          <MaintenanceRoles
                            feature={feature}
                            meterRoles={meterRoles}
                            vendorRoles={vendorRoles}
                            requestRoles={requestRoles}
                            setMeterRoles={setMeterRoles}
                            checklistRoles={checklistRoles}
                            setVendorRoles={setVendorRoles}
                            roleMaintenance={roleMaintenance}
                            setRequestRoles={setRequestRoles}
                            preventiveRoles={preventiveRoles}
                            dataImportExport={dataImportExport}
                            setCustomerRoles={setCustomerRoles}
                            maintenanceRoles={maintenanceRoles}
                            setChecklistRoles={setChecklistRoles}
                            setPreventiveRoles={setPreventiveRoles}
                            setMaintenanceRoles={setMaintenanceRoles}
                            setMeterReadingRoles={setMeterReadingRoles}
                            // meterReadingRoles={meterReadingRoles}
                            // setWorkersRoles={setWorkersRoles}
                            // setPartsRoles={setPartsRoles}
                            // customerRoles={customerRoles}
                            // workersRoles={workersRoles}
                            // partsRoles={partsRoles}
                          />
                        </div>
                      </Tab>
                    )}
                    {feature?.insurance_claim === 1 && (
                      <Tab eventKey='insurance' title='Insurance Claims'>
                        <InsuranceRoles
                          feature={feature}
                          roleInsurance={roleInsurance}
                          dataImportExport={dataImportExport}
                          roleSetupColumns={roleSetupColumns}
                          insuranceClaimRoles={insuranceClaimRoles}
                          setInsuranceClaimRoles={setInsuranceClaimRoles}
                        />
                      </Tab>
                    )}
                    {feature?.approval === 1 && (
                      <Tab eventKey='approval' title='Approval'>
                        <ApprovalRoles
                          roleApproval={roleApproval}
                          approvalRoles={approvalRoles}
                          dataImportExport={dataImportExport}
                          roleSetupColumns={roleSetupColumns}
                          setApprovalRoles={setApprovalRoles}
                        />
                      </Tab>
                    )}

                    <Tab eventKey='setup' title='Setup'>
                      <div className='mt-5'>
                        <SetupColumnsRoles
                          feature={feature}
                          roleSetupColumns={roleSetupColumns}
                          setupColumnsRoles={setupColumnsRoles}
                          setSetupColumnsRoles={setSetupColumnsRoles}
                        />
                      </div>
                    </Tab>
                    <Tab eventKey='admin' title='Admin Rights'>
                      <div className='mt-5'>
                        <AdminRightRoles
                          feature={feature}
                          userManagementRoles={userManagementRoles}
                          setUserManagementRoles={setUserManagementRoles}
                          employeeRoles={employeeRoles}
                          setEmployeeRoles={setEmployeeRoles}
                          teamRoles={teamRoles}
                          setTeamRoles={setTeamRoles}
                          alertRoles={alertRoles}
                          setAlertRoles={setAlertRoles}
                          preferenceRoles={preferenceRoles}
                          setPreferenceRoles={setPreferenceRoles}
                          loginRoles={loginRoles}
                          setLoginRoles={setLoginRoles}
                          profileRoles={profileRoles}
                          setProfileRoles={setProfileRoles}
                          billingRoles={billingRoles}
                          setBillingRoles={setBillingRoles}
                          dataImportExport={dataImportExport}
                          dataEmployee={dataEmployee}
                          roleHelpDesk={roleHelpDesk}
                          contactRoles={contactRoles}
                          setContactRoles={setContactRoles}
                        />
                      </div>
                    </Tab>
                    <Tab eventKey='setings' title='Settings'>
                      <div className='mt-5'>
                        <SettingRoles
                          feature={feature}
                          roleSettings={roleSettings}
                          categoryRoles={categoryRoles}
                          setCategoryRoles={setCategoryRoles}
                          departmentRoles={departmentRoles}
                          setDepartmentRoles={setDepartmentRoles}
                          companyRoles={companyRoles}
                          setCompanyRoles={setCompanyRoles}
                          modelRoles={modelRoles}
                          setModelRoles={setModelRoles}
                          assetStatusRoles={assetStatusRoles}
                          setAssetStatusRoles={setAssetStatusRoles}
                          typeRoles={typeRoles}
                          setTypeRoles={setTypeRoles}
                          featureRoles={featureRoles}
                          setFeatureRoles={setFeatureRoles}
                          manufacturerRoles={manufacturerRoles}
                          setManufacturerRoles={setManufacturerRoles}
                          brandRoles={brandRoles}
                          setBrandRoles={setBrandRoles}
                          supplierRoles={supplierRoles}
                          setSupplierRoles={setSupplierRoles}
                          customFieldRoles={customFieldRoles}
                          setCustomFieldRoles={setCustomFieldRoles}
                          databaseRoles={databaseRoles}
                          setDatabaseRoles={setDatabaseRoles}
                          dataImportExport={dataImportExport}
                        />
                      </div>
                    </Tab>
                    {feature?.inventory === 1 && (
                      <Tab eventKey='inventory' title='Inventory'>
                        <div className='mt-5'>
                          <InventoryRoles
                            feature={feature}
                            dataInventory={dataInventory}
                            inventoryRoles={inventoryRoles}
                            dataImportExport={dataImportExport}
                            setInventoryRoles={setInventoryRoles}
                          />
                        </div>
                      </Tab>
                    )}
                    {feature?.help_desk === 1 && (
                      <Tab eventKey='helpdesk' title='Helpdesk'>
                        <div className='mt-5'>
                          <HelpdeskRoles
                            tagsRoles={tagsRoles}
                            shiftsRoles={shiftsRoles}
                            roleHelpDesk={roleHelpDesk}
                            setTagsRoles={setTagsRoles}
                            ticketsRoles={ticketsRoles}
                            helpdeskRoles={helpdeskRoles}
                            setShiftsRoles={setShiftsRoles}
                            setTicketsRoles={setTicketsRoles}
                            setHelpdeskRoles={setHelpdeskRoles}
                            workingHourRoles={workingHourRoles}
                            setWorkingHourRoles={setWorkingHourRoles}
                          />
                        </div>
                      </Tab>
                    )}
                    {feature?.purchase_order === 1 && (
                      <Tab eventKey='purchase-order' title='Purchase Order'>
                        <div className='mt-5'>
                          <PurchaseOrderRoles
                            rolePurchaseOrder={rolePurchaseOrder}
                            purchaseOrderRoles={purchaseOrderRoles}
                            setPurchaseOrderRoles={setPurchaseOrderRoles}
                          />
                        </div>
                      </Tab>
                    )}
                    <Tab eventKey='trash' title='Trash'>
                      <div className='mt-5'>
                        <TrashRoles
                          roleTrash={roleTrash}
                          trashRoles={trashRoles}
                          setTrashRoles={setTrashRoles}
                        />
                      </div>
                    </Tab>
                  </Tabs>
                </div>
              </div>
              <div className='card-footer'>
                <div className='d-grid gap-2 d-md-flex justify-content-md-end'>
                  <Link to='/setup/role-permission' className='btn btn-sm btn-secondary mx-1'>
                    Cancel
                  </Link>
                  <Button
                    disabled={loading}
                    className='btn-sm mx-1'
                    type='submit'
                    variant='primary'
                  >
                    {!loading && <span className='indicator-label'>{'Save'}</span>}
                    {loading && (
                      <span className='indicator-progress' style={{display: 'block'}}>
                        Please wait...
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </Form>

            <style>
              {`@media screen and (max-width: 420px) {
                  .role-permission {
                    padding: 0px !important;
                    padding-bottom: 20px !important;              
                  }
                  .body-permission {
                    margin: 0px !important;
                  }
                }`}
            </style>
          </>
        )}
      </Formik>
    </div>
  )
}

const EditRolePermission = memo(
  CardRolePermission,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default EditRolePermission
