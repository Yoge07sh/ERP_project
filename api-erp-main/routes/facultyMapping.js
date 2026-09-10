const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();

const FacultyMappingController =
    require('../controllers/facultyMappingController');

router.use(bodyParser.json());

router.use(bodyParser.urlencoded({
    extended: false
}));

router.get('/faculties/for/mapping', (req, res) => {
    FacultyMappingController.getFacultyForMapping(req, res);
});

router.get('/courses/for/mapping', (req, res) => {
    FacultyMappingController.getCoursesForMapping(req, res);
});

router.get('/subjects/for/mapping', (req, res) => {
    FacultyMappingController.getSubjectsForMapping(req, res);
});

router.get('/branchs/for/mapping', (req, res) => {
    FacultyMappingController.getBranchsForMapping(req, res);
});

router.post('/add/facultymapping', (req, res) => {
    FacultyMappingController.addFacultyMapping(req, res);
});

module.exports = router;