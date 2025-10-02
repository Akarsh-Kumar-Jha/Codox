import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://codox-server.vercel.app/api/v1',
    withCredentials: true,
});

export default axiosInstance;
