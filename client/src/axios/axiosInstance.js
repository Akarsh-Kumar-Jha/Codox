import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://codox-server-qcsphl48s-akarsh-kumar-jhas-projects.vercel.app/api/v1',
    withCredentials: true,
});

export default axiosInstance;
