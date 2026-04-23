import api from './axios';




const resourceApi = {
   //receive all resources with pagination and filtering
    getAll: async (params) => {
        const response = await api.get('/resources', { params });
        return response.data;
    },

    // 2. receive details of a single resource
    getById: async (id) => {
        const response = await api.get(`/resources/${id}`);
        return response.data;
    },

    // 3. create a new resource (Admin only)
    create: async (data) => {
        const response = await api.post('/resources', data);
        return response.data;
    },

    // 4. update details of an existing resource (Admin only)
    update: async (id, data) => {
        const response = await api.put(`/resources/${id}`, data);
        return response.data;
    },

    // 5. delete a resource or mark it as OUT_OF_SERVICE (Admin only)
    delete: async (id) => {
        const response = await api.delete(`/resources/${id}`);
        return response.data;
    }
};

export default resourceApi;