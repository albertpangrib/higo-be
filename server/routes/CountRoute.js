const Count = require("../controllers/CountController");

const router = require("express").Router();

router.get(
    '',
    Count.getCount
)
module.exports = router;