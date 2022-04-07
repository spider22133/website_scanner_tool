import http from '../http-connection';
import IWebsiteControlStep from '../interfaces/website_control_step.interface';

const getAll = () => {
  return http.get('/website-control-steps');
};

const getStepsById = (id: string) => {
  return http.get(`/website-control-steps/${id}`);
};

const update = (data: IWebsiteControlStep) => {
  const { id } = data;
  return http.put(`/website-control-steps/${id}`, data);
};

const create = (data: IWebsiteControlStep) => {
  return http.post('/website-control-steps/create', data);
};

const deleteStep = (id: string) => {
  return http.delete(`/website-control-steps/${id}`);
};

const WebsiteControlStepsDataService = {
  getAll,
  getStepsById,
  update,
  create,
  deleteStep,
};

export default WebsiteControlStepsDataService;
