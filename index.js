const express = require("express")
require("dotenv").config()
const app = express()
const router = require("./routes/api")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
/* ----------------------- Connect to MongoDB Database ---------------------- */
mongoose.connect(process.env.DB_STRING)
mongoose.Promise = global.Promise

/* ------------------------ allow cross-origin access ----------------------- */
app.use(function(request, response, next) {
    response.header("Access-Control-Allow-Origin", "*") // update to match the domain you will make the request from
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token")
    next()
  })

/* ---------------- Body-parser to get access to request data --------------- */
app.use(bodyParser.json())

/* -------------------------------------------------------------------------- */
/*               Middleware to create and handle route requests               */
/* -------------------------------------------------------------------------- */
app.use("/api", router)

/* ------------------------ "error handling function" ----------------------- */
app.use((error, request, response) => {
    // console.log(error)
    response.status(422).send({error: error._message})
})
/* ------------ error handling function should come after router ------------ */

app.listen(process.env.PORT || 4000, () => console.log("now listening for requests"))