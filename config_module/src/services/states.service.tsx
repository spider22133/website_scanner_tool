import http from '../http-connection';

const getAll = () => {
  return http.get('/website-states');
};

const getStatesByWebsiteId = (id: number | undefined) => {
  return http.get(`/website-states/website/${id}`);
};

const getAggregatedDataByWebsiteId = (id: number | undefined) => {
  return http.get(`/website-states/website/${id}/aggregate`);
};

const StatesDataService = {
  getAggregatedDataByWebsiteId,
  getAll,
  getStatesByWebsiteId,
};

export default StatesDataService;
