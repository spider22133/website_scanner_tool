import { Router } from 'express'
import Route from '@/interfaces/route.interface'
import JiraController from '@controllers/jira.controller'
import authMiddleware from '@/middlewares/auth.middleware'

class JiraRoute implements Route {
  public path = '/jira'
  public router = Router()
  public jiraController = new JiraController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    // Software Jira Issues
    this.router.get(`${this.path}/software/:id/issues`, authMiddleware, this.jiraController.getSoftwareJiraIssues)
    this.router.get(`${this.path}/issue/:key`, authMiddleware, this.jiraController.getIssue)
    this.router.get(`${this.path}/user/:name`, authMiddleware, this.jiraController.getUserByName)
    this.router.get(`${this.path}/project/:id(\\d+)/components`, this.jiraController.getProjectComponents)
    this.router.get(`${this.path}/issue-types`, this.jiraController.getIssueTypes)

    this.router.post(`${this.path}/create-issue`, authMiddleware, this.jiraController.createIssue)
    this.router.put(`${this.path}/update-issue`, this.jiraController.updateIssue)
  }
}

export default JiraRoute
