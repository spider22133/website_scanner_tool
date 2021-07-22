import http from '../http-connection';

const getAll = () => {
  return http.get('/states');
};

const StatesDataService = {
  getAll,
};

export default StatesDataService;
