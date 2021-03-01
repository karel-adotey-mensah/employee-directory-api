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
  const verifiedAdmin = await Admin.find(
    { password: password },
    { firstName: 1, lastName: 1, email: 1 }
  );

  if (!_.isEmpty(verifiedAdmin)) {
    response.status(200).send({
      success: true,
      message: "Admin Authorized",
      data: verifiedAdmin[0],
      request: request.body,
    });
    console.log(verifiedAdmin);
  }
});

/* -------------------------------------------------------------------------- */
/*                           C R E A T E   A D M I N                          */
/* -------------------------------------------------------------------------- */
router.post("/admin", async (request, response, next) => {
  try {
    const hashedPassword = await bcrypt.hash(request.body.password, saltRounds);
    const newAdmin = await Admin.create({
      ...request.body,
      // firstName: request.body.firstName,
      // lastName: request.body.lastName,
      // email: request.body.email,
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
  const token = request.headers.authorization;
  const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

  try {
    await Admin.findByIdAndUpdate({ _id: decodedToken._id }, request.body);
    const updatedAdmin = await Admin.find({ _id: decodedToken._id });
    const {
      password: hashedPassword,
      _id,
      email,
      firstName,
      lastName,
    } = updatedAdmin[0];
    const newToken = jwt.sign(
      {
        _id: _id,
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: hashedPassword,
      },
      process.env.SECRET_KEY
    );

    response.status(200).send({
      success: true,
      message: "Admin Updated",
      data: updatedAdmin,
      token: newToken,
      request: request.body,
    });
  } catch (error) {
    next();
  }
});

/* -------------------------------------------------------------------------- */
/*                        U P D A T E   P A S S W O R D                       */
/* -------------------------------------------------------------------------- */
router.put("/admin/password", async (request, response, next) => {
  const token = request.headers.authorization;
  const hashedPassword = await bcrypt.hash(request.body.password, saltRounds);
  const { _id } = jwt.verify(token, process.env.SECRET_KEY);

  await Admin.findByIdAndUpdate({ _id: _id }, { password: hashedPassword });
  const updatedAdmin = await Admin.find({ _id: _id });
  const { password, email, firstName, lastName } = updatedAdmin[0];
  const newToken = jwt.sign(
    {
      _id: _id,
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: password,
    },
    process.env.SECRET_KEY
  );

  try {
    response.status(200).send({
      success: true,
      message: "Password Updated",
      token: newToken,
      data: updatedAdmin,
    });
  } catch (error) {
    next();
  }
  // }
});

/* -------------------------------------------------------------------------- */
/*                          L O G I N   R E Q U E S T                         */
/* -------------------------------------------------------------------------- */
router.post("/admin/login", async (request, response, next) => {
  try {
    const verifiedAdmin = await Admin.find({ email: request.body.email });

    if (_.isEmpty(verifiedAdmin)) {
      return response.status(400).send({
        success: false,
        message: "Email or password is incorrect",
      });
    }

    const {
      password: hashedPassword,
      _id,
      email,
      firstName,
      lastName,
    } = verifiedAdmin[0];
    const passwordDoesMatch = await bcrypt.compare(
      request.body.password,
      hashedPassword
    );
    if (passwordDoesMatch) {
      const token = jwt.sign(
        {
          _id: _id,
          email: email,
          firstName: firstName,
          lastName: lastName,
          password: hashedPassword,
        },
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
  } catch {
    next();
  }
});

module.exports = router;
