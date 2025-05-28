import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { WingetPackageDetails, SoftwareEntry, IRepresentative } from '../../../../types/common'
import {
  fetchAllSoftware,
  updateSoftware,
  checkSoftware,
  queryWinGetSoftware,
  createSoftware,
  deleteSoftware,
  fetchSoftwareUsers,
  updateSoftwareUsers,
  uploadSoftwareIcon,
} from '../thunks/software.thunk'
import { SoftwareUser } from '../../interfaces/common'

const initialState = {
  softwareSearchList: [] as SoftwareEntry[],
  softwareFilteredList: [] as SoftwareEntry[],
  software: [] as SoftwareEntry[],
  softwareUsers: [] as IRepresentative[],
  loading: false,
  createSoftwareLoading: false,
}

const softwareSlice = createSlice({
  name: 'software',
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
      .addCase(fetchAllSoftware.pending, (state, {}) => {
        state.loading = true
      })
      .addCase(fetchAllSoftware.fulfilled, (state, { payload }) => {
        state.software = payload.map(item => ({
          ...item,
          details: item.details ? (JSON.parse(item.details.toString()) as WingetPackageDetails) : undefined,
        }))
        state.loading = false
      })
      .addCase(fetchAllSoftware.rejected, state => {
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
          details: payload.details ? (JSON.parse(payload.details.toString()) as WingetPackageDetails) : undefined,
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
            details: payload.details ? (JSON.parse(payload.details.toString()) as WingetPackageDetails) : undefined,
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
          details: payload.details ? (JSON.parse(payload.details.toString()) as WingetPackageDetails) : undefined,
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
      .addCase(fetchSoftwareUsers.pending, state => {
        state.loading = true
      })
      .addCase(fetchSoftwareUsers.fulfilled, (state, action: PayloadAction<IRepresentative[]>) => {
        state.softwareUsers = action.payload
        state.loading = false
      })
      .addCase(fetchSoftwareUsers.rejected, state => {
        state.loading = false
      })

      // Update representatives
      .addCase(updateSoftwareUsers.pending, state => {
        state.loading = true
      })
      .addCase(updateSoftwareUsers.fulfilled, state => {
        state.loading = false
      })
      .addCase(updateSoftwareUsers.rejected, state => {
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
            details: payload.details ? (JSON.parse(payload.details.toString()) as WingetPackageDetails) : undefined,
          }
        }
      })
      .addCase(uploadSoftwareIcon.rejected, (state, { payload }) => {
        state.loading = false
      })
  },
})

const { reducer, actions } = softwareSlice

export const { updateSoftwareFilteredList } = actions

export default reducer
