const mongoose = require("mongoose")
const Schema = mongoose.Schema

const EmployeeSchema = new Schema({
    firstName: {
        type: String,
        required: [true]
    },
    lastName: {
        type: String,
        required: [true]
    },
    address: {
        type: String,
        required: [true]
    },
    dateOfBirth: {
        type: String,
        required: [true]
    },
    email: {
        type: String,
        required: [true]
    },
    contractEnd: {
        type: String
    },
    department: {
        type: String,
        required: [true]
    },
    role: {
        type: String,
        required: [true]
    },
    imageUrl: {
        type: String,
        default: "placeholder.png"
    }

/* -------------------------------------------------------------------------- */
/*            [true, "Name field is required"] for Custom Err Mssg            */
/* -------------------------------------------------------------------------- */
})

const Employee = mongoose.model("employee", EmployeeSchema)

module.exports = Employee