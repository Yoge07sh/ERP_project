const mongoose = require("mongoose");

const TimeSlotsSchema = new mongoose.Schema(
  {
    session: {
      type: String,
      required: true,
    },
    lectureNo: {
      type: Number,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("timeSlots", TimeSlotsSchema);
