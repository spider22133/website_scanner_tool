import http from '../http-connection';

const getAll = () => {
  return http.get('/website-states');
};

const getStatesByWebsiteId = (id: string) => {
  return http.get(`/website-states/website/${id}`);
};

const getAggregatedDataByWebsiteId = (id: string) => {
  return http.get(`/website-states/website/${id}/aggregate`);
};

const StatesDataService = {
  getAggregatedDataByWebsiteId,
  getAll,
  getStatesByWebsiteId,
};

export default StatesDataService;
