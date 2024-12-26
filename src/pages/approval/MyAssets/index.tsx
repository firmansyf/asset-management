/* eslint-disable react-hooks/exhaustive-deps */
import {ToastMessage} from '@components/toast-message'
import {checkFeature} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {Forbidden} from '@metronic/partials'
import {FC, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'

import {CardNewAssetsApproval} from './CardNewAssetsApproval'
import {CardUpdateAssetsApproval} from './CardUpdateAssetsApproval'

export const NewApprovalMyAssets: FC = () => {
  const intl: any = useIntl()
  const pagePermission: any = checkFeature('approval')
  const [loadingPage, setLoadingPage] = useState<boolean>(true)
  const subTitle: any = document.getElementsByClassName('pageSubTitle')[0]

  useEffect(() => {
    ToastMessage({type: 'clear'})
    setTimeout(() => setLoadingPage(false), 10)

    subTitle &&
      (subTitle.innerHTML = intl.formatMessage({
        id: 'MENU.APPROVAL.MY_NEW_ASSETS',
      }))
    return () => {
      subTitle && (subTitle.innerHTML = '')
    }
  }, [])

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.APPROVAL.MYASSETS.NEW'})}
      </PageTitle>
      {loadingPage ? null : <>{!pagePermission ? <Forbidden /> : <CardNewAssetsApproval />}</>}
    </>
  )
}

export const UpdateApprovalMyAssets: FC = () => {
  const intl: any = useIntl()
  const pagePermission: any = checkFeature('approval')
  const subTitle: any = document.querySelector('.pageSubTitle')
  const [loadingPage, setLoadingPage] = useState<boolean>(true)

  useEffect(() => {
    ToastMessage({type: 'clear'})
    setTimeout(() => setLoadingPage(false), 10)

    subTitle &&
      (subTitle.innerHTML = intl.formatMessage({
        id: 'MENU.APPROVAL.MYASSETS.UPDATES.FOLLOWING_ASSETS_PENDING',
      }))
    return () => {
      subTitle && (subTitle.innerHTML = '')
    }
  }, [])

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.APPROVAL.MYASSETS.UPDATES'})}
      </PageTitle>
      {loadingPage ? null : <>{!pagePermission ? <Forbidden /> : <CardUpdateAssetsApproval />}</>}
    </>
  )
}
