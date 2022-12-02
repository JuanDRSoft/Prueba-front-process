import axios from 'axios';

const clienteAxios = axios.create({
  baseURL: 'https://solutio-juandrsoft.koyeb.app'
  // baseURL: 'http://localhost:7001'
});

export default clienteAxios;
