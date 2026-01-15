import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://open.assembly.go.kr/portal/openapi'
const API_KEY = import.meta.env.VITE_ASSEMBLY_API_KEY

export const assemblyApi = axios.create({
  baseURL: API_BASE_URL,
  params: {
    KEY: API_KEY,
    Type: 'json',
    pSize: 300
  }
})

// Response interceptor for error handling
assemblyApi.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error)
  }
)
