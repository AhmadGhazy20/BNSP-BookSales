import API from '../_api';

export const getUsers = async () => {
    return await API.get('/users');
};
