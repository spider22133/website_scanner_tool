import http from '../http-connection';

const getAll = () => {
  return http.get('/website-states');
};

const getByWebsiteId = (id: number) => {
  return http.get(`/website-states/website/${id}`);
};

const StatesDataService = {
  getAll,
  getByWebsiteId,
};

export default StatesDataService;
