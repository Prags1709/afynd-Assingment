const jwt = require("jsonwebtoken");
require('dotenv').config()

const authentication = (req, res, next)=>{
    const token = req.headers.authorization;
    if(token){
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        if(decoded){
            const userId = decoded.userId;
            req.body.userId = userId;;
            next()
        }else{
            res.send("Please login first")
        }
    }else{
        res.status(401).send("Not authorized, Please login first" )
    }
}

module.exports = {authentication}