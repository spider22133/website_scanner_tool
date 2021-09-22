import http from '../http-connection';
import IUser from '../interfaces/user.interface';

// const signup = () => {
//   http.post();
// };
const login = (data: IUser) => {
  return http.post('/login', data);
};

const AuthService = {
  login,
};

export default AuthService;
