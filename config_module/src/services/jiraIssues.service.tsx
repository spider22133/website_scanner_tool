import http from '../http-connection'
import { PayloadAction } from '@reduxjs/toolkit'

export interface CreateIssuePayload {
  winget_id: string
  priority: string
  [key: string]: any
}

export interface UpdateIssuePayload {
  issue_id: string
  winget_id: string
  priority: string
  [key: string]: any
}

export interface getIssuesPayload {
  winget_id: string
  reload?: boolean
}

const JiraDataService = {
  getJiraSoftwareIssues: (payload: getIssuesPayload) => http.get(`/jira/software/${payload.winget_id}/issues?reload=${payload.reload}`),
  getIssue: (key: string) => http.get(`/jira/issue/${key}`),
  getUserByName: (name: string) => http.get(`/jira/user/${name}`),
  getProjectComponents: (projectId: number) => http.get(`/jira/project/${projectId}/components`),
  getIssueTypes: () => http.get('/jira/issue-types'),

  createIssue: (payload: CreateIssuePayload) => http.post('/jira/create-issue', payload),
  updateIssue: (payload: UpdateIssuePayload) => http.put('/jira/update-issue', payload),
}

export default JiraDataService
