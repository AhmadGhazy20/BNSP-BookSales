import API from '../_api';

export const login = async (payload) => {
    return await API.post('/login', payload);
};

export const register = async (payload) => {
    return await API.post('/register', payload);
};

export const logout = async () => {
    return await API.post('/logout');
};