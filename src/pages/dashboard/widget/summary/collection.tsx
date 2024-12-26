export interface CollectionTypes {
  unique_id?: string
  title?: string
  icon?: string | null
  url?: string | null
}

const collection: Array<CollectionTypes> = [
  {
    unique_id: 'unresolved-tickets',
    title: 'Unresolved Tickets',
    icon: null,
    url: '/help-desk/ticket',
  },
  {
    unique_id: 'my-tickets',
    title: 'My Tickets',
    icon: null,
    url: '/help-desk/ticket',
  },
  {
    unique_id: 'total-agents',
    title: 'Total Agents',
    icon: null,
    url: '/user-management/users',
  },
  {
    unique_id: 'total-unassigned',
    title: 'Total Unassigned Assets',
    icon: '/media/icons/duotone/General/User.svg',
    url: null,
  },
  {
    unique_id: 'inventory-low-stock',
    title: 'Low Stock Inventory',
    icon: null,
    url: '/inventory',
  },
  {
    unique_id: 'due-today',
    title: 'Due Today',
    icon: null,
    url: '/help-desk/ticket',
  },
  {
    unique_id: 'overdue-tickets',
    title: 'Overdue Tickets',
    icon: null,
    url: '/help-desk/ticket',
  },
  {
    unique_id: 'onhold-tickets',
    title: 'On Hold Tickets',
    icon: null,
    url: '/help-desk/ticket',
  },
  {
    unique_id: 'inventory-reservation',
    title: 'Inventory Reservations',
    icon: null,
    url: '/inventory',
  },
  {
    unique_id: 'total-policy',
    title: 'Total Policies',
    icon: '/media/icons/duotone/General/Shield-protected.svg',
    url: '/insurance/policies',
  },
  {
    unique_id: 'total-expired-warranty',
    title: 'Expired Warranties',
    icon: '/media/icons/duotone/General/Clipboard.svg',
    url: '/warranty/?filter%5Bstatus%5D=Expired',
  },
  {
    unique_id: 'total-asset',
    title: 'Total Assets',
    icon: '/media/icons/duotone/Tools/Pantone.svg',
    url: '/asset-management/all',
  },
  {
    unique_id: 'total-user',
    title: 'Total Users',
    icon: '/media/icons/duotone/Communication/Group.svg',
    url: '/user-management/users',
  },
  {
    unique_id: 'total-audited',
    title: 'Total Audited Assets',
    icon: '/media/icons/duotone/Media/Equalizer.svg',
    url: '/asset-management/all',
  },
  {
    unique_id: 'total-employee',
    title: 'Total Employees',
    icon: '/media/icons/duotone/General/User.svg',
    url: '/user-management/employee',
  },
  {
    unique_id: 'overdue-work-order',
    title: 'Overdue Work Order',
    icon: '/media/icons/duotone/Interface/Line-03-Up.svg',
    url: null,
  },
  {
    unique_id: 'total-computer',
    title: 'Total Computer',
    icon: '/media/icons/duotone/Devices/Display1.svg',
    url: null,
  },
  {
    unique_id: 'maintenance-total-worker',
    title: 'Total Workers',
    icon: null,
    url: '/user-management/users',
  },
  {
    unique_id: 'total-my-asset',
    title: 'Total My Asset',
    icon: null,
    url: '/my-assets',
  },
]

export default collection
