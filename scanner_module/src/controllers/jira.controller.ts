import { IssueModel } from '@/models/issue.model'
import { SoftwareModel } from '@/models/software.model'
import { SoftwareVersionModel } from '@/models/software_version.model'
import { UserModel } from '@/models/user.model'
import { JiraIssueService } from '@/services/jira.service'
import SoftwareService from '@/services/software.service'
import { NextFunction, Request, Response } from 'express'

class JiraController {
  private service = new JiraIssueService()
  public softwareService = new SoftwareService()

  public getSoftwareJiraIssues = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const websiteId = req.params.id
      const findOne: SoftwareModel = await this.softwareService.findSoftwareById(websiteId)

      if (req.query.reload) {
        await this.service.reloadJiraIssuesForSoftware(findOne)
      }

      const issues: IssueModel[] = await findOne.getIssues()

      res.status(200).json({ data: issues, message: 'findAll' })
    } catch (error) {
      next(error)
    }
  }

  public createIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body
      const software = await SoftwareModel.findOne({
        where: { winget_id: payload.winget_id },
        include: [{ model: SoftwareVersionModel, as: 'versions' }],
      })

      if (!software) {
        res.status(404).json({ error: 'Software not found' })
        return
      }

      const dbIssue = await this.service.createJiraIssueForSoftware(software, payload.priority || '3')
      res.status(201).json({ data: dbIssue })
    } catch (err: any) {
      console.error('[JiraController Error]', err.message)
      res.status(500).json({ error: 'Failed to create Jira issue', message: err.message })
    }
  }

  public updateIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body
      const software = await SoftwareModel.findOne({
        where: { winget_id: payload.winget_id },
        include: [
          { model: UserModel, as: 'user' },
          { model: SoftwareVersionModel, as: 'versions' },
        ],
      })

      if (!software) {
        res.status(404).json({ error: 'Software not found' })
        return
      }

      const dbIssue = await this.service.updateJiraIssueForSoftware(software, payload.priority || '3', payload.issue_id)
      res.status(201).json(dbIssue)
    } catch (err: any) {
      console.error('[JiraController Error]', err.message)
      res.status(500).json({ error: 'Failed to create Jira issue', message: err.message })
    }
  }

  public getIssue = async (req: Request, res: Response) => {
    try {
      const issue = await this.service.getIssue(req.params.key)
      res.json(issue)
    } catch (err: any) {
      console.error(err.message)
      res.status(500).json({ error: 'Failed to fetch issue' })
    }
  }

  public getUserByName = async (req: Request, res: Response) => {
    try {
      const user = await this.service.getUserByName(req.params.name)
      res.json(user)
    } catch (err: any) {
      console.error(err.message)
      res.status(500).json({ error: 'Failed to fetch user' })
    }
  }

  public getProjectComponents = async (req: Request, res: Response) => {
    try {
      const components = await this.service.getProjectComponents(req.params.id)
      res.json(components)
    } catch (err: any) {
      console.error(err.message)
      res.status(500).json({ error: 'Failed to fetch project components' })
    }
  }

  public getIssueTypes = async (req: Request, res: Response) => {
    try {
      const types = await this.service.getIssueTypes()
      res.json(types)
    } catch (err: any) {
      console.error(err.message)
      res.status(500).json({ error: 'Failed to fetch issue types' })
    }
  }
}

export default JiraController
