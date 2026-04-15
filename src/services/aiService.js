import { portalApi } from './portalApi';

export const aiService = {
  getProviders: (role = 'admin') => portalApi.get('/ai/providers', role),
  generate: (payload, role = 'admin') => portalApi.post('/ai/generate', payload, role),
};

export default aiService;
