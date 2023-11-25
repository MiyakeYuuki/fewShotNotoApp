import axios from 'axios';

/**
 * axios(app)設定
 */
const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_SERVER_URL,
});

export default api;