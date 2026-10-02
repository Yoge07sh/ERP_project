const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeaveSchema = new Schema({
    facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'faculty', required: true },
    applicantName: { type: String, required: true },
    designation: { type: String, required: true },
    session: { type: String, required: true },
    leave_name: { type: String, required: true },
    from: { type: Date, required: true },
    toDate: { type: Date },
    half: { type: String },
    numberOfLeaves: { type: Number, required: true },
    purpose: { type: String, required: true },
    leaveAddress: { type: String, required: true },
    contactNumber: { type: String, required: true },
    alternativeArrangements: [{
        date: { type: Date }, 
        time: { type: String }, 
        subject: { type: String }, 
        dutyPerson: { type: String }
    }],
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Leave', LeaveSchema);