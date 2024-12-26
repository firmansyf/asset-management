import {getDetailRole, getPermissionRoleByName} from '@api/role-and-permision'
import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {PageTitle} from '@metronic/layout/core'
import {keyBy, mapValues} from 'lodash'
import {FC, memo, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import {useLocation} from 'react-router-dom'

import AddRolePermission from './AddRolePermission'
import EditRolePermission from './EditRolePermission'

let AddEditPermission: FC<any> = () => {
  const intl: any = useIntl()
  const location: any = useLocation()
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const urlSearchParams: any = new URLSearchParams(window?.location?.search)
  const params: any = Object.fromEntries(urlSearchParams?.entries())

  const {id}: any = params || {}
  const pathname: any = location?.pathname
  const {feature}: any = preferenceStore || {}

  const [features, setFeatures] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [addPermissionData, setAddPermissionData] = useState<string>('')
  const [permissionRoleData, setPermissionRoleData] = useState<string>('')

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  useEffect(() => {
    setLoading(true)
    if (pathname === '/setup/role-permission/edit-role') {
      if (id) {
        getDetailRole(id).then(({data: {data: res}}: any) => {
          res &&
            getPermissionRoleByName(res?.name) //getPermissionRole(id)
              .then(({data: {data: result}}: any) => {
                result && setPermissionRoleData(result)
              })
        })

        setTimeout(() => setLoading(false), 1000)
      } else {
        window.location.href = '/setup/role-permission'
      }
    } else {
      getPermissionRoleByName('admin').then(({data: {data: result}}: any) => {
        result && setAddPermissionData(result)
      })

      setTimeout(() => setLoading(false), 1000)
    }
  }, [id, setPermissionRoleData, pathname])

  useEffect(() => {
    if (feature) {
      const resObj: any = keyBy(feature, 'unique_name')
      setFeatures(mapValues(resObj, 'value'))
    }
  }, [feature])

  return (
    <>
      {loading ? (
        <div className='row'>
          <div className='col-12 text-center'>
            <PageLoader />
          </div>
        </div>
      ) : (
        <>
          {pathname === '/setup/role-permission/edit-role' && (
            <>
              <PageTitle breadcrumbs={[]}>
                {intl.formatMessage({id: 'MENU.SETUP.EDIT_ROLE_PERMISSIONS'})}
              </PageTitle>

              <EditRolePermission
                roleId={id}
                feature={features}
                permissionRoleData={permissionRoleData}
              />
            </>
          )}

          {pathname !== '/setup/role-permission/edit-role' && (
            <>
              <PageTitle breadcrumbs={[]}>
                {intl.formatMessage({id: 'MENU.SETUP.ADD_ROLE_PERMISSIONS'})}
              </PageTitle>
              <AddRolePermission addPermissionData={addPermissionData} feature={features} />
            </>
          )}
        </>
      )}
    </>
  )
}

AddEditPermission = memo(
  AddEditPermission,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default AddEditPermission
