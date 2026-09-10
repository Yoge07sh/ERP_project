const mongoose=require('mongoose')
const Schema=mongoose.Schema
const subjectmapSchema= new Schema({
    session:{type:String,required:true},
    subject:{type:String,required:true},
    course:{type:String,required:true},
    branch:{type:String,required:true},
    year:{type:String,required:true},
    semester:{type:String,required:true},
    isActive:{type:String,default:'active',enum:['active','inActive']},
},{timestamps: true})
module.exports=mongoose.model('subjectmap',subjectmapSchema)
