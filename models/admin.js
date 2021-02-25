const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  firstName: {
    type: String,
    required: [true],
  },
  lastName: {
    type: String,
    required: [true],
  },
  email: {
    type: String,
    required: [true],
  },
  password: {
    type: String,
    required: [true],
  },
  /* -------------------------------------------------------------------------- */
  /*            [true, "Name field is required"] for Custom Err Mssg            */
  /* -------------------------------------------------------------------------- */
});

const Admin = mongoose.model("admin", AdminSchema);

module.exports = Admin;
