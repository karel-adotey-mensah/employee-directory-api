const express = require("express")
const router = express.Router()
const Employee = require("../models/employee")

router.get("/employees", async (request, response, next) => {
    const queryObject = await Employee.find(request.body)
    response.send(queryObject)
})

router.post("/employees", async (request, response, next) => {
    try {
        const newEmployee = await Employee.create(request.body)
        response.send(newEmployee)
    } catch {
        next()
    }
})

router.put("/employees/:id", async (request, response, next) => {
    try {
        await Employee.findByIdAndUpdate({_id: request.params.id}, request.body)
        const updatedObject = await Employee.find({_id: request.params.id})
        response.send(updatedObject)
    } catch (error) {
        next()
    }
})

router.delete("/employees/:id", async (request, response, next) => {
    const deletedObject = await Employee.findByIdAndRemove({_id: request.params.id})
    response.send(deletedObject)
})

module.exports = router