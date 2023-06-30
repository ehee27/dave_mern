// this custom hook will pull in the token and set some variables
// decode the token OBJECT
// destructure the username and roles
// check to see if the roles array 'includes' Manager and/or Admin
// if roles exist, assign them to our variables
// return all this in our auth object that we can call in components

import { useSelector } from 'react-redux'
import { selectCurrentToken } from '../features/auth/authSlice'
import jwtDecode from 'jwt-decode'

const useAuth = () => {
  // pull in the token and set some variables
  const token = useSelector(selectCurrentToken)
  let isManager = false
  let isAdmin = false
  let status = 'Employee'

  if (token) {
    // decode the token OBJECT
    // destructure the username and roles
    const decoded = jwtDecode(token)
    const { username, roles } = decoded.UserInfo

    // check to see if the roles array 'includes' Manager and/or Admin
    isManager = roles.includes('Manager')
    isAdmin = roles.includes('Admin')

    // if roles exist, assign them to our variables
    if (isManager) status = 'Manager'
    if (isAdmin) status = 'Admin'

    return { username, roles, status, isManager, isAdmin }
  }
  // return all this in our auth object that we can call in components
  return { username: '', roles: [], isManager, isAdmin, status }
}

export default useAuth
