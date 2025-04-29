import { Router } from 'express'
import Route from '@/interfaces/route.interface'
import JiraController from '@controllers/jira.controller'

class JiraRoute implements Route {
  public path = '/jira'
  public router = Router()
  public jiraController = new JiraController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/create-issue`, this.jiraController.createIssue)
    this.router.get(`${this.path}/issue/:key`, this.jiraController.getIssue)
    this.router.get(`${this.path}/user/:name`, this.jiraController.getUserByName)
    this.router.get(`${this.path}/project/:id(\\d+)/components`, this.jiraController.getProjectComponents)
    this.router.get(`${this.path}/issue-types`, this.jiraController.getIssueTypes)
  }
}

export default JiraRoute
