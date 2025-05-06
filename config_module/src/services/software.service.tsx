import http from '../http-connection'
import { SoftwareEntry } from '../../../types/common'

type CreateSoftwarePayload = {
  name: string
  url: string
}

const SoftwareDataService = {
  getAll: () => http.get('/software'),
  getById: (id: string) => http.get(`/software/${id}`),
  checkStatus: (id: string) => http.get(`/software/${id}/check`),

  getRepresentatives: (id: string) => http.get(`/software/${id}/representatives`),
  setRepresentatives: (id: string, data: number[]) => http.post(`/software/${id}/representatives`, data),

  update: (data: SoftwareEntry) => http.put(`/software/${data.winget_id}`, { ...data }),
  create: (data: SoftwareEntry) => http.post('/software/create', data),
  delete: (id: string) => http.delete(`/software/${id}`),

  searchWithWinget: (query: string) => http.get(`/software/q=${query}`),

  updateIcon: (id: string, formData: FormData) =>
    http.post(`/software/${id}/icon`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  createJiraIssues: (id: string) => http.post(`/software/${id}/issues`),
}

export default SoftwareDataService
