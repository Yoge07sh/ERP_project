const express = require('express')
const router = express.Router()
const CourseController = require('../controllers/CourseController')
const bodyParser = require('body-parser')
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}))


router.post('/add/course', (req, res) => {
    CourseController.addCourse(req, res);
})

router.get('/courses', (req, res) => {
    CourseController.getCourses(req, res);
})

router.delete('/delete/course/:id', (req, res) => {
    CourseController.deleteCourse(req, res);
})

router.get('/course/:id', (req, res) => {
    CourseController.getCourse(req, res);
})

router.put('/edit/course/:id', (req, res) => {
    CourseController.editCourse(req, res);
})

module.exports = router