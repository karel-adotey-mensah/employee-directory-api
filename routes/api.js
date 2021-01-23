const express = require("express")
const router = express.Router()
const Employee = require("../models/employee")

/* -------------------------------------------------------------------------- */
/*                                    G E T                                   */
/* -------------------------------------------------------------------------- */
router.get("/employees", async (request, response) => {
    const fullQueryObject = await Employee.find(request.body)
    const shortQueryObject = await Employee.find(request.body,
        {firstName: 1, lastName: 1, department:1, imageUrl:1})
    const token = request.header("X-Access-Token")

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
                data: shortQueryObject,
                request: request.body
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
/*                         G E T  W I T H  F I L T E R                        */
/* -------------------------------------------------------------------------- */
router.post("/employees/query", async (request, response) => {
    const shortQueryObject = await Employee.find(request.body,
        {firstName: 1, lastName: 1, department:1, imageUrl:1})
        try {
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
/* -- Have To Use Post Method In Order To Send Data In Body Of Get Request -- */

/* -------------------------------------------------------------------------- */
/*                         G E T  W I T H  S E A R C H                        */
/* -------------------------------------------------------------------------- */
router.post("/employees/query/s", async (request, response) => {
        const shortQueryObject = await Employee.find({},
            {firstName: 1, lastName: 1, department:1, imageUrl:1})
        const searchPhrase = request.body.searchPhrase.toLowerCase()
        const isSearchItem = (firstName, lastName, department) => {
            const fullName = firstName + " " + lastName
            
            return (
                firstName.toLowerCase().includes(searchPhrase) ||
                lastName.toLowerCase().includes(searchPhrase) ||
                fullName.toLowerCase().includes(searchPhrase) ||
                department.toLowerCase().includes(searchPhrase)
                )
        }
        
        try {
            const searchResults =
            shortQueryObject.filter(searchItem =>
                isSearchItem(
                    searchItem.firstName,
                    searchItem.lastName,
                    searchItem.department
                    ))
            response.status(200).send({
                success: true,
                message: "Employee Data Found",
                data: searchResults,
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