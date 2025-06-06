export interface JiraResolution {
  id: string
  name: string
  description: string
  self: string
}

export interface JiraPriority {
  id: string
  name: string
  description: string
  self: string
  iconUrl: string
  statusColor: string
}

export interface JiraIssuePayload {
  fields: Record<string, any>
}

export interface JiraIssueResponse {
  id: string
  key: string
  self: string
  fields: JiraIssueFields
}

export interface JiraIssueFields {
  watcher: {
    isWatching: boolean
    self: string
    watchCount: number
  }
  attachment: JiraAttachment[]
  'sub-tasks': JiraSubTask[]
  description: string
  project: JiraProject
  comment: JiraComment[]
  issuelinks: JiraIssueLink[]
  worklog: JiraWorklog[]
  updated: number
  timetracking: JiraTimeTracking
  resolution: JiraResolution | null
  priority: JiraPriority | null
}

// --- Attachments ---
export interface JiraAttachment {
  id: number
  self: string
  filename: string
  created: string
  mimeType: string
  size: number
  content: string
  author: JiraUser
}

// --- Sub-Tasks ---
export interface JiraSubTask {
  id: string
  outwardIssue: JiraLinkedIssue
  type: {
    id: string
    name: string
    inward: string
    outward: string
  }
}

// --- Linked Issues (inward/outward) ---
export interface JiraIssueLink {
  id: string
  inwardIssue?: JiraLinkedIssue
  outwardIssue?: JiraLinkedIssue
  type: {
    id: string
    name: string
    inward: string
    outward: string
  }
}

export interface JiraLinkedIssue {
  id: string
  key: string
  self: string
  fields: {
    status: {
      name: string
      iconUrl: string
    }
  }
}

// --- Project ---
export interface JiraProject {
  id: string
  key: string
  name: string
  self: string
  style: string
  simplified: boolean
  avatarUrls: JiraAvatarUrls
  projectCategory: {
    id: string
    name: string
    description: string
    self: string
  }
  insight: {
    totalIssueCount: number
    lastIssueUpdateTime: string
  }
}

export interface JiraAvatarUrls {
  '16x16': string
  '24x24': string
  '32x32': string
  '48x48': string
}

// --- Comments ---
export interface JiraComment {
  id: string
  self: string
  body: string
  created: string
  updated: string
  author: JiraUserBasic
  updateAuthor: JiraUserBasic
  visibility?: JiraVisibility
}

// --- Worklogs ---
export interface JiraWorklog {
  id: string
  issueId: string
  self: string
  comment: string
  started: string
  timeSpent: string
  timeSpentSeconds: number
  author: JiraUserBasic
  updateAuthor: JiraUserBasic
  updated: string
  visibility?: JiraVisibility
}

// --- User & Visibility ---
export interface JiraUser extends JiraUserBasic {
  avatarUrls: JiraAvatarUrls
  accountType: string
  key: string
  name: string
}

export interface JiraUserBasic {
  accountId: string
  active: boolean
  displayName: string
  self: string
}

export interface JiraVisibility {
  type: string
  value: string
  identifier: string
}

// --- Time Tracking ---
export interface JiraTimeTracking {
  originalEstimate: string
  originalEstimateSeconds: number
  remainingEstimate: string
  remainingEstimateSeconds: number
  timeSpent: string
  timeSpentSeconds: number
}
