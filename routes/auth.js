const express = require("express");
require("dotenv").config();
const router = express.Router();
const _ = require("lodash");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const Admin = require("../models/admin");

/* -------------------------------------------------------------------------- */
/*                              G E T   A D M I N                             */
/* -------------------------------------------------------------------------- */
router.get("/admin", async (request, response, next) => {
  const token = request.headers.authorization;
  const { password } = jwt.verify(token, process.env.SECRET_KEY);
  const currentAdmin = await Admin.find(
    { password: password },
    { firstName: 1, lastName: 1, email: 1 }
  );

  if (!_.isEmpty(currentAdmin)) {
    response.status(200).send({
      success: true,
      message: "Admin Authorized",
      data: currentAdmin[0],
      request: request.body,
    });
    console.log(currentAdmin);
  }
});

/* -------------------------------------------------------------------------- */
/*                           C R E A T E   A D M I N                          */
/* -------------------------------------------------------------------------- */
router.post("/admin", async (request, response, next) => {
  try {
    const hashedPassword = await bcrypt.hash(request.body.password, saltRounds);
    const newAdmin = await Admin.create({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: hashedPassword,
    });
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
/*                           U P D A T E   A D M I N                          */
/* -------------------------------------------------------------------------- */
router.put("/admin", async (request, response, next) => {
  try {
    await Admin.findByIdAndUpdate({ _id: request.params.id }, request.body);
    const updatedObject = await Admin.find({ _id: request.params.id });
    response.send(updatedObject);
  } catch (error) {
    next();
  }
});

/* -------------------------------------------------------------------------- */
/*                          L O G I N   R E Q U E S T                         */
/* -------------------------------------------------------------------------- */
router.post("/admin/login", async (request, response, next) => {
  try {
    const verifiedAdmin = await Admin.find({ email: request.body.email });

    if (_.isEmpty(verifiedAdmin)) {
      response.status(200).send({
        success: false,
        message: "Please Check Email And Try Again",
      });
    } else {
      const hashedPassword = verifiedAdmin[0].password;
      const passwordDoesMatch = await bcrypt.compare(
        request.body.password,
        hashedPassword
      );

      if (passwordDoesMatch) {
        const token = jwt.sign(
          { password: hashedPassword },
          process.env.SECRET_KEY
        );
        response.status(200).send({
          success: true,
          message: "Verified",
          data: verifiedAdmin,
          token: token,
          request: request.body,
        });
      } else {
        response.status(200).send({
          success: false,
          message: "Incorrect Password. Please Try Again",
        });
      }
    }
  } catch {
    next();
  }
});

module.exports = router;
