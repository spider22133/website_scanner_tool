import IUser from '../interfaces/user.interface';

export const setUserSession = (token: string, user: IUser) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const userIsLogged = () => {
  return localStorage.getItem('token') ? true : false;
};

export const getUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  else return null;
};

export const removeUserSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
