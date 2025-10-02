export const API_URL = '/api';

export const getAuthToken = () => localStorage.getItem('token');

export const setAuthToken = (token: string) => localStorage.setItem('token', token);

export const removeAuthToken = () => localStorage.removeItem('token');
