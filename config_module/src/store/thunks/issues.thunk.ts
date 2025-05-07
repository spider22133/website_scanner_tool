import { createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { IssueAttributes } from '../../../../types/common'
import httpErrors from '../../interfaces/api.error.interface'
import { setMessage } from '../slices/message.slice'
import JiraDataService, { CreateIssuePayload, getIssuesPayload } from '../../services/jiraIssues.service'

export const createIssue = createAsyncThunk<
  IssueAttributes,
  CreateIssuePayload,
  {
    rejectValue: httpErrors
  }
>('issue/create', async (data, { rejectWithValue, dispatch }) => {
  try {
    const res = await JiraDataService.createIssue(data)
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

export const getJiraIssues = createAsyncThunk<
  IssueAttributes[],
  getIssuesPayload,
  {
    rejectValue: httpErrors
  }
>('software/issues', async ({ winget_id, reload = false }, { rejectWithValue, dispatch }) => {
  try {
    const res = await JiraDataService.getJiraSoftwareIssues({ winget_id, reload })
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
