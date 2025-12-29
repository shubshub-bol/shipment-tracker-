import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const getShirts = () => api.get('/shirts/');
export const createShirt = (data) => api.post('/shirts/', data);
export const getShipments = () => api.get('/shipments/');
export const createShipment = (data) => api.post('/shipments/', data);
export const scanAction = (action, serial, shipmentId) =>
    api.post(`/scan/?action=${action}&serial=${serial}` + (shipmentId ? `&shipment_id=${shipmentId}` : ''));

export default api;
