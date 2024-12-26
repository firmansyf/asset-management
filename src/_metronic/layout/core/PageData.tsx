/* eslint-disable react-hooks/exhaustive-deps */
import {createContext, FC, useContext, useEffect, useState} from 'react'

export interface PageLink {
  title: string
  path: string
  isActive: boolean
  isSeparator?: boolean
}

export interface PageDataContextModel {
  pageTitle?: string
  setPageTitle: (_title: string) => void
  pageDescription?: string
  setPageDescription: (_description: string) => void
  pageBreadcrumbs?: Array<PageLink>
  setPageBreadcrumbs: (_breadcrumbs: Array<PageLink>) => void
  arrowBack?: Array<PageLink>
  setArrowBack: (_arrowBack: any) => void
}

const PageDataContext = createContext<PageDataContextModel>({
  setPageTitle: (_title: string) => '',
  setPageBreadcrumbs: (_breadcrumbs: Array<PageLink>) => '',
  setPageDescription: (_description: string) => '',
  setArrowBack: (_arrowBack: any) => '',
})

const PageDataProvider: FC<any> = ({children}) => {
  const [pageTitle, setPageTitle] = useState<string>('')
  const [pageDescription, setPageDescription] = useState<string>('')
  const [pageBreadcrumbs, setPageBreadcrumbs] = useState<Array<PageLink>>([])
  const [arrowBack, setArrowBack] = useState<any>({})

  const value: PageDataContextModel = {
    pageTitle,
    setPageTitle,
    pageDescription,
    setPageDescription,
    pageBreadcrumbs,
    setPageBreadcrumbs,
    arrowBack,
    setArrowBack,
  }
  return <PageDataContext.Provider value={value}>{children}</PageDataContext.Provider>
}

function usePageData() {
  return useContext(PageDataContext)
}

type Props = {
  description?: string
  breadcrumbs?: Array<PageLink>
  children?: any
  arrowBack?: any
}

const PageTitle: FC<Props> = ({children, description, breadcrumbs, arrowBack}) => {
  const {setPageTitle, setPageDescription, setPageBreadcrumbs, setArrowBack}: any = usePageData()
  useEffect(() => {
    if (children) {
      document.title = children?.toString()
      setPageTitle(children?.toString())
    }
    return () => {
      setPageTitle('')
      document.title = 'Assetdata.io'
    }
  }, [children])

  useEffect(() => {
    if (description) {
      setPageDescription(description)
    }
    return () => {
      setPageDescription('')
    }
  }, [description])

  useEffect(() => {
    if (breadcrumbs) {
      setPageBreadcrumbs(breadcrumbs)
    }
    return () => {
      setPageBreadcrumbs([])
    }
  }, [breadcrumbs])

  useEffect(() => {
    if (arrowBack) {
      setArrowBack(arrowBack)
    }
    return () => {
      setArrowBack({})
    }
  }, [arrowBack])

  return null
}

const PageDescription: FC<any> = ({children}) => {
  const {setPageDescription} = usePageData()
  useEffect(() => {
    if (children) {
      setPageDescription(children?.toString())
    }
    return () => {
      setPageDescription('')
    }
  }, [children])
  return null
}

export {PageDataProvider, PageDescription, PageTitle, usePageData}
