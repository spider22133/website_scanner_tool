import http from '../http-connection';

const getAll = () => {
  return http.get('/website-states');
};

const getAllErrors = () => {
  return http.get('/website-states/errors');
};

const getStatesByWebsiteId = (id: string) => {
  return http.get(`/website-states/website/${id}`);
};

const getErrorStatesByWebsiteId = (id: string) => {
  return http.get(`/website-states/website/${id}/errors`);
};

const getLatestStateByWebsiteId = (id: string) => {
  return http.get(`/website-states/website/${id}/latest`);
};

const getAggregatedDataByWebsiteId = (id: string) => {
  return http.get(`/website-states/website/${id}/aggregate`);
};

const StatesDataService = {
  getAggregatedDataByWebsiteId,
  getLatestStateByWebsiteId,
  getStatesByWebsiteId,
  getErrorStatesByWebsiteId,
  getAllErrors,
  getAll,
};

export default StatesDataService;
