import http from '../http-connection';
import IWebsite from '../interfaces/website.interface';
type createProps = {
  name: string;
  url: string;
};
const getAll = () => {
  return http.get('/websites');
};

const getWebsiteById = (id: string) => {
  return http.get(`/websites/${id}`);
};

const update = (data: IWebsite) => {
  const { id, name, url } = data;
  return http.put(`/websites/${id}`, { name, url });
};

const create = (data: createProps) => {
  return http.post('/websites/create', data);
};

const deleteWebsite = (id: string) => {
  return http.delete(`/websites/${id}`);
};

const searchInWebsites = (query: string) => {
  return http.get(`/websites/q=${query}`);
};

const WebsiteDataService = {
  getAll,
  getWebsiteById,
  update,
  create,
  deleteWebsite,
  searchInWebsites,
};

export default WebsiteDataService;
