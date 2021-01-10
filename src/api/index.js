import axios from 'axios';
export const api = axios.create();

const baseUrl = 'http://localhost:3000/';

const getStatuses= async () => {
  const response = await api.get(`${baseUrl}data`);
  return response;
};

export default getStatuses;

