const express = require("express");
const {EmployeeModel} = require("../model/employee-model");

const employeeRoute = express.Router();

employeeRoute.get('/employees', async (req, res)=>{
    try {
        let data = await EmployeeModel.find();
        res.send(data)
    } catch (error) {
        console.log(error);
        res.status(500).send({"message":"Internal server error", "error": error});
    }
})

employeeRoute.post('/employees', async (req, res)=>{
    let {name, email, phoneNumber, department, designation} = req.body;
    try {
        let employeeData = new EmployeeModel({name, email, phoneNumber, department, designation});
        await employeeData.save();
       res.status(201). send({"message": "your employee data has been saved successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).send({"message":"Internal server error", "error": error});
    }
})

//Update the employee data based on the userID (_id)
employeeRoute.patch("/employees/:id", async (req, res) => {
    let payload = req.body;
    let id = req.params.id;
    let isStoredData = await EmployeeModel.findById({_id:id});
    try {
        if(!isStoredData){
            res.send({"message": "Data not found"})
        }else{
            await EmployeeModel.findByIdAndUpdate({_id:id}, payload);
            res.send({"message": "Employee data has been updated successfully"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({"message":"Internal server error", "error": error});
    }
})

//Delete the employee data based on the userID (_id)
employeeRoute.delete("/employees/:id", async (req, res) => {
    let id = req.params.id;
    let isStoredData = await EmployeeModel.findById({_id:id});
    try {
        if(!isStoredData){
            res.send({"message": "Data not found"})
        }else{
            await EmployeeModel.findByIdAndDelete({_id:id});
            res.send({"message": "Employee data has been Deleted successfully"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({"message":"Internal server error", "error": error});
    }
})

module.exports = {employeeRoute}