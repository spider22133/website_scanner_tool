import { SoftwareModel } from '@/models/software.model'
import { SoftwareVersionModel } from '@/models/software_version.model'
import { UserModel } from '@/models/user.model'
import { JiraIssueService } from '@/services/jira.service'
import { Request, Response } from 'express'

class JiraController {
  private service = new JiraIssueService()

  public createIssue = async (req: Request, res: Response) => {
    try {
      const payload = req.body
      const software = await SoftwareModel.findOne({
        where: { winget_id: payload.winget_id },
        include: [
          { model: UserModel, as: 'user' },
          { model: SoftwareVersionModel, as: 'versions' },
        ],
      })

      if (!software) return res.status(404).json({ error: 'Software not found' })

      const dbIssue = await this.service.createJiraIssueForSoftware(software, payload.priority || '3')
      res.status(201).json(dbIssue)
    } catch (err: any) {
      console.error('[JiraController Error]', err.message)
      res.status(500).json({ error: 'Failed to create Jira issue', message: err.message })
    }
  }

  public updateIssue = async (req: Request, res: Response) => {
    try {
      const payload = req.body
      const software = await SoftwareModel.findOne({
        where: { winget_id: payload.winget_id },
        include: [
          { model: UserModel, as: 'user' },
          { model: SoftwareVersionModel, as: 'versions' },
        ],
      })

      if (!software) return res.status(404).json({ error: 'Software not found' })

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
