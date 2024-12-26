import {Error404 as PageNotFound} from '@components/pages'
import {MasterLayout} from '@metronic/layout/MasterLayout'
import {isValidElement} from 'react'
import {Navigate} from 'react-router-dom'

import {Element} from './_element'
import testPage from './modules/_testPage'
import approval from './modules/approval'
import assetManagement from './modules/assetManagement'
import billing from './modules/billing'
import computerManagement from './modules/computerManagement'
import customForm from './modules/customForm'
import dashboard from './modules/dashboard'
import helpdesk from './modules/helpdesk'
import insuranceClaim from './modules/insuranceClaim'
import insurancePolicy from './modules/insurancePolicy'
import inventory from './modules/inventory'
import location from './modules/location'
import maintenance from './modules/maintenance'
import notification from './modules/notification'
import profile from './modules/profile'
import purchaseOrder from './modules/purchaseOrder'
import report from './modules/report'
import setup from './modules/setup'
import tools from './modules/tools'
import trash from './modules/trash'
import userManagement from './modules/userManagement'
import warranty from './modules/warranty'
import {publicRoutes as pub} from './PublicRoutes'

const publicRoutes: any = pub('')
  ?.filter(({path}: any) => path !== '*')
  ?.map(({path}: any) => ({path, element: <Navigate to='/dashboard' />}))

let moduleRoutes: any = [
  ...testPage,
  ...approval,
  ...assetManagement,
  ...billing,
  ...computerManagement,
  ...dashboard,
  ...helpdesk,
  ...insuranceClaim,
  ...insurancePolicy,
  ...inventory,
  ...location,
  ...maintenance,
  ...notification,
  ...customForm,
  ...profile,
  ...purchaseOrder,
  ...report,
  ...setup,
  ...tools,
  ...trash,
  ...userManagement,
  ...warranty,
]

const mapper: any = (el: any) => {
  return el?.map((m: any) => {
    if (m?.element && !isValidElement(m?.element)) {
      m.element = (
        <Element
          permission={m?.permission}
          el={m.element}
          allUser={m?.allUser}
          superUser={m?.superUser}
        />
      )
    }
    return m
  })
}

moduleRoutes = moduleRoutes?.map((level1: any) => {
  if (level1?.element && !isValidElement(level1?.element)) {
    level1.element = (
      <Element
        permission={level1?.permission}
        el={level1.element}
        allUser={level1?.allUser}
        superUser={level1?.superUser}
      />
    )
  }
  if (level1?.children) {
    level1.children = mapper(level1?.children)?.map((level2: any) => {
      if (level2?.children) {
        level2.children = mapper(level2.children)
        level2 = {
          ...level2,
          children: level2?.children?.concat({path: '*', element: <PageNotFound />} as any),
        }
      }
      return level2
    })
    level1 = {
      ...level1,
      children: level1?.children?.concat({path: '*', element: <PageNotFound />} as any),
    }
  }
  return level1
})

const PrivateRoutes: any = [
  {
    element: <MasterLayout />,
    children: [...moduleRoutes, ...publicRoutes, {path: '*', element: <PageNotFound />}],
  },
]

export {PrivateRoutes}
