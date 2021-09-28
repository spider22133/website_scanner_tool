import IUser from '../interfaces/user.interface';

export const setUserSession = (token: string, user: IUser) => {
  setWithExpiry('token', token);
  setWithExpiry('user', JSON.stringify(user));
};

export const userIsLogged = () => {
  return getWithExpiry('token') ? true : false;
};

export const getUser = () => {
  const userStr = getWithExpiry('user');
  if (userStr) return JSON.parse(userStr);
  else return null;
};

export const removeUserSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

function setWithExpiry(key: string, value: string, ttl = 86400) {
  const now = new Date();
  // now.toLocaleString('de-DE', { timeZone: 'Berlin' });

  // `item` is an object which contains the original value
  // as well as the time when it's supposed to expire
  const item = {
    value: value,
    expires: now.getTime() + ttl * 1000,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

function getWithExpiry(key: string) {
  const itemStr = localStorage.getItem(key);
  // if the item doesn't exist, return null
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  // compare the expiry time of the item with the current time
  if (now.getTime() > item.expires) {
    // If the item is expired, delete the item from storage
    // and return null
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
}
