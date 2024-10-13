const _ = require('lodash');

module.exports = (result) => {
    return _.map(result, item => ({
        cust_id: item.cust_id,
        gender: item.gender,
        age: item.age,
        annual_income: item.annual_income,
        spending_score: item.spending_score,
        profession: item.profession,
        work_experience: item.work_experience,
        family_size: item.family_size
    }));
};