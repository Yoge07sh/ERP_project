const FacultyMap = require('../models/FacultyMap');
const Faculty = require('../models/Faculty');
const Branch = require('../models/Branch');
const Course = require('../models/Course');
const Subject = require('../models/Subject');

const getFacultyForMapping = async (req, res) => {
    try {
        const faculties = await Faculty.find(
            {},
            {
                _id: 1,
                firstName: 1,
                lastName: 1
            }
        ).sort({ firstName: 1 });

        res.status(200).send({
            success: true,
            data: faculties
        });

    } catch (error) {
        console.error("Error fetching faculties for mapping:", error);

        res.status(500).send({
            success: false,
            message: "Failed to fetch faculties",
            error: error.message
        });
    }
};

async function getCoursesForMapping(req, res) {
    try {
        const courses = await Course.find(
            {
                courseFullName: {
                    $regex: new RegExp(req.query.courseFullName || "", "i")
                }
            },
            {
                _id: 1,
                courseFullName: 1
            }
        );

        const sendCourses = [];

        for (let i = 0; i < courses.length; i++) {
            sendCourses.push({
                value: courses[i]._id,
                label: courses[i].courseFullName
            });
        }

        res.status(200).send({
            success: true,
            data: sendCourses
        });

    } catch (error) {
        console.error(error);

        res.status(500).send({
            success: false,
            message: "Something went wrong"
        });
    }
}

async function getBranchsForMapping(req, res) {
    try {
        const branchs = await Branch.find(
            {
                branchFullName: {
                    $regex: new RegExp(req.query.branchFullName || "", "i")
                }
            },
            {
                _id: 1,
                branchFullName: 1
            }
        );

        const sendBranchs = [];

        for (let i = 0; i < branchs.length; i++) {
            sendBranchs.push({
                value: branchs[i]._id,
                label: branchs[i].branchFullName
            });
        }

        res.status(200).send({
            success: true,
            data: sendBranchs
        });

    } catch (error) {
        console.error(error);

        res.status(500).send({
            success: false,
            message: "Something went wrong"
        });
    }
}

async function getSubjectsForMapping(req, res) {
    try {
        const subjects = await Subject.find(
            {
                subjectFullName: {
                    $regex: new RegExp(req.query.subjectFullName || "", "i")
                }
            },
            {
                _id: 1,
                subjectFullName: 1
            }
        );

        const sendSubjects = [];

        for (let i = 0; i < subjects.length; i++) {
            sendSubjects.push({
                value: subjects[i]._id,
                label: subjects[i].subjectFullName
            });
        }

        res.status(200).send({
            success: true,
            data: sendSubjects
        });

    } catch (error) {
        console.error(error);

        res.status(500).send({
            success: false,
            message: "Something went wrong"
        });
    }
}

const addFacultyMapping = async (req, res) => {
    try {
        const facultyMapping = new FacultyMap(req.body);

        await facultyMapping.save();

        res.status(201).json({
            success: true,
            message: "Faculty mapping added successfully."
        });

    } catch (error) {
        console.error("Error adding faculty mapping:", error);

        res.status(500).json({
            success: false,
            message: "Failed to add faculty mapping.",
            error: error.message
        });
    }
};

module.exports = {
    getFacultyForMapping,
    getBranchsForMapping,
    getCoursesForMapping,
    getSubjectsForMapping,
    addFacultyMapping
};