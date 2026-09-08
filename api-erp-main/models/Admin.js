const mongoose = require('mongoose')
const Schema = mongoose.Schema
const adminSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, default: '' },
    email: { type: String, unique: true, required: true },
    password: { type: String, default: '' },
    mobNo: { type: String, default: '' },
    lastLogin: { type: Date },
    adminImage: { type: String, default: '' },
    status: { type: String, default: 'Active', enum: ['Active', 'InActive'] },

}, { timestamps: true })
module.exports = mongoose.model('admin', adminSchema)