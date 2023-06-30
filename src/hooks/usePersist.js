import { useState, useEffect } from 'react'

const usePersist = () => {
  // persist is define by grabbing the 'persist' from local storage
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem('persist')) || false
  )

  useEffect(() => {
    localStorage.setItem('persist', JSON.stringify(persist))
  }, [persist])

  return [persist, setPersist]
}

export default usePersist
