const Customer = require('../models/Customer');
const Logger = require('../helpers/Logger');
const BaseResponse = require('../response/BaseResponse');

const getGenderCount = async () => {
    const genderCounts = await Customer.aggregate([
        {
            $group: {
                _id: "$gender",
                count: { $sum: 1 }
            }
        }
    ]);
    return genderCounts;
};

const getProfessionCount = async () => {
    const response = await Customer.aggregate([
        {
            $group: {
                _id: "$profession",
                totalCount: { $sum: 1 }
            }
        }
    ]);
    return response;
};

const getProfessionByGender = async () => {
    const response = await Customer.aggregate([
        {
            $group: {
                _id: {
                    profession: "$profession",
                    gender: "$gender"
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1 }
        }
    ]);
    return response;
};

// Fungsi baru untuk menggabungkan semua data
const getCount = async (req, res) => {
    try {
        // Jalankan semua fungsi secara paralel
        const [genderCounts, professionCounts, professionByGender] = await Promise.all([
            getGenderCount(),
            getProfessionCount(),
            getProfessionByGender()
        ]);

        // Format data gender counts untuk mengembalikan dalam format yang diinginkan
        const maleCount = genderCounts.find(g => g._id === "Male")?.count || 0;
        const femaleCount = genderCounts.find(g => g._id === "Female")?.count || 0;

        // Menyusun objek respon
        const response = {
            genderCount: {
                maleCount,
                femaleCount
            },
            professionCount: professionCounts,
            professionByGender
        };

        Logger.info(response);
        res.send(BaseResponse.successResponse(response));
    } catch (err) {
        Logger.error(err);
        res.status(err.errorCode || 500).send(BaseResponse.errorResponse(err));
    }
};

module.exports = {
    getCount
};
