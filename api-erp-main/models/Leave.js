const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const LeaveSchema = new Schema(
  {
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "faculty",
      required: true,
    },

    applicantName: {
      type: String,
      required: true,
    },

    designation: {
      type: String,
      required: true,
    },

    session: {
      type: String,
      required: true,
    },

    leave_name: {
      type: String,
      required: true,
    },

    from: {
      type: Date,
      required: true,
    },

    toDate: {
      type: Date,
      required: true,
    },

    half: {
      type: String,
      enum: ["First Half", "Second Half", "Full Day"],
      default: "Full Day",
    },

    numberOfLeaves: {
      type: Number,
      required: true,
      min: 0.5,
    },

    purpose: {
      type: String,
      required: true,
    },

    leaveAddress: {
      type: String,
      required: true,
    },

    contactNumber: {
      type: String,
      required: true,
    },

    alternativeArrangements: [
      {
        date: { type: Date, required: true },
        time: { type: String, required: true },
        subject: { type: String, required: true },
        dutyPerson: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "faculty",
          required: true,
        },
        arrangementStatus: {
          type: String,
          enum: ["Pending", "Accepted", "Rejected"],
          default: "Pending",
        },
        remark: { type: String, default: "" },
        respondedAt: { type: Date },
      },
    ],

    status: {
      type: String,
      enum: [
        "Pending",
        "Pending Admin",
        "Approved",
        "Rejected",
        "Arrangement Rejected",
      ],
      default: "Pending",
    },
    adminRemark: {
      type: String,
      default: "",
    },

    reviewedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Leave", LeaveSchema);
