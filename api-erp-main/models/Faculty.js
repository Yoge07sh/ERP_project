const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamps');
const Schema = mongoose.Schema;

const facultySchema = new Schema({
    collegeId: { type: String, unique: true, required: true, uppercase: true, trim: true },
    thumbId: { type: String, required:true },
    firstName: { type: String, required:true },
    lastName: { type: String, },
    collegeEmail: { type: String, required:true },
    personalEmail: { type: String, required:true },
    mobileNo: { type: Number, required:true },
    emergencyMobileNo: { type: Number, required:true },
    fatherName: { type: String, required:true },
    motherName: { type: String, required:true },
    gender: { type: String, default:'male',enum:['male','female'] },
    dob: { type: Date, required:true },
    highestQualification: { type: String, required:true },
    designation: { type: String, required:true },
    marriedStatus: { type: String, default:'not married',enum:['not married','married']},
    totalExperience: { type: String, required:true },
    teachingExperience: { type: Number, required:true },
    industryExperience: { type: Number, required:true },
    researchExperience: { type: Number, required:true },
    facultyImage: { type: String, required:true },
    status: { type:String, default:'active',enum:['active','inactive'] },
    createdAt: Date,
    updatedAt: Date
})

facultySchema.plugin(timestamps, {index: true})
module.exports = mongoose.model('faculty', facultySchema)