import omit from 'lodash/omit'
import {components} from 'react-select'

export interface SelectTypes {
  name?: string
  placeholder?: string
  onChange?: any
  data?: any
  defaultValue?: {
    value: any
    label: any
  }
  multiple?: any
  params?: any
  limit?: any
  resultParams?: any
  api?: any
  parse?: any
  reload?: any
  id?: any
  className?: any
  sm?: any
  removeOption?: any
  resetOption?: any
  setResetOption?: any
  clearOption?: any
  isClearable?: boolean
  isDisabled?: any
  isMulti?: any
  styleOption?: any
  DropdownElement?: any
  ClearElement?: any
  MultiValueElement?: any
  selectedOption?: any
  ref?: any
  components?: any
  getOptionValue?: any
  getOptionLabel?: any
}

const fontSize: any = 11
export const customStyles: any = (sm: any = true, styleOption?: any) => ({
  option: (provided: any, state: any) => ({
    ...provided,
    color: state.isSelected
      ? styleOption?.option?.activeColor || 'black'
      : styleOption?.option?.color || '#555',
    backgroundColor: state.isSelected
      ? styleOption?.option?.activeBackgroundColor || '#f5f8fa'
      : styleOption?.option?.backgroundColor || 'unset',
    '&:hover': {
      backgroundColor: styleOption?.option?.activeBackgroundColor || '#fafafa',
      color: styleOption?.option?.activeColor || 'black',
      cursor: 'pointer',
    },
    padding: '5px 10px',
    fontSize: styleOption?.option?.fontSize || fontSize,
    fontWeight: state.isSelected ? 600 : 500,
    fontFamily: 'inherit',
    border: 'unset',
    ...omit(styleOption?.option, ['color']),
  }),
  placeholder: (provided: any, _state: any) => ({
    ...provided,
    color: '#aaa',
    ...styleOption?.placeholder,
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    '&:hover, &:focus': {
      borderColor: styleOption?.control?.borderColor || '#f5f8fa',
      backgroundColor: styleOption?.control?.backgroundColor || '#f5f8fa',
    },
    display: 'flex',
    flexWrap: 'nowrap',
    width: '100%',
    borderRadius: 5,
    borderColor: styleOption?.control?.borderColor || '#f5f8fa',
    padding: sm ? 3 : 5,
    cursor: 'pointer',
    minHeight: 10,
    boxShadow: 'unset',
    fontSize,
    backgroundColor:
      styleOption?.control?.backgroundColor || state.isDisabled ? '#e2e6ea' : '#f5f8fa',
    color: state.isDisabled ? 'red' : 'blue',
    ...styleOption?.control,
  }),
  noOptionsMessage: (provided: any, _state: any) => ({
    ...provided,
    fontSize,
    ...styleOption?.noOptionsMessage,
  }),
  container: (provided: any, _state: any) => ({
    ...provided,
    height: 'auto',
    fontSize,
    ...styleOption?.valueContainer,
  }),
  valueContainer: (provided: any, _state: any) => ({
    ...provided,
    padding: '1px 5px',
    fontSize,
    lineHeight: 1,
    fontWeight: 500,
    ...styleOption?.valueContainer,
  }),
  menuList: (provided: any, _state: any) => ({
    ...provided,
    maxHeight: '150px',
    fontSize,
    ...styleOption?.menuList,
  }),
  menu: (provided: any, _state: any) => ({
    ...provided,
    zIndex: 1000,
    marginTop: 0,
    borderRadius: 5,
    boxShadow: '0 1px hsla(0,0%,0%,0.1), 0 1px 5px hsla(0,0%,0%,0.1)',
    ...styleOption?.menu,
  }),
  menuPortal: (provided: any) => ({...provided, zIndex: 1000}),
  indicatorSeparator: (provided: any, _state: any) => ({
    ...provided,
    display: 'none',
    ...styleOption?.indicatorSeparator,
  }),
  dropdownIndicator: (provided: any, _state: any) => ({
    ...provided,
    padding: '1px 5px',
    ...styleOption?.dropdownIndicator,
  }),
  multiValue: (provided: any, _state: any) => ({
    ...provided,
    backgroundColor: '#050990',
    color: '#fff',
    borderRadius: '3px',
    padding: '.15rem .25rem',
    ...styleOption?.multiValue,
  }),
  multiValueLabel: (provided: any, _state: any) => ({
    ...provided,
    fontSize: '11px',
    fontWeight: 500,
    backgroundColor: '#050990',
    color: '#fff',
    // padding: '.35rem .5rem',
    // paddingRight: '.5rem',
    borderRadius: '3px',
    ...styleOption?.multiValueLabel,
  }),
  multiValueRemove: (provided: any, _state: any) => ({
    ...provided,
    '&:hover, &:focus': {
      opacity: 1,
      color: 'inherit',
      backgroundColor: 'inherit',
    },
    backgroundColor: 'rgba(0, 0, 0, 0)',
    paddingLeft: 2,
    paddingRight: 2,
    opacity: 1,
    borderRadius: '3px',
    ...styleOption?.multiValueRemove,
  }),
  singleValue: (provided: any, state: any) => {
    const opacity = state.isDisabled ? 1 : 1
    const transition = 'opacity 300ms'
    const color = '#000'
    const height = fontSize + 1
    return {...provided, opacity, transition, color, height, ...styleOption?.singleValue}
  },
  input: (provided: any, _state: any) => {
    const lineHeight = 1.5
    return {...provided, lineHeight, ...styleOption?.input}
  },
})
export const DropdownIndicator = ({element, ...props}: any) => {
  return (
    <components.DropdownIndicator {...props}>
      {element || <i className='las la-angle-down fs-9 text-dark' />}
    </components.DropdownIndicator>
  )
}
export const ClearIndicator = ({element, ...props}: any) => {
  return (
    <components.DropdownIndicator {...props}>
      <div className='d-flex align-items-center h-15px w-15px justify-content-center bg-dark radius-50'>
        {element || <i className='fa fa-times text-white fs-9' />}
      </div>
    </components.DropdownIndicator>
  )
}
export const MultiValueRemove = ({element, ...props}: any) => {
  return (
    <components.MultiValueRemove {...props}>
      <div className='d-flex align-items-center h-15px w-15px justify-content-center bg-primary radius-50'>
        {element || <i className='fas fa-times text-white fs-9' />}
      </div>
    </components.MultiValueRemove>
  )
}
