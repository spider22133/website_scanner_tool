import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { setMessage } from './message.slice'
import httpErrors from '../interfaces/api.error.interface'
import IUser from '../interfaces/user.interface'
import UserDataService from '../services/user.service'

const initialState: { users: IUser[]; loading: boolean; createUserLoading: boolean } = {
  users: [],
  loading: false,
  createUserLoading: false,
}

export const retrieveUsers = createAsyncThunk<IUser[], void, { rejectValue: httpErrors }>(
  'users/retrieve',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const res = await UserDataService.getAll()
      return res.data.data
    } catch (err) {
      const error = err as AxiosError<httpErrors>
      if (!error.response) throw err
      dispatch(setMessage({ message: error.response.data.message }))
      return rejectWithValue(error.response.data)
    }
  },
)

export const getUserById = createAsyncThunk<IUser, string, { rejectValue: httpErrors }>(
  'users/getById',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const res = await UserDataService.getUserById(id)
      return res.data
    } catch (err) {
      const error = err as AxiosError<httpErrors>
      if (!error.response) throw err
      dispatch(setMessage({ message: error.response.data.message }))
      return rejectWithValue(error.response.data)
    }
  },
)

export const createUser = createAsyncThunk<IUser, IUser, { rejectValue: httpErrors }>('users/create', async (data, { rejectWithValue, dispatch }) => {
  try {
    const res = await UserDataService.createUser(data)
    return res.data
  } catch (err) {
    const error = err as AxiosError<httpErrors>
    if (!error.response) throw err
    dispatch(setMessage({ message: error.response.data.message }))
    return rejectWithValue(error.response.data)
  }
})

export const deleteUser = createAsyncThunk<{ id: string }, string, { rejectValue: httpErrors }>(
  'users/delete',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await UserDataService.deleteUser(id)
      return { id }
    } catch (err) {
      const error = err as AxiosError<httpErrors>
      if (!error.response) throw err
      dispatch(setMessage({ message: error.response.data.message }))
      return rejectWithValue(error.response.data)
    }
  },
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(retrieveUsers.pending, state => {
      state.loading = true
    })
    builder.addCase(retrieveUsers.fulfilled, (state, { payload }) => {
      state.users = payload
      state.loading = false
    })
    builder.addCase(retrieveUsers.rejected, state => {
      state.loading = false
    })
    builder.addCase(getUserById.fulfilled, (state, { payload }) => {
      state.users = [payload]
    })
    builder.addCase(createUser.pending, state => {
      state.createUserLoading = true
    })
    builder.addCase(createUser.fulfilled, (state, { payload }) => {
      state.users.push(payload)
      state.createUserLoading = false
    })
    builder.addCase(createUser.rejected, state => {
      state.createUserLoading = false
    })
    builder.addCase(deleteUser.fulfilled, (state, { payload }) => {
      state.users = state.users.filter(user => user.id !== payload.id)
    })
  },
})

const { reducer } = userSlice
export default reducer
