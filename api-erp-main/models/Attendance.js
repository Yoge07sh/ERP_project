const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    session: {
        type: String,
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
    facultyMapId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FacultyMap',
        required: true
    },


    timeSlotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'timeSlots',
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