import http from '../http-connection'
import IUser from '../interfaces/user.interface'

const getAll = () => {
  return http.get('/users')
}

const getUserById = (id: string) => {
  return http.get(`/users/${id}`)
}

const getUserRoles = (id: string) => {
  return http.get(`/users/${id}/roles`)
}

const createUser = (data: IUser) => {
  return http.post('/users', data)
}

const updateUser = (id: string, data: IUser) => {
  return http.put(`/users/${id}`, data)
}

const deleteUser = (id: number) => {
  return http.delete(`/users/${id}`)
}

const UserDataService = {
  getAll,
  getUserById,
  getUserRoles,
  createUser,
  updateUser,
  deleteUser,
}

export default UserDataService
