const express = require("express");
const router = express.Router();
const Employee = require("../models/employee");

/* -------------------------------------------------------------------------- */
/*                                    G E T                                   */
/* -------------------------------------------------------------------------- */
router.get("/employees", async (request, response) => {
  const shortQueryObject = await Employee.find(request.body, {
    firstName: 1,
    lastName: 1,
    department: 1,
    imageUrl: 1,
  });

  try {
    response.status(200).send({
      success: true,
      message: "Employee Data Found",
      data: shortQueryObject,
      request: request.body,
    });
  } catch (error) {
    response.status(400).send({
      success: false,
      message: "Something Went Wrong",
      error: error,
    });
  }
});

/* -------------------------------------------------------------------------- */
/*                                   P O S T                                  */
/* -------------------------------------------------------------------------- */
router.post("/employees", async (request, response, next) => {
  try {
    const newEmployee = await Employee.create(request.body);
    response.status(200).send({
      success: true,
      message: "Employee Created",
      data: newEmployee,
      request: request.body,
    });
  } catch {
    next();
  }
});

/* -------------------------------------------------------------------------- */
/*                                    P U T                                   */
/* -------------------------------------------------------------------------- */
router.put("/employees/:id", async (request, response, next) => {
  try {
    await Employee.findByIdAndUpdate({ _id: request.params.id }, request.body);
    const updatedObject = await Employee.find({ _id: request.params.id });
    response.send(updatedObject);
  } catch (error) {
    next();
  }
});

/* -------------------------------------------------------------------------- */
/*                                 D E L E T E                                */
/* -------------------------------------------------------------------------- */
router.delete("/employees/:id", async (request, response) => {
  const deletedObject = await Employee.findByIdAndRemove({
    _id: request.params.id,
  });
  response.send(deletedObject);
});

/* -------------------------------------------------------------------------- */
/*                           C R E A T E   A D M I N                          */
/* -------------------------------------------------------------------------- */
router.post("/admin", async (request, response, next) => {
  try {
    const newAdmin = await Admin.create(request.body);
    console.log(newAdmin);
    response.status(200).send({
      success: true,
      message: "Admin Added",
      data: newAdmin,
      request: request.body,
    });
  } catch {
    next();
  }
});

/* -------------------------------------------------------------------------- */
/*                          L O G I N   R E Q U E S T                         */
/* -------------------------------------------------------------------------- */
router.get("/admin/login", async (request, response, next) => {
  try {
    const verifiedAdmin = await Admin.find({ email: request.body.email });
    response.send(verifiedAdmin);
  } catch {
    next();
  }
});

module.exports = router;
