import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { WingetPackageDetails, SoftwareEntry } from '../../../types/common'
import WebsiteDataService from '../services/website.service'
import { AxiosError } from 'axios'
import { setMessage } from './message.slice'
import httpErrors from '../interfaces/api.error.interface'

const initialState = {
  softwareSearchList: [] as SoftwareEntry[],
  softwareFilteredList: [] as SoftwareEntry[],
  software: [] as SoftwareEntry[],
  loading: false,
  createSoftwareLoading: false,
}

type setErrorType = {
  data: SoftwareEntry
  id: string
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
    const res = await WebsiteDataService.createSoftware(data)
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
    const response = await WebsiteDataService.update(data)
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
    const res = await WebsiteDataService.checkStatus(id)
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
    const res = await WebsiteDataService.getAll()
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

export const deleteWebsite = createAsyncThunk<
  { id: string },
  { id: string },
  {
    rejectValue: httpErrors
  }
>('websites/delete', async ({ id }, { rejectWithValue, dispatch }) => {
  try {
    await WebsiteDataService.deleteWebsite(id)
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
    const res = await WebsiteDataService.searchWithWinGet(query)
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
    // Create website
    // builder.addCase(createWebsite.pending, (state, {}) => {
    //   state.loading = true
    // })
    // builder.addCase(createWebsite.fulfilled, (state, { payload }) => {
    //   state.loading = false
    //   state.software.push(payload)
    // })
    // builder.addCase(createWebsite.rejected, state => {
    //   state.loading = false
    // })

    // Retrieve websites
    builder.addCase(retrieveWebsites.pending, (state, {}) => {
      state.loading = true
    })
    builder.addCase(retrieveWebsites.fulfilled, (state, { payload }) => {
      state.software = payload.map(item => ({
        ...item,
        details: JSON.parse(item.details as string) as WingetPackageDetails,
      }))
      state.loading = false
    })
    builder.addCase(retrieveWebsites.rejected, state => {
      state.loading = false
    })

    // Update software
    builder.addCase(updateSoftware.pending, (state, {}) => {
      state.loading = true
    })
    builder.addCase(updateSoftware.fulfilled, (state, { payload }) => {
      const index = state.software.findIndex(item => item.winget_id === payload.winget_id)
      console.log(payload)

      state.loading = false
      state.software[index] = {
        ...state.software[index],
        ...payload,
        details: JSON.parse(payload.details as string) as WingetPackageDetails,
      }
    })
    builder.addCase(updateSoftware.rejected, state => {
      state.loading = false
    })

    // Check software
    builder.addCase(checkSoftware.pending, (state, {}) => {
      state.loading = true
    })
    builder.addCase(checkSoftware.fulfilled, (state, { payload }) => {
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
    builder.addCase(checkSoftware.rejected, state => {
      state.loading = false
    })

    // Search in websites
    // builder.addCase(queryWebsites.pending, (state, {}) => {
    //   state.loading = true
    // })
    // builder.addCase(queryWebsites.fulfilled, (state, { payload }) => {
    //   state.loading = false
    //   state.websites = payload
    // })
    // builder.addCase(queryWebsites.rejected, state => {
    //   state.loading = false
    // })

    // Search in WinGet software repository
    builder.addCase(queryWinGetSoftware.pending, (state, {}) => {
      state.loading = true
    })
    builder.addCase(queryWinGetSoftware.fulfilled, (state, { payload }) => {
      state.softwareSearchList = payload.filter((item, index, self) => index === self.findIndex(t => t.winget_id === item.winget_id))
      state.loading = false
    })
    builder.addCase(queryWinGetSoftware.rejected, state => {
      state.loading = false
    })

    builder.addCase(createSoftware.pending, (state, {}) => {
      state.createSoftwareLoading = true
    })
    builder.addCase(createSoftware.fulfilled, (state, { payload }) => {
      state.software.unshift({
        ...payload,
        details: JSON.parse(payload.details as string) as WingetPackageDetails,
      })
      state.createSoftwareLoading = false
    })
    builder.addCase(createSoftware.rejected, state => {
      state.createSoftwareLoading = false
    })

    // Delete website
    builder.addCase(deleteWebsite.fulfilled, (state, { payload }) => {
      state.software = state.software.filter(item => item.winget_id !== payload.id)
    })
  },
})

const { reducer, actions } = websiteSlice

export const { updateSoftwareFilteredList } = actions

export default reducer
