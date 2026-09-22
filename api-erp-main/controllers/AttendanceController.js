const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const FacultyMap = require("../models/FacultyMap");
const TimeSlot = require("../models/TimeSlot");
const Attendance = require("../models/Attendance");
const mongoose = require("mongoose");

// Get Faculty Mappings for logged-in Faculty
const getFacultyMappings = async (req, res) => {
  try {
    // User ID comes from JWT
    const userId = req.user._id;

    // Find Faculty connected with this User
    const faculty = await Faculty.findOne({
      userId: userId,
    });
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty profile not found",
      });
    }

    // Get mappings of this faculty
    const mappings = await FacultyMap.find({
      facultyId: faculty._id,
    })
      .populate("course", "courseShortName")
      .populate("branch", "branchShortName")
      .populate("subjectId", "subjectFullName");

    return res.status(200).json({
      success: true,
      data: mappings,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch faculty mappings",
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
        message: "Mapping ID is required",
      });
    }

    // Get logged-in User ID from JWT
    const userId = req.user._id;

    // Find connected Faculty
    const faculty = await Faculty.findOne({
      userId: userId,
    });

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty profile not found",
      });
    }

    const mapping = await FacultyMap.findOne({
      _id: mappingId,
      facultyId: faculty._id,
    });

    if (!mapping) {
      return res.status(403).json({
        success: false,
        message: "This class is not assigned to you",
      });
    }

    const students = await Student.find({
      currentSession: mapping.session,
      course: mapping.course,
      branch: mapping.branch,
      year: mapping.year,
      semester: mapping.semester,
      section: mapping.section,
      status: "Active",
    });

    return res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch students",
    });
  }
};

const submitAttendance = async (req, res) => {
  try {
    const { facultyMapId, timeSlotId, students } = req.body;

    // Check required fields
    if (!facultyMapId) {
      return res.status(400).json({
        success: false,
        message: "Faculty Map ID is required",
      });
    }

    if (!timeSlotId) {
      return res.status(400).json({
        success: false,
        message: "Time Slot ID is required",
      });
    }

    if (!students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Student attendance data is required",
      });
    }

    // Get logged-in user from JWT
    const userId = req.user._id;

    // Find Faculty connected with logged-in User
    const faculty = await Faculty.findOne({
      userId: userId,
    });

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty profile not found",
      });
    }

    // Check FacultyMap belongs to logged-in Faculty
    const mapping = await FacultyMap.findOne({
      _id: facultyMapId,
      facultyId: faculty._id,
    });

    if (!mapping) {
      return res.status(403).json({
        success: false,
        message: "This class is not assigned to you",
      });
    }

    // Check Time Slot exists
    const timeSlot = await TimeSlot.findById(timeSlotId);

    if (!timeSlot) {
      return res.status(404).json({
        success: false,
        message: "Time slot not found",
      });
    }

    // Get student IDs
    const studentIds = students.map((student) => student.studentId);

    // Check students belong to selected class
    const validStudents = await Student.find({
      _id: { $in: studentIds },
      currentSession: mapping.session,
      course: mapping.course,
      branch: mapping.branch,
      year: mapping.year,
      semester: mapping.semester,
      section: mapping.section,
      status: "Active",
    }).select("_id");

    const validStudentIds = validStudents.map((student) =>
      student._id.toString(),
    );

    // Check invalid students
    const invalidStudents = students.filter(
      (student) => !validStudentIds.includes(student.studentId.toString()),
    );

    if (invalidStudents.length > 0) {
      return res.status(400).json({
        success: false,
        message: "One or more students do not belong to this class",
      });
    }

    // Check attendance status
    const invalidStatus = students.some(
      (student) => !["Present", "Absent"].includes(student.status),
    );

    if (invalidStatus) {
      return res.status(400).json({
        success: false,
        message: "Invalid attendance status",
      });
    }

    // Set today's date
    const attendanceDate = new Date();

    // Check whether attendance already exists for today
    const startOfDay = new Date(attendanceDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(attendanceDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAttendance = await Attendance.findOne({
      facultyMapId: facultyMapId,
      timeSlotId: timeSlotId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (existingAttendance) {
      return res.status(409).json({
        success: false,
        message: "Attendance has already been submitted for this lecture today",
      });
    }

    // Save attendance
    const attendance = await Attendance.create({
      facultyMapId: facultyMapId,
      timeSlotId: timeSlotId,
      date: attendanceDate,
      students: students,
    });

    return res.status(201).json({
      success: true,
      message: "Attendance submitted successfully",
      data: attendance,
    });
  } catch (error) {
    console.error("Submit attendance error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit attendance",
    });
  }
};

const viewAttendance = async (req, res) => {
  try {
    const { mappingId, SingletimeSlot, date } = req.query;
    if (!mappingId) {
      return res.status(400).json({
        success: false,
        message: "Mapping ID is required",
      });
    }

    if (!SingletimeSlot) {
      return res.status(400).json({
        success: false,
        message: "Time slot is required",
      });
    }
    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }
    const userId = req.user._id;

    const faculty = await Faculty.findOne({
      userId: userId,
    });

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty profile not found",
      });
    }

    // Check mapping belongs to logged-in faculty
    const mapping = await FacultyMap.findOne({
      _id: mappingId,
      facultyId: faculty._id,
    });

    if (!mapping) {
      return res.status(403).json({
        success: false,
        message: "This class is not assigned to you",
      });
    }
    const startDate = new Date(`${date}T00:00:00+05:30`);
    const endDate = new Date(`${date}T23:59:59.999+05:30`);

    // Get attendance only for selected time slot
    const attendance = await Attendance.find({
      facultyMapId: mappingId,
      timeSlotId: SingletimeSlot,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .populate("timeSlotId")
      .populate("students.studentId")
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error("View attendance error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { facultyMapId, timeSlotId, date, students } = req.body;

    if (!facultyMapId || !timeSlotId || !date || !students) {
      return res.status(400).json({
        success: false,
        message: "facultyMapId, timeSlotId, date and students are required",
      });
    }

    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Students attendance data is required",
      });
    }

    // Find logged-in faculty
    const faculty = await Faculty.findOne({
      userId: req.user._id,
    });

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty profile not found",
      });
    }

    // Check that this mapping belongs to logged-in faculty
    const mapping = await FacultyMap.findOne({
      _id: facultyMapId,
      facultyId: faculty._id,
    });

    if (!mapping) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized for this faculty mapping",
      });
    }

    // Validate only studentId and status
    for (const student of students) {
      if (!student.studentId || !student.status) {
        return res.status(400).json({
          success: false,
          message: "Each student must have studentId and status",
        });
      }

      if (!["Present", "Absent"].includes(student.status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid attendance status",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(student.studentId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid student ID",
        });
      }
    }

    // Selected date range
    const startDate = new Date(`${date}T00:00:00.000Z`);
    const endDate = new Date(`${date}T23:59:59.999Z`);

    // Find the existing attendance record
    const attendanceRecord = await Attendance.findOne({
      facultyMapId: facultyMapId,
      timeSlotId: timeSlotId,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    if (!attendanceRecord) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    // Update attendance
    attendanceRecord.students = students.map((student) => ({
      studentId: student.studentId,
      status: student.status,
    }));

    await attendanceRecord.save();

    return res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      data: attendanceRecord,
    });
  } catch (error) {
    console.error("Update attendance error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update attendance",
      error: error.message,
    });
  }
};

const getEregister = async (req, res) => {
  try {
    const { mappingId, timeSlotId, fromDate, toDate } = req.query;

    if (!mappingId || !timeSlotId || !fromDate || !toDate) {
      return res.status(400).json({
        success: false,
        message: "Mapping ID, Time Slot, From Date and To Date are required",
      });
    }

    // Convert date-only values into India date boundaries
    const startDate = new Date(`${fromDate}T00:00:00+05:30`);
    const endDate = new Date(`${toDate}T23:59:59.999+05:30`);
    const userId = req.user._id;

    const faculty = await Faculty.findOne({
      userId: userId,
    });

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty profile not found",
      });
    }

    const attendanceRecords = await Attendance.find({
      facultyMapId: mappingId,
      timeSlotId: timeSlotId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .populate("timeSlotId")
      .populate({
        path: "students.studentId",
      })
      .sort({ date: 1 });

    return res.status(200).json({
      success: true,
      data: attendanceRecords,
    });
  } catch (error) {
    console.error("E-Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch E-Attendance Register",
      error: error.message,
    });
  }
};

module.exports = {
  getStudentsData,
  getFacultyMappings,
  submitAttendance,
  viewAttendance,
  updateAttendance,
  getEregister,
};
