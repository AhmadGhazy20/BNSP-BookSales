import API from '../_api';

export const getBooks = async (params = {}) => {
    return await API.get('/books', { params });
};

export const getBookById = async (id) => {
    return await API.get(`/books/${id}`);
};

export const createBook = async (payload) => {
    return await API.post('/books', payload);
};

export const updateBook = async (id, payload) => {
    return await API.put(`/books/${id}`, payload);
};

export const deleteBook = async (id) => {
    return await API.delete(`/books/${id}`);
};