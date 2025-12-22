import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://codelang.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
})
