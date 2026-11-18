import API from '../_api';

export const getAuthors = async () => {
    return await API.get('/authors');
};

export const getAuthorById = async (id) => {
    return await API.get(`/authors/${id}`);
};

export const createAuthor = async (payload) => {
    return await API.post('/authors', payload);
};

export const updateAuthor = async (id, payload) => {
    return await API.put(`/authors/${id}`, payload);
};

export const deleteAuthor = async (id) => {
    return await API.delete(`/authors/${id}`);
};
