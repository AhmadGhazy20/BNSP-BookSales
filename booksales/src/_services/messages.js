import API from '../_api';

export const createMessage = async (payload) => {
    return await API.post('/messages', payload);
};

export const getMessages = async () => {
    return await API.get('/messages');
};

export const markMessageAsRead = async (id) => {
    return await API.patch(`/messages/${id}/read`);
};

export const deleteMessage = async (id) => {
    return await API.delete(`/messages/${id}`);
};
