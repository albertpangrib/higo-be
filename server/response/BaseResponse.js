'use strict';

module.exports =  {
    successResponse: (data) => {
        const defaultResponse = {
            status: true,
            data: 'Success'
        };

        if (data) {
            defaultResponse.data = data;
        }

        return defaultResponse;
    },

    errorResponse: (error) => {
        return {
            status: false,
            error: error.message || error.errorMessage || error || null,
        };
    }
};
