const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamps')
const Schema = mongoose.Schema;

const branchSchema = new Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    branchCode: { type: String, unique: true, required: true, uppercase: true, trim: true },
    branchShortName: { type: String, unique: true, required: true, uppercase: true, trim: true },
    branchFullName: { type: String, required: true },
    branchIntake: { type: Number, default: 60 },
    status: { type: String, default: 'Active', enum: ['Active', 'InActive'] },
    createdAt: Date,
    updatedAt: Date
})

branchSchema.plugin(timestamps, { index: true })
module.exports = mongoose.model('branch', branchSchema)