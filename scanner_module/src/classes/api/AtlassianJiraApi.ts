import { SoftwareModel } from '@/models/software.model'
import { BaseCurlApi, BaseCurlApiConfig } from '../abstract/BaseCurlApi'

export interface JiraIssuePayload {
  username: string
  software: SoftwareModel
  priority?: string
}

export class JiraApi extends BaseCurlApi {
  constructor(config: BaseCurlApiConfig) {
    super(config)
    this.baseUrl += '/rest/api/2'
  }

  public async createIssue(payload: JiraIssuePayload) {
    const issue = {
      fields: {
        assignee: { name: payload.username },
        project: { id: process.env.JIRA_PROJECT_HELFI_ID },
        summary: `Aktualisierung von ${payload.software.name} auf neue Version ${payload.software.version} erforderlich`,
        description: `Dieses Ticket wurde automatisiert über die API erstellt.\n\nEin Update der Software "${payload.software.name}" auf Version ${payload.software.version} steht an.\n\nBitte prüfen, ob die Aktualisierung notwendig ist, und ggf. die Installation einplanen.`,
        issuetype: { id: process.env.JIRA_ISSUETYPE_AUFGABE_ID },
        priority: { id: payload.priority || '1' },
        labels: ['Software'],
        components: [{ id: process.env.JIRA_COMPONENT_CLIENTMANAGEMENT0_ID }],
      },
    }

    return await this.sendRequest('/issue', 'POST', issue)
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
