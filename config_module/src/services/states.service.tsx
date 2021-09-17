import http from '../http-connection';

const getAll = () => {
  return http.get('/website-states');
};

const getStatesByWebsiteId = (id: number | undefined) => {
  return http.get(`/website-states/website/${id}`);
};

const StatesDataService = {
  getAll,
  getStatesByWebsiteId,
};

export default StatesDataService;
