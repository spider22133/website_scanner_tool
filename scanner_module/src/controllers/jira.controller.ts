import { Request, Response, NextFunction } from 'express'
import { JiraApi } from '@/classes/api/AtlassianJiraApi'

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
      const payload = {
        fields: {
          assignee: { name: req.body.username },
          project: { id: process.env.JIRA_PROJECT_HELFI_ID },
          summary: `Aktualisierung von ${req.body.software.name} auf neue Version ${req.body.software.version} erforderlich`,
          description: 'Created via API',
          issuetype: { id: process.env.JIRA_ISSUETYPE_AUFGABE_ID },
          priority: { id: req.body.priority || '1' },
          labels: ['Software'],
          components: [{ id: process.env.JIRA_COMPONENT_CLIENTMANAGEMENT0_ID }],
        },
      }

      const issue = await this.jira.createIssue(payload)
      res.status(201).json(issue)
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
