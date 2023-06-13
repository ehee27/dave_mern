import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';

const notesAdapter = createEntityAdapter({
  // list them in order
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
});

const initialState = notesAdapter.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    //--------------------------- GET ALL ----------------------------------

    getNotes: builder.query({
      query: () => '/notes',
      // CHECK THAT STATUS HAS SUCCEEDED '200' AND NO ERROR
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      // we TRANSFORM the ID specifcally from 'id' to our mongo format..., '_id'
      // we then set the state to our loadedNotes
      // keepUnusedDataFor: 5,
      transformResponse: responseData => {
        const loadedNotes = responseData.map(note => {
          note.id = note._id;
          return note;
        });
        return notesAdapter.setAll(initialState, loadedNotes);
      },
      providesTags: (result, error, arg) => {
        // optional chaining to check if id's exist
        if (result?.ids) {
          return [
            { type: 'Note', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'Note', id })),
          ];
        } else return [{ type: 'Note', id: 'LIST' }];
      },
    }),

    //--------------------------- ADD NEW ----------------------------------

    addNewNote: builder.mutation({
      query: initialState => ({
        url: '/notes',
        method: 'POST',
        body: {
          ...initialState,
        },
      }),
      invalidateTags: [{ type: 'Note', id: 'LIST' }],
    }),

    //--------------------------- UPDATE ----------------------------------

    updateNote: builder.mutation({
      query: initialNote => ({
        url: '/notes',
        method: 'PATCH',
        body: {
          ...initialNote,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Note', id: arg.id }],
    }),

    //--------------------------- DELETE ----------------------------------

    deleteNote: builder.mutation({
      query: ({ id }) => ({
        url: '/notes',
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Note', id: arg.id }],
    }),
  }),
});

// auto-generates our hooks with 'use' and 'query'
export const {
  useGetNotesQuery,
  useAddNewNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApiSlice;

// returns the query result object - 'select' the query result
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select();

// creates memoized selector
const selectNotesData = createSelector(
  selectNotesResult,
  notesResult => notesResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds,
  // Pass in a selector that returns the notes slice of state
} = notesAdapter.getSelectors(state => selectNotesData(state) ?? initialState);
