const Joi = require('joi');
const router = require('express').Router();
const RequestValidation = require('../middlewares/RequestValidation');
const CustomerController = require('../controllers/CustomerController');

router.get(
    '',
    RequestValidation.validateRequest(
        {
            query: Joi.object().keys({
                cust_id: Joi.number().optional(),
                gender: Joi.string().optional(),
                age: Joi.number().optional(),
                annual_income: Joi.number().optional(),
                spending_score: Joi.number().optional(),
                profession: Joi.string().optional(),
                work_experience: Joi.number().optional(),
                family_size: Joi.number().optional(),
                page: Joi.number().min(1).required(),
                page_size: Joi.number().min(1).required(),
            })
        },
        'query'
    ),
    CustomerController.getCustomerList
);

module.exports = router;