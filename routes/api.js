const express = require("express")
const router = express.Router()
const Employee = require("../models/employee")

/* -------------------------------------------------------------------------- */
/*                                    G E T                                   */
/* -------------------------------------------------------------------------- */
router.get("/employees", async (request, response) => {
    const fullQueryObject = await Employee.find(request.body)
    const shortQueryObject = await Employee.find(request.body,
        {firstName: 1, lastName: 1, imageUrl:1})
    const token = request.headers["token"]

        try {
            token ?
            response.status(200).send({
                success: true,
                message: "Employee Data Found",
                data: fullQueryObject
            }) :
            response.status(200).send({
                success: true,
                message: "Employee Data Found",
                data: shortQueryObject
            })

        } catch (error) {
            response.status(400).send({
                success: false,
                message: "Something Went Wrong",
                error: error
            })
        }
})

/* -------------------------------------------------------------------------- */
/*                                   P O S T                                  */
/* -------------------------------------------------------------------------- */
router.post("/employees", async (request, response, next) => {
    try {
        const newEmployee = await Employee.create(request.body)
        response.send(newEmployee)
    } catch {
        next()
    }
})

/* -------------------------------------------------------------------------- */
/*                                    P U T                                   */
/* -------------------------------------------------------------------------- */
router.put("/employees/:id", async (request, response, next) => {
    try {
        await Employee.findByIdAndUpdate({_id: request.params.id}, request.body)
        const updatedObject = await Employee.find({_id: request.params.id})
        response.send(updatedObject)
    } catch (error) {
        next()
    }
})

/* -------------------------------------------------------------------------- */
/*                                 D E L E T E                                */
/* -------------------------------------------------------------------------- */
router.delete("/employees/:id", async (request, response) => {
    const deletedObject = await Employee.findByIdAndRemove({_id: request.params.id})
    response.send(deletedObject)
})

module.exports = router