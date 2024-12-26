import './style.scss'

import {configClass} from '@helpers'
import uniq from 'lodash/uniq'
import {FC, useEffect, useRef, useState} from 'react'
import {ReactTags as Tags} from 'react-tag-autocomplete'

type propTags = {
  type?: any
  onChange?: any
  onInput?: any
  required?: any
  tag?: any
  placeholder?: any
  className?: any
  name?: any
}

export const InputTags: FC<propTags> = ({
  type,
  onChange,
  onInput,
  required,
  tag,
  placeholder,
  className = '',
  name = '',
}) => {
  const inputRef: any = useRef(null)

  const [tags, setTags] = useState<any>(tag || [])
  const [validateText, setValidateText] = useState<any>({type: 'text', isValid: true})

  const classNames: any = {
    root: configClass?.form + 'py-1 px-2' + className,
    input: 'react-tags__combobox-input',
    tagList: 'react-tags__list',
    tagListItem: 'react-tags__list-item',
    tag: 'react-tags__tag',
    tagName: 'react-tags__tag-name',
    comboBox: 'react-tags__combobox',
  }

  const onValidate = (newTag: any) => {
    let isValid: any = true
    if (newTag === true) {
      return true
    }

    if (newTag?.isValid === false) {
      return false
    }

    if (type === 'email') {
      isValid = newTag?.value?.toString()?.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)
      isValid = Boolean(isValid)
      return Boolean(isValid)
    }

    isValid = /^[a-z]{2,12}$/i.test(newTag?.value)
    return Boolean(isValid)
  }

  const onValidateText = (newTag: any) => {
    let isValid: any = true
    if (newTag === true) {
      setValidateText({isValid})
      return isValid
    }

    if (newTag?.isValid === false) {
      setValidateText({isValid: false, message: newTag?.message || 'invalid'})
      return isValid
    }

    if (type === 'email') {
      isValid = newTag?.value?.toString()?.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)
      isValid = Boolean(isValid)
      setValidateText({type: 'email', isValid, message: 'Input must be type of email'})
      return isValid
    }

    isValid = /^[a-z]{2,12}$/i.test(newTag?.value)
    setValidateText({
      type: 'text',
      isValid,
      message: 'Input must be at least 2 - 12 characters',
    })
  }

  const onAddition = (tag: any) => {
    const arr: any = [...tags, tag]?.filter((f: any) => f)
    setTags(uniq(arr))
    const valuesArray: any = uniq(arr)?.map(({value}: any) => value)
    onChange && onChange(valuesArray)
  }

  const onDelete = (tagIndex: any) => {
    const arr: any = tags?.filter((_: any, i: any) => i !== tagIndex)
    setTags(arr)
    const valuesArray: any = arr?.map(({value}: any) => value)
    onChange && onChange(valuesArray)
  }

  useEffect(() => {
    required && setValidateText({isValid: false, message: required})
  }, [required])

  return (
    <>
      <Tags
        ref={inputRef}
        allowNew
        labelText=''
        // addOnBlur
        allowBackspace={true}
        collapseOnSelect
        allowResize={false}
        activateFirstOption
        selected={tags}
        newOptionText=''
        classNames={classNames}
        placeholderText={placeholder || 'Press "Enter" or "Tab"'}
        suggestions={[]}
        onDelete={onDelete}
        delimiterKeys={['Enter', 'Tab', ' ', ',', ';', '/']}
        onAdd={onAddition}
        tagListLabelText={'oke'}
        onValidate={(val: any) => onValidate({value: val})}
        onInput={(val: any) => {
          if (!val && !required) {
            onValidateText(true)
          } else if (!val && required) {
            onValidateText({isValid: false, message: required})
          } else {
            onValidateText({value: val})
          }
          onInput && onInput(val)
        }}
        renderInput={({...inputProps}: any) => (
          <input name={name} className={classNames?.input} {...inputProps} />
        )}
        renderTag={({tag, ...tagProps}: any) => {
          return (
            <div className='d-inline-flex align-items-center bg-gray-300 text-primary border-0 radius-50 m-1 p-1'>
              <div className='px-2 fw-bold'>{tag?.label}</div>
              <button
                // onClick={onDelete}
                className='btn btn-icon btn-danger w-20px h-20px radius-50'
                {...tagProps}
              >
                <i className='las la-times' />
              </button>
            </div>
          )
        }}
        renderHighlight={({children, classNames}: any) => {
          const classes: any = [classNames.root]
          return <div className={classes?.join(' ')}>{children}</div>
        }}
      />

      {!validateText?.isValid && (
        <small className='d-block text-danger mt-1'>{validateText?.message}</small>
      )}

      <style>{`
        #react-tags-combobox {
          width: 600px !important;
        }
      `}</style>
    </>
  )
}
