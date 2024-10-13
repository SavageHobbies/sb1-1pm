import axios, { AxiosError } from 'axios';

const API_BASE_URL = '/api/printify';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1