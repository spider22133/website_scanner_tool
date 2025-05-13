import { createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { IssueAttributes, SoftwareEntry } from '../../../../types/common'
import httpErrors from '../../interfaces/api.error.interface'
import SoftwareDataService from '../../services/software.service'
import { setMessage } from '../slices/message.slice'

export const fetchAllSoftware = createAsyncThunk<
  SoftwareEntry[],
  void,
  {
    rejectValue: httpErrors
  }
>('software/retrieve', async (_, { rejectWithValue, dispatch }) => {
  try {
    const res = await SoftwareDataService.getAll()
    return res.data.data
  } catch (err: any) {
    const error: AxiosError<httpErrors> = err
    if (!error.response) {
      throw err
    }
    dispatch(setMessage({ message: error.response.data.message }))
    return rejectWithValue(error.response.data)
  }
})

export const createSoftware = createAsyncThunk<
  SoftwareEntry,
  SoftwareEntry,
  {
    rejectValue: httpErrors
  }
>('software/create', async (data, { rejectWithValue, dispatch }) => {
  try {
    const res = await SoftwareDataService.create(data)
    return res.data.data
  } catch (err: any) {
    const error: AxiosError<httpErrors> = err
    if (!error.response) {
      throw err
    }
    dispatch(setMessage({ message: error.response.data.message }))
    return rejectWithValue(error.response.data)
  }
})

export const updateSoftware = createAsyncThunk<
  SoftwareEntry,
  SoftwareEntry,
  {
    rejectValue: httpErrors
  }
>('software/update', async (data, { rejectWithValue, dispatch }) => {
  try {
    const response = await SoftwareDataService.update(data)
    return response.data.data
  } catch (err: any) {
    const error: AxiosError<httpErrors> = err
    if (!error.response) {
      throw err
    }

    dispatch(setMessage({ id: data.winget_id, message: error.response.data.message }))
    return rejectWithValue(error.response.data)
  }
})

export const deleteSoftware = createAsyncThunk<
  { id: string },
  { id: string },
  {
    rejectValue: httpErrors
  }
>('websites/delete', async ({ id }, { rejectWithValue, dispatch }) => {
  try {
    await SoftwareDataService.delete(id)
    return { id }
  } catch (err: any) {
    const error: AxiosError<httpErrors> = err
    if (!error.response) {
      throw err
    }
    dispatch(setMessage({ message: error.response.data.message }))
    return rejectWithValue(error.response.data)
  }
})

export const checkSoftware = createAsyncThunk<
  SoftwareEntry | void, // Can return SoftwareEntry or void
  string,
  {
    rejectValue: httpErrors
  }
>('software/check', async (id, { rejectWithValue, dispatch }) => {
  try {
    const res = await SoftwareDataService.checkStatus(id)
    const { software, message } = res.data

    if (software) {
      return software // Return software if it exists
    }

    if (message) {
      dispatch(setMessage({ id, message, variant: 'error' }))
      return
    }

    return
  } catch (err: any) {
    const error: AxiosError<httpErrors> = err
    if (!error.response) {
      throw err
    }
    dispatch(setMessage({ message: error.response.data.message }))
    return rejectWithValue(error.response.data)
  }
})

export const queryWinGetSoftware = createAsyncThunk<
  SoftwareEntry[],
  string,
  {
    rejectValue: httpErrors
  }
>('software/query', async (query, { rejectWithValue, dispatch }) => {
  try {
    const res = await SoftwareDataService.searchWithWinget(query)
    return res.data.data
  } catch (err: any) {
    const error: AxiosError<httpErrors> = err
    if (!error.response) {
      throw err
    }
    dispatch(setMessage({ message: error.response.data.message }))
    return rejectWithValue(error.response.data)
  }
})

export const fetchSoftwareUsers = createAsyncThunk('softwareUsers/fetch', async (id: string, { rejectWithValue }) => {
  try {
    const response = await SoftwareDataService.getUsers(id)
    return response.data.data
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})

// Async thunk to set software representatives
export const updateSoftwareUsers = createAsyncThunk(
  'softwareUsers/update',
  async ({ id, data }: { id: string; data: number[] }, { rejectWithValue }) => {
    try {
      await SoftwareDataService.setUsers(id, data)
      return data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  },
)

export const uploadSoftwareIcon = createAsyncThunk<SoftwareEntry, { id: string; formData: FormData }, { rejectValue: httpErrors }>(
  'software/uploadIcon',
  async ({ id, formData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await SoftwareDataService.updateIcon(id, formData)
      return response.data.data
    } catch (err: any) {
      const error: AxiosError<httpErrors> = err
      if (!error.response) {
        throw err
      }

      dispatch(
        setMessage({
          id: id,
          message: error.response.data.message,
        }),
      )
      return rejectWithValue(error.response.data)
    }
  },
)
