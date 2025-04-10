import axios from 'axios'

export const API_URL = 'http://localhost:3001'

export default axios.create({
  baseURL: API_URL + '/',
  headers: {
    'Content-type': 'application/json',
  },
  withCredentials: true,
})
