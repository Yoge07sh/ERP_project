const  mongoose =require('mongoose')
const  timestamps =require('mongoose-timestamps')
const Schema= mongoose.Schema
const userSchema=new Schema({
    firstName:{type:String,required:true},
    lastName:{type:String,default:''},
    email:{type:String,unique:true,required:true},
    password:{type:String,default:''},
    mobNo:{type:String,default:''},
    userRole:{type:String,default:''},
    lastLogin:{type:Date},
    userImage:{type:String,default:''},
    status:{type:String,default:'Active',enum:['Active','InActive']},
    createdAt:Date,
    updatedAt:Date,

})
userSchema.plugin(timestamps,{index:true})
module.exports=mongoose.model('user',userSchema)