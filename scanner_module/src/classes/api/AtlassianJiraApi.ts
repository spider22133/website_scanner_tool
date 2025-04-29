import { BaseCurlApi, BaseCurlApiConfig } from '../abstract/BaseCurlApi'

export interface JiraIssuePayload {
  fields: Record<string, any>
}

export class JiraApi extends BaseCurlApi {
  constructor(config: BaseCurlApiConfig) {
    super(config)
    this.baseUrl += '/rest/api/2'
  }

  public async createIssue(payload: JiraIssuePayload) {
    return await this.sendRequest('/issue', 'POST', payload)
  }

  public async getIssue(issueKey: string) {
    return await this.sendRequest(`/issue/${issueKey}`, 'GET')
  }

  public async getIssueTypes() {
    return await this.sendRequest('/issuetype', 'GET')
  }

  public async getProjects() {
    return await this.sendRequest('/project', 'GET')
  }

  public async getProjectComponents(projectKey: string) {
    return await this.sendRequest(`/project/${projectKey}/components`, 'GET')
  }

  public async getUserByName(userName: string) {
    return await this.sendRequest(`/user?username=${userName}`)
  }

  public async updateIssue(issueKey: string, payload: Partial<JiraIssuePayload>) {
    const result = await this.sendRequest(`/issue/${issueKey}`, 'PUT', payload)
    // Jira returns no body and HTTP 204 on success, so we assume if no error -> success
    return result === null
  }

  public async deleteIssue(issueKey: string) {
    const result = await this.sendRequest(`/issue/${issueKey}`, 'DELETE')
    return result === null
  }

  public async searchIssues(jql: string, maxResults = 50) {
    const payload = { jql, maxResults }
    const result = await this.sendRequest('/search', 'POST', payload)
    return result?.issues || []
  }
}
