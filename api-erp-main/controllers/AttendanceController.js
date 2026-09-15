const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const FacultyMap = require('../models/FacultyMap')
// Get Faculty Mappings for logged-in Faculty
const getFacultyMappings = async (req, res) => {
    try {

        // User ID comes from JWT
        const userId = req.user._id;
        console.log("Logged in User ID:", userId);

        // Find Faculty connected with this User
        const faculty = await Faculty.findOne({
            userId: userId
        });
console.log(faculty)
        if (!faculty) {
            return res.status(404).json({
                success: false,
                message: "Faculty profile not found"
            });
        }

        // Get mappings of this faculty
        const mappings = await FacultyMap.find({
            facultyId: faculty._id
        })
            .populate("course", "courseShortName")
            .populate("branch", "branchShortName")
            .populate("subjectId", "subjectFullName");

        return res.status(200).json({
            success: true,
            data: mappings
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch faculty mappings"
        });
    }
};


// Get Students according to selected Faculty Mapping
const getStudentsData = async (req, res) => {
    try {

        const { mappingId } = req.query;

        if (!mappingId) {
            return res.status(400).json({
                success: false,
                message: "Mapping ID is required"
            });
        }

        // Get logged-in User ID from JWT
        const userId = req.user._id;

        // Find connected Faculty
        const faculty = await Faculty.findOne({
            userId: userId
        });

        if (!faculty) {
            return res.status(404).json({
                success: false,
                message: "Faculty profile not found"
            });
        }

        const mapping = await FacultyMap.findOne({
            _id: mappingId,
            facultyId: faculty._id
        });

        if (!mapping) {
            return res.status(403).json({
                success: false,
                message: "This class is not assigned to you"
            });
        }

        const students = await Student.find({
            currentSession: mapping.session,
            course: mapping.course,
            branch: mapping.branch,
            year: mapping.year,
            semester: mapping.semester,
            section: mapping.section,
            status: "Active"
        })

        return res.status(200).json({
            success: true,
            data: students
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch students"
        });
    }
};
module.exports = {
    getStudentsData,
    getFacultyMappings

}