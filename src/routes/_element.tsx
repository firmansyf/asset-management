import {Permission} from '@components/pages'
import {hasPermission, roleName} from '@helpers'
import {FC, Suspense} from 'react'

interface Props {
  el: any
  permission?: any
  allUser?: boolean
  superUser?: boolean
}

export const Element: FC<Props> = ({el, permission = undefined, allUser, superUser}) => {
  const El: any = el
  const role: any = roleName()
  const isSuperUser: any = (role === 'owner' || role === 'admin') && superUser
  const isAuthorized: any = hasPermission(permission) || allUser || isSuperUser

  return isAuthorized ? (
    <Suspense fallback=''>
      <El />
    </Suspense>
  ) : (
    <Permission />
  )
}
