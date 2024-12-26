/* eslint-disable react-hooks/exhaustive-deps */
import {Alert} from '@components/alert'
import {ToastMessage} from '@components/toast-message'
import {PageTitle} from '@metronic/layout/core'
import {getDatabaseInsurance} from '@pages/setup/databases/Serivce'
import {FC, memo, useCallback, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'

import {AddPolicy} from './AddPolicy'
import {CardPolicy} from './CardPolicy'
import {deleteInsurancePolicies} from './Service'
import ValidationSchema from './ValidationSchema'

let InsurancePolicy: FC = () => {
  const intl: any = useIntl()

  const [page, setPage] = useState<number>(1)
  const [mode, setMode] = useState<any>('view')
  const [filterAll, setFilterAll] = useState<any>({})
  const [policyName, setPolicyName] = useState<any>()
  const [pageFrom, setPageFrom] = useState<number>(0)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [dataChecked, setDataChecked] = useState<any>([])
  const [policyDetail, setPolicyDetail] = useState<any>()
  const [optDatabase, setDatabaseOption] = useState<any>([])
  const [reloadPolicy, setReloadPolicy] = useState<number>(0)
  const [onClickForm, setOnClickForm] = useState<boolean>(true)
  const [insuranceSchema, setInsuranceSchema] = useState<any>([])
  const [showModal, setShowModalPolicy] = useState<boolean>(false)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)
  const [validationNonCF, setValidationNonCF] = useState<boolean>(true)
  const [defaultPhoneNumber, setDefaultPhoneNumber] = useState<any>('')
  const [showModalConfirm, setShowModalConfirm] = useState<boolean>(false)
  const [loadingDeleteOnFilter, setLoadingDeleteOnFilter] = useState<number>(0)

  const require_filed_message: any = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})

  const msg_alert: any = [
    'Are you sure you want to delete ',
    <strong key='policy_name'>{policyName || ''}</strong>,
    '?',
  ]
  const confirmDeleteBrand = useCallback(() => {
    setLoading(true)
    deleteInsurancePolicies(policyDetail?.guid)
      .then(({data: {message}}: any) => {
        setTimeout(() => {
          const total_data_page: number = totalPage - pageFrom

          setFilterAll({})
          setLoading(false)
          setDataChecked([])
          setResetKeyword(true)
          setShowModalConfirm(false)
          setReloadPolicy(reloadPolicy + 1)
          ToastMessage({message, type: 'success'})
          setLoadingDeleteOnFilter(loadingDeleteOnFilter + 1)
          setPage(total_data_page - 1 <= 0 ? page - 1 : page)
        }, 1000)
      })
      .catch(({response}: any) => {
        const {message} = response?.data || {}
        ToastMessage({type: 'error', message})
      })
  }, [setDataChecked, policyDetail, reloadPolicy])

  useEffect(() => {
    ToastMessage({type: 'clear'})

    getDatabaseInsurance({}).then(({data: {data: res_database}}: any) => {
      res_database && setDatabaseOption(res_database)
    })
  }, [])

  useEffect(() => {
    onClickForm && !validationNonCF && ToastMessage({message: require_filed_message, type: 'error'})
  }, [onClickForm, validationNonCF])

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.INSURANCE.POLICIES'})}</PageTitle>
      <CardPolicy
        page={page}
        loading={loading}
        setMode={setMode}
        setPage={setPage}
        pageFrom={pageFrom}
        filterAll={filterAll}
        totalPage={totalPage}
        setLoading={setLoading}
        dataChecked={dataChecked}
        setPageFrom={setPageFrom}
        setFilterAll={setFilterAll}
        setTotalPage={setTotalPage}
        reloadPolicy={reloadPolicy}
        resetKeyword={resetKeyword}
        setPolicyName={setPolicyName}
        setDataChecked={setDataChecked}
        setReloadPolicy={setReloadPolicy}
        setPolicyDetail={setPolicyDetail}
        setResetKeyword={setResetKeyword}
        setShowModalPolicy={setShowModalPolicy}
        setShowModalConfirm={setShowModalConfirm}
        setDefaultPhoneNumber={setDefaultPhoneNumber}
        loadingDeleteOnFilter={loadingDeleteOnFilter}
        setLoadingDeleteOnFilter={setLoadingDeleteOnFilter}
      />

      <AddPolicy
        mode={mode}
        showModal={showModal}
        onClickForm={onClickForm}
        optDatabase={optDatabase}
        policyDetail={policyDetail}
        reloadPolicy={reloadPolicy}
        setOnClickForm={setOnClickForm}
        insuranceSchema={insuranceSchema}
        setReloadPolicy={setReloadPolicy}
        defaultPhoneNumber={defaultPhoneNumber}
        setShowModalPolicy={setShowModalPolicy}
        setValidationNonCF={setValidationNonCF}
        setDefaultPhoneNumber={setDefaultPhoneNumber}
      />

      <Alert
        type={'delete'}
        body={msg_alert}
        loading={loading}
        confirmLabel={'Delete'}
        showModal={showModalConfirm}
        title={'Delete Insurance Policy'}
        setShowModal={setShowModalConfirm}
        onConfirm={() => confirmDeleteBrand()}
        onCancel={() => setShowModalConfirm(false)}
      />

      <ValidationSchema setInsuranceSchema={setInsuranceSchema} optDatabase={optDatabase} />
    </>
  )
}

InsurancePolicy = memo(
  InsurancePolicy,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default InsurancePolicy
