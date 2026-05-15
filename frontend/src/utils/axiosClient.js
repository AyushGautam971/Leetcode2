import axios from "axios"

const axiosClient =  axios.create({
    baseURL: 'https://backend-ry9t.onrender.com',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});


export default axiosClient;

