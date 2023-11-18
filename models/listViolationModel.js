const mongoose = require("mongoose");
const listViolationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  reservation_required: Boolean,
  duration: Number,
});
const List = mongoose.model("List", listViolationSchema);

module.exports = List;
