import { getAuthToken } from './auth';

const API_URL = '/api';

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
};

export const api = {
  get: (url: string) => fetchWithAuth(url),
  post: (url: string, data: any) => fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  listings: {
    getAll: () => fetchWithAuth('/listings'),
    getById: (id: string) => fetchWithAuth(`/listings/${id}`),
    create: (data: any) => fetchWithAuth('/listings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: string, data: any) => fetchWithAuth(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: string) => fetchWithAuth(`/listings/${id}`, {
      method: 'DELETE',
    }),
  },
  claims: {
    create: (listingId: string) => fetchWithAuth('/claims', {
      method: 'POST',
      body: JSON.stringify({ listing_id: listingId }),
    }),
    getAll: () => fetchWithAuth('/claims'),
  },
};
