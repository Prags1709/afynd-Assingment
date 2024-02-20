const express = require("express");
const {connection} = require("./config/db")
const {userRoute} = require("./router/user-router")
const {employeeRoute} = require("./router/employee-route")
const {authentication} = require("./authentication/authentication")
require('dotenv').config()

const app = express();
app.use(express.json());

app.get("/", (req, res)=>{
    res.send("WELCOME")
})

app.use("/api", userRoute)
app.use(authentication)
app.use("/api", employeeRoute)

const port = process.env.port || 4500;
app.listen(port, async ()=>{
    try {
        await connection
        console.log("DB CONNECTED");
    } catch (error) {
        console.log("DB NOT CONNECTED", error);
    }
    console.log("PORT running at "+ port);
})