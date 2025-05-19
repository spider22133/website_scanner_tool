import http from '../http-connection'
import { SoftwareEntry } from '../../../types/common'
import { SoftwareUser } from '../interfaces/common'

const SoftwareDataService = {
  getAll: () => http.get('/software'),
  getById: (id: string) => http.get(`/software/${id}`),
  checkStatus: (id: string) => http.get(`/software/${id}/check`),

  getUsers: (id: string) => http.get(`/software/${id}/users`),
  setUsers: (id: string, data: SoftwareUser[]) => http.post(`/software/${id}/users`, data),

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
}

export default SoftwareDataService
