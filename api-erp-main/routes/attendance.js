const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const AttendanceController = require('../controllers/AttendanceController')
const authMiddleware = require('../middleware/authMiddleware')
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }))

router.get('/courses/for/student', (req, res) => {
    AttendanceController.getCourseForStudent(req, res);
});

router.get('/branches/for/student', (req, res) => {
    AttendanceController.getBranchForStudent(req, res);
});


router.get('/getstudentsdata', (req, res) => {
    AttendanceController.getStudentsData(req,res);
})
router.post(
    '/add/attendance',
    authMiddleware,
    (req, res) => {

    }
);


module.exports = router