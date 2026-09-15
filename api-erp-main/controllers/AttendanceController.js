const Student = require('../models/Student');
const Course = require('../models/Course');
const Branch = require('../models/Branch')

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
        const { courseId } = req.query;

        if (!courseId) {
            return res.status(200).send({
                success: true,
                data: []
            });
        }

        const branches = await Branch.find(
            {
                course: courseId,
                status: 'Active'
            },
            {
                _id: 1,
                branchFullName: 1
            }
        ).sort({ branchFullName: 1 });
        console.log(branches)
        const sendBranches = branches.map(branch => ({
            value: branch._id,
            label: branch.branchFullName
        }));

        res.status(200).send({
            success: true,
            data: sendBranches
        });

    } catch (error) {
        console.error("Error fetching branches:", error);

        res.status(500).send({
            success: false,
            message: 'Something went wrong'
        });
    }
}

const getStudentsData = async (req, res) => {
    try {
        const {
            session,
            course,
            branch,
            year,
            semester,
            section
        } = req.query;

        const students = await Student.find({
            currentSession: session,
            course: course,
            branch: branch,
            year: year,
            semester: semester,
            section: section,
            status: "Active"
        });
        res.status(200).json({
            success: true,
            data: students
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch students"
        });
    }
};

module.exports = {
    getStudentsData,
    getCourseForStudent,
    getBranchForStudent
}