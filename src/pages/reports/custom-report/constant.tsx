const columns = [
  {key: 'asset_id', value: 'Asset ID'},
  {key: 'asset_description', value: 'Asset Description'},
  {key: 'assigned_user_name', value: 'Assigned User'},
  {key: 'location_name', value: 'Asset Location'},
  {key: 'asset_name', value: 'Asset Name'},
  // { key: 'purchase_from', value: 'Purchased From' },
  {key: 'purchase_date', value: 'Purchased Date'},
  {key: 'manufacturer_name', value: 'Manufacturer'},
  {key: 'model_name', value: 'Model'},
  {key: 'brand_name', value: 'Brand'},
  {key: 'supplier_name', value: 'Supplier'},
  {key: 'status_name', value: 'Asset Status'},
  {key: 'qr_code', value: 'QR Code'},
  {key: 'serial_number', value: 'Serial Number'},
  {key: 'category_name', value: 'Category Name'},
]

export const initTableColumns = columns?.map(({key, value}: any) => ({
  value: key,
  header: value,
  sort: true,
}))

export const initSetupColumns = columns?.map(({key, value}: any, index: number) => ({
  value: key,
  label: value,
  order_number: index + 1,
  checked: false,
}))
