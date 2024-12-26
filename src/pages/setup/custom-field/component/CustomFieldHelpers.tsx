export const headerColumn: any = () => {
  const columns: any = [
    {header: 'Checkbox', width: '20px'},
    {header: 'View', width: '20px'},
    {header: 'Field Name', sort: true, value: 'name'},
    {header: 'Data Type', sort: true, value: 'name'},
    {header: 'Mandatory', sort: true, value: 'name'},
    {header: 'Edit', width: '20px'},
    {header: 'Delete', width: '20px'},
  ]
  return columns
}

export const messageAlertBulk: any = (mandatoryDeleteBulk: any, checkDeleteBulk: any) => {
  return [
    'Are you sure you want to delete ',
    <strong key='full_name'> {mandatoryDeleteBulk?.length || 'this'} </strong>,
    ' custom field(s) ?',
    checkDeleteBulk?.error ||
    (mandatoryDeleteBulk?.length > 0 ? mandatoryDeleteBulk?.includes(true) : false) ? (
      <p>
        <span className='text-danger'>{checkDeleteBulk?.message} </span>
        If proceed to delete, please take note the &nbsp;
        <b>existing value(s) will be deleted too.</b>
      </p>
    ) : (
      ''
    ),
  ]
}

export const messageAlert: any = (name: any, error: any, mandatory: any) => {
  return [
    'Are you sure you want to delete this custom field ',
    <strong key='full_name'>
      {error || mandatory ? <span className='text-danger'>{name}</span> : name}
    </strong>,
    '?',
    error || mandatory ? (
      <p>
        If proceed to delete, please take note the &nbsp;
        <b>existing value(s) will be deleted too.</b>
      </p>
    ) : (
      ''
    ),
  ]
}
