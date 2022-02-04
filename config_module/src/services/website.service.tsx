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
  const { id, name, url, is_hidden } = data;
  return http.put(`/websites/${id}`, { name, url, is_hidden });
};

const create = (data: createProps) => {
  return http.post('/websites/create', data);
};

const deleteWebsite = (id: string) => {
  return http.delete(`/websites/${id}`);
};

const searchInWebsites = (query: string) => {
  return query ? http.get(`/websites/q=${query}`) : getAll();
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
