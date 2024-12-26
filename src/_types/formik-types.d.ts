import {ComponentType, FC, ReactNode} from 'react'
declare module 'formik' {
  export interface ErrorMessageProps {
    name: string
    className?: string
    component?: string | ComponentType
    children?: (errorMessage: string) => ReactNode
    render?: (errorMessage: string) => ReactNode
  }
  export const ErrorMessage: FC<ErrorMessageProps>
}
