import settings from 'settings';
import { ApiAxiosInstance } from '@neoflex/psa-ui-shared';

const API = ApiAxiosInstance(settings.API_URL);

export { API };