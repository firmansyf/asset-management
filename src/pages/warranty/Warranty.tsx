/* eslint-disable react-hooks/exhaustive-deps */
import {ToastMessage} from '@components/toast-message'
import {PageTitle} from '@metronic/layout/core'
import {getCustomField} from '@pages/setup/custom-field/redux/ReduxCustomField'
import {useQuery} from '@tanstack/react-query'
import {FC, useEffect, useMemo, useState} from 'react'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

import {getDatabaseWarranty} from '../setup/databases/Serivce'
import {AddWarranty} from './AddWarranty'
import {BulkDeleteWarranty} from './BulkDeleteWarranty'
import CardWarranty from './CardWarranty'
import {DeleteWarranty} from './DeleteWarranty'
import {DetailWarranty} from './DetailWarranty'
import {getWarranty} from './redux/WarrantyCRUD'

const Warranty: FC<any> = () => {
  const intl: any = useIntl()
  const navigate: any = useNavigate()
  const {preference}: any = useSelector(({preference}: any) => preference, shallowEqual)

  const [filter] = useState<any>([])
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [columns, setColumns] = useState<any>([])
  const [keyword, setKeyword] = useState<string>('')
  const [filterAll, setFilterAll] = useState<any>({})
  const [guidDetail, setGuidDetail] = useState<any>()
  const [pageFrom, setPageFrom] = useState<number>(0)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [dataChecked, setDataChecked] = useState<any>([])
  const [optDatabase, setDatabaseOption] = useState<any>([])
  const [orderCol, setOrderCol] = useState<string>('asset_id')
  const [warrantyGuid, setWarrantyGuid] = useState<string>('')
  const [warrantyName, setWarrantyName] = useState<string>('')
  const [warrantyDetail, setWarrantyDetail] = useState<any>({})
  const [onClickForm, setOnClickForm] = useState<boolean>(true)
  const [reloadWarranty, setReloadWarranty] = useState<number>(0)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)
  const [showModal, setShowModaWarranty] = useState<boolean>(false)
  const [defaultCustomField, setDefaultCustomField] = useState<any>([])
  const [validationNonCF, setValidationNonCF] = useState<boolean>(true)
  const [showModalDetail, setShowModalDetail] = useState<boolean>(false)
  const [showModalConfirm, setShowModalConfirm] = useState<boolean>(false)
  const [showModalBulk, setShowModalConfirmBulk] = useState<boolean>(false)

  const require_filed_message: any = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})

  const dataFilterParams: any = useMemo(() => {
    const filterParams2: any = {}
    return filterParams2
  }, [])

  const onDelete = (e: any) => {
    const {guid, asset_name}: any = e || {}
    setShowModalConfirm(true)
    setWarrantyGuid(guid || '')
    setWarrantyName(asset_name || '')
  }

  const warrantyQueryIndex: any = useQuery({
    // initialData: {data: []},
    queryKey: [
      'getWarrantyIndex',
      {
        reloadWarranty,
        limit,
        page,
        orderDir,
        orderCol,
      },
    ],
    queryFn: async () => {
      const res: any = await getWarranty({
        page,
        limit,
        orderDir,
        orderCol,
      })
      return res?.data?.data as never[]
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })
  const resDataWarranty: any = warrantyQueryIndex?.data || []

  useEffect(() => {
    ToastMessage({type: 'clear'})

    getDatabaseWarranty({}).then(({data: {data: res_database}}: any) => {
      res_database && setDatabaseOption(res_database)
    })

    getCustomField({filter: {...filter, section_type: 'warranty'}}).then(
      ({data: {data: res_custom_field}}: any) => {
        res_custom_field && setDefaultCustomField(res_custom_field)
      }
    )
  }, [])

  useEffect(() => {
    if (onClickForm && !validationNonCF) {
      ToastMessage({message: require_filed_message, type: 'error'})
    }
  }, [onClickForm, validationNonCF])

  useEffect(() => {
    let filterParams2: any = ''
    const params: any = new URLSearchParams(window.location.search)
    if (filterAll?.child === undefined) {
      const filterColumnsParent: any = []
      let filterColumnsChild: any = {}
      columns?.forEach(({value, header}: any) => {
        if (value !== undefined && params.get(`filter[${value}]`) !== null) {
          const childKey = `filter[${value}]`
          filterColumnsChild = {
            ...filterColumnsChild,
            [childKey]: params.get(`filter[${value}]`),
          }

          filterColumnsParent?.push({
            value: value,
            label: header,
            filterOptions: false,
            checked: true,
          })

          filterParams2 =
            filterParams2 +
            `${filterParams2 === '' ? '?' : '&'}filter[${value}]=${params.get(`filter[${value}]`)}`
        }
      })

      if (Object.keys(filterColumnsChild)?.length > 0 && filterColumnsParent?.length > 0) {
        setFilterAll({
          parent: filterColumnsParent,
          child: filterColumnsChild,
        })
      }
    }

    if (filterAll?.child !== undefined) {
      Object.entries(filterAll?.child)?.forEach((m: any) => {
        if (m[1] !== '') {
          filterParams2 = filterParams2 + `${filterParams2 === '' ? '?' : '&'}${m[0]}=${m[1]}`
        }
      })
    }

    if (Object.entries(dataFilterParams || {})?.length > 0) {
      Object.entries(dataFilterParams || {})?.forEach((arr: any) => {
        if (!filterParams2.includes(arr[0])) {
          filterParams2 = filterParams2 + `${filterParams2 === '' ? '?' : '&'}${arr[0]}=${arr[1]}`
        }
      })
    }

    if (filterAll?.child !== undefined && Object.keys(filterAll?.child)?.length === 0) {
      if (keyword === '') {
        navigate(`/warranty`)
      } else {
        navigate(`/warranty/?keyword=${keyword}`)
      }
    } else if (filterParams2 !== '') {
      if (keyword === '') {
        navigate(`/warranty/${filterParams2}`)
      } else {
        navigate(`/warranty/${filterParams2}&keyword=${keyword}`)
      }
    }
  }, [filterAll?.child, navigate, columns, dataFilterParams, keyword])

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.WARRANTY'})}</PageTitle>
      <CardWarranty
        page={page}
        limit={limit}
        keyword={keyword}
        setPage={setPage}
        orderCol={orderCol}
        onDelete={onDelete}
        setLimit={setLimit}
        orderDir={orderDir}
        totalPage={totalPage}
        filterAll={filterAll}
        setColumns={setColumns}
        preference={preference}
        setKeyword={setKeyword}
        setOrderCol={setOrderCol}
        setOrderDir={setOrderDir}
        dataChecked={dataChecked}
        setPageFrom={setPageFrom}
        setFilterAll={setFilterAll}
        setTotalPage={setTotalPage}
        resetKeyword={resetKeyword}
        setGuidDetail={setGuidDetail}
        reloadWarranty={reloadWarranty}
        setDataChecked={setDataChecked}
        setResetKeyword={setResetKeyword}
        dataFilterParams={dataFilterParams}
        setWarrantyDetail={setWarrantyDetail}
        setShowModalDetail={setShowModalDetail}
        setShowModaWarranty={setShowModaWarranty}
        setShowModalConfirmBulk={setShowModalConfirmBulk}
      />

      <AddWarranty
        showModal={showModal}
        optDatabase={optDatabase}
        onClickForm={onClickForm}
        dataWarranty={resDataWarranty}
        reloadWarranty={reloadWarranty}
        setOnClickForm={setOnClickForm}
        warrantyDetail={warrantyDetail}
        setReloadWarranty={setReloadWarranty}
        defaultCustomField={defaultCustomField}
        setValidationNonCF={setValidationNonCF}
        setShowModaWarranty={setShowModaWarranty}
      />

      <DeleteWarranty
        page={page}
        setPage={setPage}
        pageFrom={pageFrom}
        totalPage={totalPage}
        warrantyGuid={warrantyGuid}
        warrantyName={warrantyName}
        showModal={showModalConfirm}
        reloadWarranty={reloadWarranty}
        setDataChecked={setDataChecked}
        setResetKeyword={setResetKeyword}
        setShowModal={setShowModalConfirm}
        setReloadWarranty={setReloadWarranty}
      />

      <BulkDeleteWarranty
        page={page}
        setPage={setPage}
        pageFrom={pageFrom}
        totalPage={totalPage}
        dataChecked={dataChecked}
        showModal={showModalBulk}
        reloadWarranty={reloadWarranty}
        setDataChecked={setDataChecked}
        setResetKeyword={setResetKeyword}
        setReloadWarranty={setReloadWarranty}
        setShowModal={setShowModalConfirmBulk}
      />

      <DetailWarranty
        guid={guidDetail}
        showModal={showModalDetail}
        warrantyDetail={warrantyDetail}
        setShowModal={setShowModalDetail}
        defaultCustomField={defaultCustomField}
      />
    </>
  )
}

export default Warranty
