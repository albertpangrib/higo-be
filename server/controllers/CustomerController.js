const _ = require('lodash');
const Customer = require('../models/Customer');
const BaseResponse = require('../response/BaseResponse');
const Logger = require('../helpers/Logger');
const GetCustomerListResponse = require('../response/GetCustomerListResponse');
const PaginationHelper = require('../helpers/PaginationHelper');

const getCustomerList = async (req, res) => {
    const {
        query: {
            cust_id,
            gender,
            age,
            annual_income,
            spending_score,
            profession,
            work_experience,
            family_size,
            page = 1,
            page_size = 20,
        }
    } = req;
    try {
        const [totalCustomer, result] = await Promise.all([
            Customer.aggregate([{ $count: 'total' }]),
            Customer.find({
              ...cust_id && { cust_id: cust_id },
              ...gender && { gender: gender },
              ...age && { age: age },
              ...annual_income && { annual_income: annual_income },
              ...spending_score && { spending_score: spending_score },
              ...profession && { profession: profession },
              ...work_experience && { work_experience: work_experience },
              ...family_size && { family_size: family_size },
            })
            .sort({cust_id: 1})
            .skip(PaginationHelper(page, page_size))
            .limit(page_size),
          ]);
          const { total: totalCustomerCount } = totalCustomer[0];
          const totalPages = Math.ceil(totalCustomer[0].total/page_size)

          const response = {
            customers: GetCustomerListResponse(result),
            totalPages: totalPages,
            totalCustomers: totalCustomerCount
        };
        
        Logger.info(response);
        res.send(BaseResponse.successResponse(response));
    } catch (err) {
        Logger.error(err);
        res.status(err.errorCode || 500).send(BaseResponse.errorResponse(err));
    }
};

module.exports = {
    getCustomerList,
};