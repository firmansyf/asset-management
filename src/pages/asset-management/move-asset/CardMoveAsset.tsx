/* eslint-disable react-hooks/exhaustive-deps */
import {getCompany} from '@api/company'
import {getDepartment} from '@api/department'
import {getLocationV1} from '@api/Service'
import {DataTable} from '@components/datatable'
import {Search} from '@components/form/searchAlert'
import {Title as Section} from '@components/form/Title'
import {Select as SelectApi} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {configClass, guidBulkChecked, KTSVG} from '@helpers'
import {ScrollTopComponent} from '@metronic/assets/ts/components'
import {getSubLocation} from '@pages/location/sub-location/redux/SubLocationCRUD'
import {useQuery} from '@tanstack/react-query'
import {ErrorMessage, Form, Formik} from 'formik'
import {FC, memo, useState} from 'react'
import {Button} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'
import * as Yup from 'yup'

import {getMoveAsset, saveMoveAsset} from '../redux/AssetMoveRedux'

type Props = {
  reloadMoveAsset: any
  setReloadMoveAsset: any
}

let CardMoveAsset: FC<Props> = ({reloadMoveAsset, setReloadMoveAsset}) => {
  const navigate: any = useNavigate()

  const [filter] = useState<any>([])
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [reload, setReload] = useState<boolean>(false)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [dataChecked, setDataChecked] = useState<any>([])
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('name')
  const [clearOption, setClearOption] = useState<boolean>(false)
  const [checkCompany, setCheckCompany] = useState<boolean>(false)
  const [checkLocation, setCheckLocation] = useState<boolean>(false)
  const [resetOptionCompany, setResetOptionCompany] = useState<boolean>(false)
  const [resetOptionLocation, setResetOptionLocation] = useState<boolean>(false)
  const [resetOptionDepertment, setResetOptionDepertment] = useState<boolean>(false)
  const [resetOptionSubLocation, setResetOptionSubLocation] = useState<boolean>(false)

  const columns: any = [
    {header: 'checkbox', width: '20px'},
    {header: 'View', width: '20px'},
    {header: 'Asset ID', sort: true, value: 'name'},
    {header: 'Asset Name', sort: true, value: 'name'},
    {header: 'Status Name', sort: true, value: 'status_name'},
    {header: 'Assigned User', sort: true, value: 'assign_user_name'},
    {header: 'Location Name', sort: true, value: 'location_name'},
    {header: 'Sub Location', sort: true, value: 'location_sub_name'},
    {header: 'Company', sort: true, value: 'company_name'},
    {header: 'Owner Department', sort: true, value: 'department_name'},
  ]

  const initValue: any = {
    location: '',
    sub_location: '',
    company: '',
    company_department: '',
  }

  const MoveSchema: any = Yup.object().shape({
    // sub_location: Yup.string().when({
    //   is: () => checkLocation,
    //   then: () => Yup.string().required('Sub location is required'),
    // }),
    // company_department: Yup.string().when({
    //   is: () => checkCompany,
    //   then: () => Yup.string().required('Department is required'),
    // }),
  })

  const onDetail = ({guid}: any) => {
    navigate(`/asset-management/detail/${guid || ''}`)
  }

  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
  }

  const onPageChange = (e: any) => {
    setPage(e)
  }

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e ? `*${e}*` : '')
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onChecked = (e: any) => {
    const ar_guid: any = guidBulkChecked(e)
    setDataChecked(ar_guid)
  }

  const messageAssetSelected = (dataChecked: any) => {
    if (dataChecked?.length === 0) {
      setLoading(false)
      ToastMessage({type: 'error', message: 'Please select at least one asset to continue.'})
    }
  }

  const messageNewValue = (dataChecked: any, checkLocation: any, checkCompany: any) => {
    if (dataChecked?.length > 0 && !checkLocation && !checkCompany) {
      setLoading(false)
      ToastMessage({
        type: 'error',
        message: 'Please select at least one new value to move asset.',
      })
    }
  }

  const handleOnSubmit = (values: any, actions: any) => {
    setLoading(true)
    const params: any = {
      guids: dataChecked,
      location_sub_guid: values?.sub_location || '',
      location_guid: values?.location.value || values?.location || '',
      owner_company_department_guid: values?.company_department || '',
      owner_company_guid: values?.company?.value || values?.company || '',
    }

    messageAssetSelected(dataChecked)
    messageNewValue(dataChecked, checkLocation, checkCompany)

    if (dataChecked?.length > 0) {
      if (checkLocation || checkCompany) {
        saveMoveAsset(params)
          .then(({data: {message}}: any) => {
            onReset()
            setLoading(false)
            setDataChecked([])
            actions.resetForm()
            ToastMessage({type: 'success', message})
          })
          .catch(({response}: any) => {
            setLoading(false)
            const {data, message}: any = response?.data || {}
            const {fields}: any = data || {}

            if (fields !== undefined) {
              actions.setFieldError('location', fields?.name)
              const error: any = fields || {}
              for (const key in error) {
                const value: any = error?.[key] || []
                actions.setFieldError(key, [value?.[0] || ''])
              }
            } else {
              ToastMessage({type: 'error', message})
            }
          })
      } else {
        //
      }
    }
  }

  const onReset = () => {
    setReload(true)
    setLoading(false)
    setClearOption(true)
    setCheckCompany(false)
    setCheckLocation(false)
    setResetOptionCompany(true)
    setResetOptionLocation(true)
    setResetOptionDepertment(true)
    setResetOptionSubLocation(true)
    setReloadMoveAsset(reloadMoveAsset + 1)

    if (dataChecked?.length > 0) {
      setDataChecked([])
    } else {
      navigate(-1)
    }
    ScrollTopComponent.goTop()
  }

  const dataMoveAssetParam: any = {page, limit, orderDir, orderCol, keyword, filter}
  const dataMoveAssetQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getMoveAsset', {...dataMoveAssetParam, reloadMoveAsset}],
    queryFn: async () => {
      if (columns?.length > 0) {
        const res: any = await getMoveAsset(dataMoveAssetParam)
        const {total}: any = res?.data?.meta || {}
        setTotalPage(total)

        const dataResult: any = res?.data?.data?.map((m: any) => {
          const {
            guid,
            asset_id,
            name,
            status_name,
            assign_user_name,
            location_name,
            location_sub_name,
            company_name,
            department_name,
          } = m
          return {
            original: m,
            checkbox: m,
            guid: guid,
            view: 'view',
            asset_id,
            name,
            status_name,
            assign_user_name,
            location_name,
            location_sub_name,
            company_name,
            department_name,
          }
        })

        return dataResult
      } else {
        return []
      }
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })
  const dataMoveAsset: any = dataMoveAssetQuery?.data || []

  return (
    <>
      <div>
        <p>
          In a single action, you can move any number of assets. Ensure that your assets have the
          most comprehensive data possible by tracking their movement.
        </p>
      </div>
      <div className='card card-table'>
        <div className='card-table-header'>
          <div className='d-flex flex-wrap flex-stack'>
            <div className='d-flex align-items-center position-relative me-4 my-1'>
              <KTSVG
                path='/media/icons/duotone/General/Search.svg'
                className='svg-icon-3 position-absolute ms-3'
              />
              <Search bg='solid' onChange={onSearch} />
            </div>
          </div>
        </div>
        <div className='card-body'>
          <DataTable
            page={page}
            edit={false}
            limit={limit}
            onEdit={false}
            onSort={onSort}
            onDelete={false}
            total={totalPage}
            columns={columns}
            onDetail={onDetail}
            data={dataMoveAsset}
            onChecked={onChecked}
            onChangePage={onPageChange}
            onChangeLimit={onChangeLimit}
            loading={!dataMoveAssetQuery?.isFetched}
          />
        </div>
      </div>

      <div>
        <Formik
          enableReinitialize
          initialValues={initValue}
          onSubmit={handleOnSubmit}
          validationSchema={MoveSchema}
        >
          {({setFieldValue, values}: any) => {
            return (
              <Form className='justify-content-center' noValidate>
                <div className='card card-custom'>
                  <div className='card-body'>
                    <div className='fw-boldest'>
                      <Section title='Move Asset' sticky={false} />
                    </div>
                    <div className='row'>
                      <div className='col-md-6 row mb-3'>
                        <div className='col-4'>
                          <label htmlFor='location' className={configClass?.label}>
                            Location
                          </label>
                        </div>
                        <div className='col-8' style={{paddingLeft: '12px'}}>
                          <SelectApi
                            sm={true}
                            api={getLocationV1}
                            params={{orderCol: 'name', orderDir: 'asc'}}
                            name='location'
                            reload={reload}
                            isClearable={true}
                            id='selectLocation'
                            clearOption={clearOption}
                            placeholder={`Enter Location`}
                            resetOption={resetOptionLocation}
                            defaultValue={values?.location || {}}
                            className='col p-0 select-location-cy'
                            setResetOption={setResetOptionLocation}
                            parse={({guid, name}: any) => ({value: guid, label: name})}
                            onChange={(e: any) => {
                              setResetOptionSubLocation(true)
                              setFieldValue('sub_location', '')
                              setFieldValue('location', e || '')
                              // setFieldValue('location', e?.value || '')
                              setCheckLocation(e?.value !== '' ? true : false)
                            }}
                          />
                        </div>
                      </div>
                      <div className='col-md-6 row mb-3'>
                        <div className='col-4'>
                          <label htmlFor='sub_location' className={configClass?.label}>
                            Sub Location
                          </label>
                        </div>
                        <div className='col-8' style={{paddingLeft: '12px'}}>
                          <SelectApi
                            sm={true}
                            api={getSubLocation}
                            params={{
                              orderCol: 'name',
                              orderDir: 'asc',
                              'filter[location_guid]':
                                values?.location.value || values?.location || '-',
                            }}
                            reload={reload}
                            isClearable={true}
                            name='sub_location'
                            id='selectSubLocation'
                            defaultValue={undefined}
                            clearOption={clearOption}
                            placeholder='Choose Sub Location'
                            resetOption={resetOptionSubLocation}
                            className='col p-0 select-sublocation-cy'
                            setResetOption={setResetOptionSubLocation}
                            parse={({guid, name}: any) => ({value: guid, label: name})}
                            onChange={(e: any) => {
                              setFieldValue('sub_location', e?.value || '')
                            }}
                          />
                          {values?.location !== '' && values?.sub_location === '' && (
                            <div className='fv-plugins-message-container invalid-feedback'>
                              <ErrorMessage name='sub_location' />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className='col-md-6 row mb-3'>
                        <div className='col-4'>
                          <label htmlFor='company' className={configClass?.label}>
                            Company
                          </label>
                        </div>
                        <div className='col-8' style={{paddingLeft: '12px'}}>
                          <SelectApi
                            sm={true}
                            api={getCompany}
                            params={{orderCol: 'name', orderDir: 'asc'}}
                            name='company'
                            reload={reload}
                            id='selectCompany'
                            isClearable={true}
                            clearOption={clearOption}
                            placeholder='Choose Company'
                            resetOption={resetOptionCompany}
                            defaultValue={values?.company || {}}
                            className='col p-0 select-company-cy'
                            setResetOption={setResetOptionCompany}
                            parse={({guid, name}: any) => ({value: guid, label: name})}
                            onChange={(e: any) => {
                              setResetOptionDepertment(true)
                              setFieldValue('company', e || '')
                              // setFieldValue('company', e?.value)
                              setFieldValue('company_department', '')
                              setCheckCompany(e?.value !== '' ? true : false)
                            }}
                          />
                        </div>
                      </div>

                      <div className='col-md-6 row mb-3'>
                        <div className='col-4'>
                          <label htmlFor='company_department' className={configClass?.label}>
                            Department
                          </label>
                        </div>
                        <div className='col-8' style={{paddingLeft: '12px'}}>
                          <SelectApi
                            sm={true}
                            api={getDepartment}
                            params={{
                              orderCol: 'name',
                              orderDir: 'asc',
                              fieldSearch: 'name',
                              'filter[company_guid]':
                                values?.company?.value || values?.company || '-',
                            }}
                            reload={reload}
                            id='selectDepartment'
                            name='company_department'
                            clearOption={clearOption}
                            placeholder='Choose Department'
                            defaultValue={values?.department}
                            resetOption={resetOptionDepertment}
                            className='col p-0 select-department-cy'
                            setResetOption={setResetOptionDepertment}
                            parse={({guid, name}: any) => ({value: guid, label: name})}
                            onChange={(e: any) =>
                              setFieldValue('company_department', e?.value || '')
                            }
                          />
                          {values?.company !== '' && values?.company_department === '' && (
                            <div className='fv-plugins-message-container invalid-feedback'>
                              <ErrorMessage name='company_department' />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='card-footer d-flex justify-content-end'>
                    <Button
                      type='reset'
                      onClick={onReset}
                      data-cy='cancelButton'
                      className='btn btn-sm btn-secondary me-2'
                    >
                      Cancel
                    </Button>
                    <Button
                      type='submit'
                      disabled={loading}
                      data-cy='moveButton'
                      className='btn btn-primary'
                    >
                      {!loading && <span className='indicator-label'>Move</span>}
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
            )
          }}
        </Formik>
      </div>
    </>
  )
}

CardMoveAsset = memo(
  CardMoveAsset,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default CardMoveAsset
