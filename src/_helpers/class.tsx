interface ClassesProps {
  row?: string
  grid?: string
  modalForm?: string
  size?: string
  label?: string
  form?: string
  select?: string
  search?: string
  body?: string
  title?: string
  readOnly?: string
}

const classes: ClassesProps = {
  size: 'sm',
  row: 'row mb-3',
  grid: 'col-md-6 mb-4',
  modalForm: 'col-md-6',
  title: 'fw-bolder fs-7 mb-1',
  body: 'bg-gray-100 p-2 rounded',
  label: 'text-uppercase fw-bolder fs-12px mb-1 text-dark',
  search: 'form-control form-control-sm fs-11px min-h-35px',
  form: 'form-control form-control-sm form-control-solid text-dark fs-11px min-h-35px',
  select: 'form-select form-select-sm form-select-solid fw-bolder text-dark fs-11px min-h-35px',
  readOnly:
    'form-control form-control-sm border-1 border-gray-300 cursor-na bg-fd text-dark fs-11px min-h-35px',
}
export default classes
