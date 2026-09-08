const express =require('express')
const bodyParser=require('body-parser')
const router=express.Router()
const SubjectController =require('../controllers/subjectController')
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({
    extended:false
}))

router.post('/add/subject',(req,res)=>{
    SubjectController.addSubject(req,res)
})
router.get('/subjects', (req, res) => {
    SubjectController.getSubjects(req, res);
})

router.get('/subject/:id', (req, res) => {
    SubjectController.getSubject(req,res);
})
router.put('/edit/subject/:id', (req, res) => {
    SubjectController.editSubject(req, res);
})

module.exports=router