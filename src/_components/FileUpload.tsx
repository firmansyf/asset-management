import {FC, forwardRef, useRef, useState} from 'react'

type Props = {
  ref?: any
  name: string
  children: any
  onChange?: any
  multiple?: boolean
  accept?: any
  errorMessage?: any
  disabled?: any
  className?: any
  classNameOndragOver?: any
}

const FileUploadComponent: any = (
  {
    name,
    children,
    onChange,
    multiple = false,
    accept,
    errorMessage,
    disabled = false,
    className = '',
    classNameOndragOver = '',
  }: Props,
  ref: any
) => {
  const inputRef: any = useRef()
  const [isOver, setIsOver] = useState<boolean>(false)

  const onInputChange = (e: any) => {
    if (e?.target?.files?.length) {
      const files: any = e?.target?.files
      onChange([...files])
    }
    inputRef.current.value = ''
  }

  const dropHandler = (e: any) => {
    e?.preventDefault()
    if (e?.dataTransfer?.items) {
      let arr: any = []
      for (let i = 0; i < e?.dataTransfer?.items?.length; i++) {
        if (e?.dataTransfer?.items?.[i]?.kind === 'file') {
          const file = e?.dataTransfer?.items?.[i]?.getAsFile()
          if (file?.type !== '') {
            if (accept?.includes(file?.type)) {
              arr = [...arr, file]
            } else if (file?.type?.split('/')?.[0] === 'video') {
              arr = [...arr, file]
            } else {
              arr = [...arr, file]
            }
          }
        }
      }
      onChange(arr)
    }
    setIsOver(false)
  }

  const handleDragOver = (e: any) => {
    e?.preventDefault()
    setIsOver(true)
  }

  const handleDragLeave = (e: any) => {
    e?.preventDefault()
    setIsOver(false)
  }

  return (
    <div
      ref={ref}
      className={isOver ? `${className} ${classNameOndragOver}` : className}
      onClick={() => inputRef?.current?.click?.()}
      onDrop={(e: any) => !disabled && dropHandler(e)}
      onDragOver={(e: any) => !disabled && handleDragOver(e)}
      onDragLeave={(e: any) => !disabled && handleDragLeave(e)}
    >
      <input
        type='file'
        multiple={multiple}
        className='d-none'
        name={name}
        ref={inputRef}
        onChange={onInputChange}
        accept={accept}
        disabled={disabled}
      />
      {children}
      {errorMessage && (
        <div className='fv-plugins-message-container invalid-feedback'>{errorMessage}</div>
      )}
    </div>
  )
}

const FileUpload: FC<Props> = forwardRef(FileUploadComponent)

export {FileUpload}
