import http from '../http-connection';

const getAll = () => {
  return http.get('/websites');
};

const WebsiteDataService = {
  getAll,
};

export default WebsiteDataService;
