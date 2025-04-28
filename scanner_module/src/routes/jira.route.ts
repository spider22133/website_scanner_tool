import { Router } from 'express'
import Route from '@/interfaces/route.interface'
import { JiraApi } from '@/classes/api/AtlassianJiraApi'

class JiraRoute implements Route {
  public path = '/jira'
  public router = Router()
  private jira: JiraApi

  constructor() {
    this.jira = new JiraApi({
      baseUrl: process.env.JIRA_URL!,
      username: process.env.JIRA_USERNAME!,
      password: process.env.JIRA_SECRET!,
    })

    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/create-issue`, async (req, res) => {
      try {
        const payload = req.body
        const issue = await this.jira.createIssue(payload)
        res.status(201).json(issue)
      } catch (err: any) {
        console.error(err.response?.data || err.message)
        res.status(500).json({ error: 'Failed to create Jira issue' })
      }
    })

    this.router.get(`${this.path}/issue/:key`, async (req, res) => {
      try {
        const issue = await this.jira.getIssue(req.params.key)
        res.json(issue)
      } catch (err: any) {
        console.error(err.response?.data || err.message)
        res.status(500).json({ error: 'Failed to fetch issue' })
      }
    })

    this.router.get(`${this.path}/project/:id(\\d+)/components`, async (req, res) => {
      try {
        const issue = await this.jira.getProjectComponents(req.params.id)
        res.json(issue)
      } catch (err: any) {
        console.error(err.response?.data || err.message)
        res.status(500).json({ error: 'Failed to fetch projects' })
      }
    })
  }
}

export default JiraRoute
