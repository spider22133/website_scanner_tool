import http from '../http-connection';
import Website from '../interfaces/website.interface';

const getAll = () => {
  return http.get('/websites');
};

const getWebsiteById = (id: string) => {
  return http.get(`/websites/${id}`);
};

const update = (id: string, data: Website) => {
  return http.put(`/websites/${id}`, data);
};

const create = (data: Website) => {
  return http.post('/websites/create', data);
};

const WebsiteDataService = {
  getAll,
  getWebsiteById,
  update,
  create,
};

export default WebsiteDataService;
