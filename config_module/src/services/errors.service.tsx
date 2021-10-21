import http from '../http-connection';

const getErrorsByWebsiteId = (id: string) => {
  return http.get(`/website-errors/website/${id}`);
};

const ErrorsDataService = {
  getErrorsByWebsiteId,
};

export default ErrorsDataService;
