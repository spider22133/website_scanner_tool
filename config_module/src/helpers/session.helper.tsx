import IUser from '../interfaces/user.interface';

export const setUserSession = (token: string, user: IUser) => {
  sessionStorage.setItem('token', token);
  sessionStorage.setItem('user', JSON.stringify(user));
};
