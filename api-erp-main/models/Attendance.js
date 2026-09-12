const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    session: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    lectureNo: {
        type: Number,
        required: true
    },

    facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'faculty',
        required: true
    },

    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course',
        required: true
    },

    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'branch',
        required: true
    },

    year: {
        type: String,
        required: true
    },

    semester: {
        type: String,
        required: true
    },

    section: {
        type: String,
        required: true
    },

    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject',
        required: true
    },

    students: [
        {
            studentId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'student',
                required: true
            },

            status: {
                type: String,
                enum: ['Present', 'Absent'],
                required: true
            }
        }
    ]

}, { timestamps: true });

module.exports = mongoose.model('attendance', attendanceSchema);