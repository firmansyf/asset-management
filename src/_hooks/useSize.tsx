import {debounce} from 'lodash'
import {useEffect} from 'react'

function useSize(func: any, timeout: any) {
  useEffect(() => {
    const updateSize: any = debounce(func, timeout || 100)
    updateSize()
    window?.addEventListener('resize', updateSize)
    return () => window?.removeEventListener('resize', updateSize)
  }, [func, timeout])
}

export default useSize
