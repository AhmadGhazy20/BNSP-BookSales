import API from '../_api';

export const getGenres = async () => {
    return await API.get('/genres');
};

export const getGenreById = async (id) => {
    return await API.get(`/genres/${id}`);
};

export const createGenre = async (payload) => {
    return await API.post('/genres', payload);
};

export const updateGenre = async (id, payload) => {
    return await API.put(`/genres/${id}`, payload);
};

export const deleteGenre = async (id) => {
    return await API.delete(`/genres/${id}`);
};
