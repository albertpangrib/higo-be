const { getAgeDistribution } = require("../controllers/AgeDistributionController");

const router = require("express").Router();

router.get(
    '',
    getAgeDistribution
)
module.exports = router;