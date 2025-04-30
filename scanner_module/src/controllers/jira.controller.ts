import { Request, Response, NextFunction } from 'express'
import { JiraApi } from '@/classes/api/AtlassianJiraApi'
import { SoftwareModel } from '@/models/software.model'
import { UserModel } from '@/models/user.model'
import { SoftwareVersionModel } from '@/models/software_version.model'
import { IssueModel } from '@/models/issue.model'
import { JiraIssueResponse } from '@/types/jira'

class JiraController {
  private jira: JiraApi

  constructor() {
    this.jira = new JiraApi({
      baseUrl: process.env.JIRA_URL!,
      username: process.env.JIRA_USERNAME!,
      password: process.env.JIRA_SECRET!,
    })
  }

  public createIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body
      console.log('payload', payload)

      const findSoftware: SoftwareModel = await SoftwareModel.findOne({
        where: { winget_id: payload.winget_id },
        include: [
          { model: UserModel, as: 'user' },
          { model: SoftwareVersionModel, as: 'versions' },
        ],
      })
      console.log('findSoftware', findSoftware)

      const latestSoftwareVersion = findSoftware.versions.find(({ version }) => findSoftware.version === version)

      console.log(latestSoftwareVersion.hasJiraIssue)

      if (latestSoftwareVersion.hasJiraIssue) return

      const template = {
        fields: {
          assignee: { name: findSoftware.user.userName },
          project: { id: process.env.JIRA_PROJECT_HELFI_ID },
          summary: `Aktualisierung von ${findSoftware.name} auf neue Version ${findSoftware.version} erforderlich`,
          description: `Dieses Ticket wurde automatisiert über die API erstellt.\n\nEin Update der Software "${findSoftware.name}" auf Version ${findSoftware.version} steht an.\n\nBitte prüfen, ob die Aktualisierung notwendig ist, und ggf. die Installation einplanen.`,
          issuetype: { id: process.env.JIRA_ISSUETYPE_AUFGABE_ID },
          priority: { id: payload.priority || '1' },
          labels: ['Software'],
          components: [{ id: process.env.JIRA_COMPONENT_CLIENTMANAGEMENT0_ID }],
        },
      }
      console.log('template', template)

      const newIssue: { id: string } = await this.jira.createIssue(template)
      console.log('newIssue', newIssue)
      if (newIssue.id) await latestSoftwareVersion.update({ hasJiraIssue: true })

      const issue: JiraIssueResponse = await this.jira.getIssue(newIssue.id)
      console.log('issue', issue)

      const newDBIssue = await IssueModel.create({
        priority: issue.fields.priority.id,
        user_id: findSoftware.user.id,
        software_id: findSoftware.id,
        jira_id: issue.id,
        jira_key: issue.key,
        resolutionName: issue.fields.resolution.name,
        resolutionDesc: issue.fields.resolution.description,
      })

      console.log('newDBIssue', newDBIssue)

      res.status(201).json(newDBIssue)
    } catch (error: any) {
      console.error(error.response?.data || error.message)
      res.status(500).json({ error: 'Failed to create Jira issue' })
    }
  }

  public getIssue = async (req: Request, res: Response) => {
    try {
      const issue = await this.jira.getIssue(req.params.key)
      res.json(issue)
    } catch (err: any) {
      console.error(err.response?.data || err.message)
      res.status(500).json({ error: 'Failed to fetch issue' })
    }
  }

  public getUserByName = async (req: Request, res: Response) => {
    try {
      const user = await this.jira.getUserByName(req.params.name)
      res.json(user)
    } catch (err: any) {
      console.error(err.response?.data || err.message)
      res.status(500).json({ error: 'Failed to fetch user' })
    }
  }

  public getProjectComponents = async (req: Request, res: Response) => {
    try {
      const components = await this.jira.getProjectComponents(req.params.id)
      res.json(components)
    } catch (err: any) {
      console.error(err.response?.data || err.message)
      res.status(500).json({ error: 'Failed to fetch project components' })
    }
  }

  public getIssueTypes = async (req: Request, res: Response) => {
    try {
      const types = await this.jira.getIssueTypes()
      res.json(types)
    } catch (err: any) {
      console.error(err.response?.data || err.message)
      res.status(500).json({ error: 'Failed to fetch issue types' })
    }
  }
}

export default JiraController
