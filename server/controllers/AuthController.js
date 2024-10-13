const User = require('../models/User');
const AuthService = require('../services/AuthService');
const BaseResponse = require('../response/BaseResponse');
const Logger = require('../helpers/Logger');

const login = async (req, res) => {
    const {
        body: {
            username,
            password
        }
    } = req;
    try {
        const user = await User.findByCredentials(username, password);
        const token = await user.generateAuthToken();
        
        Logger.info(token);
        res.setHeader('Authorization', `Bearer ${token}`).send(BaseResponse.successResponse());
    } catch (err) {
        Logger.error(err);
        res.status(err.errorCode || 500).send(BaseResponse.errorResponse(err));
    }
};

module.exports = {
    login: login
};