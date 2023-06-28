import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './api/apiSlice'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import authReducer from '../features/auth/authSlice'

// the apiSlice we setup acts as our reducer - hence the [KEY]
// we add the middleware
export const store = configureStore({
  reducer: { [apiSlice.reducerPath]: apiSlice.reducer, auth: authReducer },
  //
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware),

  devTools: false,
})

setupListeners(store.dispatch)
