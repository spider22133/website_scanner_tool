import http from '../http-connection';
import IUser from '../interfaces/user.interface';

const signup = (data: IUser) => {
  return http.post('/signup', data);
};

const login = (data: IUser) => {
  return http.post('/login', data);
};

const getUserRoles = (id: string) => {
  return http.get(`/users/${id}/roles`);
};

const AuthService = {
  signup,
  login,
  getUserRoles,
};

export default AuthService;
