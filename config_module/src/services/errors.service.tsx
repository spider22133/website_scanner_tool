import http from '../http-connection';

const getErrorsByWebsiteId = (id: number | undefined) => {
  return http.get(`/website-errors/website/${id}`);
};

const ErrorsDataService = {
  getErrorsByWebsiteId,
};

export default ErrorsDataService;
