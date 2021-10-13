import http from '../http-connection';

const getErrorsByWebsiteId = (id: number | undefined) => {
  return http.get(`/website/${id}/errors`);
};

const ErrorsDataService = {
  getErrorsByWebsiteId,
};

export default ErrorsDataService;
