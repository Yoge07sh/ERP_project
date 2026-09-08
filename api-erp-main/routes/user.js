const express =require('express')
const router=express.Router()
const UserController=require('../controllers/UserController')
router.post('/admin/login',(req,res)=>{
UserController.doAdminLogin(req,res)
})
router.post('/user/login',(req,res)=>{
UserController.doUserlogin(req,res)
})


module.exports=router