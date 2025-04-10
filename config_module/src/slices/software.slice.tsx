import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { WingetPackageDetails, SoftwareEntry, IRepresentative } from '../../../types/common'
import SoftwareDataService from '../services/software.service'
import { AxiosError } from 'axios'
import { setMessage } from './message.slice'
import httpErrors from '../interfaces/api.error.interface'

const initialState = {
  softwareSearchList: [] as SoftwareEntry[],
  softwareFilteredList: [] as SoftwareEntry[],
  software: [] as SoftwareEntry[],
  representatives: [] as IRepresentative[],
  loading: false,
  createSoftwareLoading: false,
}

// export const createWebsite = createAsyncThunk<
//   WinGetSoftwareEntry,
//   setErrorType,
//   {
//     rejectValue: httpErrors
//   }
// >('websites/create', async ({ data, id }, { rejectWithValue, dispatch }) => {
//   try {
//     const res = await WebsiteDataService.create({ name: data.name, url: data.url })
//     return res.data.data
//   } catch (err: any) {
//     const error: AxiosError<httpErrors> = err
//     if (!error.response) {
//       throw err
//     }
//     dispatch(setMessage({ id, message: error.response.data.message }))
//     return rejectWithValue(error.response.data)
//   }
// })

export const createSoftware = createAsyncThunk<
  SoftwareEntry,
  SoftwareEntry,
  {
    rejectValue: httpErrors
  }
>('software/create', async (data, { rejectWithValue, dispatch }) => {
  try {
    const res = await SoftwareDataService.createSoftware(data)
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

export const retrieveWebsites = createAsyncThunk<
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

/*export const queryWebsites = createAsyncThunk<
  IWebsite[],
  string,
  {
    rejectValue: httpErrors
  }
>('websites/query', async (query, { rejectWithValue, dispatch }) => {
  try {
    const res = await WebsiteDataService.searchInWebsites(query)
    return res.data.data
  } catch (err: any) {
    const error: AxiosError<httpErrors> = err
    if (!error.response) {
      throw err
    }
    dispatch(setMessage(error.response.data.message))
    return rejectWithValue(error.response.data)
  }
})*/

export const deleteSoftware = createAsyncThunk<
  { id: string },
  { id: string },
  {
    rejectValue: httpErrors
  }
>('websites/delete', async ({ id }, { rejectWithValue, dispatch }) => {
  try {
    await SoftwareDataService.deleteWebsite(id)
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

export const queryWinGetSoftware = createAsyncThunk<
  SoftwareEntry[],
  string,
  {
    rejectValue: httpErrors
  }
>('software/query', async (query, { rejectWithValue, dispatch }) => {
  try {
    const res = await SoftwareDataService.searchWithWinGet(query)
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

export const fetchSoftwareRepresentatives = createAsyncThunk('softwareRepresentatives/fetch', async (id: string, { rejectWithValue }) => {
  try {
    const response = await SoftwareDataService.getSoftwareRepresentatives(id)
    return response.data.data
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})

// Async thunk to set software representatives
export const updateSoftwareRepresentatives = createAsyncThunk(
  'softwareRepresentatives/update',
  async ({ id, data }: { id: string; data: number[] }, { rejectWithValue }) => {
    try {
      await SoftwareDataService.setSoftwareRepresentatives(id, data)
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
      const response = await SoftwareDataService.updateSoftwareIcon(id, formData)
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

const websiteSlice = createSlice({
  name: 'website',
  initialState,
  reducers: {
    updateSoftwareFilteredList: (state, { payload }: PayloadAction<SoftwareEntry[]>) => {
      state.softwareFilteredList = []
      state.softwareFilteredList.push(...payload)
    },
  },
  extraReducers: builder => {
    // Retrieve websites
    builder
      .addCase(retrieveWebsites.pending, (state, {}) => {
        state.loading = true
      })
      .addCase(retrieveWebsites.fulfilled, (state, { payload }) => {
        state.software = payload.map(item => ({
          ...item,
          details: JSON.parse(item.details as string) as WingetPackageDetails,
        }))
        state.loading = false
      })
      .addCase(retrieveWebsites.rejected, state => {
        state.loading = false
      })

      // Update software
      .addCase(updateSoftware.pending, (state, {}) => {
        state.loading = true
      })
      .addCase(updateSoftware.fulfilled, (state, { payload }) => {
        const index = state.software.findIndex(item => item.winget_id === payload.winget_id)

        state.loading = false
        state.software[index] = {
          ...state.software[index],
          ...payload,
          details: JSON.parse(payload.details as string) as WingetPackageDetails,
        }
      })
      .addCase(updateSoftware.rejected, state => {
        state.loading = false
      })

      // Check software
      .addCase(checkSoftware.pending, (state, {}) => {
        state.loading = true
      })
      .addCase(checkSoftware.fulfilled, (state, { payload }) => {
        if (payload) {
          const index = state.software.findIndex(item => item.winget_id === payload.winget_id)

          state.loading = false
          state.software[index] = {
            ...state.software[index],
            ...payload,
            details: JSON.parse(payload.details as string) as WingetPackageDetails,
          }
        }
      })
      .addCase(checkSoftware.rejected, state => {
        state.loading = false
      })

      // Search in WinGet software repository
      .addCase(queryWinGetSoftware.pending, (state, {}) => {
        state.loading = true
      })
      .addCase(queryWinGetSoftware.fulfilled, (state, { payload }) => {
        state.softwareSearchList = payload.filter((item, index, self) => index === self.findIndex(t => t.winget_id === item.winget_id))
        state.loading = false
      })
      .addCase(queryWinGetSoftware.rejected, state => {
        state.loading = false
      })

      .addCase(createSoftware.pending, (state, {}) => {
        state.createSoftwareLoading = true
      })
      .addCase(createSoftware.fulfilled, (state, { payload }) => {
        state.software.unshift({
          ...payload,
          details: JSON.parse(payload.details as string) as WingetPackageDetails,
        })
        state.createSoftwareLoading = false
      })
      .addCase(createSoftware.rejected, state => {
        state.createSoftwareLoading = false
      })

      // Delete website

      .addCase(deleteSoftware.fulfilled, (state, { payload }) => {
        state.software = state.software.filter(item => item.winget_id !== payload.id)
      })

      // Fetch representatives
      .addCase(fetchSoftwareRepresentatives.pending, state => {
        state.loading = true
      })
      .addCase(fetchSoftwareRepresentatives.fulfilled, (state, action: PayloadAction<IRepresentative[]>) => {
        state.representatives = action.payload
        state.loading = false
      })
      .addCase(fetchSoftwareRepresentatives.rejected, state => {
        state.loading = false
      })

      // Update representatives
      .addCase(updateSoftwareRepresentatives.pending, state => {
        state.loading = true
      })
      .addCase(updateSoftwareRepresentatives.fulfilled, state => {
        state.loading = false
      })
      .addCase(updateSoftwareRepresentatives.rejected, state => {
        state.loading = false
      })

      // Update icon data
      .addCase(uploadSoftwareIcon.pending, state => {
        state.loading = true
      })
      .addCase(uploadSoftwareIcon.fulfilled, (state, { payload }) => {
        const index = state.software.findIndex(item => item.winget_id === payload.winget_id)

        state.loading = false
        if (index !== -1) {
          state.software[index] = {
            ...state.software[index],
            ...payload,
            details: JSON.parse(payload.details as string) as WingetPackageDetails,
          }
        }
      })
      .addCase(uploadSoftwareIcon.rejected, (state, { payload }) => {
        state.loading = false
      })
  },
})

const { reducer, actions } = websiteSlice

export const { updateSoftwareFilteredList } = actions

export default reducer
