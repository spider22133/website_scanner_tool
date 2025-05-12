import { BaseRequestApi, BaseCurlApiConfig } from '../abstract/BaseRequestApi'
import { JiraIssuePayload } from '@/types/jira'

export class JiraApi extends BaseRequestApi {
  constructor(config: BaseCurlApiConfig) {
    super(config)
    this.baseUrl += '/rest/api/2'
  }

  //
  // Issue Management
  //

  public async createIssue(payload: JiraIssuePayload) {
    return await this.sendRequest('/issue', 'POST', payload)
  }

  public async updateIssue(issueIdOrKey: string, payload: Partial<JiraIssuePayload>) {
    const result = await this.sendRequest(`/issue/${issueIdOrKey}`, 'PUT', payload)
    // Jira returns HTTP 204 with no body on success
    return result === null
  }

  public async getIssue(issueIdOrKey: string) {
    return await this.sendRequest(`/issue/${issueIdOrKey}`, 'GET')
  }

  public async searchIssues(jql: string, maxResults = 50) {
    const payload = { jql, maxResults }
    const result = await this.sendRequest('/search', 'POST', payload)
    return result?.issues || []
  }

  //
  // Project and Component Management
  //

  public async getProjects() {
    return await this.sendRequest('/project', 'GET')
  }

  public async getProjectComponents(projectKey: string) {
    return await this.sendRequest(`/project/${projectKey}/components`, 'GET')
  }

  //
  // User Management
  //

  public async getUserByName(userName: string) {
    return await this.sendRequest(`/user?username=${userName}`, 'GET')
  }

  //
  // Metadata
  //

  public async getIssueTypes() {
    return await this.sendRequest('/issuetype', 'GET')
  }

  public async getResolutions() {
    return await this.sendRequest('/resolution', 'GET')
  }

  public async getResolutionById(id: string | number) {
    return await this.sendRequest(`/resolution/${id}`, 'GET')
  }

  public async getPriorities() {
    return await this.sendRequest('/priority', 'GET')
  }

  public async getPriorityById(id: string | number) {
    return await this.sendRequest(`/priority/${id}`, 'GET')
  }

  public async addWatcher(issueKey: string, username: string) {
    await this.sendRequest(`/issue/${issueKey}/watchers`, 'POST', username)
  }
}
