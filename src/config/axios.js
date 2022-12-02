import axios from 'axios';

const clienteAxios = axios.create({
  baseURL: 'http://190.158.226.150:7001'
  // baseURL: 'http://localhost:7001'
});

export default clienteAxios;
