import { SoftwareModel } from '@/models/software.model'
import { JiraApi } from '@/classes/api/AtlassianJiraApi'
import { IssueModel } from '@/models/issue.model'
import { SoftwareVersionModel } from '@/models/software_version.model'

export class JiraIssueService {
  private jira: JiraApi

  constructor() {
    this.jira = new JiraApi({
      baseUrl: process.env.JIRA_URL!,
      username: process.env.JIRA_USERNAME!,
      password: process.env.JIRA_SECRET!,
    })
  }

  private createIssueTemplate(software: SoftwareModel, assignee: string, priority: string) {
    return {
      fields: {
        // assignee: { name: assignee }, TODO: Roberts Meinung?
        project: { id: process.env.JIRA_PROJECT_HELFI_ID },
        summary: `${software.name} ${software.version} Release-Update`,
        description: `Ein Update der Software *${software.name}* auf Version *${software.version}* steht an.
Bitte prüfen Sie, ob die Aktualisierung notwendig ist, und planen Sie gegebenenfalls das Rollout ein.

Link zum Versionskontroll-Dashboard:
[Direktlink zum Produkt mit Downloadlink]

*Produkt Hauptverantwortlicher:* [~${software.user.userName}]
Dieses Ticket wurde automatisiert über das Versionskontroll-Dashboard erstellt.`,
        issuetype: { id: process.env.JIRA_ISSUETYPE_AUFGABE_ID },
        priority: { id: priority },
        labels: ['Baramundi-Paketbau'],
        components: [{ id: process.env.JIRA_COMPONENT_CLIENTMANAGEMENT0_ID }],
      },
    }
  }

  public async createJiraIssueForSoftware(software: SoftwareModel, priority: string) {
    const currentVersion = software.versions.find((v: SoftwareVersionModel) => v.version === software.version)
    if (!currentVersion) throw new Error('Software version not found')
    if (currentVersion.hasJiraIssue) throw new Error('Issue already exists')

    const template = this.createIssueTemplate(software, software.user.userName, priority)
    const issueResponse = await this.jira.createIssue(template)

    if (!issueResponse?.id) throw new Error('Jira API returned no issue ID')

    await currentVersion.update({ hasJiraIssue: true })
    await this.jira.addWatcher(issueResponse.id, software.user.userName)

    const issue = await this.jira.getIssue(issueResponse.id)
    const dbIssue = await IssueModel.create({
      priority: issue.fields.priority.id,
      user_id: software.user.id,
      software_id: software.id,
      jira_id: issue.id,
      jira_key: issue.key,
      resolutionName: issue.fields.resolution?.name || '',
      resolutionDesc: issue.fields.resolution?.description || '',
    })

    return dbIssue
  }

  public async updateJiraIssueForSoftware(software: SoftwareModel, priority: string, issueId: string) {
    const currentVersion = software.versions.find((v: SoftwareVersionModel) => v.version === software.version)
    if (!currentVersion) throw new Error('Software version not found')
    if (!currentVersion.hasJiraIssue) throw new Error('Issue does not exists')

    const template = this.createIssueTemplate(software, software.user.userName, priority)
    // await this.jira.updateIssue(issueId, template)
    const resolution = await this.jira.getResolutionById(issueId)
    await this.jira.addWatcher(issueId, software.user.userName)
    console.log(resolution)
    const issue = await this.jira.getIssue(issueId)
    console.log(issue)

    const dbIssue = await IssueModel.findOne({ where: { jira_key: issueId } })

    dbIssue?.update({
      resolutionName: resolution?.name || '',
      resolutionDesc: resolution?.description || '',
    })

    return dbIssue
  }

  public getIssue(key: string) {
    return this.jira.getIssue(key)
  }

  public getUserByName(name: string) {
    return this.jira.getUserByName(name)
  }

  public getProjectComponents(projectId: string) {
    return this.jira.getProjectComponents(projectId)
  }

  public getIssueTypes() {
    return this.jira.getIssueTypes()
  }
}
