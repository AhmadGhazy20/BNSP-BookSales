import API from '../_api';

export const getTransactions = async () => {
    return await API.get('/transactions');
};

export const createTransaction = async (bookId, quantity) => {
    return await API.post('/transactions', {
        book_id: bookId,
        quantity,
    });
};

export const checkout = async (items) => {
    return await API.post('/checkout', { items });
};
