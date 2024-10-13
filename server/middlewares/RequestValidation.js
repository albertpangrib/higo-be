const BaseResponse = require('../response/BaseResponse');

const validateRequest = (schema, properties) => {
    return (req, res, next) => {
        const splittedProperties = properties.split('.');
        let errList = '';
        for (const property of splittedProperties) {
            const { error } = schema[property].validate(req[property], schema);
            if (error) {
                const { details } = error;
                const message = details.map(i => i.message).join(',');
                errList += message + ', ';
            }
        }

        if (!errList) next();
        else res.status(400).send(BaseResponse.errorResponse(errList));
    };
};

module.exports = {
    validateRequest
};