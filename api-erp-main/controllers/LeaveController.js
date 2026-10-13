const Leave = require("../models/Leave");
const Faculty = require("../models/Faculty");

const applyLeave = async (req, res) => {
  try {
    const {
      leave_name,
      from,
      toDate,
      half,
      numberOfLeaves,
      purpose,
      leaveAddress,
      contactNumber,
      alternativeArrangements,
      session,
    } = req.body;

    // --------------------------------------------------
    // 1. Find logged-in faculty using User ID
    // --------------------------------------------------
    const faculty = await Faculty.findOne({
      userId: req.user._id,
    });

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty profile not found",
      });
    }

    // --------------------------------------------------
    // 2. Basic validation
    // --------------------------------------------------
    if (
      !leave_name ||
      !from ||
      !toDate ||
      !numberOfLeaves ||
      !purpose?.trim() ||
      !leaveAddress?.trim() ||
      !contactNumber?.trim() ||
      !session
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // --------------------------------------------------
    // 3. Validate leave type / half
    // --------------------------------------------------
    const validLeaveTypes = [
      "Casual Leave",
      "Medical Leave",
      "Earned Leave",
      "Emergency Leave",
      "Short Leave",
    ];

    if (!validLeaveTypes.includes(leave_name)) {
      return res.status(400).json({
        success: false,
        message: "Invalid leave type",
      });
    }

    const validHalf = ["First Half", "Second Half", "Full Day"];

    if (half && !validHalf.includes(half)) {
      return res.status(400).json({
        success: false,
        message: "Invalid half-day value",
      });
    }

    // --------------------------------------------------
    // 4. Short Leave validation
    // --------------------------------------------------
    if (leave_name === "Short Leave") {
      if (!["First Half", "Second Half"].includes(half)) {
        return res.status(400).json({
          success: false,
          message: "Short Leave must be First Half or Second Half",
        });
      }

      if (from !== toDate) {
        return res.status(400).json({
          success: false,
          message: "Short Leave from date and to date must be the same",
        });
      }

      if (Number(numberOfLeaves) !== 0.5) {
        return res.status(400).json({
          success: false,
          message: "Short Leave must have 0.5 leave",
        });
      }
    }

    // --------------------------------------------------
    // 5. Validate dates
    // --------------------------------------------------
    const fromDate = new Date(from);
    const endDate = new Date(toDate);

    if (Number.isNaN(fromDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid leave dates",
      });
    }

    if (endDate < fromDate) {
      return res.status(400).json({
        success: false,
        message: "To date cannot be before from date",
      });
    }

    // --------------------------------------------------
    // 6. Validate alternative arrangements
    // --------------------------------------------------
    if (
      !Array.isArray(alternativeArrangements) ||
      alternativeArrangements.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one alternative arrangement is required",
      });
    }

    // --------------------------------------------------
    // 7. Validate arrangement fields
    // --------------------------------------------------
    for (const arrangement of alternativeArrangements) {
      if (
        !arrangement.date ||
        !arrangement.time ||
        !arrangement.subject ||
        !arrangement.dutyPerson
      ) {
        return res.status(400).json({
          success: false,
          message: "All alternative arrangement fields are required",
        });
      }
    }

    // --------------------------------------------------
    // 8. Prevent applicant from selecting themselves
    // --------------------------------------------------
    for (const arrangement of alternativeArrangements) {
      if (arrangement.dutyPerson.toString() === faculty._id.toString()) {
        return res.status(400).json({
          success: false,
          message: "You cannot select yourself as arrangement faculty",
        });
      }
    }

    // --------------------------------------------------
    // 9. Prevent duplicate arrangement faculty
    // --------------------------------------------------
    const dutyPersonIds = alternativeArrangements.map((arrangement) =>
      arrangement.dutyPerson.toString(),
    );

    const uniqueDutyPersonIds = new Set(dutyPersonIds);

    if (uniqueDutyPersonIds.size !== dutyPersonIds.length) {
      return res.status(400).json({
        success: false,
        message:
          "The same arrangement faculty cannot be selected more than once",
      });
    }

    // --------------------------------------------------
    // 10. Check selected faculty are active
    // --------------------------------------------------
    const dutyFaculties = await Faculty.find({
      _id: { $in: dutyPersonIds },
      status: "active",
    });

    if (dutyFaculties.length !== uniqueDutyPersonIds.size) {
      return res.status(400).json({
        success: false,
        message:
          "One or more selected arrangement faculty are invalid or inactive",
      });
    }

    // --------------------------------------------------
    // 11. Create leave
    // --------------------------------------------------
    const leave = await Leave.create({
      facultyId: faculty._id,

      applicantName: `${faculty.firstName} ${faculty.lastName || ""}`.trim(),

      designation: faculty.designation,

      session,

      leave_name,

      from: fromDate,

      toDate: endDate,

      half: half || "Full Day",

      numberOfLeaves: Number(numberOfLeaves),

      purpose: purpose.trim(),

      leaveAddress: leaveAddress.trim(),

      contactNumber: contactNumber.trim(),

      alternativeArrangements: alternativeArrangements.map((arrangement) => ({
        date: new Date(arrangement.date),
        time: arrangement.time.trim(),
        subject: arrangement.subject.trim(),
        dutyPerson: arrangement.dutyPerson,
        arrangementStatus: "Pending",
      })),

      // Initial status
      status: "Pending",

      adminRemark: "",
    });

    // --------------------------------------------------
    // 12. Success response
    // --------------------------------------------------
    return res.status(201).json({
      success: true,
      message:
        "Leave application submitted successfully. Waiting for arrangement faculty approval.",
      leave,
    });
  } catch (error) {
    console.error("Apply leave error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getFacultyForLeave = async (req, res) => {
  try {
    const { userId } = req.params;

    const faculty = await Faculty.findOne({ userId })
      .select("firstName lastName designation -_id")
      .lean();

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: faculty,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching faculty",
      error: error.message,
    });
  }
};

// ===============================
// GET ACTIVE FACULTY
// ===============================
const getActiveFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find({
      status: "active",
      userId: { $ne: req.user._id }, // leave out the logged-in faculty
    })
      .select("firstName lastName collegeId designation")
      .sort({ firstName: 1, lastName: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: faculty.length,
      data: faculty,
    });
  } catch (error) {
    console.error("Get Active Faculty Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching active faculty",
    });
  }
};

const getMyLeaveHistory = async (req, res) => {
  try {
    // Find Faculty using logged-in User ID
    const faculty = await Faculty.findOne({
      userId: req.user._id,
    });

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty profile not found",
      });
    }

    // Find leaves submitted by this faculty
    const leaves = await Leave.find({
      facultyId: faculty._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves,
    });
  } catch (error) {
    console.error("Get My Leave History Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching leave history",
      error: error.message,
    });
  }
};

// Requests waiting for the logged-in faculty to respond to
const getMyArrangementRequests = async (req, res) => {
  try {
    const me = await Faculty.findOne({ userId: req.user._id })
      .select("_id")
      .lean();
    if (!me) {
      return res
        .status(404)
        .json({ success: false, message: "Faculty profile not found" });
    }

    const leaves = await Leave.find({
      status: "Pending",
      alternativeArrangements: {
        $elemMatch: { dutyPerson: me._id, arrangementStatus: "Pending" },
      },
    })
      .select(
        "applicantName designation leave_name from toDate half purpose alternativeArrangements createdAt",
      )
      .sort({ createdAt: -1 })
      .lean();

    // return only this faculty's arrangements for each leave
    const data = leaves.map((leave) => ({
      ...leave,
      alternativeArrangements: leave.alternativeArrangements.filter(
        (a) => a.dutyPerson.toString() === me._id.toString(),
      ),
    }));

    return res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error("Get Arrangement Requests Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching requests",
    });
  }
};

// Accept or reject
const respondToArrangement = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { action, remark } = req.body; // action: "Accepted" | "Rejected"

    if (!["Accepted", "Rejected"].includes(action)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid action" });
    }

    if (action === "Rejected" && !remark?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please give a reason for rejecting",
      });
    }

    const me = await Faculty.findOne({ userId: req.user._id })
      .select("_id")
      .lean();
    if (!me) {
      return res
        .status(404)
        .json({ success: false, message: "Faculty profile not found" });
    }

    const leave = await Leave.findById(leaveId);
    if (!leave) {
      return res
        .status(404)
        .json({ success: false, message: "Leave not found" });
    }

    if (leave.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "This leave is no longer waiting for arrangement approval",
      });
    }

    const mine = leave.alternativeArrangements.filter(
      (a) => a.dutyPerson.toString() === me._id.toString(),
    );

    if (mine.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this leave",
      });
    }

    if (mine.every((a) => a.arrangementStatus !== "Pending")) {
      return res
        .status(400)
        .json({ success: false, message: "You have already responded" });
    }

    mine.forEach((a) => {
      if (a.arrangementStatus === "Pending") {
        a.arrangementStatus = action;
        a.remark = remark?.trim() || "";
        a.respondedAt = new Date();
      }
    });

    // update overall leave status
    const all = leave.alternativeArrangements;
    if (all.some((a) => a.arrangementStatus === "Rejected")) {
      leave.status = "Arrangement Rejected";
    } else if (all.every((a) => a.arrangementStatus === "Accepted")) {
      leave.status = "Pending Admin";
    }

    await leave.save();

    return res.status(200).json({
      success: true,
      message: `Arrangement ${action.toLowerCase()} successfully`,
    });
  } catch (error) {
    console.error("Respond Arrangement Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// List leaves by status (default: waiting for admin)
const getAdminLeaves = async (req, res) => {
  try {
    const isAdmin = (req) => req.user?.userRole === "admin";
    if (!isAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const allowed = ["Pending Admin", "Approved", "Rejected"];
    const status = allowed.includes(req.query.status)
      ? req.query.status
      : "Pending Admin";

    const leaves = await Leave.find({ status })
      .populate("facultyId", "collegeId")
      .populate(
        "alternativeArrangements.dutyPerson",
        "firstName lastName collegeId",
      )
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves,
    });
  } catch (error) {
    console.error("Get Admin Leaves Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching leaves",
    });
  }
};

// Approve or reject
const decideLeave = async (req, res) => {
  try {
    const isAdmin = (req) => req.user?.userRole === "admin";
    if (!isAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const { leaveId } = req.params;
    const { action, remark } = req.body; // "Approved" | "Rejected"

    if (!["Approved", "Rejected"].includes(action)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid action" });
    }

    if (action === "Rejected" && !remark?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please give a reason for rejecting",
      });
    }

    const leave = await Leave.findById(leaveId);
    if (!leave) {
      return res
        .status(404)
        .json({ success: false, message: "Leave not found" });
    }

    if (leave.status !== "Pending Admin") {
      return res.status(400).json({
        success: false,
        message: `This leave is already ${leave.status}`,
      });
    }

    leave.status = action;
    leave.adminRemark = remark?.trim() || "";
    leave.reviewedAt = new Date();

    await leave.save();

    return res.status(200).json({
      success: true,
      message: `Leave ${action.toLowerCase()} successfully`,
    });
  } catch (error) {
    console.error("Decide Leave Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  applyLeave,
  getFacultyForLeave,
  getActiveFaculty,
  getMyLeaveHistory,
  getMyArrangementRequests,
  respondToArrangement,
  getAdminLeaves,
  decideLeave,
};
