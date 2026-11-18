import API from '../_api';

export const getPayment = async (orderNumber) => {
    return await API.get(`/payments/${orderNumber}`);
};

export const createPayment = async (orderNumber) => {
    return await API.post(`/payments/${orderNumber}/pay`);
};

export const simulatePayment = async (orderNumber) => {
    return await API.post(`/payments/${orderNumber}/simulate`);
};

export const syncPayment = async (orderNumber) => {
    return await API.post(`/payments/${orderNumber}/sync`);
};
