const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
    config: {
        all: `${API_BASE_URL}/config/all`,
        add: `${API_BASE_URL}/config/add_config`,
        update: (key) => `${API_BASE_URL}/config/update/${key}`,
        delete: (key) => `${API_BASE_URL}/config/delete/${key}`,
        countryOverrides: {
            update: (key, country) => `${API_BASE_URL}/config/update/${key}/country/${country}`,
            delete: (key, country) => `${API_BASE_URL}/config/delete/${key}/country/${country}`
        }
    }
};

export default API_ENDPOINTS; 