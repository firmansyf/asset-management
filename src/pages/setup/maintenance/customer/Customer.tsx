import {PageTitle} from '@metronic/layout/core'
import {FC, memo, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'

import ModalAddCustomer from './AddCustomer'
import CardCustomer from './CardCustomer'
import ModalDeleteCustomer from './DeleteCustomer'
import ModalDetailCustomer from './DetailCustomer'

let Customer: FC = () => {
  const intl = useIntl()
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)

  const {currency, preference: dataPreference} = preferenceStore || {}
  const [showModal, setShowModalConfirm] = useState(false)
  const [, setUserGuid] = useState('')
  const [reloadCustomer, setReloadCustomer] = useState(0)
  const [detailCustomer, setDetailCustomer] = useState()
  const [showModalCustomer, setShowModalCustomer] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [optCurrency, setOptCurrency] = useState([])
  const [preference, setPreference] = useState<any>({})

  const onDelete = (e: any) => {
    const {guid} = e || {}
    setDetailCustomer(e)
    setUserGuid(guid)
    setShowModalConfirm(true)
  }

  const onDetail = (e: any) => {
    setDetailCustomer(e)
    setShowDetail(true)
  }

  useEffect(() => {
    if (currency) {
      setOptCurrency(currency.map(({key: value, value: label}: any) => ({value, label})))
    }
  }, [currency])

  useEffect(() => {
    if (dataPreference) {
      const {country_code, phone_code} = dataPreference || {}
      setPreference({
        country_code: country_code,
        phone_code: phone_code,
      })
    }
  }, [dataPreference])

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.SETUP.MAINTENANCE.CUSTOMERS'})}
      </PageTitle>

      <CardCustomer
        reloadCustomer={reloadCustomer}
        onDelete={onDelete}
        onDetail={onDetail}
        setDetailCustomer={setDetailCustomer}
        setShowModalCustomer={setShowModalCustomer}
      />

      <ModalAddCustomer
        setReloadCustomer={setReloadCustomer}
        reloadCustomer={reloadCustomer}
        showModal={showModalCustomer}
        setShowModal={setShowModalCustomer}
        detailCustomer={detailCustomer}
        currency={optCurrency}
        preference={preference}
      />

      <ModalDeleteCustomer
        setReloadCustomer={setReloadCustomer}
        reloadCustomer={reloadCustomer}
        showModal={showModal}
        setShowModal={setShowModalConfirm}
        detailCustomer={detailCustomer}
      />

      <ModalDetailCustomer
        detailCustomer={detailCustomer}
        showDetail={showDetail}
        setShowDetail={setShowDetail}
      />
    </>
  )
}

Customer = memo(Customer, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default Customer
