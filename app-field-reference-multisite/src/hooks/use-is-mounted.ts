import { useEffect, useState } from 'react'

export const useIsMounted = () => {
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    if (!isMounted) setIsMounted(true)
    return () => {
      setIsMounted(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return isMounted
}
