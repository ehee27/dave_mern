import { createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import { apiSlice } from '../../app/api/apiSlice'

const usersAdapter = createEntityAdapter({})

const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    //--------------------------- GET ALL ----------------------------------

    getUsers: builder.query({
      query: () => ({
        url: '/users',
        // CHECK THAT STATUS HAS SUCCEEDED '200' AND NO ERROR
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      // keepUnusedDataFor: 5,
      // we TRANSFORM the ID specifcally from 'id' to our mongo format..., '_id'
      // we then set the state to our loadedUsers
      transformResponse: responseData => {
        const loadedUsers = responseData.map(user => {
          user.id = user._id
          return user
        })
        return usersAdapter.setAll(initialState, loadedUsers)
      },
      providesTags: (result, error, arg) => {
        // optional chaining to check if id's exist
        if (result?.ids) {
          return [
            { type: 'User', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'User', id })),
          ]
        } else return [{ type: 'User', id: 'LIST' }]
      },
    }),

    //--------------------------- ADD NEW ----------------------------------

    addNewUser: builder.mutation({
      query: initialState => ({
        url: '/users',
        method: 'POST',
        body: {
          ...initialState,
        },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    //--------------------------- UPDATE ----------------------------------

    updateUser: builder.mutation({
      query: initialUserdata => ({
        url: '/users',
        method: 'PATCH',
        body: {
          ...initialUserdata,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }],
    }),

    //--------------------------- DELETE ----------------------------------

    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: '/users',
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }],
    }),
  }),
})

// auto-generates our hooks with 'use' and 'query'
export const {
  useGetUsersQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice

// 1. returns the query result object - 'select' the query result
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select()

// 2. creates memoized selector - access to entity tables and IDs - NOT EXPORTING HERE, just creating to use below to define our selectors
const selectUsersData = createSelector(
  selectUsersResult,
  usersResult => usersResult.data // normalized state object with ids & entities
)

// 3. getSelectors creates these selectors and we rename them with aliases using destructuring
// *** we're destructuring and renaming with aliases to use later in User components
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
  // Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState)

// selector functions examples
// selectIds returns the state.ids array
// selectEntities return the state.entities 'lookup table'
// selectById - takes in state and ID, returns matching entity or undefined
// these are MEMOIZED selectors and will come in handy for optimization
