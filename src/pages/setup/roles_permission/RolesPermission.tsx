import {getRole} from '@api/role-and-permision'
import {DataTable} from '@components/datatable'
import {ToastMessage} from '@components/toast-message'
import {PageTitle} from '@metronic/layout/core'
import {useQuery} from '@tanstack/react-query'
import {FC, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {Link, useNavigate} from 'react-router-dom'

import AddRole from './AddRoles'
import DeleteRole from './DeleteRole'

type Props = {
  reloadData: any
  onDelete: any
  setShowModal: any
  reloadRoles: any
  setDataChecked: any
  setDataCheckedLabel: any
}

const CardRoles: FC<Props> = ({
  reloadData,
  onDelete,
  reloadRoles,
  setDataChecked,
  setDataCheckedLabel,
}) => {
  const navigate: any = useNavigate()

  const [meta, setMeta] = useState<any>({})
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('name')
  const [totalPerPage, setTotalPerPage] = useState<number>(0)

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  const columns: any = [
    {header: 'Role Name', value: 'label', sort: true},
    {header: 'Role Description', value: 'description', sort: true},
    {header: 'Active Users', value: 'users_count', sort: true},
    {header: 'Edit', width: '20px'},
    {header: 'Delete', width: '20px'},
  ]

  const onChangeLimit = (e: any) => {
    setLimit(e)
    setDataChecked(undefined)
  }

  const onPageChange = (e: any) => {
    setPage(e)
    setDataChecked(undefined)
  }

  const onEdit = ({id}: any) => {
    navigate('/setup/role-permission/edit-role?id=' + id || '')
  }

  const onSort = (value: any) => {
    setDataChecked(undefined)
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onChecked = (e: any) => {
    e?.forEach((ck: any) => {
      const {checked, guid, label}: any = ck || {}
      if (checked) {
        setDataChecked(guid || '')
        setDataCheckedLabel(label || '')
      }
    })
  }

  const rolePermissionQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getRole', {page, limit, reloadRoles, reloadData, orderDir, orderCol}],
    queryFn: async () => {
      const res: any = await getRole({page, limit, orderDir, orderCol})
      const {total}: any = res?.data?.meta || {}
      setTotalPage(total)
      setMeta(res?.data?.meta)
      const dataResult: any = res?.data?.data?.map((rolePermission: any) => {
        const {id, label, description, users_count} = rolePermission || {}
        return {
          original: rolePermission,
          guid: id,
          label: label,
          description: description || '-',
          users_count: users_count || '-',
          edit: 'Edit',
          delete: 'Delete',
        }
      })
      setTotalPerPage(dataResult?.length || 0)
      return dataResult as never[]
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })
  const dataRolePermission: any = rolePermissionQuery?.data || []

  useEffect(() => {
    if (totalPerPage === 0 && Object.keys(meta || {})?.length > 0) {
      setPage(meta?.current_page > 1 ? meta?.current_page - 1 : 1)
    }
  }, [totalPerPage, meta])

  return (
    <div className='card card-custom'>
      <div className='card-header p-6'>
        <h4>Security Rules</h4>
        <div className='justify-content-md-end create-role'>
          <Link
            data-cy='addNewRole'
            to='/setup/role-permission/add-role'
            className='btn btn-sm btn-primary me-3'
          >
            + Create a New Role
          </Link>
        </div>
      </div>

      <div className='card-body'>
        <div style={{display: 'block', paddingTop: 5, paddingBottom: 5}}>
          <div className='p-4 bg-secondary mb-5 decriptionRoles'>
            Decide which parts of your account you want accessible to your users by assigning them
            to Permission Roles. You can use and edit the predetermined roles or you can create your
            own custom roles.
          </div>

          <DataTable
            page={page}
            limit={limit}
            onEdit={onEdit}
            onSort={onSort}
            data={dataRolePermission}
            total={totalPage}
            columns={columns}
            loading={!rolePermissionQuery?.isFetched}
            onDelete={onDelete}
            onChecked={onChecked}
            onChangePage={onPageChange}
            onChangeLimit={onChangeLimit}
          />
        </div>
      </div>
    </div>
  )
}

const RolePermissions: FC = () => {
  const intl: any = useIntl()
  const [reloadData] = useState<number>(0)
  const [dataChecked, setDataChecked] = useState<any>()
  const [reloadRoles, setReloadRoles] = useState<any>([])
  const [showModal, setShowModal] = useState<boolean>(false)
  const [dataCheckedLabel, setDataCheckedLabel] = useState<any>()
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false)

  const onDelete = ({id, label}: any) => {
    setShowModalDelete(true)
    setDataChecked(id || '')
    setDataCheckedLabel(label || '')
  }

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.SETUP.ROLE_PERMISSIONS'})}
      </PageTitle>

      <CardRoles
        onDelete={onDelete}
        reloadData={reloadData}
        reloadRoles={reloadRoles}
        setShowModal={setShowModal}
        setDataChecked={setDataChecked}
        setDataCheckedLabel={setDataCheckedLabel}
      />

      <AddRole
        showModal={showModal}
        reloadRoles={reloadRoles}
        setShowModal={setShowModal}
        setReloadRoles={setReloadRoles}
        setDataChecked={setDataChecked}
      />

      <DeleteRole
        reloadRoles={reloadRoles}
        dataChecked={dataChecked}
        showModal={showModalDelete}
        setReloadRoles={setReloadRoles}
        setDataChecked={setDataChecked}
        setShowModal={setShowModalDelete}
        dataCheckedLabel={dataCheckedLabel}
        setDataCheckedLabel={setDataCheckedLabel}
      />
    </>
  )
}

export default RolePermissions
