const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["New", "Contacted", "Qualified", "Converted", "Lost"],
    default: "New",
  },
  value: {
    type: Number,
    default: 0,
    min: 0,
  },
});

module.exports = mongoose.model("Lead", LeadSchema);
