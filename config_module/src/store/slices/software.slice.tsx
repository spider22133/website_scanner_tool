import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { WingetPackageDetails, SoftwareEntry, IRepresentative, IssueAttributes } from '../../../../types/common'
import {
  fetchAllSoftware,
  updateSoftware,
  checkSoftware,
  queryWinGetSoftware,
  createSoftware,
  deleteSoftware,
  fetchSoftwareRepresentatives,
  updateSoftwareRepresentatives,
  uploadSoftwareIcon,
  getJiraIssues,
} from '../thunks/software'

const initialState = {
  softwareSearchList: [] as SoftwareEntry[],
  softwareFilteredList: [] as SoftwareEntry[],
  software: [] as SoftwareEntry[],
  softwareIssues: {} as Record<string, IssueAttributes[]>,
  representatives: [] as IRepresentative[],
  loading: false,
  createSoftwareLoading: false,
}

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
      .addCase(fetchAllSoftware.pending, (state, {}) => {
        state.loading = true
      })
      .addCase(fetchAllSoftware.fulfilled, (state, { payload }) => {
        state.software = payload.map(item => ({
          ...item,
          details: JSON.parse(item.details as string) as WingetPackageDetails,
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

      // Get software jira issues
      .addCase(getJiraIssues.pending, (state, {}) => {
        state.loading = true
      })
      .addCase(getJiraIssues.fulfilled, (state, { payload }) => {
        if (payload && payload[0]) {
          const software_id = payload[0].software_id
          state.softwareIssues[software_id] = payload
        }

        state.loading = false
      })
      .addCase(getJiraIssues.rejected, state => {
        state.loading = false
      })
  },
})

const { reducer, actions } = websiteSlice

export const { updateSoftwareFilteredList } = actions

export default reducer
