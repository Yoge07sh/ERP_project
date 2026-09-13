const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const AttendanceController = require('../controllers/AttendanceController')
const authMiddleware = require('../middleware/authMiddleware')
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }))


router.get('', (req, res) => {

})
router.post(
    '/add/attendance',
    authMiddleware,
    (req, res) => {

    }
);


module.exports = router