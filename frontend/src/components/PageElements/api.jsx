import axios from 'axios';

const api = axios.create({
    //baseURL: 'http://127.0.0.1:8000/',
    baseURL: 'https://spoinfo-production.up.railway.app',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
});

export default api;