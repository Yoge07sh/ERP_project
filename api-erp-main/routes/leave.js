
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const leaveController = require('../controllers/LeaveController');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));


router.get('/faculty/for/leave/:id', (req, res) => {
    leaveController.getFaculty(req, res);
});

router.post('/add/leave', (req, res)=> {
    leaveController.addLeave(req, res);
});
router.get('/leaves/faculty/:facultyId', (req, res) => {
    leaveController.getFacultyLeaves(req, res);
});
module.exports = router;