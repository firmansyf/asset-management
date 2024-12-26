import {useEffect, useRef} from 'react'

function useDocumentTitle(title: string, prevailOnUnmount = false) {
  const defaultTitle = useRef(document.title)

  useEffect(() => {
    document.title = title + ' - Assetdata.io'
  }, [title])

  useEffect(
    () => () => {
      if (!prevailOnUnmount) {
        document.title = defaultTitle.current
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
}

export default useDocumentTitle
