const express = require("express")
const router = express.Router()
const Employee = require("../models/employee")

router.get("/employees", (request, response, next) => {
    Employee.find(request.body).then(
        queryObject => response.send(queryObject)
    )
})

router.post("/employees", async (request, response, next) => {
    try {
        const newEmployee = await Employee.create(request.body)
        response.send(newEmployee)
    } catch {
        next()
    }

    // .then(
    //     createdObject => {
    //         response.send(createdObject)
    //     }
    // ).catch(next)
})

router.put("/employees/:id", (request, response, next) => {
    Employee.findByIdAndUpdate({_id: request.params.id}, request.body).then(
        () => {
            Employee.findOne({_id: request.params.id}).then(
                updatedObject => {
                response.send(updatedObject)}
        )}
    )
})

router.delete("/employees/:id", (request, response, next) => {
    Employee.findByIdAndRemove({_id: request.params.id}).then(
        deletedObject => response.send(deletedObject)
    )
})

module.exports = router