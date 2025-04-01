import http from '../http-connection'
import { SoftwareEntry } from '../../../types/common'

type createProps = {
  name: string
  url: string
}

const getAll = () => {
  return http.get('/software')
}

const getWebsiteById = (id: string) => {
  return http.get(`/software/${id}`)
}

const getWebsiteMainStepStates = (id: string) => {
  return http.get(`/software/${id}/main_states`)
}

const update = (data: SoftwareEntry) => {
  const { winget_id } = data
  return http.put(`/software/${winget_id}`, { ...data })
}

const checkStatus = (id: string) => {
  return http.get(`/software/${id}/check`)
}

const create = (data: createProps) => {
  return http.post('/software/create', data)
}

const createSoftware = (data: SoftwareEntry) => {
  return http.post('/software/create', data)
}

const deleteWebsite = (id: string) => {
  return http.delete(`/software/${id}`)
}

const searchInsoftware = (query: string) => {
  return query ? http.get(`/software/q=${query}`) : getAll()
}

const searchWithWinGet = (query: string) => {
  return http.get(`/software/q=${query}`)
}

const WebsiteDataService = {
  getAll,
  getWebsiteById,
  update,
  create,
  createSoftware,
  deleteWebsite,
  searchWithWinGet,
  checkStatus,
  getWebsiteMainStepStates,
}

export default WebsiteDataService
