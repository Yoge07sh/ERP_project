const Branch = require('../models/Branch');
const Course = require('../models/Course');
const Student = require('../models/Student')
const User = require('../models/User')
const cloudinary = require('cloudinary').v2

const bcrypt = require('bcrypt')

const xlsx = require('xlsx');



async function getCourseForStudent(req, res) {
    try {
        let courses = await Course.find(
            { courseFullName: { $regex: new RegExp(req.query.courseFullName, "i") } },
            {
                _id: 1,
                courseFullName: 1,
            }
        );
        let sendCourses = []
        for (let i = 0; i < courses.length; i++) {
            sendCourses.push({
                value: courses[i]._id,
                label: courses[i].courseFullName,
            })
        }
        res.status(200).send({ success: true, data: sendCourses })
    } catch (error) {
        res.status(500).send({ success: false, message: 'something went wrong' })
        console.log(error);

    }
}

async function getBranchForStudent(req, res) {
    try {
        let branches = await Branch.find(
            { branchFullName: { $regex: new RegExp(req.query.branchFullName, "i") } },
            {
                _id: 1,
                branchFullName: 1,
            }
        );
        let sendBranches = []
        for (let i = 0; i < branches.length; i++) {
            sendBranches.push({
                value: branches[i]._id,
                label: branches[i].branchFullName,
            })
        }
        res.status(200).send({ success: true, data: sendBranches })
    } catch (error) {
        res.status(500).send({ success: false, message: 'something went wrong' })
        console.log(error);

    }
}


async function addStudent(req, res) {
    try {
        let upload;

        if (req.file) {
            cloudinary.config({

                // cloud_name: process.env.CLOUD_NAME,
                // api_key: process.env.API_KEY,
                // api_secret: process.env.API_SECRET,
                cloud_name: 'dezwajyx9',
                api_key: '115759516773756',
                api_secret: 'PKUY4ZGUKyon30Joriq4hDqrWls',

            })
            upload = await cloudinary.uploader.upload(req.file.path);
        }
        let student = new Student(req.body);
        if (req.file && upload) {
            student.image = upload.secure_url;
        }
        await student.save();
        let encryptedPassword = bcrypt.hashSync('123456', 10);
        let user = new User(
            {
                firstName: student.firstName,
                lastName: student.lastName,
                email: student.collegeEmailId,
                password: encryptedPassword,
                mobNo: student.mobileNo,
                userRole: 'student',
                userImage: student.facultyImage || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png',
            }
        )
        await user.save()

        res.status(200).send({ success: true, message: 'Student Add Successfully' })

    } catch (error) {
        console.error("ERROR IN ADD STUDENT:", error);
        res.status(500).send({ success: false, message: "Something went wrong!" })
    }
}

async function getStudents(req, res) {
    try {

        const searchTerm = req.query.courseFullName || '';

        let student = await Student.find({
            $or: [
                { firstName: { $regex: new RegExp(searchTerm, "i") } },
                { lastName: { $regex: new RegExp(searchTerm, "i") } },
                { enrollmentNumber: { $regex: new RegExp(searchTerm, "i") } },
                { fileNumber: { $regex: new RegExp(searchTerm, "i") } },
                { rollNumber: { $regex: new RegExp(searchTerm, "i") } }
            ]
        })

        res.status(200).send({ success: true, data: student })

    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: 'Something went wrong..!' });
    }
}

async function deleteStudent(req, res) {
    try {
        let studentId = req.params.id;
        const result = await Student.deleteOne({ _id: studentId })

        if (result) {
            res.status(200).send({ success: true, message: 'Student Deleted Successfully...!' })
        } else {
            res.status(500).send({ success: false, message: 'Can not Delete Student!' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: 'Something went wrong..!' });
    }
}

async function getStudent(req, res) {
    try {
        let studentId = req.params.id;
        let student = await Student.findOne({ _id: studentId });
        res.status(200).send({ success: true, data: student })

    } catch (error) {
        res.status(500).send({ success: false, message: 'Something went wrong...' });
    }
}

async function editStudent(req, res) {
    try {
        let studentId = req.params.id;
        let student = await Student.findOne({ _id: studentId })
        Object.assign(student, req.body)
        await student.save();
        res.status(200).send({ success: true, message: 'Student Updated Successfully...' })
    } catch (error) {
        res.status(500).send({ success: false, message: 'Something went wrong!' })
    }
}


const bulkUploadStudents = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const { course, branch, section, year, semester, admissionYear } = req.body;

        // Read Excel buffer
        const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const students = xlsx.utils.sheet_to_json(sheet);

        const sectionMap = { A: 'Section A', B: 'Section B', C: 'Section C' };

        const validStudents = students
            .filter(s =>
                s.firstName &&
                s.lastName &&
                s.fatherName &&
                s.motherName &&
                s.personalEmailId &&
                s.collegeEmailId
            )
            .map((s, i) => ({
                ...s,
                course,
                branch,
                section: sectionMap[section] || section,
                year,
                semester,
                admissionYear,
                image: '',
                enrollmentNumber: `ENR${Date.now()}${i}`,
            }));

        await Student.insertMany(validStudents);

        res.status(200).json({ success: true, message: "Students uploaded successfully!" });
    } catch (error) {
        console.error("Bulk upload error:", error);
        res.status(500).json({ success: false, message: "Error uploading file", error });
    }
};


module.exports = {
    getCourseForStudent,
    getBranchForStudent,
    addStudent,
    getStudents,
    deleteStudent,
    getStudent,
    editStudent,
    bulkUploadStudents,
}