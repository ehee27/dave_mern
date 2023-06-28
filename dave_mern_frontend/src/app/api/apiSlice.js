import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../../features/auth/authSlice'

const baseQuery = fetchBaseQuery({
  // baseUrl: 'http://localhost:3500',
  baseUrl: 'https://technotes-api.onrender.com',
  // set the 'include' keyword to include token
  credentials: 'include',
  // prep the payload headers and destructure 'getState'
  prepareHeaders: (headers, { getState }) => {
    // set the "AUTH state" with the Bearer's token
    const token = getState().auth.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})
// Token has expired - we're 'reAuth'ing' with a REFRESH TOKEN ---------------
// checking a "result" which is our request - if rejected with a 403...
// send another request (refreshResult) to the refresh endpoint for refresh TOKEN

const baseQueryWithReauth = async (args, api, extraOptions) => {
  // console.log('this is the args...', args) // request url, method, body
  // console.log('this is the api...', api) // signal, dispatch, getState()
  // console.log('this is the extraOptions...', extraOptions) // custom like {shout: ture}

  let result = await baseQuery(args, api, extraOptions)

  // if '403 FORBIDDEN' ... send refresh token with all this logic --------
  if (result?.error?.status === 403) {
    console.log('sending refresh token')

    // send the "refresh" endpoint to get NEW ACCESS TOKEN ------------------------
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

    // the '.data' holds the NEW token ------------------------------------------------
    if (refreshResult?.data) {
      //store the new token ------------ SPREADING CREDENTIALS AND TOKEN --------
      api.dispatch(setCredentials({ ...refreshResult.data }))

      // retry original query - NOW WITH REFRESH TOKEN ---------------------------------
      result = await baseQuery(args, api, extraOptions)
    } else {
      if (refreshResult?.error?.status === 403) {
        refreshResult.error.data.message = 'Your login has expired.'
      }
      return refreshResult
    }
  }
  return result
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Note', 'User'],
  endpoints: builder => ({}),
})
