import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { WingetPackageDetails, WinGetSoftwareEntry } from '../../../types/common'
import WebsiteDataService from '../services/website.service'
import { AxiosError } from 'axios'
import { setMessage } from './message.slice'
import httpErrors from '../interfaces/api.error.interface'

const initialState = {
  softwareSearchList: [] as WinGetSoftwareEntry[],
  software: [] as WinGetSoftwareEntry[],
  loading: false as boolean,
}

type setErrorType = {
  data: WinGetSoftwareEntry
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
  WinGetSoftwareEntry,
  WinGetSoftwareEntry,
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

export const updateWebsite = createAsyncThunk<
  WinGetSoftwareEntry,
  WinGetSoftwareEntry,
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

export const retrieveWebsites = createAsyncThunk<
  WinGetSoftwareEntry[],
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
    dispatch(setMessage(error.response.data.message))
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
    dispatch(setMessage(error.response.data.message))
    return rejectWithValue(error.response.data)
  }
})

export const queryWinGetSoftware = createAsyncThunk<
  WinGetSoftwareEntry[],
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
    dispatch(setMessage(error.response.data.message))
    return rejectWithValue(error.response.data)
  }
})

const websiteSlice = createSlice({
  name: 'website',
  initialState,
  reducers: {},
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

    // Update website
    builder.addCase(updateWebsite.pending, (state, {}) => {
      state.loading = true
    })
    builder.addCase(updateWebsite.fulfilled, (state, { payload }) => {
      const index = state.software.findIndex(item => item.winget_id === payload.winget_id)

      state.loading = false
      state.software[index] = {
        ...state.software[index],
        ...payload,
      }
    })
    builder.addCase(updateWebsite.rejected, state => {
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
      state.loading = true
    })
    builder.addCase(createSoftware.fulfilled, (state, { payload }) => {
      state.software.push({
        ...payload,
        details: JSON.parse(payload.details as string) as WingetPackageDetails,
      })
      state.loading = false
    })
    builder.addCase(createSoftware.rejected, state => {
      state.loading = false
    })

    // Delete website
    builder.addCase(deleteWebsite.fulfilled, (state, { payload }) => {
      state.software = state.software.filter(item => item.winget_id !== payload.id)
    })
  },
})

export default websiteSlice.reducer
