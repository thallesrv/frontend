import axios from 'axios';

const api = axios.create({
    baseURL : "https://tbox-backend.herokuapp.com",
});

export default api;

