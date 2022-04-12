import axios from 'axios';

export default axios.create({
  baseURL: 'http://websitescanner.3m5.de/',
  headers: {
    'Content-type': 'application/json',
  },
  withCredentials: true,
});
