const Customer = require('../models/Customer');
const Logger = require('../helpers/Logger');
const BaseResponse = require('../response/BaseResponse');

const getAgeDistribution = async (req, res) => {
    try {
        const ageGenderGroups = await Customer.aggregate([
            {
                $bucket: {
                    groupBy: "$age",
                    boundaries: [18, 26, 36, 46, 56, 66, 76, 100],
                    default: "Other",
                    output: {
                        count: { $sum: 1 },
                        genders: { $push: "$gender" }
                    }
                }
            }
        ]);

        const response = ageGenderGroups.map(group => {
            const maleCount = group.genders.filter(g => g === 'Male').length;
            const femaleCount = group.genders.filter(g => g === 'Female').length;
            return {
                ageGroup: group._id,
                maleCount,
                femaleCount
            };
        });

        Logger.info(response)
        res.send(BaseResponse.successResponse(response))
    } catch (err) {
        Logger.error(err);
        res.status(err.errorCode || 500).send(BaseResponse.errorResponse(err));
    }
};

module.exports = {
    getAgeDistribution
};
