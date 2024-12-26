import {filter, includes} from 'lodash'
import {FC, useEffect} from 'react'

import RoleTable from '../sections/RoleTable'

type PORolesProps = {
  rolePurchaseOrder: any
  purchaseOrderRoles: any
  setPurchaseOrderRoles: any
}
const PurchaseOrderRoles: FC<PORolesProps> = ({
  rolePurchaseOrder,
  purchaseOrderRoles,
  setPurchaseOrderRoles,
}) => {
  useEffect(() => {
    rolePurchaseOrder?.map((data_role: any) => {
      const data_po: any = [
        'purchase-order.add',
        'purchase-order.approval',
        'purchase-order.delete',
        'purchase-order.delivery_check',
        'purchase-order.edit',
        'purchase-order.export',
        'purchase-order.payment',
        'purchase-order.setup-column',
        'purchase-order.view',
      ]
      const dataPurchaseOrder: any = filter(data_role?.items, (role: any) =>
        includes(data_po, role?.name)
      )
      return setPurchaseOrderRoles(dataPurchaseOrder)
    })
  }, [rolePurchaseOrder, setPurchaseOrderRoles])

  return (
    <div className='container'>
      <div className='mb-0 mt-10'>
        <h3>Permission</h3>
      </div>
      <div className='mb-10'>Set user&lsquo;s permission add/edit/delete/view.</div>
      <div className='row'>
        <div className='col-sm-12 col-md-6 col-lg-6'>
          <RoleTable
            dataRoles={purchaseOrderRoles}
            setDataRoles={setPurchaseOrderRoles}
            roleName={'purchase-order"'}
            roleTitle={'Purchase Order'}
          />
        </div>
      </div>
    </div>
  )
}

export default PurchaseOrderRoles
