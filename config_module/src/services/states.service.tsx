import http from '../http-connection';

const getAll = () => {
  return http.get('/website-states');
};

const getAllErrors = () => {
  return http.get('/website-states/errors');
};

const getStatesByWebsiteId = (id: string) => {
  return http.get(`/website-states/step/${id}`);
};

const getErrorStatesByWebsiteId = (id: string) => {
  return http.get(`/website-states/step/${id}/errors`);
};

const getLatestStateByWebsiteId = (id: string) => {
  return http.get(`/website-states/website/${id}/latest`);
};

const getLatestStateByStepId = (id: string) => {
  return http.get(`/website-states/step/${id}/latest`);
};

const getAggregatedDataByWebsiteId = (id: string) => {
  return http.get(`/website-states/step/${id}/aggregate`);
};

const StatesDataService = {
  getAggregatedDataByWebsiteId,
  getLatestStateByStepId,
  getLatestStateByWebsiteId,
  getStatesByWebsiteId,
  getErrorStatesByWebsiteId,
  getAllErrors,
  getAll,
};

export default StatesDataService;
