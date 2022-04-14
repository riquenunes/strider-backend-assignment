import axios, { AxiosRequestConfig } from 'axios';

export default function sendHttpRequest(config: AxiosRequestConfig) {
  return axios.request(config).catch(error => {
    /**
     * Resolves if the server responded with a status code other
     * than 1xx/2xx too. This way we can have a better feedback if
     * the functional tests ever fail.
     */
    if (error.response) return Promise.resolve(error.response);

    return Promise.reject(error);
  });
}
