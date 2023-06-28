import { Outlet, Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useRefreshMutation } from './authApiSlice'
import usePersist from '../../hooks/usePersist'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from './authSlice'
import PulseLoader from 'react-spinners/PulseLoader'

const PersistLogin = () => {
  const [persist] = usePersist()
  const token = useSelector(selectCurrentToken)
  const effectRan = useRef(false)

  const [trueSuccess, setTrueSuccess] = useState(false)

  const [refresh, { isUninitialized, isSuccess, isLoading, isError, error }] =
    useRefreshMutation()

  // React 18 strictMode useEffect() - MOUNTS component, UNMOUNTS, AND MOUNTS AGAIN
  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
      const verifyRefreshToken = async () => {
        console.log('verifying refresh token')
        try {
          // const response =
          await refresh()
          // const {accessToken} = response.data
          setTrueSuccess(true)
        } catch (err) {
          console.log(err)
        }
      }
      if (!token && persist) verifyRefreshToken()
    }
    return () => (effectRan.current = true)
    // eslint-disable-next-line
  }, [])
  // -----------------------------------------------------------------------------

  let content
  if (!persist) {
    console.log('no persist')
    content = <Outlet />
    //
  } else if (isLoading) {
    console.log('loading')
    content = <PulseLoader color={'#FFF'} />
    //
  } else if (isError) {
    console.log('error')
    content = (
      <p className="errmsg">
        {`${error?.data?.message} - `}
        <Link to="/login">Please login again</Link>.
      </p>
    )
    //
  } else if (isSuccess && trueSuccess) {
    console.log('success')
    content = <Outlet />
    //
  } else if (token && isUninitialized) {
    console.log("token but haven't yet initialized refresh with new token...")
    console.log(isUninitialized)
    content = <Outlet />
  }

  return content
}

export default PersistLogin
