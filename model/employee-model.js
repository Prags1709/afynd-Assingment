const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    phoneNumber: {type: Number, required: true},
    department: {type: String, enum: ["software development", "HR", "administrator"]},
    designation : {type: String, required:true}
})

const EmployeeModel = mongoose.model("employee", employeeSchema);

module.exports = {EmployeeModel};