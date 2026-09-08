const express =require('express')
const multer =require('multer')
const bodyParser=require('body-parser')
const router=express.Router()
const FacultyController =require('../controllers/FacultyController')
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({
    extended:false
}))
const uploader=multer({
    storage:multer.diskStorage({}),
    limits:{fileSize:10*1024*1024},
})
router.post('/add/faculty',uploader.single('file'),(req,res)=>{
    FacultyController.addFaculty(req,res)
})
router.post('/add/faculties',uploader.single('facultyData'),(req,res)=>{
    FacultyController.addFaculties(req,res)
})
router.get('/faculties', (req, res) => {
    FacultyController.getFaculties(req, res);
})
router.get('/faculty/:id', (req, res) => {
    FacultyController.getFaculty(req, res);
})

router.put('/edit/faculty/:id', (req, res) => {
    FacultyController.editFaculty(req, res);
})

module.exports=router