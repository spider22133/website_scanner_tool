import { createSlice } from '@reduxjs/toolkit'
import { createIssue, getJiraIssues } from '../thunks/issues.thunk'
import { IssueAttributes } from '../../../../types/common'

const initialState = {
  softwareIssues: {} as Record<string, IssueAttributes[]>,
  createIssueLoading: false,
  loading: false,
}

const issuesSlice = createSlice({
  name: 'issues',
  initialState,
  reducers: {
    //
  },
  extraReducers: builder => {
    builder
      .addCase(createIssue.pending, (state, {}) => {
        state.createIssueLoading = true
      })
      .addCase(createIssue.fulfilled, (state, { payload }) => {
        state.createIssueLoading = false
        console.log(payload)

        if (!payload || !payload.software_id) return

        // Initialize the array if it doesn't exist
        if (!state.softwareIssues[payload.software_id]) {
          state.softwareIssues[payload.software_id] = []
        }

        // Add the new issue to the list
        state.softwareIssues[payload.software_id].unshift(payload)
      })
      .addCase(createIssue.rejected, state => {
        state.createIssueLoading = false
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

const { reducer, actions } = issuesSlice

// export const { updateSoftwareFilteredList } = actions

export default reducer
