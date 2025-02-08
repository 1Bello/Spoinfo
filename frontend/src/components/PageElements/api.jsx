import axios from 'axios';

const api = axios.create({
    baseURL: 'spoinfo-production.up.railway.app',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
});

export default api;